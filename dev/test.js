const Blockchain = require('./blockchain');
const rp = require('request-promise');
const bodyParser = require('body-parser');


const bitcoin = new Blockchain();
const currentNode = "http://localhost:3001";
const networkNodes = [
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005"
]

registerNodes();



function registerNodes(){

    requestPromises = [];
    networkNodes.forEach(networkNode => {
        const requestOptions = {
            uri : currentNode + '/register-and-broadcast-node',
            method : 'POST',
            body : {newNodeUrl : networkNode},  
            json :true
        }
        requestPromises.push(rp(requestOptions));

    });

    Promise.all(requestPromises).then(data => {
        note : 'All nodes registered and broadcasted successfully'
    });
}

