import 'reflect-metadata';

import { AppRouter } from '../../AppRouter';

import { MetadataKeys, Methods } from './types';

export function controller(routePrefix: string) {
    return function(target: Function) {
        const router = AppRouter.getInstance();
        
        for (let key of Object.getOwnPropertyNames(target.prototype)) {
            if (key === 'constructor') continue;

            const routeHandler = target.prototype[key];

            const path = Reflect.getMetadata(
                MetadataKeys.path,
                target.prototype,
                key
            );

            const method = Reflect.getMetadata(
                MetadataKeys.method,
                target.prototype,
                key
            ) as Methods;
            
            const middlewares = Reflect.getMetadata(
                MetadataKeys.middleware,
                target.prototype,
                key
            ) || [];

            if (path) {
                router[method](
                    `${routePrefix}${path}`,
                    ...middlewares,
                    routeHandler
                );
            }
        }
    }
}