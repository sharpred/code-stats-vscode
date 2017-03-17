"use strict";
// the module 'vscode' contains the VS Code extensibility API
// import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // use the console to output diagnostic information (console.log) and errors (console.error)
    // this line of code will only be executed once when your extension is activated
    console.log("Congratulations, your extension \"code-stats-vscode\" is now active!");

    // the command has been defined in the package.json file
    // now provide the implementation of the command with  registerCommand
    // the commandId parameter must match the command field in package.json
    let disposable: vscode.Disposable = vscode.commands.registerCommand("codestats.sayHello", () => {
        var editor: vscode.TextEditor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        var selection: vscode.Selection = editor.selection;
        var text: string = editor.document.getText(selection);

        vscode.window.showInformationMessage("Selected characters: " + text.length);
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}