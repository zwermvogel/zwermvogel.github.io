function angleDiff(a1, a2){
	var sign = a1 > a2 ? 1 : -1;
	var angle = a1 - a2;
	return (Math.abs(-sign*Math.PI*2+angle) < Math.abs(angle)) ? -sign*Math.PI*2+angle : angle;
}

function turn(i, direction){
	boids[i].a += rotation*direction;
	if(Math.abs(boids[i].a)>Math.PI){boids[i].a = Math.sign(boids[i].a)*(-Math.PI+(boids[i].a-Math.PI));}
}