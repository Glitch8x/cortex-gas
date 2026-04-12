import nacl from "tweetnacl";
import bs58 from "bs58";

export class EncryptionService {
    /**
     * Encrypts a message for a specific recipient's public key.
     * Mimics Arcium's confidential compute preparation.
     */
    static encryptForNosana(message: string, recipientPublicKeyBase58: string): { ciphertext: string; nonce: string } {
        const messageUint8 = new TextEncoder().encode(message);
        const recipientPubKey = bs58.decode(recipientPublicKeyBase58);
        const ephemeralKeyPair = nacl.box.keyPair();
        const nonce = nacl.randomBytes(nacl.box.nonceLength);

        const ciphertext = nacl.box(
            messageUint8,
            nonce,
            recipientPubKey,
            ephemeralKeyPair.secretKey
        );

        return {
            ciphertext: bs58.encode(ciphertext),
            nonce: bs58.encode(nonce)
        };
    }

    /**
     * Decrypts a message intended for the agent.
     */
    static decryptFromResult(ciphertextBase58: string, nonceBase58: string, senderPublicKeyBase58: string, agentSecretKey: Uint8Array): string {
        const ciphertext = bs58.decode(ciphertextBase58);
        const nonce = bs58.decode(nonceBase58);
        const senderPubKey = bs58.decode(senderPublicKeyBase58);

        const decrypted = nacl.box.open(
            ciphertext,
            nonce,
            senderPubKey,
            agentSecretKey
        );

        if (!decrypted) {
            throw new Error("Failed to decrypt Nosana job result.");
        }

        return new TextDecoder().decode(decrypted);
    }
}
