
var vscode = require('vscode');

function activate(context) {

    if (!this._statusBarItem) {
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    }

    var backuptasks = vscode.commands.registerCommand('extension.backuptasks', function () {
        backupTasks();
    });

    var opentasks = vscode.commands.registerCommand('extension.opentasks', () => {
        openTasks()
    });

    var dateadd = vscode.commands.registerCommand('extension.dateadd', () => {
        addDate()
    });

    var showtasks = vscode.commands.registerCommand('extension.showtasks', () => {
        this._statusBarItem.text = 'Tasks';
        this._statusBarItem.show();
        this._statusBarItem.tooltip = 'Open Tasks File';
        this._statusBarItem.command = 'extension.opentasks';
    });

    context.subscriptions.push(backupTasks);
    context.subscriptions.push(showtasks);
    context.subscriptions.push(dateadd);
}
exports.activate = activate;

function openTasks(){

    let folder = vscode.workspace.getConfiguration('mytasks').get('folder', '/Users/jigarmistry/Documents/tasks');
    let year = vscode.workspace.getConfiguration('mytasks').get('year', '2016');

    let filepath = folder + "/tasks-"+year+".txt";
    vscode.workspace.openTextDocument(filepath).then(doc => {
		vscode.window.showTextDocument(doc);
    });
}

exports.openTasks = openTasks;

function backupTasks(){  
    let folder = vscode.workspace.getConfiguration('mytasks').get('folder', '/Users/jigarmistry/Documents/tasks');
    const cp = require('child_process');    
    cp.exec('./sync.sh',{cwd: folder}, (err, s, ser) => {
        console.log('stdout: ' + s);        
        if (err) {
            console.log('error: ' + err);
        }                    
    });
    vscode.window.showInformationMessage("Backup Done !!");
    
}
exports.backupTasks = backupTasks;

function addDate(){

    editor = vscode.window.activeTextEditor;

    if (editor.selection.isEmpty) {

        var datearray = new Date().toString().split(' ');
        var date = datearray[2] + "-" + datearray[1] + "-" + datearray[3];
        const position = editor.selection.active;

        editor.edit(edit => {
            edit.insert(position,"--------------------------------------------------------------------------------\n");
            edit.insert(position,"                               "+date+"                                         \n");
            edit.insert(position,"--------------------------------------------------------------------------------");
        });
    }
}
exports.addDate = addDate;

function deactivate() {
}
exports.deactivate = deactivate;