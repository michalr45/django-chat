from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('', views.index, name='index'),
    path('create_room/', views.create_room, name='create_room'),
    path('my_rooms/', views.rooms_list, name='rooms_list'),
    path('<str:room_name>/', views.room, name='room'),
]
