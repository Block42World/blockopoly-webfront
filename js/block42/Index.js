var player;

var area;
var content;
var mytimer;

class Index {

	static init()
	{
		ThreejsUtility.init();
		ModelBuilder.build();

		player = new Block42.Player(camera,ControlTypeEnum.Flight);
		player.Initialize();
	}
}

function showElementById(id) {
  document.getElementById(id).style.display = "block";
}

function hideElementById(id) {
  document.getElementById(id).style.display = "none";
}

function scrollLeft(){
	var area = document.getElementById("price-bar");
	if (area.scrollLeft >= content.offsetWidth) {
		area.scrollLeft = 0;
	} else {
		area.scrollLeft++;
	}
}

function SetPriceScroll() {
	area = document.getElementById("price-bar");
	content = document.getElementById("scroll-content");
	contentCopy = document.getElementById("scroll-content-copy");
	contentCopy.innerHTML = content.innerHTML + content.innerHTML;
  mytimer = setInterval(scrollLeft, 50);
	area.onmouseover=function(){
		clearInterval(mytimer);
	}
	area.onmouseout=function(){
		mytimer=setInterval(scrollLeft,50);
	}
}

$(document).ready(function(){
	SetPriceScroll();
});
