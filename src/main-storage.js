const electron = require('electron');
const fs = require('fs');
const ipc = electron.ipcRenderer;

class MainStorage {
    constructor() {
        // const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        // this.path = path.join(userDataPath, opts.configName + '.json');
        // this.data = parseDataFile(this.path, opts.defaults);
        this.data = ipc.sendSync("get-main-data");
        console.log("received from main storage:");
        console.log(this.data);
        if (this.data == null) {
            this.data = {};
        }
    }
    get(key) {
        return this.data[key];
    }

    save () {
        ipc.send("save-data-file", this.data);
        ipc.on("save-data-file", function(event, arg) {
            if (arg == true) {
                alert("saved");
            } else {
                alert("couldn't save");
            }
        })
    }

    remove(key) {
        delete this.data[key];
        this.save();
    }

    set(key, val) {
        this.data[key] = val;
        this.save();
        // try {
        //     fs.writeFileSync(this.path, JSON.stringify(this.data));
        // } 
        // catch (e) {
        //     console.log(e);
        // }
    }
}


module.exports = MainStorage;