import {config} from "dotenv";
import {Api, Bot, CommandContext, Context, RawApi, Keyboard, webhookCallback, InlineKeyboard, SessionFlavor, session, InputMediaBuilder, InputFile, enhanceStorage} from "grammy";
import express from "express";
import {Menu, MenuRange} from "@grammyjs/menu";
import { FileFlavor, hydrateFiles } from "@grammyjs/files";
import FileHandling from "./namespaces/FileHandling";
import fs from "fs";
import {bootstrap, ISessionData} from "./model/mongodbConfiguration";
import { User } from "./model/mongoSchema";
import bodyParser from 'body-parser';
import cors from "cors";


config();

type MyContext2 = FileFlavor<Context> & Context;
export type MyContext = MyContext2 & SessionFlavor<ISessionData>;
// Create a bot using the Telegram token

async function main(){
    const bot = new Bot<MyContext>(process.env.BOT_TOKEN || "");

    await bootstrap(bot);


    bot.api.config.use(hydrateFiles(bot.token));
    
    
    const app = express();
    app.use(cors({optionsSuccessStatus: 200}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    
    app.route("/").get((req, res)=>{
        try{
            res.send(`${req.query.name}`);
            console.log(req);
        }catch(e){
            console.error(e.message);
        }
    })
    
    const FILE_PATH = "\\tmp\\assets";
    // export const FILE_PATH = "..\\src\\temp\\assets";
    
    
    const introductionMessage:string = `
    <strong>This telegram bot is still under development</strong>
    
    <b>Commands</b>
    /start
    /yo - Typing or tapping in /yo should log your first name and a random text
    /error - Tap /error if you see anything wrong
    `;
    
    const randomMessages:string[] = [
        "<strong>You're doing amazing things every day. Keep it up!</strong>",
        "<strong>Your effort today is the success of tomorrow. Keep going!</strong>",
        "<strong>The journey may be tough, but so are you!</strong>",
        "<strong>Every step forward is a step toward achieving your goals.</strong>",
        "<strong>You're a star—keep shining brightly!</strong>",
        "<strong>Believe in yourself, and magic will happen.</strong>",
        "<strong>Your kindness and hard work make the world a better place.</strong>",
        "<strong>Challenges are opportunities in disguise. You've got this!</strong>",
        "<strong>Your resilience is your superpower.</strong>",
        "<strong>Your potential is limitless. Don't underestimate yourself!</strong>",
        "<strong>Every small progress is a victory. Celebrate it!</strong>",
        "<strong>Embrace the journey; every step is progress.</strong>",
        "<strong>Today's efforts are tomorrow's achievements.</strong>",
        "<strong>You are stronger than you think. Keep pushing forward!</strong>",
        "<strong>Your positive attitude is contagious. Spread the good vibes!</strong>",
        "<strong>The world is a better place with your unique contribution.</strong>",
        "<strong>You are capable of more than you can imagine.</strong>",
        "<strong>Challenges make you stronger. You're getting stronger every day.</strong>",
        "<strong>Your dreams are within reach. Keep reaching for the stars!</strong>",
        "<strong>You've got the power to turn dreams into reality.</strong>"
    ];
    
    
    
    bot.api.setMyDescription(`
    This telegram bot is still under development
    
    Commands
    /start
    /yo - Typing or tapping in /yo should log your first name and a random text
    /error - Tap /error if you see anything wrong
    `).then(()=>{
        console.log("description set");
    }).catch((e)=>{
        console.error(e.message);
    });
    
    
    bot.api.setMyCommands([
        {command: "start", description: "starts the bot (usage: /start [text])"},
        {command: "mydata", description: "removes custom Keyboard (usage: /myData[text])"},
        {command: "yo", description: "Be greeted by the bot"},
        {command: "error", description: "Enables user to enter send an error message to developer. (usage: /error [text])"},
        {command: "customkeyboard", description: "Start custom Keyboard (usage: /customkeyboard [text])"},
        {command: "removekeyboard", description: "removes custom Keyboard (usage: /removekeyboard [text])"},
    ]).then(()=>{
        console.log("Commands have been set successfully")
    }).catch((error)=>{
        console.error(error.message);
    })
    
    bot.on([":photo", ":video", ":animation"], async (ctx)=>{
        const fileOptions: FileHandling.iFileHandle<MyContext> = {
            ctx: ctx,
            isUrl: false,
            path: FILE_PATH
        }

        
        const myFile = new FileHandling.FileHandle(fileOptions);
        const path2:string = await myFile.downloadFile();
        // console.log(path2);
        ctx.session.userImageUrl = path2;
    })
    
    bot.command("hunger", async (ctx)=>{
        // console.log(ctx?.from);
        // console.log(ctx?.session);
        await ctx.reply(`Your hunger level is !`);
    });
    
    bot.hears(/.*🍕.*/, (ctx)=>{
        ctx.reply("I hear you");
    });
    
    bot.command("yo", (ctx:CommandContext<MyContext>):void=>{
        const randIndex:number = Math.floor(Math.random() * randomMessages.length);
    
        console.log(ctx.message.text);
        ctx.reply(`Yo ${ctx.from?.first_name} Hello World\n ${randomMessages[randIndex]}`, {parse_mode: "HTML"});
    });
    
    
    
    const issuesURLKeyboard:InlineKeyboard = new InlineKeyboard()
    .url(
        "create a new issue",
        "https://github.com/obedNuertey1/telegram-ai-image-chatbot/issues"
    )
    
    
    bot.command("error", (ctx:CommandContext<MyContext>)=>{
        console.log(ctx.session);
        ctx.reply(
            `
            <strong><i>${ctx.from?.first_name} Please visit the link below to tell me about the problem by creating an issue on this particular github project</i></strong>
            `,
            {
                reply_markup: issuesURLKeyboard,
                parse_mode: "HTML"
            }
        )
    })
    
    const rootMenuText:string = `Create AI masterpieces from selfies with [Ubaid AI](https://not-found-random-names.com) on Android and IOS. Explore 🚀[Ubaid AI](https://not-found-random-names.com)`;
    
     const labels = [
        "This is button1",
        "This is button2",
        "This is button3"
    ];
    const keyboardButtons = labels.map((label)=> [Keyboard.text(label)])
    const keyboard:Keyboard = Keyboard.from(keyboardButtons).resized().oneTime().placeholder("This is custom keyboard");
    
    bot.command("customkeyboard", (ctx:CommandContext<MyContext>)=>{
        ctx.reply("Opened Custom Keyboard", {
            reply_markup: keyboard
        });
    });
    
    bot.command("removekeyboard", (ctx:CommandContext<MyContext>)=>{
        ctx.reply(
            `Removed custom keyboard`,
            {
                reply_markup: {remove_keyboard: true}
            }
        )
    });
    
    // Issue #18
     const paymentOptionMenu: Menu<MyContext> = new Menu<MyContext>("payment-option-menu")
    .dynamic((_:MyContext, range:MenuRange<MyContext>)=>{
        const buttons:string[][] = [["🍎Apple Pay/🤖Google Pay", "Apple and Google"], ["💳PayPal", "paypal"]];
    
    
        for(let i=0; i<buttons.length; i++){
            range.text(buttons[i][0], (ctx)=>ctx.reply(buttons[i][1])).row()
        }
    });
    bot.use(paymentOptionMenu)
    
    
    // Issue #18
    interface IreplyOptions{
        parse_mode: string;
        reply_markup: Menu<MyContext> | null;
    }
    // Issue #18
     function replyInput(text:string, reply_markup:Menu<MyContext>|null=null, parse_mode:string='HTML'): (string | IreplyOptions)[]{
        const options:IreplyOptions = {parse_mode, reply_markup}
        console.log(Object.values({text, options}));
        return Object.values({text, options});
    }
    
    
    
     function rootOptionsDynamicFunc(_: MyContext, range: MenuRange<MyContext>):MenuRange<MyContext>{
        const buttons:string[][] = [
            ["🎨Menu", "menu-page-1"]
        ]
        for(let i=0; i<buttons.length; i++){
            range.submenu(buttons[i][0], buttons[i][1]);
        }
    
        const editedMessageMarkup:string = `
        Your current balance: 79 credits\n\n🌟 Buy Credits for More Magic! 🌟\n- More images: 1 Credit = 1 Image\n- No watermarks\n- Clear, unblurred images\n- Access to NSFW 🔞
        `; 
        range.text(
            "💰 Balance", 
            (ctx)=>{
                ctx.menu.nav('balance-page')
                ctx.editMessageText(editedMessageMarkup)
            }
        )
        return range;
    }
    
    const rootOptions: Menu<MyContext> = new Menu<MyContext>("main-menu");
    rootOptions.dynamic(rootOptionsDynamicFunc).row().text(
        "➡️Next Image⬅️",
        (ctx)=> ctx.reply(`➡️Next Image⬅️ has been clicked`)
    );
    
    
     function balanceMenuDynamicFunc(_: MyContext, range: MenuRange<MyContext>):MenuRange<MyContext>{
        const buttons:string[][] = [["🔥 Lifetime Unlimited - $29.99 🔥", "$29.99"], ["200 credits - $19.99", "$19.99"], ["50 credits - $9.99", "$9.99"], ["🎁 Get 10 free credits", "free"]];
        let replyItems: (string | IreplyOptions)[] = replyInput("Select a payment method:", paymentOptionMenu);// Issue #18
        
        for(let i=0; i < buttons.length; i++){
            if(buttons[i][1] == "free"){
                range.text(buttons[i][0], (ctx) => ctx.reply(
                    `🎉 Earn 10 credits for every friend you invite!\n\n🌟 Share this link: https://t.me/obd_sample_bot?start=referral_${ctx.from?.id}`,
                    {
                        parse_mode: "HTML"
                    }
                )).row()
                continue;
            }
            range.text(buttons[i][0], (ctx) => ctx.reply(replyItems[0] as string, replyItems[1] as any)).row()// Issue #18
        }
        return range;
    }
    
    const balanceMenu: Menu<MyContext> = new Menu<MyContext>('balance-page')
    .dynamic(balanceMenuDynamicFunc)
    .text(
        "⬅️ Back",
        (ctx)=>{
            ctx.menu.nav("main-menu");
            ctx.editMessageText(rootMenuText, {parse_mode: "Markdown"})
        }
    );
    
    
     async function sendPhoto(ctx: MyContext){
        try{
            let userId = (ctx?.from.id).toString();
            let file1 = `${__dirname}${FILE_PATH}\\${userId}.jpg`;
    
            console.log(`fs.existsSync(file1)=${fs.existsSync(file1)}`);
            if(!fs.existsSync(file1)){
                file1 = `${__dirname}${FILE_PATH}\\${userId}.png`;
            }
    
            if(!fs.existsSync(file1)){
                file1 = `${__dirname}${FILE_PATH}\\${userId}.jpeg`;
            }
    
            if(!fs.existsSync(file1)){
                return false
            }
        
            const photo = InputMediaBuilder.photo(new InputFile(file1), {
                caption: `${ctx?.from.first_name} this is the image you served earlier`
            });
            await ctx.reply('loading...');
            await ctx.replyWithMediaGroup([photo]);
            return file1;
        }catch(e){
            throw new Error(e.message);
        }
    }
    
     function menuPage1DynamicFunc(_: MyContext, range: MenuRange<MyContext>):MenuRange<MyContext>{
        const buttons:string[] = ["❤️ Romantic", "👗 Fashion", "🌟 Celebrity", "🏀 Sport", "🍿 Bollywood", "🕉 Hindu", "🕌 Muslim", "🌍 World Culture", "🍎 School", "🔥🔞 NSFW"];
    
    
        for(let i=0; i<buttons.length; i++){
            if(i%2 == 1){
                range.text(buttons[i], async (ctx)=>{
                    let photo = await sendPhoto(ctx);
                    if(!photo){
                        return ctx.reply(`Please upload an image and continue`);
                    }
                    await ctx.reply(`${buttons[i]} has been clicked`)
                }).row();
                continue
            }
            range.text(buttons[i], async (ctx)=> {
                let photo = await sendPhoto(ctx);
                if(!photo){
                    return ctx.reply(`Please upload an image and continue`);
                }
                await ctx.reply(`${buttons[i]} has been clicked`)
            });
        }
        return range;
    }
    const menuPage1: Menu<MyContext> = new Menu<MyContext>("menu-page-1");
    menuPage1.dynamic(menuPage1DynamicFunc).row()
    .submenu("Next >>", "menu-page-2").row()
    .back("⬅️ Back");
    
    
     function menuPage2DynamicFunc(_:MyContext, range:MenuRange<MyContext>):MenuRange<MyContext>{
        const buttons: string[] = ["🎄 Christmas", "🎬 Movies", "🎲 Random", "✈️ Travel", "⚡️ Harry Potter", "🎸 Music", "😂 Meme", "💾 Retro", "🚹🚺 Set Sex", "👋🏻👋🏾 Set Skin Color"];
        for(let i=0; i<buttons.length; i++){
            if(i%2 === 1){
                range.text(buttons[i], async (ctx)=>{
                    let photo = await sendPhoto(ctx);
                    if(!photo){
                        return ctx.reply(`Please upload an image and continue`);
                    }
                    await ctx.reply(`${buttons[i]} has been clicked`);
                }).row();
                continue
            }
            range.text(buttons[i], async (ctx)=> {
                let photo = await sendPhoto(ctx);
                if(!photo){
                    return ctx.reply(`Please upload an image and continue`);
                }
                ctx.reply(`${buttons[i]} has been clicked`)
            });
        }
    
        return range;
    }
    
    const menuPage2: Menu<MyContext> = new Menu<MyContext>("menu-page-2");
    menuPage2.dynamic(menuPage2DynamicFunc).row()
    .text(
        "<< previous",
        async (ctx)=>{
            await ctx.menu.nav("menu-page-1", {immediate: true})
        }
    ).row()
    .text(
        "⬅️ Back",
        async (ctx)=>{
            await ctx.menu.nav("main-menu", {immediate: true});
        }
    );
    
    rootOptions.register(menuPage1);
    rootOptions.register(balanceMenu);
    menuPage1.register(menuPage2);
    
    bot.use(rootOptions);
    
    bot.command("start", async (ctx:CommandContext<MyContext>)=>{
        try{

            const userData = await User.findOne({key: /\d*/});
            console.log(userData);
            // console.log(ctx.from);
            console.log("This is the session data");
            // console.log(ctx?.session);
            ctx.session.first_name = ctx?.from.first_name;
            ctx.session.last_name = ctx?.from.last_name;
            ctx.session.is_bot = ctx?.from.is_bot;
            ctx.session.username = ctx?.from.username;
            ctx.session.language_code = ctx?.from.language_code;
            ctx.session.points = 12;
        
            await ctx.reply(
                rootMenuText,
                {
                    parse_mode: "Markdown"
                }
            );
        
            await ctx.reply(
                `
                Create Your Custom Image:\n- Choose a style from the Menu.\n- Describe your dream photo, like 'with purple hair and a leather jacket'.\n- Or, upload a selfie for a new look!
                `,
                {
                    reply_markup: rootOptions,
                    parse_mode: "HTML"
                }
            )
        }catch(e){
            console.error(e.message);
        }
    
    });


    bot.command("mydata", async (ctx)=>{
        ctx.reply(`This is your data ${ctx?.from.first_name} \n ${JSON.stringify(ctx.session)}`)
    })
    
    
    if(process.env.NODE_ENV === "production"){
        // Use Webhooks for the production server
        bot.catch((err) => console.error(err.message));
        bot.start();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, ()=>{
            console.log(`Bot listening on port ${PORT}`);
        });
    }else{
        // start the bot
        bot.catch((err) => console.error(err.message));
        bot.start();
    }
}
main();



