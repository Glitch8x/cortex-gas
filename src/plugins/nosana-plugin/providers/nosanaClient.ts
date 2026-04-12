import { Provider, Memory, State } from "@elizaos/core";
import { createCortexClient, CortexNetwork } from "@nosana/kit";

/**
 * Provides an initialized Nosana client to the agent runtime.
 */
export const NosanaProvider: Provider = {
    name: "cortex-provider" as any,
    get: (async (runtime: any, _message: Memory, _state?: State) => {
        const apiKey = runtime.getSetting("Nosana_API_KEY");
        const networkStr = runtime.getSetting("Nosana_NETWORK") || "mainnet";
        const network = networkStr === "devnet" ? CortexNetwork.DEVNET : CortexNetwork.MAINNET;

        if (!apiKey) {
            return null;
        }

        try {
            const client = createCortexClient(network, {
                api: { apiKey: apiKey as string }
            });
            return client;
        } catch (error) {
            console.error("Failed to initialize Nosana client:", error);
            return null;
        }
    }) as any
};
