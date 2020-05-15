const socket = io()
const chatForm = document.getElementById('chat-form')
const message_input = document.getElementById('msg')
const ApperChat = document.getElementById('chat_msg')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const clear_button = document.getElementById('clear-btn')


console.log(username + " " + room)

socket.emit('join-chat',{username,room})

socket.on('message',data=>{
    console.log(data)
    outputMessage(data)

    ApperChat.scrollTop = ApperChat.scrollHeight
})

socket.on('output',data=>{
    console.log(data)
    data.forEach(element => {
        outputMessage(element)
        ApperChat.scrollTop = ApperChat.scrollHeight
    });
    
})

socket.on('sendUserData',({room,users})=>{
    outputRoom(room)
    outputUsers(users)
})

socket.on('clear',()=>{
    location.reload();
})

//sending message from client to server
chatForm.addEventListener('submit',e=>{
    e.preventDefault()
    const msg  = message_input.value
    const time = "("+moment().format('MMMM Do YYYY, h:mm a')+")";
    const data ={
        msg,
        time,
    }
    socket.emit('chatMessage',data)
    message_input.value = ''
    message_input.focus()
})

//clearing messages from screen
clear_button.addEventListener('click',e=>{
    socket.emit('clear')
    location.reload();
})


function outputMessage (message) {
    console.log(message)
    const div = document.createElement('div')
    div.className = 'message'
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    ApperChat.appendChild(div)
}

function outputRoom(room){
    roomName.innerHTML = room
}

function outputUsers(users){
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}