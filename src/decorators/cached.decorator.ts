import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export function CachedObservable() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const cacheMap = new Map<string, Observable<any>>();
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            const serialized = JSON.stringify(args);

            if (!cacheMap.has(serialized)) {
                const source = originalMethod.apply(this, args)
                  .pipe(shareReplay(1));
                cacheMap.set(serialized, source);
            }

            return cacheMap.get(serialized);
        };
    };
}
