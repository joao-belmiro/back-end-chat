const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const crypto = require('crypto'); 
const app = express();
const server = http.Server(app).listen(8083);
const io = socketIo().listen(server).origins("*:*");

const users = []
const sala = {}
io.on('connection', (socket) => {
    let id = socket.id

    console.log('novo Clinete Conectado =>' + id)

    socket.on("registro", function (data) {
        users.push({id: socket.id, nome: data})
        socket.broadcast.emit('connection', `${data} Se Registrou`)
    })

    socket.on('broadcast', function (data) {
        socket.broadcast.emit('broadcast',data)
    })
    
    socket.on('mensagem-privada' , function (data) {
        io.sockets.connected[data.idDestino].emit('mensagem-privada', data)
    })

    socket.on('listar', function (data) {
      let filtro = users.filter(usr => usr.nome.toLowerCase().indexOf(data.toLowerCase()) > -1)
      io.sockets.connected[socket.id].emit('listar', filtro)
    })

    socket.on('disconnect', () => {
        let index = users.findIndex(u => u.id === id)
        console.log('cliente desconectado ==>'+ socket.id)
        if (index !== -1) users.splice(index)
        console.log(users)
    })
})