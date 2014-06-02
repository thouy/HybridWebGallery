/**
 * 1.0
 */


var currentIndex = 0;
var screenWidth = 600;
imgUrlArr = new Array();

function resize(img) {
	var width = img.width;
	var height = img.height;
	//alert(width +"/" + height);
	var maxWidth = 300;
	var maxHeight = 300;
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
		//alert(width +"/" + height);
		resizeWidth = width;
		resizeHeight = height;
	}
	img.width = resizeWidth;
	img.height = resizeHeight;
}

Object.extend.fadeIn = function() {
	this.opacity -= 0.1;
};

var MobileGallery = {
		
	
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
		
		resize(resultImgElem);
		galleryScreen.appendChild(resultImgElem);
		resultImgElem.fadeIn();
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
		
		resize(resultImgElem);
		galleryScreen.appendChild(resultImgElem);
	},
	
	initGallery : function(imgsContainer) {
		
		if(imgsContainer.hasChildNodes()) {
			
			var imgElements = imgsContainer.getElementsByTagName('img');
			
			this.appendDivElement(document.body, 'mg_bg', 'top:0; left:0; z-index:99999999; display:block; position:fixed; opacity:1;');
			var galleryBg = document.getElementById('mg_bg');
			
			this.appendDivElement(galleryBg, 'mg_screen', '');
			
			var mgControllerWrapper = document.createElement('div');
			mgControllerWrapper.setAttribute('id', 'mg_controller_wrapper');
			
			var prev = document.createElement('div');
			prev.setAttribute('id', 'mg_prev_image');
			prev.innerHTML = 'prev';
			var next = document.createElement('div');
			next.setAttribute('id', 'mg_next_image');
			next.innerHTML = 'next';
			
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
				resize(this);
			};
			
			galleryScreen.appendChild(resultImgElem);
			
			
			prev.onclick = this.movePrev;
			next.onclick = this.moveNext;
			
		} else {
			throw new Error("The container has no child nodes");
		}
	}
	
	
};
	
	