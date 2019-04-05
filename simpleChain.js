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
      this.addBlock(new Block("First block in the chain - Genesis block"));
    }
    // Add new block
    addBlock(newBlock){
      // Adding block object to chain
      this.chain.push(newBlock);
    }
}    