/* ===== SHA256 with Crypto-js ===================================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js      |
|  =============================================================*/

const SHA256 = require('crypto-js/sha256');

// ===== STEP 1: Block data model =================
// ===== Block Class ==============================
// ===== init block obj ===========================
class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

// ===== STEP 1: Store Blocks ==========================
/* ===== Blockchain Class ==============================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/
class Blockchain{
    constructor(){
      this.chain = [];
      this.addBlock(this.createGenesisBlock());
    }
    createGenesisBlock(){
        return new Block("First block in the chain - Genesis block");
    }    
    // Add new block
    addBlock(newBlock){
      // previous block hash
      if(this.chain.length>0){
        newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
      }  
      // Block hash with SHA256 using newBlock and converting to a string
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();  
      // Adding block object to chain
      this.chain.push(newBlock);
    }
}    