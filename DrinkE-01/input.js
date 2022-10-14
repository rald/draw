var touches=null;
var mouse={ x:0, y:0, isDown:false };
var key={ keyCode:0, isDown:false };

canvas.addEventListener("mousedown", (function (e) {
	const mousePos = this.getMousePos(canvas, e);
	mouse.x=mousePos.x;
	mouse.y=mousePos.y;
	mouse.isDown=true;
}).bind(this), false);

canvas.addEventListener("mouseup", (function (e) {
	const mousePos = this.getMousePos(canvas, e);
	mouse.x=mousePos.x;
	mouse.y=mousePos.y;
	mouse.isDown=false;
}).bind(this), false);

canvas.addEventListener("mousemove", (function (e) {
	const mousePos = this.getMousePos(canvas, e);
	mouse.x=mousePos.x;
	mouse.y=mousePos.y;
}).bind(this), false);

// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", (function (e) {
  const mousePos = this.getTouchPos(canvas, e);
  touches=e.touches;
	var touch = e.touches[0];
	var mouseEvent = new MouseEvent("mousedown", {
		clientX: touch.clientX,
		clientY: touch.clientY
	});
	canvas.dispatchEvent(mouseEvent);
}).bind(this), false);

canvas.addEventListener("touchend", (function (e) {
  touches=e.touches;
	var mouseEvent = new MouseEvent("mouseup", {});
	canvas.dispatchEvent(mouseEvent);
}).bind(this), false);

canvas.addEventListener("touchmove", (function (e) {
  touches=e.touches;
	var touch = this.touches[0];
	var mouseEvent = new MouseEvent("mousemove", {
		clientX: touch.clientX,
		clientY: touch.clientY
	});
	canvas.dispatchEvent(mouseEvent);
}).bind(this), false);

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", (function (e) {
	if (e.target == canvas) {
		e.preventDefault();
	}
}).bind(this), false);

document.body.addEventListener("touchend", (function (e) {
	if (e.target == canvas) {
		e.preventDefault();
	}
}).bind(this), false);

document.body.addEventListener("touchmove", (function (e) {
	if (e.target == canvas) {
		e.preventDefault();
	}
}).bind(this), false);

document.body.addEventListener("keydown", (function (e) {
  key.keyCode=e.keyCode;
  key.isDown=true;
//  console.log(keyCode);
}).bind(this), false);

document.body.addEventListener("keyup", (function (e) {
  key.keyCode=e.keyCode;
  key.isDown=false;
}).bind(this), false);


// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
	var rect = canvasDom.getBoundingClientRect();
	return {
		x: mouseEvent.clientX - rect.left,
		y: mouseEvent.clientY - rect.top
	};
}

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
	var rect = canvasDom.getBoundingClientRect();
	
	touches=touchEvent.touches;
	
	return {
		x: touchEvent.touches[0].clientX - rect.left,
		y: touchEvent.touches[0].clientY - rect.top
	};
}
