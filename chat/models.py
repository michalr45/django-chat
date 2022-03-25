from django.db import models
from django.conf import settings
import uuid


class ChatRoom(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_rooms')
    uuid = models.UUIDField(editable=False, default=uuid.uuid4, unique=True)
    name = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
