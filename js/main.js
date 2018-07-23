// Get info of lands, this will be replaced by blockchain get later
var landsJson = require('./block42/lands.json')
var myLandsJson = require('./block42/mylands.json')

// Init the land, will be replaced by Blockchain later
Land.init(landsJson, myLandsJson)

// var Web3 = require('web3')

var netId
var web3js
var userAccount = false

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
        // Debug only: override web3js instead of using Mist/MetaMask
//        web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Local-node, use Geth or testrpc to start one
//        web3js = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/eth')); // Mainnet node
//        web3js = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/93Pkd62SaFUrBJZC646A')); // Mainnet node 2
//        web3js = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/93Pkd62SaFUrBJZC646A")); // Ropsten testnet node
        startApp();
    } else {
        toggleMetaMaskPrompt(true);
    }
});

function startApp(){
    // Check if in mainnet or testnets
    web3js.eth.net.getId().then(function (networkId) {
        netId = networkId;
        if (netId !== 1)
            $('#no-mainnet-alert').show();
        if (netId === 3) {
            // tokenContractAddress = tokenContractAddressRopsten;
            // crowdsaleContractAddress = crowdsaleContractAddressRopsten;
            $('#no-mainnet-alert-text').html("Currently in Ropsten <b>Testnet</b>. Change to mainnet for valid transactions.");
        } else {
            $('#no-mainnet-alert-text').html("You're not connected! Open MetaMask and make sure you are on the Main Ethereum Network.");
        }
        // $('#token-address').html(getTokenUrl(tokenContractAddress));
        // $('#crowdsale-address').html(getContractUrl(crowdsaleContractAddress));

        // Get hold of contract instance
        // CubikToken = new web3js.eth.Contract(tokenAbi, tokenContractAddress);
        // CubikCrowdsale = new web3js.eth.Contract(crowdsaleAbi, crowdsaleContractAddress);

        // Update account detail every 1 seconds
        setInterval(checkAccountDetail, 1000);
    })
}

function checkAccountDetail() {
    // Get default account
    web3js.eth.getAccounts().then(function (accounts) {
        // Just keep updating, so the user's balance is updated after purchase
        userAccount = accounts[0];
        console.log(userAccount);
        updateAccountDetail();
    });
}

function updateAccountDetail() {
    if (userAccount === undefined) {
        toggleMetaMaskPrompt(true);
    } else {
        toggleMetaMaskPrompt(false);
        getAccountDetail();
    }
}

function getAccountDetail() {

}

function toggleMetaMaskPrompt(toggle) {
    console.log("toggleMetaMaskPrompt-" + toggle);
    $('#no-metamask-alert').toggle(toggle);
    // $('#account-detail').toggle(!toggle);
    // $('#buy-button').prop('disabled', toggle);
}