import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

import { Message } from '../models/message.model';
import { Chat } from '../models/chat.model';
import { User } from '../models/user.model';

@Injectable()
export class GenesysChatService {
	messages: Message[] = [];
	chat: Chat;
	pageSource: string;
	userDetail: User;
	client: Message = null;
	agent: Message = null;
	url: string;
	headers: Headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
	intevalAPICall;
	chatUsers: Subject<Object> = new Subject<Object>();

	constructor(private http: Http) {
        const data: any = this.getURLparams();
		this.userDetail = new User({
			firstName: data.firstName,
        	lastName: data.lastName,
        	subject: data.subject,
        	emailAddress: data.email,
        	nickName: data.nickName,
			type: data.type,
        	userData: {
				CustomerSegment: data.customerSegment,
				PrefPhoneNumber: data.prefPhoneNumber,
				UserID: data.userID,
                Computer_Serial: data.Computer_Serial,
                BusinessUnit: data.businessUnit,
                TargetType: data.targetType,
                urlPath: data.urlPath
			}
		});
	}

	// One the page load this function is called to initialize the chat which calls the refreshChatData() at the end
	firstConnection(): void {
		const primaryAPIUrl: string = `${this.url}/${this.userDetail.type}/chat`;

		this.http.post(primaryAPIUrl, JSON.stringify(this.userDetail), {headers: this.headers})
			.toPromise().then(response => {
				const data = response.json();
				this.chat = new Chat({
    				alias: data.alias,
					chatId: data.chatId,
    				chatEnded: data.chatEnded,
					userId: data.userId,
    				secureKey: data.secureKey,
					transcriptPosition: data.transcriptPosition
				});
				this.refreshChatData();
		});
	}

	// this function that refreshes API call every 3.5 seconds to grab data coming from Genesys to the web client
	//  the function also sets the transcript Position which is required for every API call
	// the data JSON coming back from the REST API is send to processMessage function which manipulates the chat view
	refreshChatData(): void {
		const refreshAPIUrl: string =`${this.url}/${this.userDetail.type}/chat/${this.chat.chatId}/refresh`;

		this.intevalAPICall = Observable.interval(3500).flatMap(() => {
			return this.http.post(refreshAPIUrl, JSON.stringify(this.chat), {headers: this.headers})
				.toPromise().then(response => { return response.json() });
    	}).subscribe(data => {
			if(data.chatEnded === true) {
				if (!_.isEmpty(data.messages)) {
					this.processMessage(data.messages);
				}
				this.intevalAPICall.unsubscribe();
			} else if (data.statusCode === 1) {
				this.messages.push(new Message({
					notification: true,
					text: 'We are experiencing technical difficulties. Please try again later.'
				}));
				this.intevalAPICall.unsubscribe();
			} else if(data.statusCode !== 400) {
				if (data.transcriptPosition) {
					this.chat.transcriptPosition = data.transcriptPosition;
				}
				if (!_.isEmpty(data.messages)) {
					this.processMessage(data.messages);
				}
			} else {
				this.messages.push(new Message({
					notification: true,
					text: data.message
				}));
				this.intevalAPICall.unsubscribe();
			}
		});
	}

