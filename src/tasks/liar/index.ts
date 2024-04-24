import {Task, Token} from "../tasks";
import {solve, trySolve} from "../../solver";
import OpenAI from "openai";
import env from "../../env";
import {ApiResponse, postQuestion} from "../../api";

type Res = ApiResponse<{ hint1: string, hint2: string, hint3: string }>

(async () => {
    await solve(Task.liar, async (res: Res, token: Token) => {

        const question = "What is the capital of Poland?"

        const form = new FormData()
        form.append('question', question)

        const answerRes = await postQuestion<{ answer: string }>(token, form)

        const prompt = `Is it true that the answer for "${question}" is "${answerRes.answer}"?`

        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You can only answer YES or NO."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        })

        return chatResponse.choices[0].message.content
    })
})()
