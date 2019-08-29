import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatRowComponent } from './chat-row/chat-row.component';
import { GenesysChatService } from './services/genesys-chat-service.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatFormComponent,
    ChatListComponent,
    ChatRowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [GenesysChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
