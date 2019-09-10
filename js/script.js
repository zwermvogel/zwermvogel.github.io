var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.setAttribute("width", window.innerWidth-50);
canvas.setAttribute("height", window.innerHeight-50);

var target = {x:canvas.width/2,y:canvas.height/2};
var boids = [];

var size = 10;
var count = 100;
var speed = 5;
var rotation = Math.PI/64;
var viewDist = 50;
var viewAngle = Math.PI/2;

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

	//follow
		for(var i = 0; i < boids.length; i++){
			for(var z = 0; z < boids.length; z++){
				if(i<z){
					if(Math.hypot(boids[i].x-boids[z].x,boids[i].y-boids[z].y)<viewDist){
						if(Math.abs(angleDiff(boids[i].a,Math.atan2(boids[i].y-boids[z].y,boids[z].x-boids[i].x)))<viewAngle){
							if(rotation/2<Math.abs(angleDiff(boids[i].a,boids[z].a)) && Math.abs(angleDiff(boids[i].a,boids[z].a))<viewAngle){
								turn(i,-Math.sign(angleDiff(boids[i].a,boids[z].a)));
								turn(z,-Math.sign(angleDiff(boids[z].a,boids[i].a)));
							}
						}
					}
				}
			}
		}

	//center
		for(var i = 0; i < boids.length; i++){
			var center = {x:0, y:0, n:0};
			for(var z = 0; z < boids.length; z++){
				if(i !== z){
					if(Math.hypot(boids[i].x-boids[z].x,boids[i].y-boids[z].y)<viewDist){
						if(Math.abs(angleDiff(boids[i].a,Math.atan2(boids[i].y-boids[z].y,boids[z].x-boids[i].x)))<viewAngle){
							center.x += boids[z].x;
							center.y += boids[z].y;
							center.n++;
						}
					}
				}
			}
			center.x /= center.n;
			center.y /= center.n;

			if(center.n){
				turn(i,-Math.sign(angleDiff(boids[i].a,Math.atan2(boids[i].y-center.y,center.x-boids[i].x))));
			}
		}

	//avoid
		for(var i = 0; i < boids.length; i++){
			for(var z = 0; z < boids.length; z++){
				if(i<z){
					if(Math.hypot(boids[i].x-boids[z].x,boids[i].y-boids[z].y)<viewDist){
						if(Math.abs(angleDiff(boids[i].a,Math.atan2(boids[i].y-boids[z].y,boids[z].x-boids[i].x)))<viewAngle){
							turn(i,Math.sign(angleDiff(boids[i].a,Math.atan2(boids[i].y-boids[z].y,boids[z].x-boids[i].x))));
							turn(z,Math.sign(angleDiff(boids[z].a,Math.atan2(boids[z].y-boids[i].y,boids[i].x-boids[z].x))));
						}
					}
				}
			}
		}

	//edges
		var angleOffset = 0;
		for(var i = 0; i < boids.length; i++){
			var x = boids[i].x+Math.cos(boids[i].a+angleOffset)*viewDist;
			var y = boids[i].y-Math.sin(boids[i].a+angleOffset)*viewDist;
			if(angleOffset>Math.PI){continue;}
			if(y<0){
				angleOffset = -(angleOffset+Math.sign(angleOffset+rotation/2)*rotation);
				i--;
				continue;
			}
			if(y>canvas.height){
				angleOffset = -(angleOffset+Math.sign(angleOffset+rotation/2)*rotation);
				i--;
				continue;
			}
			if(x<0){
				angleOffset = -(angleOffset+Math.sign(angleOffset+rotation/2)*rotation);
				i--;
				continue;
			}
			if(x>canvas.width){
				angleOffset = -(angleOffset+Math.sign(angleOffset+rotation/2)*rotation);
				i--;
				continue;
			}

			boids[i].a += angleOffset;
			if(Math.abs(boids[i].a)>Math.PI){boids[i].a = Math.sign(boids[i].a)*(-Math.PI+(Math.abs(boids[i].a)-Math.PI));}
			angleOffset = 0;
		}
}

function move(){
	for(var i = 0; i < boids.length; i++){
		boids[i].x += Math.cos(boids[i].a)*boids[i].s;
		boids[i].y -= Math.sin(boids[i].a)*boids[i].s;

		if(boids[i].y<0){boids[i].y=0;}
		if(boids[i].y>canvas.height){boids[i].y=canvas.height;}
		if(boids[i].x<0){boids[i].x=0;}
		if(boids[i].x>canvas.width){boids[i].x=canvas.width;}
	}
}

function draw(){
	ctx.strokeStyle = "grey";
	ctx.fillStyle = "grey";
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(var i = 0; i < boids.length; i++){
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