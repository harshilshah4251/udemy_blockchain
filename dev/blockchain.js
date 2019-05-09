const sha256 = require('sha256');
const uuid = require('uuid/v1');
const currentNodeUrl = process.argv[3];

function Blockchain(){
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes= [];
    //arbitrary parameters for genesis block
    this.createNewBlock(100, '0', '0');

}

//creates new block
Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash){
    const newBlock = {
        index : this.chain.length + 1,
        timestamp : Date.now(),
        transactions : this.pendingTransactions,
        nonce : nonce,
        hash : hash,
        previousBlockHash : previousBlockHash
    };

    //clear out new transactions as we have put everything in the block we created
    this.pendingTransactions = [];
    //push new block in chain
    this.chain.push(newBlock);

    return newBlock;
}

//returns last block
Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length -1];
}


//create new transaction. 
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
    const newTransaction = {
        amount : amount,
        sender : sender,
        recipient : recipient,
        transactionId : uuid().split('-').join('')
    };
    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
}

//currentBlockData can be an array of transactions
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}


//generating a hash that has four zeroes in the beginning of it
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while(hash.substring(0,4) !== '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
}                                 

Blockchain.prototype.chainIsValid = function(blockchain){
    let validChain = true;
    for(var i = 1; i < blockchain.length; i++){
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i-1];
        const blockHash = this.hashBlock(prevBlock['hash'], {transactions: currentBlock['transactions'], index: currentBlock['index']}, currentBlock['nonce']);
        if(blockHash !== currentBlock['hash']) validChain = false;
        if(currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
    };
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPrevBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if(!correctNonce || !correctPrevBlockHash || !correctHash || !correctTransactions) validChain = false;
    return validChain;
}








module.exports = Blockchain;