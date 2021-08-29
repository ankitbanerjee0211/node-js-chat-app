// linking the socket.io to this localhost
const socket = io('http://localhost:8000', { transports: ['websocket', 'polling', 'flashsocket'] });

// Getting DOM Elements
const form = document.getElementById('send_container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container')
var audio = new Audio('../message.wav');

setInterval(() => {
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
}, 500);

// Function which will append event to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left' || position == 'center'){
        audio.play();
    }
}

// Ask new use for name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, receive the name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center')
})
// it simply runs the function by relaying it through the socket.io

// If server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container of others
socket.on('left', name => {
    append(`${name} left the chat`, 'center')
})

// If the form gets submitted, send the server the message
form.addEventListener('submit', (e) => {
    // Stop reloading of the page
    e.preventDefault();

    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    // this emit function relays that its been called and will now be managed by the socket.io

    // clearing the message input box after sending
    messageInput.value = '';
})