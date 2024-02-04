import {config} from "dotenv";
import {Api, Bot, CommandContext, Context, InlineKeyboard, Keyboard, RawApi, session, webhookCallback, SessionFlavor, HearsContext} from "grammy";
import {chunk} from "lodash";
import {applyTextEffect, Variant} from "./textEffects";
import type{Variant as TextEffectVariant} from "./textEffects";
import express from "express";
import {Menu, MenuRange} from "@grammyjs/menu";
import { FileFlavor, hydrateFiles } from "@grammyjs/files";
import fs from 'fs';

config();

interface SessionData{
    pizzaCount: number;
}

type MyContext2 = FileFlavor<Context> & Context;
type MyContext = MyContext2 & SessionFlavor<SessionData>;
// Create a bot using the Telegram token
const bot = new Bot<MyContext>(process.env.BOT_TOKEN || "");

bot.api.config.use(hydrateFiles(bot.token));

bot.on([":photo", ":video", ":animation"], async (ctx)=>{
    const path2:string = await downloadFile({ctx, isUrl:true});
    const path:string = await downloadFile({ctx, path:'\\tmp\\assets'});
    console.log(path);
    console.log(path2);
})

async function downloadFile({ctx, isUrl=false, path=""}:any){

    try{
        if(isUrl){// return the telegram url to the uploaded file
            const file = await ctx.getFile();
            return await file.getUrl();
        }

        path = editPath(path);
        if(!fs.existsSync(`${__dirname}${path}`)){
            fs.mkdirSync(`${__dirname}${path}`, {recursive: true})
        }
        const file = await ctx.getFile();
        const fileRegex = /.*(\..*)/;
        let ctxFilePath = file?.file_path;
        let extension = ctxFilePath.match(fileRegex)[1];
        const downloadPath = await file.download(`${__dirname}${path}\\${ctx?.from?.id}${extension}`);
        return downloadPath;
    }catch(e){
        throw new Error(e.message);
    }
}

