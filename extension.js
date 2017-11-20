var vscode = require("vscode");

function activate(context) {
  if (!this._statusBarItem) {
    this._statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
  }

  var backuptasks = vscode.commands.registerCommand(
    "extension.backuptasks",
    function() {
      backupTasks();
    }
  );

  var opentasks = vscode.commands.registerCommand("extension.opentasks", () => {
    openTasks();
  });

  var dateadd = vscode.commands.registerCommand("extension.dateadd", () => {
    addDate();
  });

  var edtcalc = vscode.commands.registerCommand("extension.edtcalc", () => {
    editorCalc();
  });

  var showtasks = vscode.commands.registerCommand("extension.showtasks", () => {
    this._statusBarItem.text = "Tasks";
    this._statusBarItem.show();
    this._statusBarItem.tooltip = "Open Tasks File";
    this._statusBarItem.command = "extension.opentasks";
  });

  context.subscriptions.push(backupTasks);
  context.subscriptions.push(showtasks);
  context.subscriptions.push(dateadd);
  context.subscriptions.push(edtcalc);
}
exports.activate = activate;

function openTasks() {
  let folder = vscode.workspace
    .getConfiguration("mytasks")
    .get("folder", "/Users/jigarmistry/Documents/tasks");
  let year = vscode.workspace.getConfiguration("mytasks").get("year", "2016");

  let filepath = folder + "/tasks-" + year + ".txt";
  vscode.workspace.openTextDocument(filepath).then(doc => {
    vscode.window.showTextDocument(doc);
  });
}

exports.openTasks = openTasks;

function backupTasks() {
  let folder = vscode.workspace
    .getConfiguration("mytasks")
    .get("folder", "/Users/jigarmistry/Documents/tasks");
  const cp = require("child_process");
  cp.exec(
    "./sync.sh",
    {
      cwd: folder
    },
    (err, s, ser) => {
      console.log("stdout: " + s);
      if (err) {
        console.log("error: " + err);
      }
    }
  );
  vscode.window.showInformationMessage("Backup Done !!");
}
exports.backupTasks = backupTasks;

function addDate() {
  editor = vscode.window.activeTextEditor;

  if (editor.selection.isEmpty) {
    var datearray = new Date().toString().split(" ");
    var date = datearray[2] + "-" + datearray[1] + "-" + datearray[3];
    const position = editor.selection.active;

    editor.edit(edit => {
      edit.insert(
        position,
        "--------------------------------------------------------------------------------\n"
      );
      edit.insert(
        position,
        "                               " +
          date +
          "                                         \n"
      );
      edit.insert(
        position,
        "--------------------------------------------------------------------------------"
      );
    });
  }
}
exports.addDate = addDate;

function editorCalc() {
  var selection = vscode.window.activeTextEditor.selection;
  var startLine = selection.start.line - 1;
  var selectedText = vscode.window.activeTextEditor.document.getText(selection);
  if (selectedText) {
    if (selectedText.indexOf("+") > 0) {
      var arrValues = selectedText.split("+");
      var ans = 0;
      for (var i = 0; i < arrValues.length; i++) {
        if (!isNaN(arrValues[i])) {
          ans = ans + parseInt(arrValues[i]);
        }
      }
      vscode.window.showInformationMessage(ans.toString());
    }
    if (selectedText.indexOf("-") > 0) {
      var arrValues = selectedText.split("-");
      var ans = 0;
      for (var i = 0; i < arrValues.length; i++) {
        if (!isNaN(arrValues[i])) {
          if (i == 0) {
            ans = parseInt(arrValues[i]);
          } else {
            ans = ans - parseInt(arrValues[i]);
          }
        }
      }
      vscode.window.showInformationMessage(ans.toString());
    }
    if (selectedText.indexOf("*") > 0) {
      var arrValues = selectedText.split("*");
      var ans = 1;
      for (var i = 0; i < arrValues.length; i++) {
        if (!isNaN(arrValues[i])) {
          ans = ans * parseInt(arrValues[i]);
        }
      }
      vscode.window.showInformationMessage(ans.toString());
    }
    if (selectedText.indexOf("/") > 0) {
      var arrValues = selectedText.split("/");
      var ans = parseInt(arrValues[0]) / parseInt(arrValues[1]);
      vscode.window.showInformationMessage(ans.toString());
    }
  } else {
    vscode.window.showInformationMessage("No Output !");
  }
}

exports.editorCalc = editorCalc;

function deactivate() {}
exports.deactivate = deactivate;
