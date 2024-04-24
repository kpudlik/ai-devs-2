import {Task} from "../tasks";
import {solve, trySolve} from "../../solver";
import OpenAI from "openai";
import env from "../../env";
import {ApiResponse} from "../../api";

type Res = ApiResponse<{ blog: string[] }>

(async () => {
    await trySolve(Task.blogger, async (res: Res) => {
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `User provides you an JSON array of n article outlines. For each outline write an article explaining the outline which means you should write exactly n articles. Each article should be a separate string in JSON array . For example if user sends ["outline1", "outline2"] then you should answer with following JSON array ["articleForOutline1", "articleForOutline2"]`

                },
                {
                    role: "user",
                    content: res.blog.toString()
                }
            ]
        })
        const result = JSON.parse(chatResponse.choices[0].message.content!)

        return result
    })
})()
