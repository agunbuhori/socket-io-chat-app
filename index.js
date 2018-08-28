const express = require('express'),
        app = express(),
        http = require('http'),
        path = require('path'),
        server = http.createServer(app),
        io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'assets')));

var users = [];

io.on('connection', (socket) => { 
   socket.on('login', (data) => {
       users.push(data);
       onlyUnique = (value, index, self) => {
           return self.indexOf(value) === index;
       }

       io.sockets.emit('add-user', users.filter(onlyUnique));
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