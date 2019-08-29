import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'chat-row',
	templateUrl: './chat-row.component.html',
	styleUrls: ['./chat-row.component.css'],
	inputs: ['message']
})
export class ChatRowComponent implements OnInit {

	constructor() { }

	// Scroll to the Bottom of the chat container when new Message is added in the view
	scrollToBottom(): void {
		let scrollPane: any = document.getElementById('chat-box-inner-container');
		scrollPane.scrollTop = scrollPane.scrollHeight;
	}

	ngOnInit() {}

	ngAfterViewInit() {
		this.scrollToBottom();
	}

}
