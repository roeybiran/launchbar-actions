/// <reference types="node" />
import { URL } from 'url';
import { Options, NormalizedOptions, Defaults, ResponseType, Response } from './types';
import Request from '../core';
export declare const knownBodyTypes: string[];
export declare const parseBody: (response: Response<unknown>, responseType: ResponseType, encoding?: string | undefined) => unknown;
export default class PromisableRequest extends Request {
    ['constructor']: typeof PromisableRequest;
    options: NormalizedOptions;
    static normalizeArguments(url?: string | URL, nonNormalizedOptions?: Options, defaults?: Defaults): NormalizedOptions;
    static mergeOptions(...sources: Options[]): NormalizedOptions;
    _beforeError(error: Error): Promise<void>;
}
