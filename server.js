const express = require('express')
const app = express()

app.use(express.static('public'))

const http = require('http').Server(app)
const serverSocket = require('socket.io')(http)

const porta = 8181

http.listen(porta, function (){
    console.log('Servidor Iniciado: ' + porta)
})

app.get('/', function(req, resp){
    resp.sendFile(__dirname + '/index.html')
})

serverSocket.on('connection', function(socket){

    socket.on('login', function(nickname){
        console.log('Cliente conectado: ' + nickname)
        serverSocket.emit('chat msg', `[${nickname}] ***Conectou.`)
        socket.nickname = nickname
    })

    socket.on('chat msg', function(msg){
        console.log(`Mensagen recebida ${socket.nickname}: ${msg}`)
        serverSocket.emit('chat msg', `${socket.nickname} diz ${msg}`)
    })

    socket.on('status', function(msg){
        socket.broadcast.emit('status', msg)
    })
})