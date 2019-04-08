# Project #2. Private Blockchain
This is Project 2, Private Blockchain, in this project I created the classes to manage my private blockchain, to be able to persist my blochchain I used LevelDB.

## Install project for Review.

To setup the project for review do the following:
1. Download the project or clone project.
2. Navigate to folder & Run command __`npm install`__ to install the project dependencies.
3. Run command __`node`__ to launch Node.js REPL.
4. load the project __`simpleChain.js`__ class.
5. create BlockchainData instance __`let blockchainData = new BlockchainData('./chaindata')`__
6. create Blockchain instance __`let blockchain = new Blockchain(blockchainData)`__

### Requirement 1 Use getBlock(blockHeight) function
 __`blockchain.addBlock(new Block('Test block wooohoo!!'))`__

### Requirement 2 Use getBlockHeight() function 
 __`blockchain.getBlockHeight()`__

### Requirement 3 Use getBlock(blockHeight) function 
 __`blockchain.getBlock(3)`__

### Requirement 4 Use validateBlock(blockHeight) function 
 __`blockchain.validateBlock(3)`__

### Requirement 5 Use validateChain() function 
 __`blockchain.validateChain()`__
