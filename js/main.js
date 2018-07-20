var landsJson = require('./block42/lands.json')
var myLandsJson = require('./block42/mylands.json')

Land.init(landsJson, myLandsJson);

console.log(Land.getLand(0,0));