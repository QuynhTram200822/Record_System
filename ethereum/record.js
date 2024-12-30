import web3 from "./web3";
import Record from "./build/Record.json";

const instance = new web3.eth.Contract(
  Record.abi, // Lấy 'abi' từ tệp JSON (không cần parse)
  "0xe6212cf3e0390706c67F499563091607D27a4c70" // Địa chỉ hợp đồng đã được triển khai
);

export default instance;

//Whenever there is a change in Solidity code, use this few commands
//Step 1: cd ethereum
//Step 2: node compile.js
//Step 3: node deploy.js
//Step 4: Paste the contract deployed address above
