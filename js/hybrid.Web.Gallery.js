/**
 * Hybrid Web Gallery 1.0.0
 */



var currentIndex = 0;
var screenWidth = 600;
imgUrlArr = new Array();


/**
 *
 * Utility Object
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




function animate(element, delta, duration) {
	
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
				
				galleryScreen.appendChild(resultImgElem);
				
				prev.onclick = this.movePrev;
				next.onclick = this.moveNext;
			} else {
				// TODO Client is Desktop
			}
		} else {
			throw new Error("The container has no child nodes");
		}
	}
};
	
	