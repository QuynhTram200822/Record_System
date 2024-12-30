const HDWalletProvider = require('@truffle/hdwallet-provider'); // Sửa tên provider
const Web3 = require('web3');
const compiledRecord = require('./build/Record.json'); // Đảm bảo file JSON tồn tại
const fs = require('fs');
// Kết nối đến mạng HoleSky qua Infura
const provider = new HDWalletProvider(
    'flame mosquito step ocean tiny clever test time country head gloom evoke', // Seed phrase của ví
    'https://holesky.infura.io/v3/9d2440ebe1174eb9afdd525dc8d6d0c8' // URL mạng HoleSky từ Infura
);

const web3 = new Web3(provider);

const deploy = async () => {
    // Lấy danh sách tài khoản
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account:', accounts[0]);

    // Triển khai hợp đồng
    try {
        const result = await new web3.eth.Contract(compiledRecord.abi) // Sửa `interface` thành `abi`
            .deploy({ data: compiledRecord.evm.bytecode.object }) // Sửa `bytecode` đúng định dạng
            .send({ gas: '5000000', from: accounts[0] }); // Điều chỉnh gas phù hợp

        // Kiểm tra số dư sau triển khai
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log('Account address:', accounts[0]);
        console.log('Account balance (in Wei):', balance);
        console.log('Account balance (in ETH):', web3.utils.fromWei(balance, 'ether'));

        // In địa chỉ hợp đồng đã triển khai
        console.log('Contract deployed to:', result.options.address);
    } catch (error) {
        console.error('Deployment failed:', error);
    } finally {
        provider.engine.stop(); // Dừng kết nối provider sau khi triển khai
    }
};

// Gọi hàm triển khai
deploy();
