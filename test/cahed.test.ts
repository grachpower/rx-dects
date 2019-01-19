import 'jest';
import { Observable, Observer, forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CachedObservable } from '../src/public-api';

class TestingClass {
    public evalTimes: number = 0;

    @CachedObservable()
    public featchData(): Observable<string> {
        return Observable.create((observer: Observer<string>) => {
            setTimeout(() => {
                observer.next('next');
                this.evalTimes++;
                observer.complete();
            }, 100);
        });
    }
}

test('Cached decorator should get data from cache after first resolved in sequence', () => {
    const testEntity = new TestingClass();

    forkJoin(
        testEntity.featchData(),
        testEntity.featchData(),
        testEntity.featchData(),
    )
        .subscribe(() => {
            expect(testEntity.evalTimes).toBe(1);
        })
});

test('Cached decorator should get data from cache after first resolved', () => {
    const testEntity = new TestingClass();

    testEntity.featchData()
        .pipe(
            concatMap(() => testEntity.featchData()),
            concatMap(() => testEntity.featchData()),
        )
        .subscribe(() => {
            expect(testEntity.evalTimes).toBe(1);
        });
});


