const canvas = document.querySelector('canvas'),
ctx= canvas.getContext('2d'),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImage = document.querySelector(".save-img");
let isDrawing = false,
selectedTool = "brush",
brushWidth=5,
prevMouseX,prevMouseY,snapshot,
selectedColor="#000";

const setBackgroundCanvas = ()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle= selectedColor;
}

window.addEventListener("load", () =>  {
    //setting canvas width,height .. offsetwidth/offsetheight returns viewable width/height of an element.
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setBackgroundCanvas();
});

const drawRect=(e) => {
    if(!fillColor.checked){
       return  ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX - e.offsetX ,prevMouseY - e.offsetY);
    }
   ctx.fillRect(e.offsetX,e.offsetY,prevMouseX - e.offsetX ,prevMouseY - e.offsetY);
}
 const drawCircle = (e) => {
    ctx.beginPath(); //creating new path
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));//getting radius of circle according to mouse pointer
    ctx.arc(prevMouseX,prevMouseY,radius, 0 , 2* Math.PI);
    fillColor.checked? ctx.fill() : ctx.stroke();
 }
  const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX,e.offsetY); //creating first line according to mouse pointer
    ctx.lineTo(prevMouseX *2 - e.offsetX, e.offsetY) ;// creating bottom line of the triangle
    ctx.closePath();
    fillColor.checked? ctx.fill() : ctx.stroke();
  }

const drawing = (e) => {
    if(!isDrawing) return; // if drawing is false, return from here
    ctx.putImageData(snapshot,0,0);
    if(selectedTool==="brush" || selectedTool==="eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff":selectedColor;
        ctx.lineTo(e.offsetX,e.offsetY); //creates line according to the mouse pointer
        ctx.stroke() //drawing/ filling the line with color
    }else if(selectedTool==="rectangle"){
        drawRect(e);
    }else if(selectedTool==="circle"){
        drawCircle(e);
    }else if(selectedTool==="triangle"){
        drawTriangle(e);
    }
   
}
toolBtns.forEach(btn => {
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove(".active");//removes active class fro previous class and adds it to the current clicked option
        btn.classList.add("active");
        selectedTool=btn.id;
        console.log(selectedTool);
    })
});
colorBtns.forEach(btn => {
    btn.addEventListener("click",()=> {
        document.querySelector(".options .selected").classList.remove(".selected");
        btn.classList.add("selected");
        selectedColor=(window.getComputedStyle(btn).getPropertyValue("background-color"));
    })
})
sizeSlider.addEventListener("change",()=>{brushWidth=sizeSlider.value});

const startDraw =(e) => {
    isDrawing=true;
    prevMouseX=e.offsetX;
    prevMouseY=e.offsetY;
    ctx.beginPath(); //creating a new path to draw
    ctx.lineWidth= brushWidth; //passing brush size as line-width
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle=selectedColor;
    snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);
}
colorPicker.addEventListener("change", ()=> {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click();
})
canvas.addEventListener("mousedown",startDraw);
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",()=>isDrawing=false);
clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0, canvas.width,canvas.height);
    setBackgroundCanvas();
})

saveImage.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
})