from .models import ChatRoom
from django.forms import ModelForm, forms, CharField, PasswordInput


class JoinChatRoomForm(forms.Form):
    name = CharField()
    password = CharField(widget=PasswordInput)


class CreateChatRoomForm(ModelForm):
    class Meta:
        model = ChatRoom
        fields = ['name', 'password']
