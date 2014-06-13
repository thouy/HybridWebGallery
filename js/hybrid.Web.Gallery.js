/**
 * Hybrid Web Gallery 1.0.0
 */



var currentIndex = 0;
var screenWidth = 600;
imgUrlArr = new Array();


/**
 * 
 * Utility Object
 * Define method be used generally
 */
var Utility = (function(){
	
	// Closure
	return {
		resize : function(imgElem) {
			var width = imgElem.width;
			var height = imgElem.height;
			var maxWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
			var maxHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			var resizeWidth;
			var resizeHeight;
			if(width > maxWidth || height > maxHeight){ // 원본이미지가 크면 
				if(width > height){
					resizeWidth = maxWidth;
					resizeHeight = Math.round((height * resizeWidth) / width);
				} else {
					resizeHeight = maxHeight;
					resizeWidth = Math.round((width * resizeHeight) / height);
				}
			}else{ // 원본이미지가 작거나 같으면
				resizeWidth = width;
				resizeHeight = height;
			}
			imgElem.width = resizeWidth;
			imgElem.height = resizeHeight;
		},
	
		isMobile : function() {
			var result = null;
			var agent = navigator.userAgent;
			if(agent.match(/(iPhone|iPod|iPad|Android|WebOS|BlackBerry)/))
				result = true;
			else if (agent.match(/(MSIE|Chrome|Safari|Firefox)/))
				result = false;
			return result;
		}
	};
})(); // IIFE Pattern


/**
 * 
 * Delta Object
 * Define moving method
 */
var Delta = {
	// Exponent function
	quadrantic : function(progress){
		return Math.pow(progress, 2);
	}
}

/**
 * 
 * MoveUtility Object
 * Define method for moving/scaling
 */
var MoveUtility = {
	
	/**
	 * @parameter
	 * options = {
	 * 		duration : number   / Time which you want to contain animation
	 * 		delta    : function / Moving method identifier (quadrantic)
	 *		delay    : number   / Interval time (ms)
	 * 		step     : callback / Animation callback step by step
	 * }
	 */
	animate : function(options) {
		console.log('animate');
		var start = new Date();
		var id = setInterval(function() {
			var timePassed = new Date() - start;
			var progress = timePassed / options.duration;
			if (progress > 1)
				progress = 1;
			var delta = options.delta(progress);
			options.step(delta);
			if (progress == 1) {
		    	clearInterval(id);
			}
			console.log(progress);
		}, options.delay || 10);
	},
	
	
	/**
	 * @parameter
	 * element     : Element object which you want to scale
	 * delta       : Moving method identifier (quadrantic)
	 * duration    : Time(ms) how long contain animate
	 * to          : 
	 * orientation : land(landscape) / port(portrait)
	 */
	scale : function(element, delta, duration, to, orientation) {
		animate({
			duration : duration,
			delta : delta,
			step : function(delta) {
				if(orientation == "land")
					element.style.width = to * delta + "px";
				else if(orientation == "port")
					element.style.height = to * delta + "px";
			}
		})
	},
	
	move : function(element, delta, duration, to, orientation) {
		this.animate({
			duration : duration,
			delta : delta,
			step : function(delta) {
				if(orientation == "land"){
					element.style.top = to * delta + "px";
				} else if(orientation == "port") {
					console.log('delta' + delta);
					element.style.left = to * delta + "px";
				}
			}
		});
	},
	
	getOffsetX : function(element) {
		var bodyRect = document.body.getBoundingClientRect();
		var elementRect = element.getBoundingClientRect();
		return bodyRect.left - elementRect.left;
	},
	
	getOffsetY : function(element) {
		var bodyRect = document.body.getBoundingClientRect();
		var elementRect = element.getBoundingClientRect();
		return bodyRect.top - elementRect.top;
	},
	
	calculateDegree : function(start, end) {
		
	}
}


function calculateAngle(startPoint, endPoint) {
	var x = startPoint.x - endPoint.x;
	var y = endPoint.y - startPoint.y;
	var r = Math.atan2(y, x); //radians
	var angle = Math.round(r * 180 / Math.PI); //degrees

	//ensure value is positive
	if (angle < 0) {
		angle = 360 - Math.abs(angle);
	}

	return angle;
}

function calculateDirection(startPoint, endPoint ) {
	var angle = calculateAngle(startPoint, endPoint);

	if ((angle <= 45) && (angle >= 0)) {
		return LEFT;
	} else if ((angle <= 360) && (angle >= 315)) {
		return LEFT;
	} else if ((angle >= 135) && (angle <= 225)) {
		return RIGHT;
	} else if ((angle > 45) && (angle < 135)) {
		return DOWN;
	} else {
		return UP;
	}
}



/**
 * 
 * HybridWebGallery Object
 */
