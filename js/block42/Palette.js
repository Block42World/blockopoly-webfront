class Palette
{
	static init(colX, rowY, cellSize, haveLine)
	{
	console.log("sdseas");
		this.cellSize = cellSize;
		this.haveLine = false
		//rowY = Math.round(getPageX() / cellSize);
		//colX = Math.round(getPageY() / cellSize);

		//alert(document.documentElement.clientHeight +" "+document.documentElement.clientWidth+" "+rowY+" "+ colX);

		Palette.BG_COLOR = "#00ffff";//LightBlue
		Palette.palette= document.createElement("div");
		Palette.tab = document.createElement("table");
		Palette.palette.appendChild(Palette.tab);
		document.body.appendChild(Palette.palette);


		//tab.border = "0px";
		Palette.tab.style.width = "200px";
		Palette.tab.style.height = "500px";
		Palette.tab.style.backgroundColor = "#000000";
		Palette.palette.style.position = 'absolute';
		Palette.palette.style.zIndex = 3;
		if(haveLine)
		{
			Palette.tab.style.borderCollapse = "collapse";
		}

		for(var y = 0; y<rowY; y++)
		{
			var newR = Palette.tab.insertRow();
			for(var x = 0; x<colX; x++)
			{
				var newC = newR.insertCell();
				newC.id = (rowY -y-1)*colX + x;
				newC.style.backgroundColor = Palette.rgb(vox.defaultPalette[newC.id]);
				newC.onclick = function()
				{
					Palette.div.style.backgroundColor = this.style.backgroundColor;
					Palette.colorID = this.id;
					console.log(this.id);
				}
			}
		}


		Palette.div = document.createElement("div");
		Palette.palette.appendChild(Palette.div);
		Palette.div.style.backgroundColor = Palette.rgb( {r:255,g:255,b:255});
		Palette.div.style.width = "100px";
		Palette.div.style.height = "100px";
		console.log();
	}

	static rgb(color)
	{
		return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
	}

	static rgb(color)
	{
		return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
	}
}

