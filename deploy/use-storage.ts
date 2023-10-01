import { Provider } from "zksync-web3";
import * as ethers from "ethers";
const { toBN, randomHex } = require('web3-utils')
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/Storage.sol/Storage.json";
//import * as ContractArtifact from "../artifacts-zk/contracts/Groth16Verifier.sol/Groth16Verifier.json";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const CONTRACT_ADDRESS = "0x13eB437Eaa886082324f79e697B99c4C1E9B160f";
//const CONTRACT_ADDRESS = "0x19bE833b430077Aac50F0C8F42d08aF791D6aD60";

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  

  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // Initialize contract instance
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ContractArtifact.abi,
    signer
  );

  // Read message from contract
  console.log(`The message is ${await contract.commitment_root()}`);

  // send transaction to update the message
  //message is array of 5 bytes
  //const newMessage = [[5,3,10,8,2],[5,2,10,8,3],[5,3,10,7,4],[5,3,1,8,6],[5,0,10,8,6],[5,3,1,1,7],[2,2,10,8,7],[3,3,10,7,7],[4,3,1,8,7],[5,0,10,0,7]];
  const message = "0x0000009"
  const tx = await contract.change_root(message);
  //const params = [["0x169cd755f15843200f9ccf66fd1cb4c98d45b8378dbf45c3ee40ed8597f882f8", "0x102ef159921d97770bdc3d013d63a2011ce380b16fb6a4744cc23b5da237fd33"],[["0x08ee7574aa01f3bc64910e877a11fb79f7b0b48d059887879498e5f7b8e3781c", "0x1123aaf6213a4b58023cc626ff055cd6b32cc4826fd317a324e8210c5c53eabe"],["0x2e2734c2bacb85d360015e4757e7f60d809eea925eb4f1ccdb369640def820a9", "0x0d870e564baa9fe430329b7bf425c4a17e347f50acc1a8ca92ca650b3300b548"]],["0x1146d12c725f6a7cc6ad50a435cf9babaf71ecc7c4c7820e58a6652c99b51c45", "0x046bb1b2bd3a90cab45557e11e2999884ffb5219abb2278180837bc31597c1f7"],["0x0000000000000000000000000000000000000000000000000000000000000021"]];
  //const tx = await contract.verifyProof(["0x169cd755f15843200f9ccf66fd1cb4c98d45b8378dbf45c3ee40ed8597f882f8", "0x102ef159921d97770bdc3d013d63a2011ce380b16fb6a4744cc23b5da237fd33"],[["0x08ee7574aa01f3bc64910e877a11fb79f7b0b48d059887879498e5f7b8e3781c", "0x1123aaf6213a4b58023cc626ff055cd6b32cc4826fd317a324e8210c5c53eabe"],["0x2e2734c2bacb85d360015e4757e7f60d809eea925eb4f1ccdb369640def820a9", "0x0d870e564baa9fe430329b7bf425c4a17e347f50acc1a8ca92ca650b3300b548"]],["0x1146d12c725f6a7cc6ad50a435cf9babaf71ecc7c4c7820e58a6652c99b51c45", "0x046bb1b2bd3a90cab45557e11e2999884ffb5219abb2278180837bc31597c1f7"],["0x0000000000000000000000000000000000000000000000000000000000000021"]);
  //const params = "0x169cd755f15843200f9ccf66fd1cb4c98d45b8378dbf45c3ee40ed8597f882f8102ef159921d97770bdc3d013d63a2011ce380b16fb6a4744cc23b5da237fd3308ee7574aa01f3bc64910e877a11fb79f7b0b48d059887879498e5f7b8e3781c1123aaf6213a4b58023cc626ff055cd6b32cc4826fd317a324e8210c5c53eabe2e2734c2bacb85d360015e4757e7f60d809eea925eb4f1ccdb369640def820a90d870e564baa9fe430329b7bf425c4a17e347f50acc1a8ca92ca650b3300b5481146d12c725f6a7cc6ad50a435cf9babaf71ecc7c4c7820e58a6652c99b51c45046bb1b2bd3a90cab45557e11e2999884ffb5219abb2278180837bc31597c1f70000000000000000000000000000000000000000000000000000000000000021";
  //const tx = await contract.verifyProof(params);
  console.log(tx);
  console.log(`Transaction to change the message is ${tx}`);
  console.log(`Transaction to change the message is ${tx.hash}`);
  await tx.wait();

  // Read message after transaction
  console.log(`The message now is ${await contract.commitment_root()}`);
}
