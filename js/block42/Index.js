var player;

// DEV: move main logic to main.js
class Index {

	static init()
	{
		ThreejsUtility.init();
		ModelBuilder.build();

		player = new Block42.Player(camera,ControlTypeEnum.Flight);
		player.Initialize();
	}
}

// DEV: use JQuery - $('#id').show()
function showElementById(id) {
  document.getElementById(id).style.display = "block";
}

// DEV: use JQuery - $('#id').hide()
function hideElementById(id) {
  document.getElementById(id).style.display = "none";
}
