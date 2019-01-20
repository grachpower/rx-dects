import { Observable } from 'rxjs';
import { finalize, share } from 'rxjs/operators';

export function SharedObservable() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const sharedMap = new Map<string, Observable<any>>();
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            const serialized = JSON.stringify(args);

            if (!sharedMap.has(serialized)) {
                const source = originalMethod.apply(this, args)
                    .pipe(
                      finalize(() => sharedMap.delete(serialized)),
                      share(),
                    );
                sharedMap.set(serialized, source);
            }

            return sharedMap.get(serialized);
        };
    };
}
