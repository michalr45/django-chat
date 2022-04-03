const roomName = JSON.parse(document.getElementById('room-name').textContent);
const submitButton = document.querySelector('#chat-message-submit');
let chatInput = document.querySelector('#chat-message-input');
let chatbox = document.querySelector('.chatbox')
let errorInfo = document.querySelector('.error')


//text chat

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    chatbox.innerHTML += `<div>
                             <p class="user">${data.username}</p>
                             <p class="message">${data.message}</p>
                          </div><hr>`;
};

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

chatInput.focus();
chatInput.onkeyup = function (e) {
    if (e.key === 'Enter') {
        submitButton.click();
    }
};

submitButton.onclick = function (e) {
    const message = chatInput.value;
    if (message) {
        chatSocket.send(JSON.stringify({
            'message': message
        }));
        errorInfo.innerHTML = ""
    } else {
        errorInfo.innerHTML = "message can't be empty"
    }
    chatInput.value = '';
};

//video

const appID = JSON.parse(document.getElementById('app_id').textContent);
const channel = roomName;
const token = JSON.parse(document.getElementById('token').textContent);
let UID = JSON.parse(document.getElementById('uid').textContent);

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8'
})

let tracks = []
let remoteUser = {}

let localStream = async function () {
    client.on('user-published', userJoin)
    client.on('user-left', userLeft)

    UID = await client.join(appID, channel, token, UID);

    tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `
                     <div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                    </div>
    `
    document.querySelector('.video-chat').insertAdjacentHTML('beforeend', player)

    tracks[1].play(`user-${UID}`)

    await client.publish([tracks[0], tracks[1]])
}

let userJoin = async function (user, mediaType) {
    remoteUser[user.uid] = user
    await client.subscribe(user, mediaType)

    if (mediaType === 'video') {
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null) {
            player.remove()
        }
        player = `
                     <div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div>
                    </div>
                 `
        document.querySelector('.video-chat').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio') {
        user.audioTrack.play()
    }
}

let userLeft = async function(user){
    delete remoteUser[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let userLeave = async function(){
    for(let i=0; tracks.length > i; i++){
        tracks[i].stop()
        tracks[i].close()
    }

    await client.leave()
    window.open('/', '_self')
}

let userMicrophone = async function(e){
    if(tracks[0].muted){
        await tracks[0].setMuted(false)
        e.target.style.color = 'green'
    }else{
        await tracks[0].setMuted(true)
        e.target.style.color = 'grey'
    }
}

let userCamera = async function(e){
    if(tracks[1].muted){
        await tracks[1].setMuted(false)
        e.target.style.color = 'green'
    }else{
        await tracks[1].setMuted(true)
        e.target.style.color = 'grey'
    }
}


localStream();

document.getElementById('leave-btn').addEventListener('click', userLeave)
document.getElementById('microphone-btn').addEventListener('click', userMicrophone)
document.getElementById('camera-btn').addEventListener('click', userCamera)
