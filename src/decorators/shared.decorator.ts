import { Observable } from 'rxjs';
import { finalize, share } from 'rxjs/operators';

export function SharedObservable() {
    const sharedMap = new Map<string, Observable<any>>();

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

            if (sharedMap.has(serialized)) {
                return sharedMap.get(serialized).pipe(share());
            } else {
                const result = originalMethod.apply(this, args)
                    .pipe(share());

                sharedMap.set(serialized, result);

                result
                    .pipe(finalize(() => sharedMap.delete(serialized)))
                    .subscribe();

                return result;
            }
        };
    };
}

