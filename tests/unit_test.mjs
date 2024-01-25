import { assert } from 'chai';
import {labels} from "../dist/bot.js";


suite('Bot functions', ()=>{
    suite("Keyboard keynames", function(){
        test("Should be an array", function(){
            assert.isArray(labels);
        })
    })
})

