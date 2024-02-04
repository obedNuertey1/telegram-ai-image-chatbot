"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const grammy_1 = require("grammy");
const files_1 = require("@grammyjs/files");
const fs_1 = __importDefault(require("fs"));
(0, dotenv_1.config)();
const bot = new grammy_1.Bot(process.env.BOT_TOKEN || "");
bot.api.config.use((0, files_1.hydrateFiles)(bot.token));
bot.on([":photo", ":video", ":animation"], async (ctx) => {
    const path2 = await downloadFile({ ctx, isUrl: true });
    const path = await downloadFile({ ctx, path: '\\tmp\\assets' });
    console.log(path);
    console.log(path2);
});
async function downloadFile({ ctx, isUrl = false, path = "" }) {
    try {
        if (isUrl) {
            const file = await ctx.getFile();
            return await file.getUrl();
        }
        path = editPath(path);
        if (!fs_1.default.existsSync(`${__dirname}${path}`)) {
            fs_1.default.mkdirSync(`${__dirname}${path}`, { recursive: true });
        }
        const file = await ctx.getFile();
        const fileRegex = /.*(\..*)/;
        let ctxFilePath = file?.file_path;
        let extension = ctxFilePath.match(fileRegex)[1];
        const downloadPath = await file.download(`${__dirname}${path}\\${ctx?.from?.id}${extension}`);
        return downloadPath;
    }
    catch (e) {
        throw new Error(e.message);
    }
}
function editPath(path) {
    if (path.includes("./") || path.includes("/")) {
        return path.replace(/\.\/|\//g, '\\');
    }
    return path;
}
function initial() {
    return { pizzaCount: 0 };
}
bot.use((0, grammy_1.session)({ initial }));
bot.command("hunger", async (ctx) => {
    const count = ctx.session.pizzaCount;
    console.log(ctx?.from);
    await ctx.reply(`Your hunger level is ${count}!`);
});
bot.hears(/.*🍕.*/, (ctx) => {
    ctx.session.pizzaCount++;
    ctx.reply("I hear you");
});
bot.start();
