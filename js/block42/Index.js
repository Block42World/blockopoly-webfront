var player;

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
