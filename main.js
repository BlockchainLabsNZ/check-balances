const Web3 = require("web3");
const fs = require("fs");
var sleep = require("sleep");

const infuraAPIKey = ''; // Optional
const providerURL = "https://mainnet.infura.io" + infuraAPIKey;
var web3 = new Web3(new Web3.providers.HttpProvider(providerURL));

let balance;
let balances = [];

// INITIALIZE LOG FILES
fs.openSync("errors.txt", "w");
fs.openSync("balances.csv", "w");
console.log("Log files initialized");

// FILE WE'LL READ ADDRESSES FROM
const readFrom = "addresses.csv";
var lineReader = require("readline").createInterface({
  input: fs.createReadStream(readFrom, { encoding: "utf8" })
});

// https://stackoverflow.com/a/32599033
let counter = 0;
lineReader.on("line", async line => {
  counter++;
  if (counter % 5000 == 0) {
    console.log("Iterations : ", counter);
    console.log("Pausing job...", new Date());
    lineReader.pause();
    sleep.sleep(5);
    console.log("Resuming job...", new Date());
    lineReader.resume();
  }
  // Force lower case so the checksum is not checked
  await getBalance(line.toLowerCase());
});

lineReader.on("close", () => {
  console.log("Balances written to balances.csv");
});

const getBalance = async address => {
  sleep.msleep(2);
  try {
    balance = await web3.eth.getBalance(address);
    fs.appendFileSync("balances.csv", `${address},${balance}\n`);
  } catch (err) {
    try {
      fs.appendFileSync("errors.txt", err + "\n");
    } catch (err) {
      console.log(err);
    }
  }
};
