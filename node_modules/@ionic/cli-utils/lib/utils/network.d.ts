export declare const ERROR_NETWORK_ADDRESS_NOT_AVAIL = "NETWORK_ADDRESS_NOT_AVAIL";
export declare function getAvailableIPAddresses(): any[];
export declare function findClosestOpenPort(port: number, host?: string): Promise<number>;
export declare function isPortAvailable(port: number, host?: string): Promise<boolean>;
