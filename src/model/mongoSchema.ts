import { config } from "dotenv";
import mongoose from "mongoose";
config();

mongoose.connect(process.env.MONGO_URI, {
    dbName: "telegram_bot"
})

const {Schema, model} = mongoose;

const sessionSchema = new Schema({
    is_bot: {type: Boolean},
    first_name: {type: String},
    last_name: {type: String},
    username: {type: String},
    language_code: {type: String},
    paide: {type: Boolean},
    arrayNewUserReferral_Id: {type: [String]},
    userImageUrl: {type: String},
    skinColor: {type: String},
    sex: {type: String},
    points: {type: Number}
})

const usersSchema = new Schema({
    key: String,
    value: sessionSchema
});

export const User = model("Users", usersSchema);
