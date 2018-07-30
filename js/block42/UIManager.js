
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
