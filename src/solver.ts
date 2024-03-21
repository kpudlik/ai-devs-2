import {getTask, getToken, postAnswer} from "./api";
import {Task} from "./tasks/tasks";
import {helloapi} from "./tasks/helloapi";
import chalk from "chalk";

const toPrettyJson = <T>(str: T) => JSON.stringify(str, null, 2)

export const readTask = async (task: Task) => {
    const token = await getToken(task)
    const input = await getTask(token)
    console.log(`Reading task: ${chalk.green(task)}`)
    console.log(`Input: ${chalk.white(input)}`)
}

export const trySolve = async (task: Task) => {
    const token = await getToken(task)
    const input = await getTask(token)
    console.log(`Trying to solve: ${chalk.green(task)}`)
    console.log(`Input: ${chalk.white(toPrettyJson(input))}`)
    const answer = await makeAnswer(task, input)
    console.log(`Answer: ${chalk.yellow(answer)}`)
}

export const solve = async (task: Task) => {
    try {
        const token = await getToken(task)
        const input = await getTask(token)
        console.log(`Solving: ${chalk.green(task)}`)
        console.log(`Input: ${chalk.white(toPrettyJson(input))}`)
        const answer = await makeAnswer(task, input)
        console.log(`Answer: ${chalk.yellow(answer)}`)
        const res = await postAnswer(answer, token)
        console.log(`Result: ${chalk.green(toPrettyJson(res))}`)
    } catch (e) {
        console.error(chalk.red(e))
    }
}

export const makeAnswer = async (task: Task, input: {}) => {
    switch (task) {
        case Task.helloapi:
            return await helloapi(input)
        default:
            task satisfies never;
    }
}
