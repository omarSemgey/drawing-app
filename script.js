const canvas = document.querySelector('canvas'),
toolsBtns = document.querySelectorAll('.tools'),
fillColor = document.querySelector('#fill-color');
sizeSlider = document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.clear-canvas'),
saveImg = document.querySelector('.save-img'),
ctx = canvas.getContext('2d');

let prevMouseX,prevMouseY,snapShot,
isDrawing = false,
selectedTool = 'brush',
brushWidth = 3,
selectedColor = '#000';


window.addEventListener('load',() => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

sizeSlider.addEventListener('change',() => {
    brushWidth = sizeSlider.value;
});

toolsBtns.forEach(btn => {
    btn.addEventListener('click',() => {
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
    });
});

colorBtns.forEach(btn => {
    btn.addEventListener('click',(e) => {
        document.querySelector('.options .selected').classList.remove('selected');
        btn.classList.add('selected');
        selectedColor =window.getComputedStyle(btn).getPropertyValue('background-color');
    });
});

colorPicker.addEventListener('change',() => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener('click',() => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener('click',() => {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg` 
    link.href = canvas.toDataURL();
    link.click()
});

canvas.addEventListener('mousedown',startDraw)
canvas.addEventListener('mousemove',drawing);
canvas.addEventListener('mouseup',() => { isDrawing=false; })
canvas.addEventListener('mouseleave',() => { isDrawing=false; });

//functions
function startDraw(e){
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function drawRect(e){
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    }else{
        ctx.fillRect(e.offsetX,e.offsetY,prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    }
}

function drawCircle(e){
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY ), 2));
    ctx.arc(prevMouseX,prevMouseY,radius,0, 2 * Math.PI);
    ctx.stroke();
    if(!fillColor.checked){
        ctx.stroke;
    }else{
        ctx.fill();
    }
}

function drawTriangle(e){
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX,e.offsetY);
    ctx.closePath();
    if(!fillColor.checked){
        ctx.stroke();
    }else{
        ctx.fill();
    }
}

function drawing(e){
    if(!isDrawing) return;
    ctx.putImageData(snapShot,0,0);
    if(selectedTool == 'brush' || selectedTool == 'eraser'){
        ctx.strokeStyle = selectedTool == 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    } else if(selectedTool == 'rectangle'){
        drawRect(e);
    } else if(selectedTool == 'circle'){
        drawCircle(e);
    }else{
        drawTriangle(e);
    }
}

function setCanvasBackground(){
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle= selectedColor;
}
