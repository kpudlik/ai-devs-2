import axios, {AxiosResponse} from "axios";
import {Task, Token} from "./tasks/tasks";
import env from "./env";

export type ApiResponse<T> = {
    code: 0,
    msg: string
} & T

class NonZeroCodeError extends Error {
    res: AxiosResponse<any>

    constructor(res: AxiosResponse<any>) {
        super("Response returned non-zero code")
        Object.setPrototypeOf(this, new.target.prototype);
        this.res = res
    }
}


const client = axios.create({
    baseURL: 'https://tasks.aidevs.pl',
})
client.interceptors.response.use(res => {
    if (res.data in res && res.data?.code != 0) {
        throw new NonZeroCodeError(res)
    }
    return res
})
export const getToken = async (taskName: Task) => {
    const {data: {token}} = await client.post<ApiResponse<{
        token: Token
    }>>(`/token/${taskName}`, {apikey: env.API_KEY})
    return token as Token
}


export const getTask = async <T>(token: Token) => {
    const {data} = await client.get<ApiResponse<T>>(`task/${token}`)
    return data
}

export const postQuestion = async <T>(token: Token, body: any) => {
    const {data} = await client.post<ApiResponse<T>>(`task/${token}`, body)
    return data
}

export const postAnswer = async (answer: string, token: Token) => {
    const {data} = await client.post(`/answer/${token}`, {answer})
    return data
}

