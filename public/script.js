
/**
 * Socket
 */
 var socket;
 socket = io.connect('http://localhost:3000');
 /*
 * Canvas
 */

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// Resizing
let canvasOffsetX = canvas.offsetLeft;
let canvasOffsetY = canvas.offsetTop;
canvas.height = window.innerHeight - canvasOffsetX;
canvas.width = window.innerWidth - canvasOffsetY;
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Variables
let painting = false;
let lineWidth = 3;

function startPosition(e){
    painting = true;
    draw(e);
}

function finishedPosition(){
    painting = false;
    ctx.beginPath();
}

function draw(e){
    if(!painting) return;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    let mouseX = e.clientX - canvasOffsetX;
    let mouseY = e.clientY - canvasOffsetY;

    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);

    

    console.log('Sending : ' + (mouseX) + ', ' + (mouseY));
    var data = {
        x: mouseX,
        y: mouseY
    }
    socket.emit('mouse', data);

    

    socket.on('mouse', newDrawing);
    function newDrawing(data){
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(data.x, data.y);
    }
}

// Inputs
const clearBtn = document.querySelector('#clear');
const strokeBtn = document.querySelector('#stroke');
const colorBtn = document.querySelector('#color');
const fillBtn = document.querySelector('#fill');

// Event listeners
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('pointerdown', startPosition);
canvas.addEventListener('pointerup', finishedPosition);
canvas.addEventListener('pointermove', draw);

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

ctx.strokeStyle = colorBtn.value;
colorBtn.addEventListener('change', () => {
    ctx.strokeStyle = colorBtn.value;
})

lineWidth = strokeBtn.value;
strokeBtn.addEventListener('change', () => {
    lineWidth = strokeBtn.value;
})

fillBtn.addEventListener('click', () => {
    ctx.fillStyle = colorBtn.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
})

window.addEventListener('resize', () =>{
    canvasOffsetX = canvas.offsetLeft;
    canvasOffsetY = canvas.offsetTop;
    canvas.height = window.innerHeight - canvasOffsetX;
    canvas.width = window.innerWidth - canvasOffsetY;
})


// Download image
const displayBtn = document.querySelector('#display');
const dlBtn = document.querySelector('#download');
const imgConverted = document.querySelector('#imgConverted')

displayBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/jpeg');
    imgConverted.src = dataURL;
})

dlBtn.addEventListener('click', () => {
    const a = document.createElement('a');

    document.body.appendChild(a);
    a.href = canvas.toDataURL('image/jpeg');
    a.download = 'canvas-image.jpg';
    a.click();
})