function editPath(path:string):string{// Removes ./ and / and replaces with \ and returns path
    if(path.includes("./")||path.includes("/")){
        return path.replace(/\.\/|\//g, '\\');
    }
    return path;
}



// Install session middleware, and define the initial session value.
function initial():SessionData{
    return {pizzaCount: 0};
}
bot.use(session({initial}));


bot.command("hunger", async (ctx)=>{
    const count = ctx.session.pizzaCount;
    console.log(ctx?.from);
    await ctx.reply(`Your hunger level is ${count}!`);
});

bot.hears(/.*🍕.*/, (ctx)=>{
    ctx.session.pizzaCount++;
    ctx.reply("I hear you");
});

bot.start();

// const introductionMessage:string = `
// This telegram bot is under development

// <b>Commands</b>
// /effect
// /yo - Typing or tapping in /yo should log your first name and a random text
// /error - Tap /error if you see anything wrong
// `


// const randomMessages:string[] = [
//     "<strong>You're doing amazing things every day. Keep it up!</strong>",
//     "<strong>Your effort today is the success of tomorrow. Keep going!</strong>",
//     "<strong>The journey may be tough, but so are you!</strong>",
//     "<strong>Every step forward is a step toward achieving your goals.</strong>",
//     "<strong>You're a star—keep shining brightly!</strong>",
//     "<strong>Believe in yourself, and magic will happen.</strong>",
//     "<strong>Your kindness and hard work make the world a better place.</strong>",
//     "<strong>Challenges are opportunities in disguise. You've got this!</strong>",
//     "<strong>Your resilience is your superpower.</strong>",
//     "<strong>Your potential is limitless. Don't underestimate yourself!</strong>",
//     "<strong>Every small progress is a victory. Celebrate it!</strong>",
//     "<strong>Embrace the journey; every step is progress.</strong>",
//     "<strong>Today's efforts are tomorrow's achievements.</strong>",
//     "<strong>You are stronger than you think. Keep pushing forward!</strong>",
//     "<strong>Your positive attitude is contagious. Spread the good vibes!</strong>",
//     "<strong>The world is a better place with your unique contribution.</strong>",
//     "<strong>You are capable of more than you can imagine.</strong>",
//     "<strong>Challenges make you stronger. You're getting stronger every day.</strong>",
//     "<strong>Your dreams are within reach. Keep reaching for the stars!</strong>",
//     "<strong>You've got the power to turn dreams into reality.</strong>"
// ];

// const replyWithIntro = (ctx:any):void => {
//     ctx.reply(introductionMessage, {
//         parse_mode: "HTML",
//     });
// }


// const issuesURLKeyboard:InlineKeyboard = new InlineKeyboard().url(
//     "create a new issue",
//     "https://github.com/obedNuertey1/telegram-ai-image-chatbot/issues"
// );




// bot.command('error', (ctx:any):void=>{
//     ctx.reply(`
//     <strong><i>${ctx.from?.first_name} Please visit the link below to tell me about the problem by creating an issue on this particular github project</i></strong>
//     `, {
//         reply_markup: issuesURLKeyboard,
//         parse_mode: "HTML"
//     })
// });

// bot.command('start', replyWithIntro);
// bot.command("yo", (ctx:any):void=>{
//     const randIndex:number = Math.floor(Math.random() * randomMessages.length);

//     console.log(ctx.message.text);
//     ctx.reply(`Yo ${ctx.from?.first_name} Hello World\n ${randomMessages[randIndex]}`, {parse_mode: "HTML"});
// });

// // ############### Part 2 - InlineQueries ##################
// type Effect = {code: TextEffectVariant; label: string};
// const allEffects:Effect[] = [
//     {
//         code: "w",
//         label: "Monospace"
//     },
//     {
//         code: "b",
//         label: "Bold"
//     },
//     {
//         code: "i",
//         label: "Italic"
//     },
//     {
//         code: "d",
//         label: "Doublestruck"
//     },
//     {
//         code: "o",
//         label: "Circle"
//     },
//     {
//         code: "q",
//         label: "Squared"
//     }
// ];

// const queryRegEx = /effect (monospace|bold|italic) (.*)/;

// bot.inlineQuery(queryRegEx, async (ctx)=>{
//     const fullQuery = ctx.inlineQuery.query;
//     const fullQueryMatch = fullQuery.match(queryRegEx);
//     if (!fullQueryMatch) return;

//     const effectLabel = fullQueryMatch[1];
//     const originalText = fullQueryMatch[2];

//     const effectCode = allEffects.find(
//         (effect)=> effect.label.toLowerCase() === effectLabel.toLowerCase()
//     )?.code;
//     const modifiedText = applyTextEffect(originalText, effectCode as Variant);

//     await ctx.answerInlineQuery(
//         [
//             {
//                 type: "article",
//                 id: "text-effect",
//                 title: "Text Effects",
//                 input_message_content: {
//                     message_text: `Original: ${originalText}
//         Modified: ${modifiedText}`,
//                     parse_mode: "HTML",
//                 },
//                 reply_markup: new InlineKeyboard().switchInline("Share", fullQuery),
//                 url: "https://t.me/obd_sample_bot",
//                 description: "Create stylish Unicode text, all within Telegram.",
//             },
//         ],
//         { cache_time: 30 * 24 * 3600 } // one month in seconds
//     );
// });


// // ############### Inline and Custom Keyboards(built-in) #######################
// const inlineKeyboard1:InlineKeyboard = new InlineKeyboard()
// .text("<< 1", "first")
// .text(", < 3", "prev")
// .text(". 4 .", "stay")
// .text("31 >>", "last")

// const inlineKeyboard1First:InlineKeyboard = new InlineKeyboard()
// .text("1", "effect1")
// .text("2", "effect2")
// .text("3", "effect3")
// .text("4", "effect4")
// .row()
// .text("5", "effect5")
// .text("6", "effect6")
// .text("7", "effect7")
// .text("8", "effect8")
// .row()
// .text("9", "effect9")
// .text("10", "effect10")
// .row()
// .text("11", "effect11")


// bot.command("first", (ctx:any):void=>{
//     ctx.reply(`<strong>${ctx.message.text} This is an inline keyboard</strong>`,{
//         parse_mode: "HTML",
//         reply_markup: inlineKeyboard1First
//     })
// })
// // const regEx =  /.*(effect\d)/;


// bot.command("inlineKeys", (ctx) => {

//     ctx.reply(
//         `<strong>${ctx.message.text} This is an inline keyboard</strong>`,
//         {
//             parse_mode: "HTML",
//             reply_markup: inlineKeyboard1
//         }
//     );
// });

// const labelDataPairs = [
//     ["<< 1", "first"],
//     ["< 3", "prev"],
//     [". 4 .", "stay"],
//     ["5 >", "next"],
//     ["31 >>", "last"]
// ];
// const buttonRow = labelDataPairs
// .map(([label, data])=> InlineKeyboard.text(label, data))

// const keyboard = InlineKeyboard.from([buttonRow])
// bot.command("inline2", (ctx:any):void=>{
//     ctx.reply(`<strong>${ctx.message.text} This is an inline keyboard</strong>`,{
//         parse_mode: "HTML",
//         reply_markup: keyboard
//     })
// })



// // ############## Building Custom Keyboards ###########
// const keyboard2 = new Keyboard()
// .text("Yes, they certainly are").row()
// .text("I'm not quite sure").row()
// .text("No. 😈")
// .resized().oneTime().placeholder("Decide now!").selected();

// // Turning an array of keyboard buttons to string
// const labels = [
//     "Yes, they certainly are",
//     "I'm not quite sure",
//     "No. 😈"
// ];

// const buttonRows = labels
// .map((label)=>([Keyboard.text(label)]));

// const keyboard3 = Keyboard.from(buttonRows).resized();

// bot.command("customkeyboard", (ctx)=>{
//     ctx.reply(
//         '<strong>This is a custom keyboard</strong>',
//         {
//             parse_mode: "HTML",
//             reply_markup: keyboard2
//         }
//     )
// });

// bot.command("removekeyboard", (ctx)=>{
//     ctx.reply(
//         `<strong>Removed custom keyboard</strong>`,
//         {
//             parse_mode: "HTML",
//             reply_markup: {remove_keyboard: true}
//         }
//     )
// });




// bot.api.setMyCommands([
//     {command: "yo", description: "Be greeted by the bot"},
//     {command: "effect", description: "Apply text effects on the text. (usage: /effect [text])"},
//     {command: "customkeyboard", description: "Start a custom Keyboard (usage: /customKeyboard [text])"},
//     {command: "removekeyboard", description: "Removes custom Keyboard (usage: /removekeyboard [text])"}
// ])


// // ****************** Interactive menus *************start

// // create a simple menu.
// const menu: Menu<Context> = new Menu<Context>("my-menu-identifier")
// .text("A", (ctx) => ctx.reply("You pressed A!")).row()
// .text("B", (ctx) => ctx.reply("You pressed B!"));

// // Make the menu interactive.
// bot.use(menu);

// bot.command("mymenu", async (ctx)=>{
//     // Send the menu.
//     await ctx.reply(
//         "Check out this menu:",
//         {reply_markup: menu}
//     );
// });

// // ############## Adding Buttons ###############
// const menu2: Menu<Context> = new Menu<Context>("movements")
// .text("^", (ctx)=>ctx.reply("Forward!")).row()
// .text("<", (ctx)=>ctx.reply("Left!"))
// .text(">", (ctx)=>ctx.reply("Right!")).row()
// .text("v", (ctx)=> ctx.reply("Backwords!"));

// bot.use(menu2);

// bot.command("mymenu2", async(ctx)=>{
//     await ctx.reply(
//         "Check out this second menu:",
//         {
//             reply_markup: menu2
//         }
//     )
// })

// // ############## Dynamic Labels #################
// const menu3: Menu<Context> = new Menu<Context>("greet-me")
// .text(
//     (ctx) => `Greet ${ctx.from?.first_name ?? "me"}!`, // dynamic label
//     (ctx) => ctx.reply(`Hello ${ctx.from.first_name}!`), // handler
// );

// bot.use(menu3);

// bot.command('mymenu3', async(ctx)=>{
//     ctx.reply("Check out this third menu:",
//     {
//         reply_markup: menu3
//     }
//     )
// })


// // Set of user identifiers that have notifications enabled.
// const notifications = new Set<number>();

// function toggleNotifications(id: number){
//     if(!notifications.delete(id)) notifications.add(id)
//     console.log("notifications")
// }



// const menu4: Menu<Context> = new Menu<Context>("toggle")
// .text(
//     (ctx) => (ctx.from && notifications.has(ctx.from.id)) ? "🔔" : "🔕",
//     (ctx) => {
//         toggleNotifications(ctx.from.id as number);
//         ctx.menu.update();
//     },
// );


// bot.use(menu4);

// bot.command("mymenu4", (ctx: CommandContext<Context>)=>{
//     ctx.reply(
//         "Check out this fourth menu",
//         {
//             reply_markup: menu4
//         }
//     )
// })


// // ############# Updating or Closing the menu ###########
// const menu5: Menu<Context> = new Menu<Context>("time", {onMenuOutdated: false})
// .text(
//     () => new Date().toLocaleString(),
//     async (ctx) => await ctx.menu.close({immediate: true}),
//     // async (ctx) => await ctx.menu.update({immediate: true}),
// );

// bot.use(menu5);

// bot.command("mymenu5", (ctx:CommandContext<Context>)=>{
//     ctx.reply(
//         "Check out this fifth menu",
//         {
//             reply_markup: menu5
//         }
//     );
// });

// // ######## Part 2 Updating the menu
// const menu6: Menu<Context> = new Menu<Context>("time2")
// .text(
//     "What's the time?",
//     (ctx) => ctx.editMessageText("It is " + new Date().toLocaleString())
// );

// bot.use(menu6);

// bot.command("mymenu6", (ctx:CommandContext<Context>)=>{
//     ctx.reply(
//         "Check out this sixth menu",
//         {
//             reply_markup: menu6
//         }
//     );
// });



// // ################### Navigation Between Menus #############
// const menu7: Menu<Context> = new Menu<Context>("root-menu")
// .text("Welcome", (ctx)=> ctx.reply("Hi!")).row()
// .submenu("Credits", "credits-menu");

// const settings: Menu<Context> = new Menu<Context>("credits-menu")
// .text("Show Credits", (ctx)=> ctx.reply("Powered by grammY"))
// .back("Go Back");

// menu7.register(settings /*, "optionally-set-a-different-parent"*/)

// bot.use(menu7);

// bot.command("mymenu7", (ctx: CommandContext<Context>)=>{
//     ctx.reply(
//         `Check out this seventh menu`,
//         {
//             reply_markup: menu7
//         }
//     )
// })



// // ################## Payloads ########################
// function generatePayload(){
//     return Date.now().toString();
// }

// const menu8: Menu<Context> = new Menu<Context>("store-current-time-in-payload")
// .text(
//     {text: "ABORT!", payload: generatePayload},
//     async (ctx)=>{
//         // Give the user 5 seconds to undo. Get payload in ctx.match
//         const text = Date.now() - Number(ctx.match) < 5000
//         ? "The operation was canceled successfully.":
//         "Too late. Your cat videos have already gone viral on the internet"
//         // await ctx.editMessageText(text);
//         // await ctx.reply("**Looks good**", {parse_mode: "Markdown"});
//         // await ctx.menu.close({immediate: true})
//         await Promise.all([ctx.editMessageText(text), ctx.reply("**Looks good**", {parse_mode: "Markdown"}), ctx.menu.close()]);
//     },
// )
// .text("checking something", (ctx)=>{ctx.reply("checking something")})
// ;

// bot.use(menu8);
// bot.command("publish", async (ctx)=>{
//     await ctx.reply(
//         "The videos will be sent. You have 5 seconds to cancel it.",{
//             reply_markup: menu8
//         }
//     )
// });


// // ################ Dynamic Range #######################
// const menu9: Menu<Context> = new Menu<Context>("dynamic");
// menu9
// .url("About", "https://grammy.dev/plugins/menu").row()
// .dynamic(()=>{
//     // Generate a part of the menu dynamically!
//     const range = new MenuRange();
//     for(let i = 0; i < 3; i++){
//         range.text(i.toString(), (ctx) => ctx.reply(`You chose ${i}`))
//         .row();
//     }
//     return range;
// })
// .text("Cancel", (ctx)=> ctx.deleteMessage());

// bot.use(menu9);

// bot.command("mymenu9", (ctx:CommandContext<Context>)=>{
//     ctx.reply(
//         "Check out the 9th menu",
//         {
//             reply_markup: menu9
//         }
//     )
// })

// // ######## Dynamic Range Part 2
// const menu10: Menu<Context> = new Menu<Context>("dynamic2");
// menu10
// .url("About", "https://grammy.dev/plugins/menu").row()
// .dynamic((_, range)=>{
//     for(let i = 0; i < 3; i++){
//         range // no need for 'new MenuRange()' or a 'return'
//         .text(i.toString(), (ctx)=>ctx.reply(`You chose ${i}`))
//         .row();
//     }
//     return range;
// }).text("Cancel", (ctx)=> ctx.deleteMessage());

// bot.use(menu10);
// bot.command("mymenu10", (ctx: CommandContext<Context>)=>{
//     ctx.reply(
//         "Check out the 10th menu",
//         {
//             reply_markup: menu10
//         }
//     );
// });

// // ###### Outdated Menus and Fingerprints ######

// // Custom message to be displayed
// const menu11: Menu<Context> = new Menu("id", {onMenuOutdated: "Updated, try now."}).text("me", (ctx)=>ctx.reply("Yes"));

// // Custom handler function
// const menu12: Menu<Context> = new Menu<Context>("id", {
//     onMenuOutdated: async (ctx) => {
//         await ctx.answerCallbackQuery();
//         await ctx.reply("Here is a fresh menu", {reply_markup: menu12})
//     }
// })

// const menu13: Menu<Context> = new Menu<Context>("id", {onMenuOutdated: false});
// bot.use(session())
// bot.use(menu11);
// bot.use(menu12);
// bot.use(menu13);

// bot.command("mymenu11", (ctx: CommandContext<Context>)=>{
//     ctx.reply(
//         "Check out the 11th menu",
//         {
//             reply_markup: menu13
//         }
//     )
// });


// // ####### Outdated Menus and Fingerprints (Use fingerprints function to handle outdated menus)

// // ************************************************end








// bot.on('callback_query:data', async (ctx) => {
//     const match = ctx?.callbackQuery?.data;
//     console.log(match)
//     if(match == "first"){
//         await ctx.reply(`<strong>Pressed ${match}</strong>`,{
//             reply_markup: inlineKeyboard1First,
//             parse_mode: "HTML"
//         })
//     }
// })

// bot.callbackQuery("first", async (ctx:any)=>{
//     // console.log(ctx);
//     await ctx.answerCallbackQuery(
//         {
//             text: `${JSON.stringify(ctx?.update?.callback_query?.message?.reply_markup?.inline_keyboard)} This is an inline keyboard`
//         }
//     );
// })

// // Deploying to a real server
// if(process.env.NODE_ENV === "production"){
//     // Use Webhooks for the production server
//     const app = express();
//     app.use(express.json());
//     app.use(webhookCallback(bot, "express"));

//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, ()=>{
//         console.log(`Bot listening on port ${PORT}`)
//     })

// }else{
//     // bot.on('message', replyWithIntro);
//     bot.start();
// }


