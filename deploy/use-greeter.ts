import { Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/Storage.sol/Storage.json";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const CONTRACT_ADDRESS = "0x13eB437Eaa886082324f79e697B99c4C1E9B160f";

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
  const newMessage = [[5,3,10,8,2],[5,2,10,8,3],[5,3,10,7,4],[5,3,1,8,6],[5,0,10,8,6],[5,3,1,1,7],[2,2,10,8,7],[3,3,10,7,7],[4,3,1,8,7],[5,0,10,0,7]];
  const tx = await contract.batch_spend(newMessage);

  console.log(`Transaction to change the message is ${tx.hash}`);
  await tx.wait();

  // Read message after transaction
  console.log(`The message now is ${await contract.commitment_root()}`);
}
