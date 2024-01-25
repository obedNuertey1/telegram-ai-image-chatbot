"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const grammy_1 = require("grammy");
const textEffects_js_1 = require("textEffects.js");
const express_1 = __importDefault(require("express"));
const menu_1 = require("@grammyjs/menu");
(0, dotenv_1.config)();
const bot = new grammy_1.Bot(process.env.BOT_TOKEN || "");
const introductionMessage = `
This telegram bot is under development

<b>Commands</b>
/effect
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
const replyWithIntro = (ctx) => {
    ctx.reply(introductionMessage, {
        parse_mode: "HTML",
    });
};
const issuesURLKeyboard = new grammy_1.InlineKeyboard().url("create a new issue", "https://github.com/obedNuertey1/telegram-ai-image-chatbot/issues");
bot.command('error', (ctx) => {
    ctx.reply(`
    <strong><i>${ctx.from?.first_name} Please visit the link below to tell me about the problem by creating an issue on this particular github project</i></strong>
    `, {
        reply_markup: issuesURLKeyboard,
        parse_mode: "HTML"
    });
});
bot.command('start', replyWithIntro);
bot.command("yo", (ctx) => {
    const randIndex = Math.floor(Math.random() * randomMessages.length);
    console.log(ctx.message.text);
    ctx.reply(`Yo ${ctx.from?.first_name} Hello World\n ${randomMessages[randIndex]}`, { parse_mode: "HTML" });
});
const allEffects = [
    {
        code: "w",
        label: "Monospace"
    },
    {
        code: "b",
        label: "Bold"
    },
    {
        code: "i",
        label: "Italic"
    },
    {
        code: "d",
        label: "Doublestruck"
    },
    {
        code: "o",
        label: "Circle"
    },
    {
        code: "q",
        label: "Squared"
    }
];
const queryRegEx = /effect (monospace|bold|italic) (.*)/;
bot.inlineQuery(queryRegEx, async (ctx) => {
    const fullQuery = ctx.inlineQuery.query;
    const fullQueryMatch = fullQuery.match(queryRegEx);
    if (!fullQueryMatch)
        return;
    const effectLabel = fullQueryMatch[1];
    const originalText = fullQueryMatch[2];
    const effectCode = allEffects.find((effect) => effect.label.toLowerCase() === effectLabel.toLowerCase())?.code;
    const modifiedText = (0, textEffects_js_1.applyTextEffect)(originalText, effectCode);
    await ctx.answerInlineQuery([
        {
            type: "article",
            id: "text-effect",
            title: "Text Effects",
            input_message_content: {
                message_text: `Original: ${originalText}
        Modified: ${modifiedText}`,
                parse_mode: "HTML",
            },
            reply_markup: new grammy_1.InlineKeyboard().switchInline("Share", fullQuery),
            url: "https://t.me/obd_sample_bot",
            description: "Create stylish Unicode text, all within Telegram.",
        },
    ], { cache_time: 30 * 24 * 3600 });
});
const inlineKeyboard1 = new grammy_1.InlineKeyboard()
    .text("<< 1", "first")
    .text(", < 3", "prev")
    .text(". 4 .", "stay")
    .text("31 >>", "last");
const inlineKeyboard1First = new grammy_1.InlineKeyboard()
    .text("1", "effect1")
    .text("2", "effect2")
    .text("3", "effect3")
    .text("4", "effect4")
    .row()
    .text("5", "effect5")
    .text("6", "effect6")
    .text("7", "effect7")
    .text("8", "effect8")
    .row()
    .text("9", "effect9")
    .text("10", "effect10")
    .row()
    .text("11", "effect11");
bot.command("first", (ctx) => {
    ctx.reply(`<strong>${ctx.message.text} This is an inline keyboard</strong>`, {
        parse_mode: "HTML",
        reply_markup: inlineKeyboard1First
    });
});
bot.command("inlineKeys", (ctx) => {
    ctx.reply(`<strong>${ctx.message.text} This is an inline keyboard</strong>`, {
        parse_mode: "HTML",
        reply_markup: inlineKeyboard1
    });
});
const labelDataPairs = [
    ["<< 1", "first"],
    ["< 3", "prev"],
    [". 4 .", "stay"],
    ["5 >", "next"],
    ["31 >>", "last"]
];
const buttonRow = labelDataPairs
    .map(([label, data]) => grammy_1.InlineKeyboard.text(label, data));
const keyboard = grammy_1.InlineKeyboard.from([buttonRow]);
bot.command("inline2", (ctx) => {
    ctx.reply(`<strong>${ctx.message.text} This is an inline keyboard</strong>`, {
        parse_mode: "HTML",
        reply_markup: keyboard
    });
});
const keyboard2 = new grammy_1.Keyboard()
    .text("Yes, they certainly are").row()
    .text("I'm not quite sure").row()
    .text("No. 😈")
    .resized().oneTime().placeholder("Decide now!").selected();
const labels = [
    "Yes, they certainly are",
    "I'm not quite sure",
    "No. 😈"
];
const buttonRows = labels
    .map((label) => ([grammy_1.Keyboard.text(label)]));
const keyboard3 = grammy_1.Keyboard.from(buttonRows).resized();
bot.command("customkeyboard", (ctx) => {
    ctx.reply('<strong>This is a custom keyboard</strong>', {
        parse_mode: "HTML",
        reply_markup: keyboard2
    });
});
bot.command("removekeyboard", (ctx) => {
    ctx.reply(`<strong>Removed custom keyboard</strong>`, {
        parse_mode: "HTML",
        reply_markup: { remove_keyboard: true }
    });
});
bot.api.setMyCommands([
    { command: "yo", description: "Be greeted by the bot" },
    { command: "effect", description: "Apply text effects on the text. (usage: /effect [text])" },
    { command: "customkeyboard", description: "Start a custom Keyboard (usage: /customKeyboard [text])" },
    { command: "removekeyboard", description: "Removes custom Keyboard (usage: /removekeyboard [text])" }
]);
const menu = new menu_1.Menu("my-menu-identifier")
    .text("A", (ctx) => ctx.reply("You pressed A!")).row()
    .text("B", (ctx) => ctx.reply("You pressed B!"));
bot.use(menu);
bot.command("mymenu", async (ctx) => {
    await ctx.reply("Check out this menu:", { reply_markup: menu });
});
const menu2 = new menu_1.Menu("movements")
    .text("^", (ctx) => ctx.reply("Forward!")).row()
    .text("<", (ctx) => ctx.reply("Left!"))
    .text(">", (ctx) => ctx.reply("Right!")).row()
    .text("v", (ctx) => ctx.reply("Backwords!"));
bot.use(menu2);
bot.command("mymenu2", async (ctx) => {
    await ctx.reply("Check out this second menu:", {
        reply_markup: menu2
    });
});
const menu3 = new menu_1.Menu("greet-me")
    .text((ctx) => `Greet ${ctx.from?.first_name ?? "me"}!`, (ctx) => ctx.reply(`Hello ${ctx.from.first_name}!`));
bot.use(menu3);
bot.command('mymenu3', async (ctx) => {
    ctx.reply("Check out this third menu:", {
        reply_markup: menu3
    });
});
const notifications = new Set();
function toggleNotifications(id) {
    if (!notifications.delete(id))
        notifications.add(id);
    console.log("notifications");
}
const menu4 = new menu_1.Menu("toggle")
    .text((ctx) => (ctx.from && notifications.has(ctx.from.id)) ? "🔔" : "🔕", (ctx) => {
    toggleNotifications(ctx.from.id);
    ctx.menu.update();
});
bot.use(menu4);
bot.command("mymenu4", (ctx) => {
    ctx.reply("Check out this fourth menu", {
        reply_markup: menu4
    });
});
const menu5 = new menu_1.Menu("time", { onMenuOutdated: false })
    .text(() => new Date().toLocaleString(), async (ctx) => await ctx.menu.close({ immediate: true }));
bot.use(menu5);
bot.command("mymenu5", (ctx) => {
    ctx.reply("Check out this fifth menu", {
        reply_markup: menu5
    });
});
const menu6 = new menu_1.Menu("time2")
    .text("What's the time?", (ctx) => ctx.editMessageText("It is " + new Date().toLocaleString()));
bot.use(menu6);
bot.command("mymenu6", (ctx) => {
    ctx.reply("Check out this sixth menu", {
        reply_markup: menu6
    });
});
const menu7 = new menu_1.Menu("root-menu")
    .text("Welcome", (ctx) => ctx.reply("Hi!")).row()
    .submenu("Credits", "credits-menu");
const settings = new menu_1.Menu("credits-menu")
    .text("Show Credits", (ctx) => ctx.reply("Powered by grammY"))
    .back("Go Back");
menu7.register(settings);
bot.use(menu7);
bot.command("mymenu7", (ctx) => {
    ctx.reply(`Check out this seventh menu`, {
        reply_markup: menu7
    });
});
function generatePayload() {
    return Date.now().toString();
}
const menu8 = new menu_1.Menu("store-current-time-in-payload")
    .text({ text: "ABORT!", payload: generatePayload }, async (ctx) => {
    const text = Date.now() - Number(ctx.match) < 5000
        ? "The operation was canceled successfully." :
        "Too late. Your cat videos have already gone viral on the internet";
    await Promise.all([ctx.editMessageText(text), ctx.reply("**Looks good**", { parse_mode: "Markdown" }), ctx.menu.close()]);
})
    .text("checking something", (ctx) => { ctx.reply("checking something"); });
bot.use(menu8);
bot.command("publish", async (ctx) => {
    await ctx.reply("The videos will be sent. You have 5 seconds to cancel it.", {
        reply_markup: menu8
    });
});
const menu9 = new menu_1.Menu("dynamic");
menu9
    .url("About", "https://grammy.dev/plugins/menu").row()
    .dynamic(() => {
    const range = new menu_1.MenuRange();
    for (let i = 0; i < 3; i++) {
        range.text(i.toString(), (ctx) => ctx.reply(`You chose ${i}`))
            .row();
    }
    return range;
})
    .text("Cancel", (ctx) => ctx.deleteMessage());
bot.use(menu9);
bot.command("mymenu9", (ctx) => {
    ctx.reply("Check out the 9th menu", {
        reply_markup: menu9
    });
});
const menu10 = new menu_1.Menu("dynamic2");
menu10
    .url("About", "https://grammy.dev/plugins/menu").row()
    .dynamic((_, range) => {
    for (let i = 0; i < 3; i++) {
        range
            .text(i.toString(), (ctx) => ctx.reply(`You chose ${i}`))
            .row();
    }
    return range;
}).text("Cancel", (ctx) => ctx.deleteMessage());
bot.use(menu10);
bot.command("mymenu10", (ctx) => {
    ctx.reply("Check out the 10th menu", {
        reply_markup: menu10
    });
});
const menu11 = new menu_1.Menu("id", { onMenuOutdated: "Updated, try now." }).text("me", (ctx) => ctx.reply("Yes"));
const menu12 = new menu_1.Menu("id", {
    onMenuOutdated: async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.reply("Here is a fresh menu", { reply_markup: menu12 });
    }
});
const menu13 = new menu_1.Menu("id", { onMenuOutdated: false });
bot.use((0, grammy_1.session)());
bot.use(menu11);
bot.use(menu12);
bot.use(menu13);
bot.command("mymenu11", (ctx) => {
    ctx.reply("Check out the 11th menu", {
        reply_markup: menu13
    });
});
bot.on('callback_query:data', async (ctx) => {
    const match = ctx?.callbackQuery?.data;
    console.log(match);
    if (match == "first") {
        await ctx.reply(`<strong>Pressed ${match}</strong>`, {
            reply_markup: inlineKeyboard1First,
            parse_mode: "HTML"
        });
    }
});
bot.callbackQuery("first", async (ctx) => {
    await ctx.answerCallbackQuery({
        text: `${JSON.stringify(ctx?.update?.callback_query?.message?.reply_markup?.inline_keyboard)} This is an inline keyboard`
    });
});
if (process.env.NODE_ENV === "production") {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, grammy_1.webhookCallback)(bot, "express"));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}`);
    });
}
else {
    bot.start();
}
