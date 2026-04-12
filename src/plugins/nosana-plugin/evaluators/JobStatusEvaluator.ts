import { Evaluator, Memory, State } from "@elizaos/core";
import { createNosanaClient, NosanaNetwork } from "@nosana/kit";

/**
 * Periodically evaluates the status of running Nosana jobs.
 * This ensures the agent "notices" when a job is done and can proactively ping the user.
 */
export const jobStatusEvaluator: Evaluator = {
    name: "CHECK_Nosana_JOB_STATUS",
    similes: ["MONITOR_GPU_JOBS", "POLL_Nosana_NETWORK", "VERIFY_TASK_COMPLETION"],
    description: "Evaluates whether dispatched Nosana jobs are completed or still running.",
    
    validate: async (runtime: any, _message: Memory) => {
        // Only run if we have a Nosana API key
        return !!runtime.getSetting("Nosana_API_KEY");
    },

    handler: async (runtime: any, _message: Memory, _state?: State): Promise<any> => {
        const apiKey = runtime.getSetting("Nosana_API_KEY") as string;
        const client = createNosanaClient(NosanaNetwork.MAINNET, {
            api: { apiKey: apiKey || "" }
        });

        try {
            // Mocking a lookup for the last submitted job
            const activeJobId = "some_job_id"; 
            
            return { success: true, text: `Monitoring job ${activeJobId}` };
        } catch (error) {
            console.error("Job status check failed:", error);
            return { success: false, text: "Status check failed" };
        }
    },
    
    examples: [
        {
            context: "A Nosana job was recently submitted.",
            messages: [
                {
                    user: "{{agentName}}",
                    content: { text: "I'll let you know once the image generation is complete." },
                },
            ],
            outcome: "CHECK_Nosana_JOB_STATUS is triggered to monitor the background task.",
        },
    ] as any,
};
