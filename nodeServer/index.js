// Node server which will handle socket.io connections
const io = require('socket.io')(8000);
const users = {};

io.on('connection', socket => {
    // if any user joins then let other users connected to the server know
    socket.on('new-user-joined', name => {
        // console.log('New user', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    // if someone sends a message, broadcast it to the other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    })

    // if someone leaves the chat, broadcast it to the other people
    // * This 'disconnect' function is predefined by socket.io
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
})