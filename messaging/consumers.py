import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from urllib.parse import parse_qs
from django.contrib.auth.models import User
from .models import ChatRoom, ChatRoomParticipant

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"
        user = User.objects.get(username="atiq@mnsaf.com")
        self.user = user
        
        self.room, created = ChatRoom.objects.get_or_create(name=self.room_name)
        
        participant, _ = ChatRoomParticipant.objects.get_or_create(user=self.user, room=self.room)
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        json_text = json.loads(text_data)
        message = json_text["message"]
        
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type": "chat_message",
                "message": message,
                "user": self.user.username 
            }
        )
        

    def chat_message(self, event):
        message = event["message"]
        username = event["user"] 

        self.send(text_data=json.dumps({
            "message": message,
            "user": username  
        }))
