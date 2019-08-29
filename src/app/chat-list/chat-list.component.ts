import { Component, OnInit} from '@angular/core';

import { Message } from '../models/message.model';
import { Chat } from '../models/chat.model';
import { GenesysChatService } from '../services/genesys-chat-service.service';

@Component({
	selector: 'chat-list',
	templateUrl: './chat-list.component.html',
	styleUrls: ['./chat-list.component.css']
})

export class ChatListComponent implements OnInit {
	messages: Message[];
	gensysUserName: string;

	constructor(private GenesysChatService: GenesysChatService) {}

	// Function to kick ofg the Chat API connection
	initChatSevice(): void {
		this.GenesysChatService.firstConnection();
	}

	// function that watches the message property of the GensysChatService and receives them here
	// which gets passed along to the child component ChatRow as an Input on the template that is used to render
	// each chat rows
	getMessageArray(): void {
		this.GenesysChatService.getMessageArray().then(response => this.messages = response);
	}

	ngOnInit(): void {
		this.initChatSevice();
    	this.getMessageArray();
	}
}
