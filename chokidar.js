var
    chokidar = require('chokidar'),
    printer = require('printer'),
    sysPath  = require('path'),
    fs = require('fs'),
    info = '',
    watchDir = './orders';

function sendPrint() {
    printer.printDirect({
        data: info,
        type: 'RAW',
        success: function (jobID) {
            console.log("ID: " + jobID);
        },
        error: function (err) {
            console.log('printer module error: '+err);
            throw err;
        }
    });
}

// create watch folder if it doesn't exist
if (!fs.existsSync(watchDir)){
    fs.mkdirSync(watchDir);
}

// Initialize watcher.
var watcher = chokidar.watch('orders/', {
    ignored: /[\/\\]\./,
    persistent: true
});

// stay awake to find any new file added
// print content and moved it to backup folder
watcher
    .on('add', path => {

    // get file content
    info = fs.readFileSync(path).toString();

    // send it to printer
    sendPrint();

    // moved file to backup folder
    fs.rename(path, __dirname + '/backup-orders/' + sysPath .basename(path), function (err) {
        if (err) throw err;
        console.log('renamed complete');
    });
});

