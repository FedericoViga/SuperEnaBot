import { Telegraf } from "telegraf";

export function createBot(token) {
  return new Telegraf(token);
}
