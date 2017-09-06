import * as superagentType from 'superagent';
import { APIResponse, APIResponseError, APIResponseSuccess, HttpMethod, IClient, IPaginator, Response, SuperAgentError } from '../definitions';
import { FatalException } from './errors';
export declare const ERROR_UNKNOWN_CONTENT_TYPE = "UNKNOWN_CONTENT_TYPE";
export declare const ERROR_UNKNOWN_RESPONSE_FORMAT = "UNKNOWN_RESPONSE_FORMAT";
export declare function getGlobalProxy(): [string, string] | [undefined, undefined];
export declare function createRequest(method: string, url: string): superagentType.SuperAgentRequest;
export declare class Client implements IClient {
    host: string;
    constructor(host: string);
    make(method: HttpMethod, path: string): superagentType.SuperAgentRequest;
    do(req: superagentType.SuperAgentRequest): Promise<APIResponseSuccess>;
    paginate<T extends Response<Object[]>>(reqgen: () => superagentType.SuperAgentRequest, guard: (res: APIResponseSuccess) => res is T): Paginator<T>;
}
export declare class Paginator<T extends Response<Object[]>> implements IPaginator<T> {
    protected client: IClient;
    protected reqgen: () => superagentType.SuperAgentRequest;
    protected guard: (res: APIResponseSuccess) => res is T;
    protected previousReq?: superagentType.SuperAgentRequest;
    protected done: boolean;
    constructor(client: IClient, reqgen: () => superagentType.SuperAgentRequest, guard: (res: APIResponseSuccess) => res is T);
    next(): IteratorResult<Promise<T>>;
    [Symbol.iterator](): this;
}
export declare function transformAPIResponse(r: superagentType.Response): APIResponse;
export declare function createFatalAPIFormat(req: superagentType.SuperAgentRequest, res: APIResponse): FatalException;
export declare function formatSuperAgentError(e: SuperAgentError): string;
export declare function formatAPIResponse(req: superagentType.SuperAgentRequest, r: APIResponse): string;
export declare function formatAPISuccess(req: superagentType.SuperAgentRequest, r: APIResponseSuccess): string;
export declare function formatAPIError(req: superagentType.SuperAgentRequest, r: APIResponseError): string;
