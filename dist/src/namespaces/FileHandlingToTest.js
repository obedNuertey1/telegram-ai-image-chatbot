"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileHandle = void 0;
const FileHandling_1 = __importDefault(require("./FileHandling"));
const ctx = {
    from: { id: 1502217517, first_name: "Obed" },
    reply: (rep) => (rep),
    replyWithMediaGroup: async (arr) => (arr),
    getFile: () => ({
        getUrl: () => ("this is a url"),
        file_path: "path/to/file",
        download: (path) => (path)
    })
};
exports.fileHandle = new FileHandling_1.default.FileHandle({ ctx, isUrl: false, path: "\\tmp\\assets" });
