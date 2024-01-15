"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("<h1>Welcome to the Home page</h1>");
});
app.get("/next", (req, res) => {
    res.send("<h1>Welcome to the next page</h1>");
});
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
