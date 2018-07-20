class Index {

	static init()
	{
		ThreejsUtility.init();
		ModelBuilder.build();
		Player.initFly();
	}

	static initOrbitControl()
	{
		ThreejsUtility.init();
		ModelBuilder.build();
		Player.initOrbitControl();
	}

	static initFPS()
	{
		ThreejsUtility.init();
		ModelBuilder.build();
		Player.initFly();
	}
}

function showElementById(id) {
  document.getElementById(id).style.display = "block";
}

function hideElementById(id) {
  document.getElementById(id).style.display = "none";
}
