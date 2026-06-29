import {config} from "dotenv";
config();

// Gemeni Api key , Misteral Api key COHERE_API Key 
// type will be string 


type CONFIG = {
    readonly GEMENI_API_KEY: string;
    readonly MISTERAL_API_KEY: string;
    readonly COHERE_API_KEY: string;
}


const appconfig: CONFIG = {
    GEMENI_API_KEY: process.env.GEMENI_API_KEY || "",
    MISTERAL_API_KEY: process.env.MISTERAL_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
};


export default appconfig;