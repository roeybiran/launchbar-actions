/// <reference types="node" />
import PCancelable = require('p-cancelable');
import { CancelError } from 'p-cancelable';
import { Options as RequestOptions, NormalizedOptions as RequestNormalizedOptions, Defaults as RequestDefaults, Hooks as RequestHooks, Response as RequestResponse, RequestError, MaxRedirectsError, CacheError, UploadError, TimeoutError, HTTPError, ReadError, UnsupportedProtocolError, HookEvent as RequestHookEvent, InitHook, BeforeRequestHook, BeforeRedirectHook, BeforeErrorHook, Progress, Headers, RequestFunction, Agents, Method, PromiseCookieJar, RequestEvents } from '../core';
import PromisableRequest from './core';
export declare type ResponseType = 'json' | 'buffer' | 'text';
export interface Response<T = unknown> extends RequestResponse<T> {
    request: PromisableRequest;
}
export interface RetryObject {
    attemptCount: number;
    retryOptions: RequiredRetryOptions;
    error: TimeoutError | RequestError;
    computedValue: number;
}
export declare type RetryFunction = (retryObject: RetryObject) => number;
export interface RequiredRetryOptions {
    limit: number;
    methods: Method[];
    statusCodes: number[];
    errorCodes: string[];
    calculateDelay: RetryFunction;
    maxRetryAfter?: number;
}
export declare type BeforeRetryHook = (options: NormalizedOptions, error?: RequestError, retryCount?: number) => void | Promise<void>;
export declare type AfterResponseHook = (response: Response, retryWithMergedOptions: (options: Options) => CancelableRequest<Response>) => Response | CancelableRequest<Response> | Promise<Response | CancelableRequest<Response>>;
export interface Hooks extends RequestHooks {
    beforeRetry?: BeforeRetryHook[];
    afterResponse?: AfterResponseHook[];
}
export interface PaginationOptions<T, R> {
    pagination?: {
        transform?: (response: Response<R>) => Promise<T[]> | T[];
        filter?: (item: T, allItems: T[], currentItems: T[]) => boolean;
        paginate?: (response: Response<R>, allItems: T[], currentItems: T[]) => Options | false;
        shouldContinue?: (item: T, allItems: T[], currentItems: T[]) => boolean;
        countLimit?: number;
        requestLimit?: number;
        stackAllItems?: boolean;
    };
}
export interface Options extends RequestOptions, PaginationOptions<unknown, unknown> {
    hooks?: Hooks;
    responseType?: ResponseType;
    resolveBodyOnly?: boolean;
    retry?: Partial<RequiredRetryOptions> | number;
    isStream?: boolean;
    encoding?: BufferEncoding;
}
export interface NormalizedOptions extends RequestNormalizedOptions {
    hooks: Required<Hooks>;
    responseType: ResponseType;
    resolveBodyOnly: boolean;
    retry: RequiredRetryOptions;
    isStream: boolean;
    encoding?: BufferEncoding;
    pagination?: Required<PaginationOptions<unknown, unknown>['pagination']>;
}
export interface Defaults extends RequestDefaults {
    hooks: Required<Hooks>;
    responseType: ResponseType;
    resolveBodyOnly: boolean;
    retry: RequiredRetryOptions;
    isStream: boolean;
    pagination?: Required<PaginationOptions<unknown, unknown>['pagination']>;
}
export declare class ParseError extends RequestError {
    readonly response: Response;
    constructor(error: Error, response: Response);
}
export interface CancelableRequest<T extends Response | Response['body'] = Response['body']> extends PCancelable<T>, RequestEvents<CancelableRequest<T>> {
    json<ReturnType>(): CancelableRequest<ReturnType>;
    buffer(): CancelableRequest<Buffer>;
    text(): CancelableRequest<string>;
}
export declare type HookEvent = RequestHookEvent | 'beforeRetry' | 'afterResponse';
export { RequestError, MaxRedirectsError, CacheError, UploadError, TimeoutError, HTTPError, ReadError, UnsupportedProtocolError, CancelError };
export { InitHook, BeforeRequestHook, BeforeRedirectHook, BeforeErrorHook };
export { Progress, Headers, RequestFunction, Agents, Method, PromiseCookieJar };
