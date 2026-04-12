import { Plugin } from "@elizaos/core";
import { runComputeJob } from "./actions/RunComputeJob";
import { NosanaProvider } from "./providers/nosanaClient";
import { jobStatusEvaluator } from "./evaluators/JobStatusEvaluator";

/**
 * Nosana AI Forge Plugin for ElizaOS
 * 
 * Provides:
 * - RUN_Nosana_COMPUTE: Intelligent GPU task orchestration
 * - NosanaProvider: SDK context management
 * - jobStatusEvaluator: Continuous lifecycle monitoring
 */
export const NosanaPlugin: Plugin = {
    name: "Nosana-plugin",
    description: "Advanced autonomous GPU compute orchestration on the Nosana network.",
    actions: [runComputeJob],
    providers: [NosanaProvider],
    evaluators: [jobStatusEvaluator],
    services: []
};

export default NosanaPlugin;
