import {solve, trySolve} from "./solver";
import {Task} from "./tasks/tasks";

(async () => {
    await solve(Task.helloapi)
})()
