import { NosanaJobDefinition } from "../types/Types";

export const JobTemplates: Record<string, (input: string) => NosanaJobDefinition> = {
    "stable-diffusion": (prompt: string) => ({
        version: "0.1",
        type: "container",
        ops: [{
            type: "container/run",
            id: "sdxl-gen",
            args: {
                image: "nosana/stable-diffusion-xl:latest",
                cmd: ["python", "generate.py", "--prompt", prompt],
            },
        }],
    }),
    "whisper": (audioUrl: string) => ({
        version: "0.1",
        type: "container",
        ops: [{
            type: "container/run",
            id: "whisper-transcribe",
            args: {
                image: "nosana/whisper-large-v3:latest",
                cmd: ["whisper", audioUrl, "--model", "large-v3"],
            },
        }],
    }),
    "llama-3-8b": (message: string) => ({
        version: "0.1",
        type: "container",
        ops: [{
            type: "container/run",
            id: "llama-infer",
            args: {
                image: "nosana/llama-3-8b-instruct:latest",
                cmd: ["python", "infer.py", "--prompt", message],
            },
        }],
    }),
    "monte-carlo": (params: string) => ({
        version: "0.1",
        type: "container",
        ops: [{
            type: "container/run",
            id: "gas-sim",
            args: {
                image: "nosana/monte-carlo-gas:latest",
                cmd: ["python", "simulate.py", "--params", params],
            },
        }],
    }),
};

export function findTemplate(task: string): string | null {
    const lowerTask = task.toLowerCase();
    if (lowerTask.includes("image") || lowerTask.includes("draw") || lowerTask.includes("generate")) return "stable-diffusion";
    if (lowerTask.includes("audio") || lowerTask.includes("transcribe") || lowerTask.includes("whisper")) return "whisper";
    if (lowerTask.includes("gas") || lowerTask.includes("optimize") || lowerTask.includes("arbitrage") || lowerTask.includes("path")) return "monte-carlo";
    if (lowerTask.includes("llama") || lowerTask.includes("ai") || lowerTask.includes("text")) return "llama-3-8b";
    return null;
}
