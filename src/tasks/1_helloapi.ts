import {getTask, getToken, postAnswer} from "../api";

export const helloapi = async () => {
    const apikey = process.env.API_KEY
    const task = "helloapi"
    if (apikey) {
        const { token } = await getToken(apikey, task)
        const { cookie} = await getTask<{ cookie: string }>(token)
        const res = await postAnswer(cookie, token)
        console.log(`Task ${task}`, res)
    }
}


