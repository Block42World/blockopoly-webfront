var json = require('../contracts/World.json')
var worldAbi = json.abi
var worldContractAddress = '0x59c1f440e53509e29915e2ddcc3b9cafab77179a';
json = require('../contracts/Land.json')
var landAbi = json.abi
var landContractAddress = '0xfea653b5494c88af2c2fecf92eed8c1b020a3811';

// Get info of lands from local JSON, this will be replaced by blockchain getLands() later
var landsJson = require('./block42/Lands-auto-generated.json')
var myLandsJson = require('./block42/mylands.json')
Land.init(landsJson, myLandsJson)

var netId
var web3js
var userAccount = false

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
        // Debug only: override web3js instead of using Mist/MetaMask
    //    web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Local-node, use Geth or testrpc to start one
//        web3js = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/eth')); // Mainnet node
//        web3js = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/93Pkd62SaFUrBJZC646A')); // Mainnet node 2
//        web3js = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/93Pkd62SaFUrBJZC646A")); // Ropsten testnet node
        startApp();
    } else {
        toggleMetaMaskPrompt(true);
        // Use Infura Kovan testnet to show lands
        web3js = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/6469dd6b6c614a20ab3efb85cc1c7b1d")); // Kovan testnet node
        // getLands();
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
            $('#no-mainnet-alert-text').html("Currently in <b>Ropsten Test Network</b>. Change to <b>Main Ethereum Network</b> for valid transactions.");
        } else {
            $('#no-mainnet-alert-text').html("You're not connected! Open MetaMask and make sure you are on the Main Ethereum Network.");
        }
        // Get hold of contract instance
        // CubikToken = new web3js.eth.Contract(tokenAbi, tokenContractAddress);
        // CubikCrowdsale = new web3js.eth.Contract(crowdsaleAbi, crowdsaleContractAddress);

        getLands();
        
        // Update account detail every 1 seconds
        setInterval(checkAccountDetail, 1000);
    })
}

function getLands() {
    var Land = new web3js.eth.Contract(landAbi, landContractAddress);
    Land.methods.allLands(0).call().then((res) => {
        console.log(res)
        for (var i = 0; i < res[0].length; i++) {
            if (res[o][i] == undefined)
                continue;
            var x = res[0][i];
            var y = res[1][i];
            var w = res[2][i];
            var z = res[3][i];
            var owner = res[4][i];
        }
    })
}

function checkAccountDetail() {
    // Get default account
    web3js.eth.getAccounts().then(function (accounts) {
        // Just keep updating, so the user's balance is updated after purchase
        userAccount = accounts[0];
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
    $('#no-metamask-alert').toggle(toggle);
    // $('#account-detail').toggle(!toggle);
    // $('#buy-button').prop('disabled', toggle);
}