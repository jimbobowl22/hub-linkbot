/*
    HUB-LINKBOT (jdwoj5)
    Please view the README before getting started. (Please run node server.js when starting up the bot, not node handler.js.)
*/
const { spawn } = require('child_process');

let full;
function StartBot(arg) {
    if (!arg) full = spawn('node', ['handler.js']);
    else full = spawn('node', ['handler.js', arg]);
    full.stdout.on('data', (data) => {
        console.log(String(data).trim());
    });
      
    full.stderr.on('data', (data) => {
        console.error(String(data));
    });
    full.on('close', function (code) {
        if (code == 2) {
            StartBot('--restarted')
        }
    });
}

StartBot()
