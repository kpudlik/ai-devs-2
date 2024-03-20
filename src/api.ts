import axios, {AxiosResponse} from "axios";

const baseUrl = "https://tasks.aidevs.pl"

type ApiErrorResponse = {
    code: number,
    msg: string
}

type ApiSuccessResponse<T> = {
    code: 0,
    msg: string
} & T

type ApiResponse<T> = ApiErrorResponse | ApiSuccessResponse<T>

const isSuccessResponse = <T>(apiRes: ApiResponse<T>): apiRes is ApiSuccessResponse<T> =>
    apiRes.code === 0

const call = async <T>(req: Promise<AxiosResponse<ApiResponse<T>>>) => {
    try {
        const { data: apiRes} = await req

        if (isSuccessResponse(apiRes)) {
            return apiRes
        } else {
            throw new Error(`code=${apiRes.code}, msg=${apiRes.msg}`)
        }
    } catch (e) {
        console.error(`Request failed`, e)
        throw e
    }
}

export const getToken = async (apikey: string, taskName: string) =>
    await call(axios.post<ApiResponse<{ token: string }>>(`${baseUrl}/token/${taskName}`, { apikey }))

export const getTask = async <T>(token: string) =>
    await call(axios.get<ApiResponse<T>>(`${baseUrl}/task/${token}`))

export const postAnswer = async (answer: string, token: string) =>
    await call(axios.post(`${baseUrl}/answer/${token}`, { answer }))
