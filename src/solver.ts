import {getTask, getToken, postAnswer} from "./api";
import {Task, Token} from "./tasks/tasks";
import chalk from "chalk";

const toPrettyJson = <T>(str: T) => JSON.stringify(str, null, 2)

export const readTask = async (task: Task) => {
    const token = await getToken(task)
    const input = await getTask(token)
    console.log(`Reading task: ${chalk.green(task)}`)
    console.log(`Input: ${chalk.white(toPrettyJson(input))}`)
}

export const trySolve = async (task: Task, solveFn: (input: any, token: Token) => Promise<any>) => {
    const token = await getToken(task)
    const input = await getTask(token)
    const answer = await solveFn(input, token)
    console.log(`Trying to solve: ${chalk.green(task)}`)
    console.log(`Input: ${chalk.white(toPrettyJson(input))}`)
    console.log(`Answer: ${chalk.yellow(JSON.stringify(answer))}`)
}

export const solve = async (task: Task, solveFn: (input: any, token: Token) => Promise<any>) => {
    try {
        const token = await getToken(task)
        const input = await getTask(token)
        const answer = await solveFn(input, token)
        console.log(`Solving: ${chalk.green(task)}`)
        console.log(`Input: ${chalk.white(toPrettyJson(input))}`)
        console.log(`Answer: ${chalk.yellow(JSON.stringify(answer))}`)
        const res = await postAnswer(answer, token)
        console.log(`Result: ${chalk.green(toPrettyJson(res))}`)
    } catch (e) {
        console.error(chalk.red(e))
    }
}

