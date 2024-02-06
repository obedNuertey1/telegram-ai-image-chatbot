import * as chai from 'chai';
// import chaiHttp = require('chai-http');
import 'mocha';
// chai.use(chaiHttp);
import {initial, FILE_PATH, labels, replyInput, paymentOptionMenu, balanceMenuDynamicFunc, sendPhoto} from "../src/bot.js";
import {fileHandle} from "../src/namespaces/FileHandlingToTest.js";


const {expect, assert} = chai;

type MyContext = any;
const ctx:MyContext = {
    from: {id: 123132352342234, first_name: "Obed"},
    reply: (rep:any)=>(rep),
    replyWithMediaGroup: async (arr:any)=>(arr),
    getFile: ()=>({
        getUrl:()=>("this is a url"),
        file_path: "path/to/file",
        download: (path:any)=>(path)
    })
}

const {downloadFile, editPath} = fileHandle;

const replyInputData = replyInput("Select a payment method:", paymentOptionMenu);

describe("in bot functions", ()=>{
    describe("initialize session function", ()=>{
        it("Should have pizzaCount Object", ()=>{
            assert.deepEqual(initial(), {pizzaCount: 0})
        })
    })

    describe("what file path should be", ()=>{
        it("FILE_PATH should be a string", ()=>{
            assert.isString(FILE_PATH);
        });

        it("FILE_PATH should be equal to \\tmp\\assets", ()=>{
            assert.equal(FILE_PATH, "\\tmp\\assets");
        })
    })

    describe("What the variable labels should be", ()=>{
        it("labels should be an array", ()=>{
            assert.isArray(labels);
        });

        it("labels should have three element", ()=>{
            assert.equal(labels.length, 3);
        });

        it("All elements of labels should be string", ()=>{
            for(let i = 0; i < labels.length; i++){
                assert.isString(labels[i]);
            }
        });
    });


    describe("What the function replyInput should be", ()=>{
        
        it("replyInput should be an array", ()=>{
            assert.isArray(replyInputData);
        });

        it("replyInput should have two arrays as elements", ()=>{
            assert.equal(replyInputData.length, 2);
        })

        it("First Element must be a string", ()=>{
            assert.isString(replyInputData[0], "checks whether it is string");
        });

        it("Last element should be an object", ()=>{
            assert.isObject(replyInputData[1]);
        });

        it("The last element should have the properties parse_mode and reply_markup", ()=>{
            assert.property(replyInputData[1], "parse_mode", "parse_input is a property");
            assert.property(replyInputData[1], "reply_markup", "reply_input is a property");
        });

    });

    describe("What send photo should return", ()=>{
        it("send photo with wrong user id should return false", async()=>{
            const sendPhotoResult = await sendPhoto(ctx);
            
            assert.equal(sendPhotoResult, false);
        })

    })

    describe("How downloadPath function should behave", ()=>{
        it("should return a string if file exists", async ()=>{
            const downloadVal = await downloadFile();
            assert.isString(downloadVal);
        })
        it("should return undefined if file does not exist", async()=>{
            const downloadVal = await downloadFile();
            assert.isUndefined(downloadVal);
        });
    });

    describe("How editPath should behave", ()=>{
        it("Should return a well formated path in this maner \\this\\is\\your\\path when this is parsed /this/is/your/path", ()=>{
            assert.isString(editPath("/this/is/your/path"));
            assert.equal(editPath("/this/is/your/path"), "\\this\\is\\your\\path");
        });
        it("Should return a well formated path in this maner \\this\\is\\your\\path when this is parsed ./this/is/your/path", ()=>{
            assert.isString(editPath("./this/is/your/path"));
            assert.equal(editPath("./this/is/your/path"), "\\this\\is\\your\\path");
        })
    })

})