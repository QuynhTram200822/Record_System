const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Xóa thư mục build
const buildPath = path.resolve(__dirname, 'build');
console.log('Deleting build folder...');
fs.removeSync(buildPath);

// Đọc file hợp đồng Solidity
console.log('Getting contract by path...');
const contractPath = path.resolve(__dirname, 'contracts', 'Record.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// Cấu hình đầu vào cho trình biên dịch
console.log('Compiling contract...');
const input = {
    language: 'Solidity',
    sources: {
        'Record.sol': {
            content: source,
        },
    },
    settings: {
        optimizer: {
            enabled: true, // Bật tối ưu hóa
            runs: 200,     // Số lần tối ưu hóa
        },
        viaIR: true, // Biên dịch qua IR để tránh lỗi Stack Too Deep
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode', 'metadata'],
            },
        },
    },
};

// Biên dịch hợp đồng
let output;
try {
    output = JSON.parse(solc.compile(JSON.stringify(input))); // Chuyển đổi kết quả biên dịch thành JSON
} catch (error) {
    console.error('Compilation failed with error:', error);
    process.exit(1);
}

// Kiểm tra lỗi biên dịch
if (output.errors && output.errors.length > 0) {
    console.error('Compilation errors/warnings:');
    output.errors.forEach((err) => {
        console.error(err.formattedMessage);
    });
    if (output.errors.some((err) => err.severity === 'error')) {
        console.error('Fix the errors above to proceed.');
        process.exit(1); // Thoát nếu có lỗi nghiêm trọng
    }
}

// Kiểm tra nếu có hợp đồng được biên dịch
if (output.contracts && output.contracts['Record.sol']) {
    fs.ensureDirSync(buildPath); // Tạo lại thư mục build nếu chưa có

    for (const contract in output.contracts['Record.sol']) {
        const contractData = output.contracts['Record.sol'][contract];
        const fileName = contract.replace(':', '') + '.json';

        fs.outputJsonSync(
            path.resolve(buildPath, fileName),
            contractData // Lưu ABI và bytecode vào file JSON
        );

        console.log(`Contract ${contract} compiled successfully and saved to ${fileName}`);
    }
} else {
    console.error('No contracts found in the compilation output.');
    process.exit(1);
}
