let canvas = document.querySelector("canvas");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let pencilColors = pencilToolCont.querySelectorAll(".pencil-color");
let pencilWidthElem = pencilToolCont.querySelector(".pencil-width");
let eraserWidthElem = eraserToolCont.querySelector(".eraser-width")

let penColor = "black";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let undoRedoTracker = [];   // data
let track = 0;    // represent action from tracker array

// API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;   // set color
tool.lineWidth = penWidth; // set lineWidth
let mouseDown = false;

// tool.beginPath();   // new graphic (path or line)
// tool.moveTo(10,10); // start point
// tool.lineTo(100,150);   // end point
// tool.stroke();  // fill color


// tool.beginPath();
// tool.moveTo(10,10);
// tool.lineTo(200,250);
// tool.stroke();

canvas.addEventListener("mousedown",(e)=>{
    // tool.beginPath();
    // tool.moveTo(e.clientX,e.clientY);
    
    mouseDown = true;
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
    let data = {
        x:  e.clientX,
        y:  e.clientY
    }
    // beginPath(data);
    // data sent to server
    socket.emit("beginPath",data)
})

canvas.addEventListener("mousemove",(e)=>{
    if(mouseDown){
        // drawStroke({
        //     x:  e.clientX,
        //     y:  e.clientY
        // })     
        let data={
            x:  e.clientX,
            y:  e.clientY,
            color:  eraserFlag?eraserColor:penColor,
            width:  eraserFlag?eraserWidth:penWidth
        } 
        socket.emit("drawStroke",data);
    }
})

canvas.addEventListener("mouseup",(e)=>{
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})

pencilColors.forEach((colorElem)=>{
    colorElem.addEventListener("click",(e)=>{
        penColor = colorElem.classList[0];
        tool.strokeStyle = penColor;
       
    })
})

pencilWidthElem.addEventListener("change",(e)=>{
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
   
})

eraserWidthElem.addEventListener("change",(e)=>{
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
    
})

eraser.addEventListener("click",(e)=>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click",(e)=>{
    let a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = "board.jpg";
    a.click();
})

undo.addEventListener("click",(e)=>{
    if(track>0)
    track--;
    // track action
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj);
    socket.emit("undoRedo",trackObj);
})

redo.addEventListener("click",(e)=>{
    if(track<undoRedoTracker.length-1)
    track++;
// track action 
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }

    socket.emit("undoRedo",trackObj);
    // undoRedoCanvas(trackObj);
})

function undoRedoCanvas(trackObj){
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image();  // new image reference element
    tool.clearRect(0, 0, canvas.width, canvas.height);
    img.src = url;
    img.onload = (e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height)
    }
}

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

socket.on("beginPath",(data)=>{
    // data from server
    beginPath(data);
})

socket.on("drawStroke",(data)=>{
    drawStroke(data);
})

socket.on("undoRedo",(data)=>{
    undoRedoCanvas(data);
})