var HybridWebGallery = {
	
	appendDivElement : function(parent, idStr, styleOptions) {
		var childElement = document.createElement('div');
		if(styleOptions != '') childElement.setAttribute('style', styleOptions);
		childElement.setAttribute('id', idStr);
		parent.appendChild(childElement);
	},
	
	setImage : function(url) {
		var galleryScreen = document.getElementById('mg_screen');
		var resultImgElem = document.createElement('img');
		resultImgElem.src = url;
		resize(resultImgElem);
		galleryScreen.appendChild(resultImgElem);
	},
	
	movePrev : function() {
		if(currentIndex == 0) {
			currentIndex = imgUrlArr.length - 1;
		} else {
			currentIndex--;
		}
		console.log('currentIndex = ' + currentIndex);
		
		var galleryScreen = document.getElementById('mg_screen');
		galleryScreen.removeChild(galleryScreen.childNodes[0]);
		var resultImgElem = document.createElement('img');
		resultImgElem.src = imgUrlArr[currentIndex];
		
		Utility.resize(resultImgElem);
		galleryScreen.appendChild(resultImgElem);
	},
	
	moveNext : function() {
		if(currentIndex == imgUrlArr.length - 1){
			currentIndex = 0;
		} else {
			currentIndex++;
		}
		console.log('currentIndex = ' + currentIndex);
		
		var galleryScreen = document.getElementById('mg_screen');
		galleryScreen.removeChild(galleryScreen.childNodes[0]);
		var resultImgElem = document.createElement('img');
		resultImgElem.src = imgUrlArr[currentIndex];
		
		Utility.resize(resultImgElem);
		galleryScreen.appendChild(resultImgElem);
	},
	
	initGallery : function(imgsContainer) {
		
		var isMobile = Utility.isMobile();
		
		if(imgsContainer.hasChildNodes()) {
			
			if(isMobile) {
				var imgElements = imgsContainer.getElementsByTagName('img');
				
				this.appendDivElement(document.body, 'mg_bg', '');
				var galleryBg = document.getElementById('mg_bg');
				
				this.appendDivElement(galleryBg, 'mg_screen', '');
				
				var mgControllerWrapper = document.createElement('div');
				mgControllerWrapper.setAttribute('id', 'mg_controller_wrapper');
				
				var prev = document.createElement('div');
				prev.setAttribute('id', 'mg_prev_image');
				prev.setAttribute('class', 'mg_controller');
				//prev.innerHTML = 'prev';
				var next = document.createElement('div');
				next.setAttribute('id', 'mg_next_image');
				next.setAttribute('class', 'mg_controller');
				//next.innerHTML = 'next';
				
				mgControllerWrapper.appendChild(prev);
				mgControllerWrapper.appendChild(next);
				
				galleryBg.appendChild(mgControllerWrapper);
				
				for(var i=0; i<imgElements.length; i++) {
					imgUrlArr[i] = imgElements[i].src;
					console.log(i +' = ' + imgUrlArr[i]);
				}
				
				//this.setImage(imgUrlArr[currentIndex]);
				var galleryScreen = document.getElementById('mg_screen');
				var resultImgElem = document.createElement('img');
				resultImgElem.src = imgUrlArr[currentIndex];
				resultImgElem.onload = function() {
					Utility.resize(this);
				};
				
				this.setTouchEvent(resultImgElem);
				
				galleryScreen.appendChild(resultImgElem);
				
				prev.onclick = this.movePrev;
				next.onclick = this.moveNext;
			} else {
				// TODO Client is Desktop
				alert("Desktop version will be comming soon.");
			}
		} else {
			throw new Error("The container has no child nodes");
		}
	},
	
	setTouchEvent : function(element) {
		
		element.addEventListener("touchstart", TouchEventCallback.handleStart, false);
		element.addEventListener("touchend", function(event) {
			event.preventDefault();
			var touches = event.changedTouches;
			var screenWidth = screen.width;
			for(var i=0; i<touches.length; i++) {
				var swipedXPos = touches[i].clientX;
				if(screenWidth/2 > swipedXPos) {
					console.log('reset position 0');
					MoveUtility.move(this, Delta.quadrantic, 500, 1, "port");
				}
			}
		}, false);
		
		element.addEventListener("touchcancel", TouchEventCallback.handleCancel, false);
		element.addEventListener("touchmove", function(event) {
			event.preventDefault();
			var touches = event.changedTouches;
			var screenWidth = screen.width;
			
			for(var i = 0; i<touches.length; i++) {
				var swipedXPos = touches[i].clientX;
				console.log(touches[i].clientX + ' / ' + touches[i].clientY);
				console.log('element posX = ' + this.style.left);
				this.style.left = touches[i].clientX;
			}
			
		}, false);
	}
};
	


var ongoingTouches = new Array();

/**
 * 
 * TouchEventCallback Object
 */
var TouchEventCallback = {
	handleStart : function(event) {
		event.preventDefault();
		console.log("touchstart");
	},
	
	handleEnd : function(event) {
		event.preventDefault();
		var touches = event.changedTouches;  // List of Touch Object during touchmove event
		for(var i=0; i<touches.length; i++) {
			console.log(touches[i].clientX + ' / ' + touches[i].clientY);
		}
		console.log("touchend");
	},
	
	handleCancel : function(event) {
		event.preventDefault();
		
		console.log("touchcancel");
	},
	
	handleMove : function(event) {
		event.preventDefault();
		var touches = event.changedTouches;  // List of Touch Object during touchmove event
		for(var i=0; i<touches.length; i++) {
			var idx = TouchUtility.ongoingTouchIndexById(touches[i].identifier);
			console.log(touches[i].clientX + ' / ' + touches[i].clientY);
			if(idx >= 0) {
				console.log("continuing touch "+idx);
			}
		}
		console.log("touchmove");
	},
}


/**
 * 
 * TouchUtility Object
 */
var TouchUtility = (function(){
	return {
		
		copyTouch : function(touch) {
			return { identifier: touch.identifier, clientX: touch.clientX, clientY: touch.clientY };
		},
	
		ongoingTouchIndexById : function(idToFind) {
			for (var i=0; i < ongoingTouches.length; i++) {
				var id = ongoingTouches[i].identifier;	
				if (id == idToFind) {
					return i;
				}
			}
			return -1;    // not found
		}
	};
})();