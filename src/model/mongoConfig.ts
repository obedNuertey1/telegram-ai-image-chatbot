import { config } from "dotenv";
import mongoose from "mongoose";
import {ISession, MongoDBAdapter } from "@grammyjs/storage-mongodb"
config();

namespace MongodbConfiguration{
    
    (async()=>{
        try{
            await mongoose.connect(process.env.MONGO_URI);
        }catch(e){
            console.error(e.message);
        }
    })();
    
    export const collection = mongoose.connection.db.collection<ISession>(
        "sessions",
    );
    
    export interface ISessionData{
        is_bot: boolean;
        first_name: string;
        last_name: string;
        username: string;
        language_code: string;
        paid: boolean;
        arrayNewUserReferral_Id: string[];
        userImageUrl: string;
        skinColor: string;
        sex: string;
        points: number;
    };
    
    export function initialSessionData():ISessionData{
        return {
            is_bot: false,
            first_name: "",
            last_name: "",
            username: "",
            language_code: "",
            paid: false,
            arrayNewUserReferral_Id: [],
            userImageUrl: "",
            skinColor: "",
            sex: "",
            points: 0
        }
    }
    export let $MongoDBAdapter = MongoDBAdapter;
}

export default MongodbConfiguration;