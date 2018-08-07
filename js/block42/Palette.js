class Palette
{
	static init(colX, rowY, cellSize, haveLine)
	{

		this.cellSize = cellSize;
		//rowY = Math.round(getPageX() / cellSize);
		//colX = Math.round(getPageY() / cellSize);

		//alert(document.documentElement.clientHeight +" "+document.documentElement.clientWidth+" "+rowY+" "+ colX);
		
		Palette.tab = document.getElementById("paletteTable");

		Palette.colorID = 0;
		//tab.border = "0px";

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


		Palette.div = document.getElementById("colorBoard");
		Palette.div.style.backgroundColor = Palette.rgb( {r:255,g:255,b:255});

		console.log();
	}

	static rgb(color)
	{
		return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
	}
}

