import {Task} from "../tasks";
import {solve, trySolve} from "../../solver";
import OpenAI from "openai";
import env from "../../env";
import {ApiResponse} from "../../api";

type Res = ApiResponse<{ input: string[], question: string }>

(async () => {
    await solve(Task.inprompt, async (res: Res) => {
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });

        const nameQuestion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Every time user sends you the sentence, respond with the name mentioned in the sentence. Remember that names are written with capital case!`

                },
                {
                    role: "user",
                    content: res.question
                }
            ]
        })

        const name = nameQuestion.choices[0].message.content!

        const nameRelatedQuestions = res.input.filter(q => q.includes(name))

        const answeringQuestion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are assistant who responds to the questions about person only by using the knowledge from the following context: ${nameRelatedQuestions.join(", ")}`,

                },
                {
                    role: "user",
                    content: res.question
                }
            ]
        })

        const answer = answeringQuestion.choices[0].message.content!

        return answer
    })
})()
