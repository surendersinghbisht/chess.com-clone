const socket = io(); 
const chess = new Chess();
const boardElement = document.querySelector(".chessboard")
const headerElement = document.querySelector(".header")

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard =()=> {
    boardElement.innerHTML = "";
const board = chess.board()

board.forEach((row, rowIndex)=>{
row.forEach((square, squareIndex)=>{
const squareElement = document.createElement("div")
squareElement.classList.add(
    "square",
    (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
)

squareElement.dataset.row = rowIndex;
squareElement.dataset.col = squareIndex;

if(square) {
    const pieceElement = document.createElement("div");
    pieceElement.classList.add(
        "piece",
        square.color === "w" ? "white" : "black"
    )

    pieceElement.innerText = getPieceUnicode(square)
    pieceElement.draggable = playerRole === square.color;

    pieceElement.addEventListener("dragstart", (e)=> {
        if(pieceElement.draggable){
            draggedPiece = pieceElement;
            sourceSquare = {row: rowIndex, col: squareIndex}
            e.dataTransfer.setData("text/plain", "")
        }
    })

    pieceElement.addEventListener("dragend", (e)=>{
        draggedPiece = null;
        sourceSquare = null;
    });

    squareElement.appendChild(pieceElement);
}

squareElement.addEventListener("dragover", (e)=>{
    e.preventDefault();
})

squareElement.addEventListener("drop", (e)=>{
e.preventDefault();
if(draggedPiece){
    const targetSource = {
        row: parseInt(squareElement.dataset.row),
        col: parseInt(squareElement.dataset.col)
    }
    handleMove(sourceSquare, targetSource);
}
})
boardElement.appendChild(squareElement)
})
})

if(playerRole === "b" ){
    boardElement.classList.add("flipped")
}else {
    boardElement.classList.remove("flipped")
}


if(playerRole === "w"){
    headerElement.innerText = "player 1"
}else if(playerRole === "b"){
    headerElement.innerText = "player 2"
}else{
    headerElement.innerText = "spectator"
}
}

const handleMove =(source, target)=> {
const move = {
    from : `${String.fromCharCode(97 + sourceSquare.col)}${8 - source.row}`,
    to : `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q",
}
socket.emit("move", move)
}

const getPieceUnicode =(piece)=>{
    const unicodePieces = {
    k: "♔",
    q: "♕",
    r: "♖",
    b: "♗",
    n: "♘", 
    p: "♙",
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘", 
    P: "♙",
    }

    return unicodePieces[piece.type] || null;
}



socket.on("playerRole", (role)=>{
    playerRole = role;
    renderBoard()
    })
    

socket.on("spectatorRole", ()=>{
playerRole = null;
renderBoard()
})

socket.on("boardState", (fen)=>{
    chess.load(fen)
    renderBoard()
    })


socket.on("move", (move)=>{
    chess.move(move)
    renderBoard()
    })
// k: "♔",
// q: "♕",
// r: "♖",
// b: "♗",
// n: "♘", 
// p: "♙"

renderBoard()