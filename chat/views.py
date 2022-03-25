from django.shortcuts import render, redirect, reverse
from .models import ChatRoom
from .forms import JoinChatRoomForm, CreateChatRoomForm


def index(request):
    if request.method == 'POST':
        form = JoinChatRoomForm(request.POST)
        chat_room = ChatRoom.objects.filter(name=form.data['name'])
        if form.is_valid() and chat_room.exists() and form.data['password'] == chat_room[0].password:
            request.session['room'] = form.data['name']
            return redirect('chat:room', room_name=form.data['name'])
        else:
            form = JoinChatRoomForm()
    else:
        form = JoinChatRoomForm()
    return render(request, 'chat/index.html', {'form': form})


def create_room(request):
    if request.method == 'POST':
        form = CreateChatRoomForm(request.POST)
        if form.is_valid():
            new_room = form.save(commit=False)
            new_room.user = request.user
            new_room.save()
            return redirect('chat:index')
    else:
        form = CreateChatRoomForm()
    return render(request, 'chat/create_room.html', {'form': form})


def room(request, room_name):
    if 'room' in request.session and request.session['room'] == room_name:
        return render(request, 'chat/room.html', {'room_name': room_name})
    else:
        return redirect('chat:index')


def rooms_list(request):
    rooms = ChatRoom.objects.filter(user=request.user)
    return render(request, 'chat/rooms_list.html', {'rooms': rooms})
