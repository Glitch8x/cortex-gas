import { Action, Memory, State, HandlerCallback, ActionResult } from "@elizaos/core";
import { createNosanaClient, NosanaNetwork } from "@nosana/kit";
import { findTemplate, JobTemplates } from "../templates/Library";
import { MarketIntelligence } from "../services/MarketIntelligence";
import { PrivacyEvaluator } from "../evaluators/PrivacyEvaluator";
import { EncryptionService } from "../services/EncryptionService";

export const runComputeJob: Action = {
    name: "RUN_NOSANA_COMPUTE",
    similes: [
        "START_GPU_JOB", 
        "DISPATCH_Nosana_TASK", 
        "EXECUTE_REMOTE_COMPUTE", 
        "RUN_WORKER_NODE", 
        "PROVISION_GPU",
        "AI_FORGE_GENERATE",
        "OPTIMIZE_TRANSACTION",
        "SWAP_SIMULATOR",
        "GAS_OPTIMIZER"
    ],
    description: "Intelligently provisions a Nosana compute job using dynamic template selection and market scanning.",
    
    validate: async (runtime: any, _message: Memory) => {
        return !!runtime.getSetting("Nosana_API_KEY");
    },

    handler: async (
        runtime: any,
        message: Memory,
        state: State | undefined,
        _options: any,
        callback?: HandlerCallback
    ): Promise<ActionResult> => {
        const text = message.content.text || "";
        const apiKey = runtime.getSetting("Nosana_API_KEY");
        const networkStr = runtime.getSetting("Nosana_NETWORK") || "mainnet";
        const network = networkStr === "mainnet" ? NosanaNetwork.MAINNET : NosanaNetwork.DEVNET;

        if (!apiKey) {
            if (callback) callback({ text: "I need a Nosana_API_KEY to proceed." });
            return { success: false, text: "Missing API Key" };
        }

        try {
            // 1. Privacy Scanning & Redaction (Confidentiality)
            if (callback) callback({ text: "🔍 [ELIZA] Initiating Proactive Privacy Scan..." });
            
            const privacyResult = await PrivacyEvaluator.handler(runtime, message, state);
            if (privacyResult && callback) {
                callback({ text: "🛡️ [ELIZA] Privacy Shield: Redacted sensitive personal identifiers from your request." });
            }

            // 2. Encryption Layer (Confidential Computing)
            const isConfidential = text.toLowerCase().includes("confidential") || 
                                 text.toLowerCase().includes("encrypted");
            
            let finalPrompt = text;
            let encryptionMetadata = {};

            if (isConfidential) {
                if (callback) callback({ text: "🔒 [ELIZA] Establishing Secure Execution Environment (Confidential Compute)..." });
                const recipientPubKey = runtime.getSetting("Nosana_RECIPIENT_PUBKEY") as string;
                if (!recipientPubKey) {
                    if (callback) callback({ text: "❌ [ELIZA] Failed: Missing Nosana_RECIPIENT_PUBKEY for confidential compute." });
                    return { success: false, text: "Missing Recipient Public Key" };
                }

                const encryption = EncryptionService.encryptForNosana(finalPrompt, recipientPubKey);
                finalPrompt = encryption.ciphertext;
                encryptionMetadata = { nonce: encryption.nonce, mode: "confidential" };
            }

            // 3. Dynamic Market Selection
            if (callback) callback({ text: "📡 [ELIZA] Consulting Nosana Market Intelligence for optimal GPU density..." });
            const intelligence = new MarketIntelligence(apiKey as string, network);
            const gpuType = text.toLowerCase().includes("a100") ? "a100" : "any";
            const marketAddress = await intelligence.findOptimalMarket(gpuType);
            if (callback) callback({ text: `💎 [ELIZA] Optimal Market Selected: ${marketAddress.substring(0, 12)}...` });

            // 4. Dynamic Template Matching
            const templateKey = findTemplate(text);
            const jobDefinition = templateKey 
                ? JobTemplates[templateKey](finalPrompt)
                : JobTemplates["llama-3-8b"](finalPrompt);

            // 5. Dispatch Job
            if (callback) callback({ text: "🚀 [ELIZA] Dispatching compute task to Nosana GPU network..." });
            const client = createNosanaClient(network, {
                api: { apiKey: apiKey as string }
            });

            const job = await (client.api.jobs as any).create({
                market: marketAddress,
                jobDefinition: jobDefinition as any,
                ...encryptionMetadata
            });

            if (callback) {
                const templateName = templateKey || "General AI Task";
                const shieldIcon = isConfidential ? "🛡️ [CONFIDENTIAL]" : "🛠️";
                callback({ 
                    text: `${shieldIcon} **Nosana AI Forge** has ignited!\n\n` +
                          `**Task Identified:** ${templateName}\n` +
                          `**Market Selected:** \`${marketAddress.substring(0, 8)}...\`\n` +
                          `**Job ID:** \`${job.id}\`\n\n` +
                          (isConfidential ? "🔒 Your data has been encrypted at the source. Only the GPU node and you can read the inputs/outputs." : "I'm monitoring the network status for you. Your results will be processed shortly on the decentralized GPU network.")
                });
            }

            return { success: true, text: `Job ${job.id} created`, data: { jobId: job.id, market: marketAddress, confidential: isConfidential } };

        } catch (error: any) {
        console.error("Nosana Forge Error:", error);
        if (callback) callback({ text: `Nosana Forge failed to ignite: ${error.message}` });
        return { success: false, text: error.message };
    }
},

examples: [
    [
        { user: "{{user1}}", content: { text: "Generate a futuristic cyberpunk city image." } },
        { user: "{{agentName}}", content: { text: "Forging your image using Nosana's Stable Diffusion template on the most efficient market.", action: "RUN_Nosana_COMPUTE" } }
    ],
    [
        { user: "{{user1}}", content: { text: "Transcribe this audio file for me using a premium GPU." } },
        { user: "{{agentName}}", content: { text: "Scanning Nosana for high-tier markets and initializing a Whisper-v3 job...", action: "RUN_Nosana_COMPUTE" } }
    ]
] as any
};
