import { input } from '@inquirer/prompts';
import {getTask, getToken, postAnswer} from "./api";

(async () => {
    const apikey = process.env.API_KEY

    if (apikey) {
        const taskname = await input({ message: 'taskname:' })

        const { token } = await getToken(apikey, taskname)
        const task = await getTask<any>(token)
        console.log(task)
        const answer = await input({ message: 'answer:'})
        const res = await postAnswer(answer, token)
        console.log(res)
    } else {
        throw new Error('Missing API key');
    }
})()
