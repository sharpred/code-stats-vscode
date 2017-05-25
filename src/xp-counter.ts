// tslint:disable-next-line:max-line-length
import { Disposable, workspace, window, StatusBarItem, TextDocument, StatusBarAlignment, TextDocumentChangeEvent, Range, WorkspaceConfiguration } from "vscode";
import { Pulse } from "./pulse";
import { CodeStatsAPI } from "./code-stats-api";

export class XpCounter {
    private combinedDisposable: Disposable;
    private statusBarItem: StatusBarItem;
    private pulse: Pulse;
    private api: CodeStatsAPI;
    private updateTimeout: any;

    //    private languages: Array<string> = ["typescript", "javascript"];

    // wait 10s after each change in the document before sending an update
    private UPDATE_DELAY = 10000;

    constructor() {
        this.pulse = new Pulse();

        /* // print out supported language names
        let allLanguages = languages.getLanguages().then(
            (result => {
                console.log(JSON.stringify(result));
            })
        );
        */

        let config: WorkspaceConfiguration = workspace.getConfiguration("codestats");
        if (!config) {
            return;
        }

        // tslint:disable-next-line:typedef
        let apiKey = config.get("apikey");
        this.api = new CodeStatsAPI(`${apiKey}`);

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
        let containsLineBreaks: boolean = false;
        for (let change of event.contentChanges) {
            if (change.text.indexOf("\n") !== -1) {
                //if line breaks found in text, assume it is a reformatting of a text or JSON object
                containsLineBreaks = true;
            } else {
                changeCount += this.determineChangeCount(change.range);
            }
        }
        if (containsLineBreaks) {
            this.updateXpCount(event.document, 1);
        } else {
            this.updateXpCount(event.document, changeCount);
        }
    }

    private determineChangeCount(range: Range): number {
        if (range === null || range === undefined) {
            return 0;
        }
        if (range.start.line === range.end.line) {
            if (range.start.character === range.end.character) {
                return 1;
            } else {
                return range.end.character - range.start.character;
            }
        }
        // multiline changes, copy/paste count as 1XP
        return 1;
    }

    public updateXpCount(document: TextDocument, changeCount: number): void {
        let show: boolean;
        if (this.isSupportedLanguage(document.languageId)) {
            this.pulse.addXP(document.languageId, changeCount);
            show = true;
        } else {
            show = false;
        }
        this.updateStatusBar(show, `${this.pulse.getXP(document.languageId)}`);

        // each change resets the timeout so we only send updates when there is a 10s delay in updates to the document
        if (this.updateTimeout !== null) {
            clearTimeout(this.updateTimeout);
        }

        this.updateTimeout = setTimeout(() => {
            this.api.sendUpdate(this.pulse);
        }, this.UPDATE_DELAY);
    }

    private updateStatusBar(show: boolean, changeCount: string): void {
        if (!show) {
            this.statusBarItem.hide();
        } else {
            this.statusBarItem.text = `$(pencil) C::S ${changeCount}`;
            this.statusBarItem.show();
        }
    }

    private isSupportedLanguage(language: string): boolean {
        // todo: check supported languages
        // only update xp if one of supported languages
        return true;
    }

}
