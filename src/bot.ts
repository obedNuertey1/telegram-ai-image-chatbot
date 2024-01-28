import {config} from "dotenv";
import {Api, Bot, CommandContext, Context, RawApi, Keyboard, webhookCallback, InlineKeyboard} from "grammy";
import express from "express";
import {Menu, MenuRange} from "@grammyjs/menu";

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


bot.command("yo", (ctx:CommandContext<Context>):void=>{
    const randIndex:number = Math.floor(Math.random() * randomMessages.length);

    console.log(ctx.message.text);
    ctx.reply(`Yo ${ctx.from?.first_name} Hello World\n ${randomMessages[randIndex]}`, {parse_mode: "HTML"});
});



const issuesURLKeyboard:InlineKeyboard = new InlineKeyboard()
.url(
    "create a new issue",
    "https://github.com/obedNuertey1/telegram-ai-image-chatbot/issues"
)


bot.command("error", (ctx:CommandContext<Context>)=>{
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

export const labels = [
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

// Issue #18
const paymentOptionMenu: Menu<Context> = new Menu<Context>("payment-option-menu")
.dynamic((_:Context, range:MenuRange<Context>)=>{
    const buttons:string[][] = [["🍎Apple Pay/🤖Google Pay", "Apple and Google"], ["💳PayPal", "paypal"]];


    for(let i=0; i<buttons.length; i++){
        range.text(buttons[i][0], (ctx)=>ctx.reply(buttons[i][1])).row()
    }
});
bot.use(paymentOptionMenu)


// Issue #18
interface IreplyOptions{
    parse_mode: string;
    reply_markup: Menu<Context> | null;
}
// Issue #18
export function replyInput(text:string, reply_markup:Menu<Context>|null=null, parse_mode:string='HTML'): (string | IreplyOptions)[]{
    const options:IreplyOptions = {parse_mode, reply_markup}
    return Object.values({text, options});
}



export function rootOptionsDynamicFunc(_: Context, range: MenuRange<Context>):MenuRange<Context>{
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

const rootOptions: Menu<Context> = new Menu<Context>("main-menu");
rootOptions.dynamic(rootOptionsDynamicFunc).row().text(
    "➡️Next Image⬅️",
    (ctx)=> ctx.reply(`➡️Next Image⬅️ has been clicked`)
);


export function balanceMenuDynamicFunc(_: Context, range: MenuRange<Context>):MenuRange<Context>{
    const buttons:string[][] = [["🔥 Lifetime Unlimited - $29.99 🔥", "$29.99"], ["200 credits - $19.99", "$19.99"], ["50 credits - $9.99", "$9.99"], ["🎁 Get 10 free credits", "free"]];
    let replyItems: (string | IreplyOptions)[] = replyInput("Select a payment method:", paymentOptionMenu);// Issue #18
    
    for(let i=0; i < buttons.length; i++){
        range.text(buttons[i][0], (ctx) => ctx.reply(replyItems[0] as string, replyItems[1] as any)).row()// Issue #18
    }
    return range;
}

const balanceMenu: Menu<Context> = new Menu<Context>('balance-page')
.dynamic(balanceMenuDynamicFunc)
.text(
    "⬅️ Back",
    (ctx)=>{
        ctx.menu.nav("main-menu");
        ctx.editMessageText(rootMenuText, {parse_mode: "Markdown"})
    }
);


export function menuPage1DynamicFunc(_: Context, range: MenuRange<Context>):MenuRange<Context>{
    const buttons:string[] = ["❤️ Romantic", "👗 Fashion", "🌟 Celebrity", "🏀 Sport", "🍿 Bollywood", "🕉 Hindu", "🕌 Muslim", "🌍 World Culture", "🍎 School", "🔥🔞 NSFW"];

    for(let i=0; i<buttons.length; i++){
        if(i%2 == 1){
            range.text(buttons[i], (ctx)=> ctx.reply(`${buttons[i]} has been clicked`)).row();
            continue
        }+
        range.text(buttons[i], (ctx)=> ctx.reply(`${buttons[i]} has been clicked`));
    }
    return range;
}
const menuPage1: Menu<Context> = new Menu<Context>("menu-page-1");
menuPage1.dynamic(menuPage1DynamicFunc).row()
.submenu("Next >>", "menu-page-2").row()
.back("⬅️ Back");


export function menuPage2DynamicFunc(_:Context, range:MenuRange<Context>):MenuRange<Context>{
    const buttons: string[] = ["🎄 Christmas", "🎬 Movies", "🎲 Random", "✈️ Travel", "⚡️ Harry Potter", "🎸 Music", "😂 Meme", "💾 Retro", "🚹🚺 Set Sex", "👋🏻👋🏾 Set Skin Color"];
    for(let i=0; i<buttons.length; i++){
        if(i%2 === 1){
            range.text(buttons[i], (ctx)=> ctx.reply(`${buttons[i]} has been clicked`)).row();
            continue
        }
        range.text(buttons[i], (ctx)=> ctx.reply(`${buttons[i]} has been clicked`));
    }

    return range;
}

const menuPage2: Menu<Context> = new Menu<Context>("menu-page-2");
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

bot.command("start", async (ctx:CommandContext<Context>)=>{
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