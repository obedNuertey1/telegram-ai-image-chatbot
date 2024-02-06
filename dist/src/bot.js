"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuPage2DynamicFunc = exports.menuPage1DynamicFunc = exports.sendPhoto = exports.balanceMenuDynamicFunc = exports.rootOptionsDynamicFunc = exports.replyInput = exports.paymentOptionMenu = exports.labels = exports.FILE_PATH = exports.initial = void 0;
const dotenv_1 = require("dotenv");
const grammy_1 = require("grammy");
const express_1 = __importDefault(require("express"));
const menu_1 = require("@grammyjs/menu");
const files_1 = require("@grammyjs/files");
const FileHandling_1 = __importDefault(require("./namespaces/FileHandling"));
const fs_1 = __importDefault(require("fs"));
(0, dotenv_1.config)();
const bot = new grammy_1.Bot(process.env.BOT_TOKEN || "");
bot.api.config.use((0, files_1.hydrateFiles)(bot.token));
function initial() {
    return { pizzaCount: 0 };
}
exports.initial = initial;
bot.use((0, grammy_1.session)({ initial }));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, grammy_1.webhookCallback)(bot, "express"));
exports.FILE_PATH = "\\tmp\\assets";
const introductionMessage = `
<strong>This telegram bot is still under development</strong>

<b>Commands</b>
/start
/yo - Typing or tapping in /yo should log your first name and a random text
/error - Tap /error if you see anything wrong
`;
const randomMessages = [
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
    { command: "start", description: "starts the bot (usage: /start [text])" },
    { command: "yo", description: "Be greeted by the bot" },
    { command: "error", description: "Enables user to enter send an error message to developer. (usage: /error [text])" },
    { command: "customkeyboard", description: "Start custom Keyboard (usage: /customkeyboard [text])" },
    { command: "removekeyboard", description: "removes custom Keyboard (usage: /removekeyboard [text])" },
]);
bot.on([":photo", ":video", ":animation"], async (ctx) => {
    const fileOptions = {
        ctx: ctx,
        isUrl: false,
        path: exports.FILE_PATH
    };
    const myFile = new FileHandling_1.default.FileHandle(fileOptions);
    const path2 = await myFile.downloadFile();
    console.log(path2);
});
bot.command("hunger", async (ctx) => {
    const count = ctx.session.pizzaCount;
    await ctx.reply(`Your hunger level is ${count}!`);
});
bot.hears(/.*🍕.*/, (ctx) => {
    ctx.session.pizzaCount++;
    ctx.reply("I hear you");
});
bot.command("yo", (ctx) => {
    const randIndex = Math.floor(Math.random() * randomMessages.length);
    console.log(ctx.message.text);
    ctx.reply(`Yo ${ctx.from?.first_name} Hello World\n ${randomMessages[randIndex]}`, { parse_mode: "HTML" });
});
const issuesURLKeyboard = new grammy_1.InlineKeyboard()
    .url("create a new issue", "https://github.com/obedNuertey1/telegram-ai-image-chatbot/issues");
