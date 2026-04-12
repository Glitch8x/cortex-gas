import { Evaluator, IAgentRuntime, Memory, State } from "@elizaos/core";

/**
 * Scans user messages for PII and sensitive data before any compute job is triggered.
 * Inspired by Arcium's "Privacy-First" Confidential Computing model.
 */
export const PrivacyEvaluator: Evaluator = {
    name: "PROTECT_CONFIDENTIAL_DATA",
    similes: ["SCAN_FOR_PII", "REDACT_SENSITIVE_INFO", "ENFORCE_PRIVACY_POLICY"],
    description: "Detects and redacts personal information like emails, phone numbers, and keys.",
    
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        return !!runtime.getSetting("Nosana_API_KEY");
    },

    handler: async (runtime: IAgentRuntime, message: Memory, _state?: State): Promise<any> => {
        const text = message.content.text || "";

        // Simplified PII patterns for the challenge
        const piiPatterns = {
            email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
            solanaKey: /[1-9A-HJ-NP-Za-km-z]{32,44}/g
        };

        let redactedText = text;
        let piiDetected = false;

        for (const [type, pattern] of Object.entries(piiPatterns)) {
            if (pattern.test(text)) {
                piiDetected = true;
                redactedText = redactedText.replace(pattern, `[REDACTED_${type.toUpperCase()}]`);
            }
        }

        if (piiDetected) {
            console.warn(`Privacy Warning: Sensitive data detected and redacted in message ${message.id}`);
            // Update the message content in memory to the redacted version
            message.content.text = redactedText || "";
        }

        return piiDetected;
    },
    
    examples: [
        {
            context: "User provides an email address in the compute request.",
            messages: [
                {
                    user: "{{user1}}",
                    content: { text: "Run analysis for user@example.com" },
                },
            ],
            outcome: "PROTECT_CONFIDENTIAL_DATA redacts the email to [REDACTED_EMAIL] before processing.",
        },
    ] as any,
};
