import {Task, Token} from "../tasks";
import {solve, trySolve} from "../../solver";
import OpenAI from "openai";
import env from "../../env";
import {ApiResponse} from "../../api";
import * as fs from "fs";
import * as Path from "path";

type Res = ApiResponse<{ hint: string }>

(async () => {
    await solve(Task.whisper, async (res: Res, token: Token) => {
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });

        const mp3UrlResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You should find url in user's message and return the url and only url."
                },
                {
                    role: "user",
                    content: res.msg
                }
            ]
        })

        const url = mp3UrlResponse.choices[0].message.content!
        const file = await fetch(url)

        const chatResponse = await openai.audio.transcriptions.create({
            model: "whisper-1",
            file
        })

        return chatResponse.text
    })
})()
