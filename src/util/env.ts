import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config();
const path = `${__dirname}/../../.env`;
// console.log(resolve(path));
dotenv.config({ path: path });

export const discordToken = process.env.DISCORD_TOKEN;
export const prefix = process.env.prefix;
export const email = process.env.email;
export const password = process.env.password;
export const botPrefix = process.env.botprefix;
