import {config} from "dotenv";
import {Api, Bot, Context, InlineKeyboard, RawApi} from "grammy";

config();

// Create a bot using the Telegram token
const bot:Bot<Context, Api<RawApi>> = new Bot(process.env.BOT_TOKEN || "");

const introductionMessage:string = `
This telegram bot is under development

<b>Commands</b>
/yo - Typing or tapping in /yo should log your first name and a random text
/error - Tap or /error if you see anything wrong
`


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

const replyWithIntro = (ctx:any):void => {
    ctx.reply(introductionMessage, {
        parse_mode: "HTML",
    });
}


const issuesURLKeyboard:InlineKeyboard = new InlineKeyboard().url(
    "create an new issue",
    "https://github.com/obedNuertey1/telegram-ai-image-chatbot/issues"
);


bot.command('error', (ctx:any):void=>{
    ctx.reply(`
    <strong><i>${ctx.from?.first_name} Please visit the link below to tell me about the problem by creating an issue on this particular github project</i></strong>
    `, {
        reply_markup: issuesURLKeyboard,
        parse_mode: "HTML"
    })
});

bot.command('start', replyWithIntro);
bot.command("yo", (ctx:any):void=>{
    const randIndex:number = Math.floor(Math.random() * randomMessages.length);

    console.log(ctx.message.text);
    ctx.reply(`Yo ${ctx.from?.first_name} Hello World\n ${randomMessages[randIndex]}`, {parse_mode: "html"});
});

bot.on('message', replyWithIntro);
bot.start();
