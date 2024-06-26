import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chatscreen.component.html',
  styleUrls: ['./chatscreen.component.css']
})
export class ChatscreenComponent {
  newMessage = '';
  messages: string[] = [];

  chatSocket: WebSocket;

  constructor() {
    this.chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/public_room/`);

    this.chatSocket.onopen = (e) => {
      console.log('Chat socket successfully connected.');
    };

    this.chatSocket.onclose = (e) => {
      console.log('Chat socket closed unexpectedly');
    };

    this.chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const message = `${data.user}: ${data.message}`;
      this.messages.push(message);
    };
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatSocket.send(JSON.stringify({ 'message': this.newMessage.trim() }));
      this.newMessage = '';
    }
  }

  removeMessage(message: string): void {
    const index = this.messages.indexOf(message);
    if (index !== -1) {
      this.messages.splice(index, 1);
    }
  }
}
