import { Disposable, workspace, window, StatusBarItem, TextDocument, StatusBarAlignment, TextDocumentChangeEvent, Range } from "vscode";
import { Pulse } from "./pulse";

export class XpCounter {
    private combinedDisposable: Disposable;
    private statusBarItem: StatusBarItem;
    private pulse: Pulse;
    private languages: Array<string> = ["typescript", "javascript"];
    private changeCount: number = 0;

    constructor() {
        console.log(`Supported languages for Code::Stats are ${this.languages}`);
        this.pulse = new Pulse();

        if (!this.statusBarItem) {
            this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        let subscriptions: Disposable[] = [];
        workspace.onDidChangeTextDocument(this.onTextDocumentChanged, this, subscriptions);
        this.combinedDisposable = Disposable.from(...subscriptions);
    }

    dispose(): void {
        this.combinedDisposable.dispose();
        this.statusBarItem.dispose();
    }

    private onTextDocumentChanged(event: TextDocumentChangeEvent): void {
        let changeCount: number = 0;
        for (let change of event.contentChanges) {
            changeCount += this.determineChangeCount(change.range);
        }
        this.updateXpCount(event.document, changeCount);
    }

    private determineChangeCount(range: Range): number {
        if (range === null || range === undefined ) {
            return 0;
        }
        // console.log(`L${range.start.line}C${range.start.character} to L${range.end.line}C${range.end.character}`);
        if (range.start.line === range.end.line) {
            if (range.start.character === range.end.character) {
                return 1;
            } else {
                console.log(`L${range.start.line}C${range.start.character} to L${range.end.line}C${range.end.character}`);
                return range.end.character - range.start.character;
            }
        }
        // todo detect multiline changes
        return 1;
    }

    public updateXpCount(document: TextDocument, changeCount: number): void {
        // only update xp if one of supported languages
        if (this.isSupportedLanguage(document.languageId)) {
            this.pulse.addXP(document.languageId, changeCount);
            // this.statusBarItem.text = this.changeCount !== 1 ?
            //    ` C::S  ${this.changeCount} Words` : "$(pencil) C::S 1 Word";
            this.statusBarItem.text = `C::S $(pencil) ${this.pulse.getXP(document.languageId)}`;
            this.statusBarItem.show();
        } else {
            this.statusBarItem.hide();
        }
    }

    private isSupportedLanguage(language: string): boolean {
        // todo: check supported languages
        return true;
    }

}
