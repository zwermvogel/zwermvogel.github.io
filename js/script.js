var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);

var target = {x:canvas.width/2,y:canvas.height/2};
var boids = [];

var size = 5;
var count = 250;
var speed = 5;
var rotation = Math.PI/64;
var viewDist = 25;

for(var i = 0; i < count; i++){
	boids.push({
		x:Math.floor(Math.random()*canvas.width),
		y:Math.floor(Math.random()*canvas.height),
		a:Math.floor(Math.random()*360)/180*Math.PI-Math.PI,
		s:speed
	});
}

canvas.onmousemove = function(e){
	target = {x:e.clientX, y:e.clientY};
}

function frame(){
	steer();
	move();
	edges();
	draw();
	requestAnimationFrame(frame);
}

function steer(){
	//target
		/*for(var i = 0; i < boids.length; i++){
			if(Math.abs(angleDiff(boids[i].a,Math.atan2(boids[i].y-target.y,target.x-boids[i].x)))>=rotation/2){
				turn(i,-Math.sign(angleDiff(boids[i].a,Math.atan2(boids[i].y-target.y,target.x-boids[i].x))));
			}
		}*/
	
	//avoid
		for(var i = 0; i < boids.length; i++){
			for(var z = 0; z < boids.length; z++){
				if(i<z){
					if(Math.hypot(boids[i].x-boids[z].x,boids[i].y-boids[z].y)<viewDist){
						turn(i,Math.sign(angleDiff(boids[i].a,Math.atan2(boids[i].y-boids[z].y,boids[z].x-boids[i].x))));
						turn(z,Math.sign(angleDiff(boids[z].a,Math.atan2(boids[z].y-boids[i].y,boids[i].x-boids[z].x))));
					}
				}
			}
		}

	//follow
		for(var i = 0; i < boids.length; i++){
			for(var z = 0; z < boids.length; z++){
				if(i<z){
					if(Math.hypot(boids[i].x-boids[z].x,boids[i].y-boids[z].y)<viewDist){
						turn(i,-Math.sign(angleDiff(boids[i].a,boids[z].a)));
						turn(z,-Math.sign(angleDiff(boids[z].a,boids[i].a)));
					}
				}
			}
		}
}

function move(){
	for(var i = 0; i < boids.length; i++){
		boids[i].x += Math.cos(boids[i].a)*boids[i].s;
		boids[i].y -= Math.sin(boids[i].a)*boids[i].s;
	}
}

function edges(){
	for(var i = 0; i < boids.length; i++){
		if(boids[i].y<0){boids[i].y=canvas.height;}
		if(boids[i].y>canvas.height){boids[i].y=0;}
		if(boids[i].x<0){boids[i].x=canvas.width;}
		if(boids[i].x>canvas.width){boids[i].x=0;}
	}
}

function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(var i = 0; i < boids.length; i++){
		ctx.fillStyle = "grey";
		if(i == 0){ctx.fillStyle = "white";}
		ctx.beginPath();
		ctx.moveTo(boids[i].x, boids[i].y);
		ctx.lineTo(boids[i].x-Math.cos(boids[i].a+Math.PI/8)*size*1.25,boids[i].y+Math.sin(boids[i].a+Math.PI/8)*size*1.25);
		ctx.lineTo(boids[i].x-Math.cos(boids[i].a)*size,boids[i].y+Math.sin(boids[i].a)*size);
		ctx.lineTo(boids[i].x-Math.cos(boids[i].a-Math.PI/8)*size*1.25,boids[i].y+Math.sin(boids[i].a-Math.PI/8)*size*1.25);
		ctx.closePath();
		ctx.fill();
	}
}

frame();