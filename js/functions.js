function angleDiff(a1, a2){
	var sign = a1 > a2 ? 1 : -1;
	var angle = a1 - a2;
	return (Math.abs(-sign*Math.PI*2+angle) < Math.abs(angle)) ? -sign*Math.PI*2+angle : angle;
}

function turn(i, direction){
	boids[i].a += rotation*direction;
	if(Math.abs(boids[i].a)>Math.PI){boids[i].a = Math.sign(boids[i].a)*(-Math.PI+(Math.abs(boids[i].a)-Math.PI));}
}

function initResize(){
	var canvas = document.getElementById("canvas");
	var resizers = document.getElementsByClassName("resizer");

	var original = {widht:0, height:0, left:0, top:0, mouse:{x:0, y:0}};

	for(var i = 0; i < resizers.length; i++){
		const currentResizer = resizers[i];
		currentResizer.addEventListener("mousedown", function(e) {
			e.preventDefault();
			original.width = canvas.width;
			original.height = canvas.height;
			original.left = canvas.getBoundingClientRect().left;
			original.top = canvas.getBoundingClientRect().top;
			original.mouse.x = e.clientX;
			original.mouse.y = e.clientY;

			window.addEventListener("mousemove", resize);
			window.addEventListener("mouseup", stopResize);
		});

		function resize(e){
			if(currentResizer.classList.contains("top")){
				var height = original.height - (e.clientY - original.mouse.y);
				if(height>100){
					canvas.setAttribute("height", height);
					canvas.style.top = original.top + (e.clientY - original.mouse.y) + "px";
					draw();
					resizeResizers();
				}
			}
			if(currentResizer.classList.contains("bottom")){
				var height = original.height + (e.clientY - original.mouse.y);
				if(height>100){
					canvas.setAttribute("height", height);
					draw();
					resizeResizers();
				}
			}
			if(currentResizer.classList.contains("left")){
				var width = original.width - (e.clientX - original.mouse.x);
				if(width>100){
					canvas.setAttribute("width", width);
					canvas.style.left = original.left + (e.clientX - original.mouse.x) + "px";
					draw();
					resizeResizers();
				}
			}
			if(currentResizer.classList.contains("right")){
				var width = original.width + (e.clientX - original.mouse.x);
				if(width>100){
					canvas.setAttribute("width", width);
					draw();
					resizeResizers();
				}
			}
		}

		function stopResize(){
			window.removeEventListener("mousemove", resize);
			window.removeEventListener("mouseup", stopResize);
		}
	}
}

function resizeResizers(){
	var top = document.getElementById("top");
	var right = document.getElementById("right");
	var bottom = document.getElementById("bottom");
	var left = document.getElementById("left");
	var topLeft = document.getElementById("topLeft");
	var topRight = document.getElementById("topRight");
	var bottomRight = document.getElementById("bottomRight");
	var bottomLeft = document.getElementById("bottomLeft");

	top.style.height = canvas.getBoundingClientRect().top + "px";
	top.style.width = canvas.width + "px";
	top.style.left = canvas.getBoundingClientRect().left + "px";

	right.style.height = canvas.height + "px";
	right.style.width = window.innerWidth-canvas.width-canvas.getBoundingClientRect().left + "px";
	right.style.left = canvas.width+canvas.getBoundingClientRect().left + "px";
	right.style.top = canvas.getBoundingClientRect().top + "px";

	bottom.style.height = window.innerHeight-canvas.height-canvas.getBoundingClientRect().top + "px";
	bottom.style.width = canvas.width + "px";
	bottom.style.left = canvas.getBoundingClientRect().left + "px";
	bottom.style.top = canvas.height+canvas.getBoundingClientRect().top + "px";

	left.style.height = canvas.height + "px";
	left.style.width = canvas.getBoundingClientRect().left + "px";
	left.style.top = canvas.getBoundingClientRect().top + "px";

	topLeft.style.height = canvas.getBoundingClientRect().top + "px";
	topLeft.style.width = canvas.getBoundingClientRect().left + "px";

	topRight.style.height = canvas.getBoundingClientRect().top + "px";
	topRight.style.width = window.innerWidth-canvas.width-canvas.getBoundingClientRect().left + "px";
	topRight.style.left = canvas.width+canvas.getBoundingClientRect().left + "px";

	bottomRight.style.height = window.innerHeight-canvas.height-canvas.getBoundingClientRect().top + "px";
	bottomRight.style.width = window.innerWidth-canvas.width-canvas.getBoundingClientRect().left + "px";
	bottomRight.style.left = canvas.width+canvas.getBoundingClientRect().left + "px";
	bottomRight.style.top = canvas.height+canvas.getBoundingClientRect().top + "px";

	bottomLeft.style.height = window.innerHeight-canvas.height-canvas.getBoundingClientRect().top + "px";
	bottomLeft.style.width = canvas.getBoundingClientRect().left + "px";
	bottomLeft.style.top = canvas.height+canvas.getBoundingClientRect().top + "px";
}

initResize();