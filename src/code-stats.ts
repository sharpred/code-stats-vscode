"use strict";
import { ExtensionContext } from "vscode";
import { XpCounter } from "./xp-counter";

export function activate(context: ExtensionContext): void {
    console.log("Activating code-stats-vscode");

    let controller: XpCounter = new XpCounter();

    // add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
}

// this method is called when your extension is deactivated
export function deactivate(): void {
    console.log("Deactivating code-stats-vscode");
}
