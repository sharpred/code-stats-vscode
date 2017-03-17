import * as assert from "assert";

// tslint:disable-next-line:no-unused-variable
import * as vscode from "vscode";
// tslint:disable-next-line:no-unused-variable
import * as codestats from "../src/code-stats";
import { Pulse } from "../src/pulse";

suite("code-stats-vscode extension tests", () => {
    test("Initialized Pulse is empty", () => {
        let pulse: Pulse = new Pulse();
        const language: string = "typescript";

        let initialXP: number = pulse.getXP(language);

        assert.equal(initialXP, 0);
    });

    test("Add XP to Pulse", () => {
        let pulse: Pulse = new Pulse();

        const language1: string = "typescript";
        const language2: string = "javascript";
        const language3: string = "coffeescript";
        const addedXP: number = 1000;

        let xp1: number = pulse.getXP(language1);
        let xp2: number = pulse.getXP(language2);
        let xp3: number = pulse.getXP(language3);
        assert.equal(xp1, 0);
        assert.equal(xp2, 0);
        assert.equal(xp3, 0);

        pulse.addXP(language1, addedXP);
        xp1 = pulse.getXP(language1);
        xp2 = pulse.getXP(language2);
        xp3 = pulse.getXP(language3);

        assert.equal(xp1, addedXP);
        assert.equal(xp2, 0);
        assert.equal(xp3, 0);

        pulse.addXP(language1, addedXP);
        pulse.addXP(language2, addedXP);
        xp1 = pulse.getXP(language1);
        xp2 = pulse.getXP(language2);
        xp3 = pulse.getXP(language3);

        assert.equal(xp1, 2 * addedXP);
        assert.equal(xp2, addedXP);
        assert.equal(xp3, 0);
    });
});