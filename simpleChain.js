/* ===== SHA256 with Crypto-js ===================================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js      |
|  =============================================================*/

const SHA256 = require('crypto-js/sha256');

/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

let level = require('level');

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
/* ===== BlockchainData Class ==============================
|  Class with a Wrapper for leveldb                    |
|  with functions to support:                          |
|     - getDb()                                        |
|     - saveBlock(block)                               |
|     - getBlock(key)                                  |
|     - isEmpty()                                      |
|     - getChainLength()                               |
|  ====================================================*/
class BlockchainData {
    constructor(dbDir){
    //   this.chain = [];
    //   this.addBlock(this.createGenesisBlock());
      this.db = level(dbDir);
    }
    getDb() {
        return this.db;
    }
    saveBlock(block) {
        let _this = this;
        let key = block.height;
        return new Promise(function(resolve, reject) {
            _this.db.put(key, JSON.stringify(block), function(err){
                if(err) {
                    reject(new Error(`Block ${key} submission failed. ${err.message}`));
                }
                resolve(block);
            })
        });
    }
    getBlock(key) {
        let _this = this;
        return new Promise(function(resolve, reject) {
            _this.db.get(key, function(err, value) {
                if(err) {
                    reject(new Error(`Can not find block in : ${key}. ${err.message}`));
                } else {
                    resolve(JSON.parse(value));
                }
            });
        });
    }
    isEmpty() {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let length = _this.getChainLength();
            length.then(result => {
                if(result === 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(err => {
                reject(new Error(`Can not determine, if DB is empty. ${err.message}`));
            });
        });
    }
    getChainLength() {
        let _this = this;
        return new Promise(function(resolve, reject){
            let length = 0;
            _this.db.createReadStream({ keys: true, values: false })
                .on('data', function (data) {
                    length++;
                })
                .on('error', function(err) {
                    reject(new Error(`error in DB Read Stream. ${err.message}`));
                })
                .on('close', function(){
                    resolve(length);
                });
        });
    }

} 
/* ===== Blockchain Class ==========================
 |  Class with a constructor for new blockchain 	|
 |  ================================================*/

class Blockchain{
    constructor(db){
        this.chain = db || new BlockchainData("./chaindata");
        this.chain.isEmpty().then(result => {
            if(result) {
                console.log("Blockchain DB is empty, Creating new Blockchain with genesis block");
                this.addBlock(new Block("First block in the chain - Genesis block"));
            } 
            else {
                console.log("Blockchain DB has blocks, Reading Blockchain from DB");
            }
        }).catch(err => {
            throw err;
        });
    }

    getChain() {
        return this.chain;
    }

    addBlock(newBlock){
        let _this = this;
        return new Promise((resolve, reject) => {
            newBlock.time = new Date().getTime().toString().slice(0,-3);
            _this.chain.getChainLength().then(chainLength => {
                newBlock.height = chainLength;
                if(chainLength === 0) {
                    return new Promise((resolve, reject) => {
                        console.log("chain length = 0, return null instead of block");
                        resolve(null);
                    });
                } 
                else {
                    console.log(`chain length is ${chainLength}, return previous block`);
                    return _this.chain.getBlock(chainLength - 1);
                }
            }).then(previousBlock => {
                if(previousBlock === null) {
                    newBlock.previousBlockHash = "";
                } 
                else {
                    newBlock.previousBlockHash = previousBlock.hash;
                }
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                return _this.chain.saveBlock(newBlock);
            }).then(saveOperationResult => {
                console.log("block saved");
                resolve(saveOperationResult);
            }).catch(err => {
                reject(new Error(`${err.message}`));
            });
        });
    }

    getBlockHeight() {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.chain.getChainLength().then(currentLength => {
                resolve(currentLength);
            }).catch(err => {
                reject(new Error(`${err.message}`));
            });
        });
    }

    getBlock(blockHeight){
        return new Promise((resolve, reject) => {
            this.chain.getBlock(blockHeight).then(block => {
                resolve(block);
            }).catch(err => {
                reject(new Error(`${err.message}`));
            });
        });
    }

    validateBlock(blockHeight){
        let _this = this;
        return new Promise(function(resolve, reject){
            _this.chain.getBlock(blockHeight).then(block => {
                let blockHash = block.hash;
                block.hash = '';
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (blockHash === validBlockHash) {
                    resolve(true);
                }
                 else {
                    reject(new Error('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash));
                }
            });
        });
    }

    validateChain() {
        let errors = [];
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.chain.getChainLength()
                .then(currentLength => {
                    let allBlockValidations = [];
                    for(let i = 0; i < currentLength; i++) {
                        allBlockValidations.push(
                            _this.validateBlock(i)
                                .catch(err => {
                                    errors.push(err);
                                })
                        );
                    }
                    return Promise.all(allBlockValidations);
                })
                .then(value => {
                    if(errors.length > 0) {
                        reject(errors);
                    } 
                    else {
                        resolve(true);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}   