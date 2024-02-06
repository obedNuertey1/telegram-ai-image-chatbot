"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
var FileHandling;
(function (FileHandling) {
    class FileHandle {
        ctx;
        isUrl = false;
        path = "";
        constructor({ ctx, isUrl = false, path = "" }) {
            this.ctx = ctx;
            this.isUrl = isUrl;
            this.path = path;
        }
        async downloadFile() {
            try {
                if (this.isUrl) {
                    const file = await this.ctx.getFile();
                    return await file.getUrl();
                }
                this.path = this.editPath(this.path);
                if (!fs_1.default.existsSync(`${__dirname}${this.path}`)) {
                    fs_1.default.mkdirSync(`${__dirname}${this.path}`, { recursive: true });
                }
                const file = await this.ctx.getFile();
                const fileRegex = /.*(\..*)/;
                let ctxFilePath = file?.file_path;
                let extension = ctxFilePath.match(fileRegex)[1];
                const downloadPath = await file.download(`${__dirname}${this.path}\\${this.ctx?.from?.id}${extension}`);
                return downloadPath;
            }
            catch (e) {
                console.error(e.message);
            }
        }
        editPath(path) {
            if (path.includes("./") || path.includes("/")) {
                return path.replace(/\.\/|\//g, '\\');
            }
            return path;
        }
    }
    FileHandling.FileHandle = FileHandle;
})(FileHandling || (FileHandling = {}));
exports.default = FileHandling;