bot.command("error", (ctx) => {
    ctx.reply(`
        <strong><i>${ctx.from?.first_name} Please visit the link below to tell me about the problem by creating an issue on this particular github project</i></strong>
        `, {
        reply_markup: issuesURLKeyboard,
        parse_mode: "HTML"
    });
});
const rootMenuText = `Create AI masterpieces from selfies with [Ubaid AI](https://not-found-random-names.com) on Android and IOS. Explore 🚀[Ubaid AI](https://not-found-random-names.com)`;
exports.labels = [
    "This is button1",
    "This is button2",
    "This is button3"
];
const keyboardButtons = exports.labels.map((label) => [grammy_1.Keyboard.text(label)]);
const keyboard = grammy_1.Keyboard.from(keyboardButtons).resized().oneTime().placeholder("This is custom keyboard");
bot.command("customkeyboard", (ctx) => {
    ctx.reply("Opened Custom Keyboard", {
        reply_markup: keyboard
    });
});
bot.command("removekeyboard", (ctx) => {
    ctx.reply(`Removed custom keyboard`, {
        reply_markup: { remove_keyboard: true }
    });
});
exports.paymentOptionMenu = new menu_1.Menu("payment-option-menu")
    .dynamic((_, range) => {
    const buttons = [["🍎Apple Pay/🤖Google Pay", "Apple and Google"], ["💳PayPal", "paypal"]];
    for (let i = 0; i < buttons.length; i++) {
        range.text(buttons[i][0], (ctx) => ctx.reply(buttons[i][1])).row();
    }
});
bot.use(exports.paymentOptionMenu);
function replyInput(text, reply_markup = null, parse_mode = 'HTML') {
    const options = { parse_mode, reply_markup };
    console.log(Object.values({ text, options }));
    return Object.values({ text, options });
}
exports.replyInput = replyInput;
function rootOptionsDynamicFunc(_, range) {
    const buttons = [
        ["🎨Menu", "menu-page-1"]
    ];
    for (let i = 0; i < buttons.length; i++) {
        range.submenu(buttons[i][0], buttons[i][1]);
    }
    const editedMessageMarkup = `
    Your current balance: 79 credits\n\n🌟 Buy Credits for More Magic! 🌟\n- More images: 1 Credit = 1 Image\n- No watermarks\n- Clear, unblurred images\n- Access to NSFW 🔞
    `;
    range.text("💰 Balance", (ctx) => {
        ctx.menu.nav('balance-page');
        ctx.editMessageText(editedMessageMarkup);
    });
    return range;
}
exports.rootOptionsDynamicFunc = rootOptionsDynamicFunc;
const rootOptions = new menu_1.Menu("main-menu");
rootOptions.dynamic(rootOptionsDynamicFunc).row().text("➡️Next Image⬅️", (ctx) => ctx.reply(`➡️Next Image⬅️ has been clicked`));
function balanceMenuDynamicFunc(_, range) {
    const buttons = [["🔥 Lifetime Unlimited - $29.99 🔥", "$29.99"], ["200 credits - $19.99", "$19.99"], ["50 credits - $9.99", "$9.99"], ["🎁 Get 10 free credits", "free"]];
    let replyItems = replyInput("Select a payment method:", exports.paymentOptionMenu);
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i][1] == "free") {
            range.text(buttons[i][0], (ctx) => ctx.reply(`🎉 Earn 10 credits for every friend you invite!\n\n🌟 Share this link: https://t.me/obd_sample_bot?start=referral_${ctx.from?.id}`, {
                parse_mode: "HTML"
            })).row();
            continue;
        }
        range.text(buttons[i][0], (ctx) => ctx.reply(replyItems[0], replyItems[1])).row();
    }
    return range;
}
exports.balanceMenuDynamicFunc = balanceMenuDynamicFunc;
const balanceMenu = new menu_1.Menu('balance-page')
    .dynamic(balanceMenuDynamicFunc)
    .text("⬅️ Back", (ctx) => {
    ctx.menu.nav("main-menu");
    ctx.editMessageText(rootMenuText, { parse_mode: "Markdown" });
});
async function sendPhoto(ctx) {
    try {
        let userId = (ctx?.from.id).toString();
        let file1 = `${__dirname}${exports.FILE_PATH}\\${userId}.jpg`;
        console.log(`fs.existsSync(file1)=${fs_1.default.existsSync(file1)}`);
        if (!fs_1.default.existsSync(file1)) {
            file1 = `${__dirname}${exports.FILE_PATH}\\${userId}.png`;
        }
        if (!fs_1.default.existsSync(file1)) {
            file1 = `${__dirname}${exports.FILE_PATH}\\${userId}.jpeg`;
        }
        if (!fs_1.default.existsSync(file1)) {
            return false;
        }
        const photo = grammy_1.InputMediaBuilder.photo(new grammy_1.InputFile(file1), {
            caption: `${ctx?.from.first_name} this is the image you served earlier`
        });
        await ctx.reply('loading...');
        await ctx.replyWithMediaGroup([photo]);
        return file1;
    }
    catch (e) {
        throw new Error(e.message);
    }
}
exports.sendPhoto = sendPhoto;
function menuPage1DynamicFunc(_, range) {
    const buttons = ["❤️ Romantic", "👗 Fashion", "🌟 Celebrity", "🏀 Sport", "🍿 Bollywood", "🕉 Hindu", "🕌 Muslim", "🌍 World Culture", "🍎 School", "🔥🔞 NSFW"];
    for (let i = 0; i < buttons.length; i++) {
        if (i % 2 == 1) {
            range.text(buttons[i], async (ctx) => {
                let photo = await sendPhoto(ctx);
                if (!photo) {
                    return ctx.reply(`Please upload an image and continue`);
                }
                await ctx.reply(`${buttons[i]} has been clicked`);
            }).row();
            continue;
        }
        range.text(buttons[i], async (ctx) => {
            let photo = await sendPhoto(ctx);
            if (!photo) {
                return ctx.reply(`Please upload an image and continue`);
            }
            await ctx.reply(`${buttons[i]} has been clicked`);
        });
    }
    return range;
}
exports.menuPage1DynamicFunc = menuPage1DynamicFunc;
const menuPage1 = new menu_1.Menu("menu-page-1");
menuPage1.dynamic(menuPage1DynamicFunc).row()
    .submenu("Next >>", "menu-page-2").row()
    .back("⬅️ Back");
