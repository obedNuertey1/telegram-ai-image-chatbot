import * as chai from 'chai';
// import chaiHttp = require('chai-http');
import 'mocha';

// chai.use(chaiHttp);
const {expect, assert} = chai;

describe("this is a sample test", ()=>{
    it("It does something", ()=>{
        assert.equal("a", "a");
        expect("a").to.be.equal("a");
    });
});
