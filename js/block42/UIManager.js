
function ShowInfoBox(land)
{
	if(typeof land === "undefined")
	{
		$("#land-info").hide();
		$("#plotname").text("N/A");
	}else{
		$("#land-info").show();
		$("#plotname").text(land._description);
		$("#fileName").val(land._description +"_x"+land._x+"_y"+land._y);
		console.log($("#fileName"));
	}
}
