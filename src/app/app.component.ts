import { Component, HostListener } from '@angular/core';
import { GenesysChatService } from './services/genesys-chat-service.service';

@Component({
	selector: 'app-genesys',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	agent: any = {};

	constructor(private GenesysChatService: GenesysChatService) {
		this.GenesysChatService.chatUsers.subscribe((value) => {
      		this.agent = value;
    	});
	}

	// Event Listener for Window close event to send the Disconnect flag to API
	@HostListener('window:beforeunload', [ '$event' ])
  		beforeUnloadHander(event) {
			this.GenesysChatService.disconnectChat();
  	}
}
