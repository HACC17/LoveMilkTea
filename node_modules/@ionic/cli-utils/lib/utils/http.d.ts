import * as superagentType from 'superagent';
export declare function getGlobalProxy(): [string, string] | [undefined, undefined];
export declare function createRequest(method: string, url: string): superagentType.SuperAgentRequest;
