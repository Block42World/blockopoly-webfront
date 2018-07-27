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
		loadPrices();
	} else {
		area.scrollLeft++;
	}
}

function SetPriceScroll() {
	area = document.getElementById("price-bar");
  mytimer = setInterval(scrollLeft, 50);
	area.onmouseover=function(){
		clearInterval(mytimer);
	}
	area.onmouseout=function(){
		mytimer=setInterval(scrollLeft,50);
	}
}

function CopyPrice() {
	contentCopy = document.getElementById("scroll-content-copy");
	content = document.getElementById("scroll-content");
	contentCopy.innerHTML = content.innerHTML + content.innerHTML;
}

function loadPrices() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
			var coins = JSON.parse(this.responseText);
			console.log("coins.length: " + coins.data.length);
      for (i = 0; i < coins.data.length; ++i) {
				document.getElementById("currency" + i).innerHTML += coins.data[i].symbol + ":";
				var price = coins.data[i].quotes.USD.percent_change_24h;
				var priceTag = document.getElementById("currency" + i + "-price");
				priceTag.innerText = price + "%";
				if (price > 0) {
					priceTag.className = "price-tag red";
				} else {
					priceTag.className = "price-tag green";
				}
			}
		}
		CopyPrice();
  };
  xhttp.open("GET", "https://api.coinmarketcap.com/v2/ticker/?limit=10&structure=array", true);
  xhttp.send();
}

function ShowLandInfo(land) {
	var panelId = "land-info";
	showElementById(panelId);
	
}

$(document).ready(function(){
	loadPrices();
	SetPriceScroll();
});
