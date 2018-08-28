const express = require('express'),
        app = express(),
        http = require('http'),
        path = require('path'),
        server = http.createServer(app),
        io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'assets')));

var users = [];
var messages = [];

io.on('connection', (socket) => { 
   socket.on('login', (data) => {
       if (users.length === 0)
            users.push(data);
        else
            for (var i = 0; i < users.length; i++)
                if (data.username != users[i].username)
                    users.push(data);

       io.sockets.emit('add-user', users);
   });

   socket.on('send-message', (data) => {
        io.sockets.emit('receive-message', data);
   });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, './index.html'));
});