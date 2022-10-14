var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

var txtframe=document.getElementById("txtframe");

var btnplay=document.getElementById("btnplay");
var inpcolor=document.getElementById("inpcolor");
var btnfloodfill=document.getElementById("btnfloodfill");
var btneyedrop=document.getElementById("btneyedrop");


var b;
var f=0;
var h=false;
var d=false;
var px=0,py=0;
var play=false;
var delay=1000;
var ani;
var buf=null;
var color="#000000";
var filling=false;
var eyedropping=false;

function toggleButtons() {

	if(filling) {
		btnfloodfill.style.backgroundColor="#aaa";
	} else {
		btnfloodfill.style.backgroundColor="";
	}

	if(eyedropping) {
		btneyedrop.style.backgroundColor="#aaa";
	} else {
		btneyedrop.style.backgroundColor="";
	}
	
}

function doFloodFill() {
	filling=!filling;
	if(filling && eyedropping) eyedropping=false;
	toggleButtons();
}

function doEyeDrop() {
	eyedropping=!eyedropping;
	if(eyedropping && filling) filling=false;
	toggleButtons();
}



function changeColor() {
	color=inpcolor.value;
}


function copy() {
	buf=[];
	for(var i=0;i<b.p[f].length;i++) buf.push(b.p[f][i]);
}



function cut() {
	buf=[];
	for(var i=0;i<b.p[f].length;i++) buf.push(b.p[f][i]);
	for(var i=0;i<b.p[f].length;i++) b.p[f][i]="#ffffff";
}



function paste() {
	if(buf) {
		b.p[f]=[];
	for(var i=0;i<buf.length;i++) b.p[f].push(buf[i]);
	}
}


function prev() {
	f--;
	if(f<0) f=b.p.length-1;
	txtframe.value=f;
}



function next() {
	f++;
	if(f>=b.p.length) f=0;
	txtframe.value=f;
}



function removeFrame() {
	if(b.p.length>1) {
		b.p.splice(f,1);
		if(f>=b.p.length) f=b.p.length-1;
		txtframe.value=f;
	}
}



function insertFrame() {
	var m=[];
	for(var i=0;i<b.w*b.h;i++) m.push("#ffffff");
	f++;
	b.p.splice(f,0,m);
	txtframe.value=f;
}


function downloadData() {
	aredata.value=JSON.stringify(b.p);
}


function uploadData() {
	b.p=JSON.parse(aredata.value);
}



function togglePlay() {
	play=!play;
	if(play) {
		ani=setInterval(function(){
			f=(f+1)%b.p.length;
			txtframe.value=f;
		},delay);
		btnplay.innerHTML="PAUSE";
	} else {
		clearInterval(ani);
		btnplay.innerHTML="PLAY";
	}
}



function resize() {
	canvas.width = b.w*b.s+1;
	canvas.height = b.h*b.s+1;

	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	draw();
}



function rnd(x) {
	return Math.floor(Math.random()*x);
}



function fillRect(x,y,w,h,s,c) {
	ctx.fillStyle=c;
	ctx.fillRect(x*s,y*s,w*s,h*s);
}



function setPixel(x,y,s,c) {
	fillRect(x*s,y*s,s,s,s,c);
}



function drawLine(x0,y0,x1,y1,s,c) {
	var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
	var err = (dx > dy ? dx : -dy) / 2, e2;

	for (;;)
	{
		setPixel( x0, y0, s, c);
		if (x0 == x1 && y0 == y1)
			break;
		e2 = err;
		if (e2 > -dx)
		{
			err -= dy;
			x0 += sx;
		}
		if (e2 < dy)
		{
			err += dx;
			y0 += sy;
		}
	}
}	



function bitmap_setPixel(b,f,x,y,c) {
	if(x>=0 && x<b.w && y>=0 && y<b.h) {
		b.p[f][y*b.w+x]=c;
	}
}



function bitmap_drawLine(b,f,x0,y0,x1,y1,c)
{
	var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
	var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
	var err = (dx > dy ? dx : -dy) / 2, e2;

	for (;;)
	{
		bitmap_setPixel(b,f, x0, y0, c);
		if (x0 == x1 && y0 == y1)
			break;
		e2 = err;
		if (e2 > -dx)
		{
			err -= dy;
			x0 += sx;
		}
		if (e2 < dy)
		{
			err += dx;
			y0 += sy;
		}
	}
}



function clrscr() {
	ctx.fillStyle=palette[0];
	ctx.fillRect(0,0,canvas.width,canvas.height);
}



function inrect(x,y,rx,ry,rw,rh) {
	return x>=rx && x<=rx+rw && y>=ry && y<=ry+rh;
}

function floodfill(x,y,p,n) {
	if(x>=0 && x<b.w && y>=0 && y<b.h) {
		var c=b.p[f][y*b.w+x];
		if(c==p) {
			b.p[f][y*b.w+x]=n;
			floodfill(x,y-1,p,n);
			floodfill(x,y+1,p,n);
			floodfill(x-1,y,p,n);
			floodfill(x+1,y,p,n);
		}
	}
}

function drawGrid(b,f,x,y,c,p,g) {

	if(mouse.isDown) {
		var x0=Math.floor(mouse.x/b.s);
		var y0=Math.floor(mouse.y/b.s);
		
		if(filling) {
			 var pc=b.p[f][y0*b.w+x0];
			 var nc=color;
			if(pc!==nc) {
				floodfill(x0,y0,pc,nc);
			}
			filling=false;
			btnfloodfill.style.backgroundColor="";
		} else if(eyedropping) {
			 color=b.p[f][y0*b.w+x0];
			 inpcolor.value=color;
			 eyedropping=false;
			 btneyedrop.style.backgroundColor="";
		} else if(d) {
			bitmap_drawLine(b,f,px,py,x0,y0,color);
		} else {
			d=true;
		}
		px=x0; py=y0;
	} else {
		d=false;
	}

	
	for(var j=0;j<b.h;j++) {
		for(var i=0;i<b.w;i++) {
			var k=b.p[f][j*b.w+i];
			fillRect(i*b.s,j*b.s,b.s,b.s,1,k);
		}
	}
	
	if(g) {
		for(var i=0;i<=b.w;i++) {
			drawLine(x+i*b.s,y,x+i*b.s,y+b.h*b.s,1,c);
		}
		for(var j=0;j<=b.h;j++) {
			drawLine(x,y+j*b.s,x+b.w*b.s,y+j*b.s,1,c);
		}
	}
}



function draw() {	

	clrscr();

	drawGrid(b,f,0,0,palette[15],palette,true);

	window.requestAnimationFrame(draw);
}



function main() {
	
	b={
		w:32,h:32,s:8,
		p:[]
	};

  var m=[];
	for(var i=0;i<b.w*b.h;i++) m.push("#ffffff");
	b.p.push(m);
	
	txtframe.value=f;
	
	resize();
	window.onresize=resize;
	window.requestAnimationFrame(draw);
}



main();


