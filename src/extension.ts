// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import AddTaskViewProvider from "./views/addTaskView";
import ToDoListViewProvider from "./views/toDoListView";
import DoneViewProvider from "./views/doneView";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "to-do-list-demo" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "to-do-list-demo.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from to do list demo!");
    }
  );

  context.subscriptions.push(disposable);

  const addTaskViewProvider = new AddTaskViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      AddTaskViewProvider.viewType,
      addTaskViewProvider
    )
  );

  const toDoListViewProvider = new ToDoListViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ToDoListViewProvider.viewType,
      toDoListViewProvider
    )
  );

  const doneViewProvider = new DoneViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      DoneViewProvider.viewType,
      doneViewProvider
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
