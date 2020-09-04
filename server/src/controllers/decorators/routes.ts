import 'reflect-metadata';

import { MetadataKeys, Methods } from './types';

function routeBinder(method: string) {
    return function (path: string) {
        return function (target: any, key: string) {
            Reflect.defineMetadata(MetadataKeys.path, path, target, key);
            Reflect.defineMetadata(MetadataKeys.method, method, target, key);
        }
    }
}

export const get = routeBinder(Methods.get);
export const post = routeBinder(Methods.post);
export const del = routeBinder(Methods.del);
export const patch = routeBinder(Methods.patch);
export const put = routeBinder(Methods.put);