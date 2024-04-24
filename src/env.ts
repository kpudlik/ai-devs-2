import {z} from "zod";

const schema = z.object({
    API_KEY: z.string().trim().min(1, "API_KEY is missing!"),
    OPENAI_API_KEY: z.string().trim().min(1, "OPENAI_API_KEY is missing!"),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
    console.error(parsed.error.issues);
    process.exit(1);
}

export default parsed.data
