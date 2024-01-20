import {config} from "dotenv";
import {Api, Bot, CommandContext, Context, RawApi, Keyboard, webhookCallback, InlineKeyboard} from "grammy";
import type{Variant as TextEffectVariant} from "./textEffects";
import express from "express";
import {Menu} from "@grammyjs/menu";

config();

const bot:Bot<Context, Api<RawApi>> = new Bot(process.env.BOT_TOKEN || "");

const app = express();
app.use(express.json());
app.use(webhookCallback(bot, "express"));



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
`);

bot.api.setMyCommands([
    {command: "start", description: "starts the bot (usage: /start [text])"},
    {command: "yo", description: "Be greeted by the bot"},
    {command: "error", description: "Enables user to enter send an error message to developer. (usage: /error [text])"},
    {command: "customkeyboard", description: "Start custom Keyboard (usage: /customkeyboard [text])"},
    {command: "removekeyboard", description: "removes custom Keyboard (usage: /removekeyboard [text])"},
])


// bot.command("start", (ctx:CommandContext<Context>):void=>{
//     ctx.reply(introductionMessage, {
//         parse_mode: "HTML"
//     })
// })

bot.command("yo", (ctx:CommandContext<Context>):void=>{
    const randIndex:number = Math.floor(Math.random() * randomMessages.length);

    console.log(ctx.message.text);
    ctx.reply(`Yo ${ctx.from?.first_name} Hello World\n ${randomMessages[randIndex]}`, {parse_mode: "HTML"});
});



const issuesURLKeyboard:InlineKeyboard = new InlineKeyboard()
.url(
    "create a new issues",
    "https://github.com/obedNuertey1/telegram-ai-image-chatbot/issues"
)


bot.command("error", (ctx:CommandContext<Context>)=>{
    ctx.reply(
        `
        <strong><i>${ctx.from?.first_name} Please visit the link below to tell me about the problem by creating an issue on this particular github project</i></strong>
        `,
        {
            reply_markup: issuesURLKeyboard
        }
    )
})


const labels = [
    "This is button1",
    "This is button2",
    "This is button3"
];
const keyboardButtons = labels.map((label)=> [Keyboard.text(label)])
const keyboard:Keyboard = Keyboard.from(keyboardButtons).resized().oneTime().placeholder("This is custom keyboard");

bot.command("customkeyboard", (ctx:CommandContext<Context>)=>{
    ctx.reply("Opened Custom Keyboard", {
        reply_markup: keyboard
    });
});

bot.command("removekeyboard", (ctx:CommandContext<Context>)=>{
    ctx.reply(
        `Removed custom keyboard`,
        {
            reply_markup: {remove_keyboard: true}
        }
    )
});


if(process.env.NODE_ENV === "production"){
    // Use Webhooks for the production server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=>{
        console.log(`Bot listening on port ${PORT}`);
    });
}else{
    // start the bot
    bot.start();
}