
# django-chat

Simple django based video and text chat web app

## Features

- user authentication
- creating chat rooms
- WebSockets based text chat
- video chat using Agora SDK
 

## Tech Stack

Built with **Django**
- Basic django channels usage to handle WebSockets
- Agora Video SDK used for video chat (special credits to [Dennis Ivy](https://github.com/divanov11))

## Installation

Clone this repository and install project dependencies in a virtual enviroment by running
`pip install -r requirements.txt` from project's root directory.

Create .env file and create SECRET_KEY variable

Run migrations: `python manage.py migrate`

To start the local server use this command: `python manage.py runserver` 

For the text chat to work, you need to start a local Redis server

For the video chat to work, it is necessary to provide individual Agora's APP_ID and and APP_CERT variables in .env file
## Note

User's interface isn't as polished as it could be, but since I'm looking to recreate this application using WebRTC, further improvements will be applied in the next version.
