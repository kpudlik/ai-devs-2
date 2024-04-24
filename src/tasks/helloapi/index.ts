import {Task} from "../tasks";
import {trySolve} from "../../solver";
import {ApiResponse} from "../../api";

type Input = ApiResponse<{ cookie: string }>

(async () => {
    await trySolve(Task.helloapi, async (input: Input) => {
        return input.cookie
    })
})()