function menuPage2DynamicFunc(_, range) {
    const buttons = ["🎄 Christmas", "🎬 Movies", "🎲 Random", "✈️ Travel", "⚡️ Harry Potter", "🎸 Music", "😂 Meme", "💾 Retro", "🚹🚺 Set Sex", "👋🏻👋🏾 Set Skin Color"];
    for (let i = 0; i < buttons.length; i++) {
        if (i % 2 === 1) {
            range.text(buttons[i], async (ctx) => {
                let photo = await sendPhoto(ctx);
                if (!photo) {
                    return ctx.reply(`Please upload an image and continue`);
                }
                await ctx.reply(`${buttons[i]} has been clicked`);
            }).row();
            continue;
        }
        range.text(buttons[i], async (ctx) => {
            let photo = await sendPhoto(ctx);
            if (!photo) {
                return ctx.reply(`Please upload an image and continue`);
            }
            ctx.reply(`${buttons[i]} has been clicked`);
        });
    }
    return range;
}
exports.menuPage2DynamicFunc = menuPage2DynamicFunc;
const menuPage2 = new menu_1.Menu("menu-page-2");
menuPage2.dynamic(menuPage2DynamicFunc).row()
    .text("<< previous", async (ctx) => {
    await ctx.menu.nav("menu-page-1", { immediate: true });
}).row()
    .text("⬅️ Back", async (ctx) => {
    await ctx.menu.nav("main-menu", { immediate: true });
});
rootOptions.register(menuPage1);
rootOptions.register(balanceMenu);
menuPage1.register(menuPage2);
bot.use(rootOptions);
bot.command("start", async (ctx) => {
    console.log(ctx);
    console.log(ctx.from);
    await ctx.reply(rootMenuText, {
        parse_mode: "Markdown"
    });
    await ctx.reply(`
        Create Your Custom Image:\n- Choose a style from the Menu.\n- Describe your dream photo, like 'with purple hair and a leather jacket'.\n- Or, upload a selfie for a new look!
        `, {
        reply_markup: rootOptions,
        parse_mode: "HTML"
    });
});
if (process.env.NODE_ENV === "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}`);
    });
}
else {
    bot.start();
}
