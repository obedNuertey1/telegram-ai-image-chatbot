import { config } from "dotenv";
import {ISession, MongoDBAdapter} from "@grammyjs/storage-mongodb"
import { MongoClient } from "mongodb";
import { session } from "grammy";
config();

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

function initialSessionData():ISessionData{
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

export async function bootstrap(bot:any){
    try{
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        console.log("Connected to database successfully");
        const db = client.db("telegram_bot");
        const sessions = db.collection<ISession>("users");
    
        bot.use(
            session({
                initial: () => (initialSessionData()),
                storage: new MongoDBAdapter({collection: sessions})
            })
        )
    }catch(e){
        console.log(e.message);
    }
}

// export let $MongoDBAdapter = MongoDBAdapter;