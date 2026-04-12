import { Action, IAgentRuntime, Memory, State, HandlerCallback } from "@elizaos/core";

export interface NosanaJobDefinition {
    version?: string;
    type?: string;
    meta?: Record<string, any>;
    ops: Array<{
        type: string;
        id: string;
        args: {
            image: string;
            cmd?: string[];
            env?: Record<string, string>;
        };
    }>;
}

export interface NosanaPluginConfig {
    apiKey?: string;
    network?: "mainnet" | "testnet";
    market?: string;
}
