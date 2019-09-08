var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);

var target = {x:canvas.width/2,y:canvas.height/2};
var birds = [];
var birdSize = 5;
var birdCount = 100;
var birdSpeed = 5;
var turnSpeed = Math.PI/64;
var birdViewLength = 2;
var birdViewWidth = Math.PI;

for(var i = 0; i < birdCount; i++){
	birds.push({
		x:Math.floor(Math.random()*canvas.width),
		y:Math.floor(Math.random()*canvas.height),
		angle:Math.atan2(Math.random()-0.5,Math.random()-0.5),
		speed:Math.floor(Math.random()*birdSpeed)+birdSpeed
	});
}

canvas.onmousemove = function(e){
	target = {x:e.clientX, y:e.clientY};
}

function frame(){
	for(var i = 0; i < birds.length; i++){
		birds[i].x += Math.cos(birds[i].angle)*birds[i].speed;
		birds[i].y -= Math.sin(birds[i].angle)*birds[i].speed;
	}

	for(var i = 0; i < birds.length; i++){
		var sign = birds[i].angle > Math.atan2(birds[i].y-target.y,target.x-birds[i].x) ? 1 : -1;
		var angle = birds[i].angle - Math.atan2(birds[i].y-target.y,target.x-birds[i].x);
		var angleDifference = (Math.abs(-sign*Math.PI*2+angle) < Math.abs(angle)) ? -sign*Math.PI*2+angle : angle;
		console.log(angle + ", " + angleDifference);

		if(Math.abs(angleDifference)>=turnSpeed){
			birds[i].angle -= Math.sign(angleDifference)*turnSpeed;
			if(Math.abs(birds[i].angle)>Math.PI){birds[i].angle = Math.sign(birds[i].angle)*(-Math.PI+(birds[i].angle-Math.PI));}
		}
	}

	for(var i = 0; i < birds.length; i++){
		for(var z = 0; z < birds.length; z++){
			if(i<z){
				if(Math.hypot(birds[i].x-birds[z].x, birds[i].y-birds[z].y)<birdSize*birdViewLength){
					var sign = birds[i].angle > Math.atan2(birds[i].y-birds[z].y,birds[z].x-birds[i].x) ? 1 : -1;
					var angle = birds[i].angle - Math.atan2(birds[i].y-birds[z].y,birds[z].x-birds[i].x);
					var angleDifference = (Math.abs(-sign*Math.PI*2+angle) < Math.abs(angle)) ? -sign*Math.PI*2+angle : angle;

					if(Math.abs(angleDifference)<birdViewWidth){
						birds[i].angle += Math.sign(angleDifference)*turnSpeed;
						if(Math.abs(birds[i].angle)>Math.PI){birds[i].angle = Math.sign(birds[i].angle)*(-Math.PI+(birds[i].angle-Math.PI));}
					}
				}
			}
		}
	}

	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(var i = 0; i < birds.length; i++){
		ctx.beginPath();
		ctx.moveTo(birds[i].x, birds[i].y);
		ctx.lineTo(birds[i].x-Math.cos(birds[i].angle+Math.PI/8)*birdSize*1.25,birds[i].y+Math.sin(birds[i].angle+Math.PI/8)*birdSize*1.25);
		ctx.lineTo(birds[i].x-Math.cos(birds[i].angle)*birdSize,birds[i].y+Math.sin(birds[i].angle)*birdSize);
		ctx.lineTo(birds[i].x-Math.cos(birds[i].angle-Math.PI/8)*birdSize*1.25,birds[i].y+Math.sin(birds[i].angle-Math.PI/8)*birdSize*1.25);
		ctx.closePath();
		ctx.fillStyle = "white";
		ctx.fill();
	}

	requestAnimationFrame(frame);
}

frame();