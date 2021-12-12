const app = require('server.js');
const dbConnect = require('./db');
//dbConnect.user.deleteMany({});

var port = (process.env.PORT || 3000);

console.log("Starting API server at "+port);

dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready!");
    },
    err => {
        console.log("Connection error: "+err);
    }
)