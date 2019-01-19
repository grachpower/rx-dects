import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';

export function CachedObservable() {
    const cacheMap = new Map<string, Observable<any>>();

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }

        const originalMethod = descriptor.value;

        descriptor.value = function () {
            const args = [];
            for (let i = 0; i < arguments.length; i++) {
                args[i] = arguments[i];
            }

            const serialized = JSON.stringify(args);

            if (cacheMap.has(serialized)) {
                return of(cacheMap.get(serialized));
            } else {
                const result = originalMethod.apply(this, args).pipe(share());

                result.subscribe((value: any) => {
                    cacheMap.set(serialized, value);
                });

                return result;
            }
        };
    };
}

