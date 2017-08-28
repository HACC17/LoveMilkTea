import { IonicEnvironment } from '../definitions';
export declare const ERROR_SSH_MISSING_PRIVKEY = "SSH_MISSING_PRIVKEY";
export declare const ERROR_SSH_INVALID_PUBKEY = "SSH_INVALID_PUBKEY";
export declare const ERROR_SSH_INVALID_PRIVKEY = "SSH_INVALID_PRIVKEY";
export declare function getGeneratedPrivateKeyPath(env: IonicEnvironment): Promise<string>;
export declare function parsePublicKeyFile(pubkeyPath: string): Promise<[string, string, string, string]>;
/**
 * @return Promise<[full pubkey, algorithm, public numbers, annotation]>
 */
export declare function parsePublicKey(pubkey: string): Promise<[string, string, string, string]>;
export declare function validatePrivateKey(keyPath: string): Promise<void>;
