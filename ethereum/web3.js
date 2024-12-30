import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && window.web3 !== 'undefined') {
    //We are in the browser AND metamask is running
    async () => {await window.ethereum.enable();}
    web3 = new Web3(window.ethereum);
} else {
    //We are on the server OR the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://holesky.infura.io/v3/9d2440ebe1174eb9afdd525dc8d6d0c8'
    );
    web3 = new Web3(provider);
}

export default web3;