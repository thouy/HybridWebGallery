/**
 * Hybrid Web Gallery 1.0.0
 */



var currentIndex = 0;
var totalIndexNum = 0;
var imgUrlArr = new Array();
var imgDesc = new Array();

var hg_background_pane;
var hg_gallery_screen;
var hg_image;
var hg_desc_box;
var hg_numbering_box;

var screenWidth;
var screenHeight;


/**
 * 
 * Utility Object
 * Define method be used generally
 */
var Utility = (function(){
	
	// Closure
	return {
		resize : function(imgElem) {
			
			// Get image's width and height value
			var width = imgElem.width;
			var height = imgElem.height;
			console.log(width + '/' + height);
			
			var resizeWidth;
			var resizeHeight;
			if(width > screenWidth || height > screenHeight) { // When image size bigger than device screen 
				if(width > height){
					resizeWidth = screenWidth;
					resizeHeight = Math.round((height * resizeWidth) / width);
				} else {
					resizeHeight = screenHeight;
					resizeWidth = Math.round((width * resizeHeight) / height);
				}
			} else { // When image size smaller than device screen
				resizeWidth = width;
				resizeHeight = height;
			}
			imgElem.width = resizeWidth;
			imgElem.height = resizeHeight;
		},
		
		// Check if current device is mobile
		isMobile : function() {
			var result = null;
			var agent = navigator.userAgent;
			if(agent.match(/(iPhone|iPod|iPad|Android|WebOS|BlackBerry)/))
				result = true;
			else if (agent.match(/(MSIE|Chrome|Safari|Firefox)/))
				result = false;
			return result;
		},
		
		// Get current browser vendor prefix 
		getBrowserVendorPrefix : function() {
			var body = document.body || document.documentElement;
			var style = body.style;
			var transition = "transition"
			var vendors = ["Moz", "Webkit", "ms", "o", "Khtml"];
			transition = transition.charAt(0).toUpperCase() + transition.substr(1);
			for(var i=0; i<vendors.length; i++) {
				if(typeof style[vendors[i] + transition] === "string") {
					return vendors[i];
				}
			}
			return false;
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
		console.log('animate()');
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
	var r = Math.atan2(y, x); //라디안
	var angle = Math.round(r * 180 / Math.PI); // 각도

	// Take unsigned number
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

	// Append <div> element to parent element
	appendDivElement : function(parent, idStr, styleOptions) {
		var childElement = document.createElement('div');
		if(styleOptions != '') childElement.setAttribute('style', styleOptions);
		childElement.setAttribute('id', idStr);
		parent.appendChild(childElement);
	},
	
	setImage : function(url) {
		hg_image.src = url;
		resize(hg_image);
	},
	
	// Move previous
	movePrev : function() {
		if(currentIndex == 0) {
			currentIndex = imgUrlArr.length - 1;
		} else {
			currentIndex--;
		}
		console.log('currentIndex = ' + currentIndex);
		
		hg_image.removeAttribute('width');
		hg_image.removeAttribute('height');
		hg_image.src = imgUrlArr[currentIndex];
		Utility.resize(hg_image);

		//hg_image.style.transition = 'all 1.0s;';
		hg_image.style.left = 0;
		
		hg_desc_box.innerHTML = imgDesc[currentIndex];
		hg_numbering_box.innerHTML =  (currentIndex + 1) + ' / ' + totalIndexNum;
	},
	
	// Move next
	moveNext : function() {
		
		if(currentIndex == imgUrlArr.length - 1) {
			currentIndex = 0;
		} else {
			currentIndex++;
		}
		console.log('currentIndex = ' + currentIndex);
		
		hg_image.removeAttribute('width');
		hg_image.removeAttribute('height');
		hg_image.src = imgUrlArr[currentIndex];
		Utility.resize(hg_image);
		
		//hg_image.setAttribute('style', 'opacity 1.0s;');
		hg_image.style.left = 0;
		
		hg_desc_box.innerHTML = imgDesc[currentIndex];
		hg_numbering_box.innerHTML =  (currentIndex + 1) + ' / ' + totalIndexNum;
	},
	
	
	initGallery : function(imgsContainer) {
		var isMobile = Utility.isMobile();
		var _this = this;
		if(imgsContainer.hasChildNodes()) {
			if(isMobile) {
				
				// Get device's screen width and height value
				screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
				screenHeight = (window.innerWidth > 0) ? window.innerHeight : screen.height;
				
				// Read image info from '<img>' tag list
				var imgElements = imgsContainer.getElementsByTagName('img');
				totalIndexNum = imgElements.length;
				
				// Mapping image's info into array
				for(var i=0; i<imgElements.length; i++) {
					imgUrlArr[i] = imgElements[i].src;
					imgDesc[i] = imgElements[i].title;
				}
				
				_this.appendDivElement(document.body, 'hg_bg', 'width:' + screenWidth + 'px; height:' + screenHeight + 'px;');
				hg_background_pane = document.getElementById('hg_bg');
				_this.appendDivElement(hg_background_pane, 'hg_screen', '');
				
				
				// controller buttons wrapper
				var hgControllerWrapper = document.createElement('div');
				hgControllerWrapper.id = 'hg_controller_wrapper';
				
				// previous button
				var prev = document.createElement('div');
				prev.id = 'hg_prev_image';
				prev.className = 'hg_controller';
				
				// next button
				var next = document.createElement('div');
				next.id = 'hg_next_image';
				next.className = 'hg_controller';
				
				hgControllerWrapper.appendChild(prev);
				hgControllerWrapper.appendChild(next);
				
				hg_background_pane.appendChild(hgControllerWrapper);
				
				hg_gallery_screen = document.getElementById('hg_screen');
				
				// description box setting
				hg_desc_box = document.createElement('div');
				hg_desc_box.id = 'hg_desc_bar';
				hg_desc_box.className = 'hg_desc_bar';
				hg_desc_box.innerHTML = imgDesc[currentIndex];
				hg_gallery_screen.appendChild(hg_desc_box);
				
				// numbering box setting
				hg_numbering_box = document.createElement('div');
				hg_numbering_box.id = 'hg_index_printer';
				hg_numbering_box.className = 'hg_index_printer';
				hg_numbering_box.innerHTML =  (currentIndex + 1) + ' / ' + totalIndexNum;
				hg_gallery_screen.appendChild(hg_numbering_box);
				
				// <img> tag setting
				hg_image = document.createElement('img');
				hg_image.id = 'hg_gallery_item';
				hg_image.src = imgUrlArr[currentIndex];
				hg_image.onload = function() {
					Utility.resize(this);
				};
				this.setTouchEvent(hg_image);
				hg_gallery_screen.appendChild(hg_image);

				// onclick event
				prev.onclick = this.movePrev;
				next.onclick = this.moveNext;
				
				//hgControllerWrapper.style.opacity = "0";
				
				hg_image.onmouseenter = function(){
					prev.style.opacity = "1";
					next.style.opacity = "1";
				};
				
				hg_image.onmouseleave = function(){
					prev.style.opacity = "0";
					next.style.opacity = "0";
				};
				
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
		element.addEventListener("touchmove", TouchEventCallback.handleMove, false);
		element.addEventListener("touchend", TouchEventCallback.handleEnd, false);
		element.addEventListener("touchcancel", TouchEventCallback.handleCancel, false);
	}
};
	


/**
 * 
 * TouchEventCallback Object
 */
var TouchEventCallback = {
		
	swipeDist : 0,
	startXPos : 0,
	currentXPos : 0,
	
	handleStart : function(event) {
		event.preventDefault();
		currentXPos = this.offsetLeft;   // When touch event start, capture current element x position
		var touches = event.changedTouches;
		for(var i=0; i<touches.length; i++) {
			var startX = touches[i].clientX;
			startXPos = startX;
			console.log('swipeStart = ' + startXPos);
		}
	},
	
	handleEnd : function(event) {
		event.preventDefault();
		var touches = event.changedTouches;
		var screenWidth = screen.width;
		console.log("screen width = " + screenWidth);
		for(var i=0; i<touches.length; i++) {
			var endXPos = touches[i].clientX;
			//this.style.left = -screenWidth;
			console.log('swipeEnd = ' + endXPos);
			console.log('Element position [finish] = ' + this.style.left);
			
			var swipedDistance = Math.abs(MoveUtility.getOffsetX(this));
			if(80 > swipedDistance) {
				this.style.left = 0;
			} else {
				if(swipeDist > 0) {  // previous
					HybridWebGallery.movePrev();
				} else {
					HybridWebGallery.moveNext();
				}
			}
		}
	},
	
	handleMove : function(event) {
		event.preventDefault();
		this.removeAttribute('style');
		
		var touches = event.changedTouches;
		var screenWidth = screen.width;   // Device screen's width
		console.log(currentXPos);
		for(var i = 0; i<touches.length; i++) {
			var swipedXPos = touches[i].clientX;
			swipeDist = swipedXPos-startXPos;   // Calculate moving distance
			//console.log('Swiped  distance [processing] = ' + swipeDist);
			//console.log('Element position [processing] = ' + this.style.left);
			if(swipeDist > 0)
				this.style.left = currentXPos + Math.abs(swipeDist) + "px";  // Image swipe effect
			else
				this.style.left = currentXPos - Math.abs(swipeDist) + "px";  // Image swipe effect
		}
	},
	
	handleCancel : function(event) {
		event.preventDefault();
		console.log("touchcancel");
	},
	
	handleEnter : function(event) {
		event.preventDefault();
		var controllerUI = document.getElementById('hg_controller_wrapper');
	},
	
	handleLeave : function(event) {
		event.preventDefault();
		var timout = setTimeout(function(){
			var controllerUI = document.getElementById('hg_controller_wrapper');
			for(var i=100; i<=0; i--) {
				controllerUI.style.opacity = i / 100;
			}
		}, 1000);
	}
}