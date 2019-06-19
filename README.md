![Block42](http://assets.block42.world/images/icons/block42_logo_200.png)

# Block42 web client frontend

## About
A light web app version that allow players to buy and sell lands, customize their own buildings, and just browse around the city in Block42, which players build togather.

A client version will provide more interactive functionalities and MMO-gameplay, using the same assets built by players in the web app version.

Please note that this is still in prototype and under heavy development. The final product may be subject to a number of quality assurance tests to verify conformance with specifications.

## Development

### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- [Browserify](http://browserify.org/) `npm install -g browserify`
- [Watchify](https://github.com/substack/watchify) `npm install -g watchify`
- [http-server](https://www.npmjs.com/package/http-server) `npm install -g http-server -g`
- [Concurrently](https://www.npmjs.com/package/concurrently) `npm install -g concurrently`

### Install dependencies
`npm i`

### Watch and bundle JavaScript
`watchify js/main.js -o js/bundle.js`

### Start web server in localhost
`npm start`

## Demo
http://app.block42.world/
