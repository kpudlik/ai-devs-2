import {Task} from "../tasks";
import {solve, trySolve} from "../../solver";
import OpenAI from "openai";
import env from "../../env";
import {ApiResponse} from "../../api";

type Res = ApiResponse<{ input: string[] }>

(async () => {
    await trySolve(Task.moderation, async (res: Res) => {
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });

        const moderationResult = await openai.moderations.create({
            model: "text-moderation-latest",
            input: res.input
        })

        return moderationResult.results.map(({flagged}) => flagged ? 1 : 0)
    })
})()
