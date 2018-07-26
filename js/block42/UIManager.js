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

function ShowInfoBox(land)
{
	if(typeof land === "undefined")
	{
		$("#land-info").hide();
		$("#plotname").text("N/A");
	}else{
		$("#land-info").show();
		$("#plotname").text(land._description);
	}
}
