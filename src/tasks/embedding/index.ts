import {Task, Token} from "../tasks";
import {solve} from "../../solver";
import OpenAI from "openai";
import env from "../../env";
import {ApiResponse} from "../../api";

type Res = ApiResponse<{ hint1: string, hint2: string, hint3: string }>

(async () => {
    await solve(Task.embedding, async (res: Res, token: Token) => {
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });

        const chatResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: "Hawaiian pizza"
        })

        return chatResponse.data[0].embedding
    })
})()