	// Depending on what type of message it is on every refresh processMessage function sets the message and notifications on the view
	// the function also set the ChatUSer data which is of type subject that gets passed to components every time
	// its value changes.
	processMessage(messages): void {
        let fullNameArray = [];
		for (let i = 0; i < messages.length; i++) {
			switch(messages[i].type) {
				case "ParticipantJoined":
					if (messages[i].from.type === 'Client' && _.isEmpty(this.client)) {
						this.client = new Message({ nickName: messages[i].from.nickname });
					} else if (messages[i].from.type === 'Agent' && _.isEmpty(this.agent)) {
						this.agent = new Message({ nickName: messages[i].from.nickname });
					}
					if (messages[i].from.type === 'Agent') {
						this.messages.push(new Message({
							nickName: messages[i].from.nickname,
							notification: true,
							text: `${messages[i].from.nickname} has joined the chat.`
						}));
					}
					break;
                case "Message":
                    fullNameArray =  messages[i].from.nickname.split(' ');
					if (messages[i].from.type === 'Agent') {
						this.messages.push(new Message({
                            nickName: messages[i].from.nickname,
                            firstName: fullNameArray[0],
							notification: false,
							text: messages[i].text.replace(/[\u21b5|\n|\r|\r\n]+/gm, `<br />`),
							type: messages[i].from.type
						}));
						this.agent.isTyping = false;
					} else if (messages[i].from.type === 'External'){
						this.messages.push(new Message({
                            nickName: messages[i].from.nickname,
                            firstName: fullNameArray[0],
							notification: true,
							text: messages[i].text.replace(/[\u21b5|\n|\r|\r\n]+/gm, `<br />`)
						}));
                    }
					break;
				case "TypingStarted":
					if (messages[i].from.type === 'Agent') {
						this.agent.isTyping = true;
						this.chatUsers.next(this.agent);
					}
					break;
				case "TypingStopped":
					if (messages[i].from.type === 'Agent') {
						this.agent.isTyping = false;
						this.chatUsers.next(this.agent);
					}
					break;
                case "ParticipantLeft":
                    fullNameArray =  messages[i].from.nickname.split(' ');
					if (messages[i].from.type === 'Agent') {
						this.messages.push(new Message({
                            nickName: messages[i].from.nickname,
                            firstName: fullNameArray[0],
							notification: true,
							text: `${messages[i].from.nickname} has left the chat. Thank You.`
						}));
						// this.intevalAPICall.unsubscribe();
					}
					break;
				case "PushUrl":
					this.messages.push(new Message({
							nickName: messages[i].from.nickname,
							notification: false,
							isPushUrl: true,
							text: messages[i].text.replace((/https?:\/\//), ''),
							type: messages[i].from.type
						}));
						this.agent.isTyping = false;
					break;
				default:
					break;
			}
		}
	}

	// Sends the flag when the User starts typing, only on the first KeyDown
	startTyping(): void {
		const startTypingAPIUrl: string = `${this.url}/${this.userDetail.type}/chat/${this.chat.chatId}/startTyping`;
		this.http.post(startTypingAPIUrl, JSON.stringify(this.chat), {headers: this.headers}).toPromise();
	}

	// sends the flag when user stops typing
	stopTyping(): void {
		const stopTypingAPIUrl: string = `${this.url}/${this.userDetail.type}/chat/${this.chat.chatId}/stopTyping`;
		this.http.post(stopTypingAPIUrl, JSON.stringify(this.chat), {headers: this.headers}).toPromise();
	}

	// send the flag back to the user when the Agent disconnects from the Chat
	disconnectChat(): void {
		const disconnectAPIUrl: string = `${this.url}/${this.userDetail.type}/chat/${this.chat.chatId}/disconnect`;
		this.http.post(disconnectAPIUrl, JSON.stringify(this.chat), {headers: this.headers}).toPromise();
	}

	// Function that sends the chat message from User to the Agent
	sendMessage(message: string, convertedText: string): void {
		// Send the Message to the API as needed and add to the messages array
		const sendAPIUrl: string = `${this.url}/${this.userDetail.type}/chat/${this.chat.chatId}/send`;
		let data = {
			alias: this.chat.alias,
			userId: this.chat.userId,
			secureKey: this.chat.secureKey,
			message: encodeURIComponent(message)
        };
        let fullNameArray =  this.client.nickName.split(' ');
		this.messages.push(new Message({
            nickName: this.client.nickName,
            firstName: fullNameArray[0],
			text: convertedText,
			type: 'Client'
		}));

		this.http.post(sendAPIUrl, JSON.stringify(data), {headers: this.headers}).toPromise().then(response => { response.json() });
	}

	// sends every message to chatList Component which renders the Chat view, this
	getMessageArray(): Promise<Message[]> {
		return Promise.resolve(this.messages);
	}

	// Parse the Url Parameters to an Object that is used to initialize the User Class which gets used for the first connection.
	getURLparams(): Object {
		const environment = window.location.hostname;
		if(environment === 'localhost') {
			this.url = 'https://moolocal.mutualofomaha.com/api/genesys';
		} else {
			this.url  = `https://${environment}/api/genesys`;
		}
		const regex = /[?&]([^=#]+)=([^&#]*)/g;
    	const url = window.location.href;
    	let params = {};
   		let match;

		while (match = regex.exec(url)) {
    		params[match[1]] = match[2];
		}
		return params;
	}
}
