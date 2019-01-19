import 'jest';
import { Observable, Observer, forkJoin } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

import { CachedObservable } from '../src/public-api';

class TestingClass {
    public evalTimes: number = 0;

    @CachedObservable()
    public featchData(): Observable<number> {
        return Observable.create((observer: Observer<number>) => {
            setTimeout(() => {
                observer.next(Math.random());
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
    let resultOne;
    let resultTwo;
    let resultThree;

    testEntity.featchData()
        .pipe(
            tap(result => resultOne = result),
            concatMap(() => testEntity.featchData()),
            tap(result => resultTwo = result),
            concatMap(() => testEntity.featchData()),
            tap(result => resultThree = result),
        )
        .subscribe(() => {
            expect(testEntity.evalTimes).toBe(1);
            expect(resultOne).toBe(resultTwo);
            expect(resultTwo).toBe(resultThree);
            expect(resultOne).toBe(resultThree);
        });
});


