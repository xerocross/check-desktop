const remote = require('electron').remote
export default {
    methods : {
        confirmModal (message) {
            let response = remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                type : "none",
                message : message,
                title : "Xerocross Check",
                buttons : ["No", "Yes"]
            });
            return (response == 1);
        },
        alertModal (message) {
            remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                type : "none",
                message : message,
                title : "Xerocross Check"
            });
        }
    }
}