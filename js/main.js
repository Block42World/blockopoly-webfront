var landsJson = require('./block42/lands.json')
var myLandsJson = require('./block42/mylands.json')

Land.init(landsJson, myLandsJson);

// console.log(Land.lands);

console.log(Land.getLand(0,0));

console.log(Land.myLands);

console.log(Land.getLand(-8, 1));

console.log(Land.isMyLandByPos(-8, 1));