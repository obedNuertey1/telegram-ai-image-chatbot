import { config } from "dotenv";
import express from "express";
import cors from "cors";

config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// @ts-ignore
app.get("/", (req, res)=>{
    res.send("<h1>Welcome to the Home page</h1>");
});

// @ts-ignore
app.get("/next", (req, res)=>{
    res.send("<h1>Welcome to the next page</h1>");
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
});