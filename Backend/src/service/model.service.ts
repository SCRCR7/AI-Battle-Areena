import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere"


import appconfig from "../config/config.js";

export const gemeniModel = new ChatGoogle({
    model:"gemini-2.5-flash",
    apiKey: appconfig.GEMENI_API_KEY,
});



export const misteralModel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey:appconfig.MISTERAL_API_KEY,
});





export const cohereModel = new ChatCohere({
     model: "command-a-03-2025",
    apiKey: appconfig.COHERE_API_KEY,
})
