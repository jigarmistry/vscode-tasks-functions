
var vscode = require('vscode');
var ssh = require('simple-ssh');

function activate(context) {

    if (!this._statusBarItem) {
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    }

    var disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        vscode.window.showInformationMessage('Hello World!');
    });

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

    context.subscriptions.push(disposable);
    context.subscriptions.push(backupTasks);
    context.subscriptions.push(showtasks);
    context.subscriptions.push(dateadd);
}
exports.activate = activate;

function openTasks(){

    let year = vscode.workspace.getConfiguration('mytasks').get('year', '2016');
    let filepath = "/Volumes/jigarm/www/tasks-"+year+".txt";
    vscode.workspace.openTextDocument(filepath).then(doc => {
		vscode.window.showTextDocument(doc);
    });
}

exports.openTasks = openTasks;

function backupTasks(){

    editor = vscode.window.activeTextEditor;
    editorDocument = editor.document;
    editorContent = editorDocument.getText();

    cnssh = new ssh({host: '192.168.2.10',
      user: 'jigarm',
      pass: 'JigarM'});

    today = new Date();
    dd = today.getDate();
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();

    filename = 'cat > tasks_backup/tasks-'+dd+'-'+mm+"-"+yyyy+".txt";

    cnssh.exec(filename, {
        in: editorContent
    }).start();

    vscode.workspace.showInformationMessage("Backup Done !!");
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