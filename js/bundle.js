(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports=[
	{
		"x": 0,
		"y": 0,
		"w": 10,
		"h": 10,
		"owned": true,
		"sale": false
	},
	{
		"x": -7.5,
		"y": 2.5,
		"w": 5,
		"h": 5,
		"owned": true,
		"sale": false
	},
	{
		"x": -7.5,
		"y": -2.5,
		"w": 5,
		"h": 5,
		"owned": false,
		"sale": true
	},
	{
		"x": 7.5,
		"y": 2.5,
		"w": 5,
		"h": 5,
		"owned": false,
		"sale": true
	},
	{
		"x": 7.5,
		"y": -2.5,
		"w": 5,
		"h": 5,
		"owned": false,
		"sale": true
	},
	{
		"x": -7.5,
		"y": 5,
		"w": 10,
		"h": 5,
		"owned": false,
		"sale": true
	},
	{
		"x": 7.5,
		"y": 5,
		"w": 10,
		"h": 5,
		"owned": false,
		"sale": true
	},
	{
		"x": -7.5,
		"y": -5,
		"w": 10,
		"h": 5,
		"owned": false,
		"sale": true
	},
	{
		"x": 7.5,
		"y": -5,
		"w": 10,
		"h": 5,
		"owned": false,
		"sale": true
	}
]
},{}],2:[function(require,module,exports){
module.exports=[
	{
		"x": -7.5,
		"y": 2.5
	}
]
},{}],3:[function(require,module,exports){
var landsJson = require('./block42/lands.json')
var myLandsJson = require('./block42/mylands.json')

Land.init(landsJson, myLandsJson);

console.log(Land.getLand(0,0));
},{"./block42/lands.json":1,"./block42/mylands.json":2}]},{},[3]);
