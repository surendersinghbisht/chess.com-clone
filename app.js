const express = require('express');
const app = express();
const path = require('path');
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");


app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

const server = http.createServer(app)
const io = socket(server)

const chess = new Chess();
let players = {}
let currentPlayer = "w"

app.get("/", (req, res) => {
    res.render('index', {title: 'chess game'})
})

io.on("connection", (uniqueSocket)=> {
    console.log('connected')
    if(!players.white) {
        players.white = uniqueSocket.id
        uniqueSocket.emit("playerRole", "w")
        } else if(!players.black){
            players.black = uniqueSocket.id
            uniqueSocket.emit("playerRole", "b")
        } else {
            uniqueSocket.emit("spectatorRole")
        }
        
        uniqueSocket.on ("disconnect", (uniqueSocket)=> {
            if(uniqueSocket.id == players.white){
                delete players.white
            } else if( uniqueSocket.id == players.black) {
                delete players.black
            }
        } ) 

        uniqueSocket.on("move", (move)=> {
         
        try {
            if(chess.turn() === "w" && uniqueSocket.id !== players.white) return;
            if(chess.turn() === "b" && uniqueSocket.id !== players.black) return;
           const result = chess.move(move);
           if(result){
            currentPlayer = chess.turn()
            io.emit("move", move)
                io.emit("boardState", chess.fen())
           } else {
            uniqueSocket.emit("invalid Move", move)
           }
        }catch (err) {
       uniqueSocket.emit("invalid move :", move)
        }
        })
})



server.listen(3000, ()=> {
    console.log('listen')
});

