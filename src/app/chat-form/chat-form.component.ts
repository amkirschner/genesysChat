import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { GenesysChatService } from '../services/genesys-chat-service.service';

@Component({
	selector: 'chat-form',
	templateUrl: './chat-form.component.html',
	styleUrls: ['./chat-form.component.css']
})

export class ChatFormComponent implements OnInit {
	firstKeydown: boolean = false;

	constructor(private GenesysChatService: GenesysChatService, public el: ElementRef) { }

	// Function to send the message to GenesysChatService when the user types in the message input chat box
	sendMessage(message: HTMLInputElement): void {
		if(message.value !== '') {
            const convertedText = this.convertLinkInText(message.value);
			this.GenesysChatService.sendMessage(message.value, convertedText);
			message.value = '';
		}
    }

    convertLinkInText(text): string {
        const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        let text1 = text.replace(exp, '<a target="_blank" href="$1">$1</a>');
        const exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        const convertedText = text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
        return convertedText;
    }

	// the Function that sends a flag when the user starts typing
	startTyping(): void {
		if(!this.firstKeydown) {
			this.GenesysChatService.startTyping();
			this.firstKeydown = true;
		}
	}

	// Function that send a flag when the user stops typing which waits till 1 second for the keyup event to happen
	stopTyping(): void {
		this.GenesysChatService.stopTyping();
	}

	ngOnInit(): void {
		const chatInputBox = this.el.nativeElement.querySelector('input');
		Observable.fromEvent(chatInputBox, 'keyup')
			.debounceTime(1000)
			.subscribe(() => {
				this.stopTyping();
				this.firstKeydown = false;
			});
	}
}
