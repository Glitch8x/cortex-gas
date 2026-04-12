import { createNosanaClient, NosanaNetwork } from "@nosana/kit";

export interface MarketInfo {
    address: string;
    jobPrice: string;
    nodeCount: number;
    queueTime: string;
}

export class MarketIntelligence {
    private client;

    constructor(apiKey: string, network: NosanaNetwork = NosanaNetwork.MAINNET) {
        this.client = createNosanaClient(network, {
            api: { apiKey }
        });
    }

    /**
     * Best effort scan to find the optimal market for a given GPU requirement.
     * In a real implementation, this would query the Nosana API for all active markets.
     */
    async findOptimalMarket(gpuType: "any" | "rtx-4090" | "a100"): Promise<string> {
        console.log(`Scanning Nosana network for ${gpuType} markets...`);
        
        // Mocked logic for the challenge - normally we'd pull this from the SDK
        const markets = [
            { address: "Nosana1111111111111111111111111111111111111", price: "0.1 NOS/hr", type: "any" },
            { address: "Nosana2222222222222222222222222222222222222", price: "0.5 NOS/hr", type: "a100" }
        ];

        const selected = markets.find(m => m.type === gpuType) || markets[0];
        return selected.address;
    }
}
