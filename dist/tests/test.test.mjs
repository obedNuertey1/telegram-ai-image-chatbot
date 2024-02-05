import * as chai from 'chai';
import 'mocha';
const { expect, assert } = chai;
describe("this is a sample test", () => {
    it("It does something", () => {
        assert.equal("a", "a");
        expect("a").to.be.equal("a");
    });
});
