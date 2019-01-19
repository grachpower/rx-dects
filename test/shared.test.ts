import 'jest';
import { Observable, Observer, forkJoin } from 'rxjs';

import { SharedObservable } from '../src/public-api';

class TestingClass {
    public evalTimes: number = 0;

    @SharedObservable()
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

test('Shared decorator should share 1 cold observable between two observers', () => {
    const testEntity = new TestingClass();

    forkJoin(
        testEntity.featchData(),
        testEntity.featchData()
    )
        .subscribe(() => {
            expect(testEntity.evalTimes).toBe(1);
        })
});

test('Shared decorator should should create new observable if has no pending', () => {
    const testEntity = new TestingClass();


    testEntity.featchData()
        .subscribe(() => {
            expect(testEntity.evalTimes).toBe(1);
        });

    testEntity.featchData()
        .subscribe(() => {
            expect(testEntity.evalTimes).toBe(2);
        });

    testEntity.featchData()
        .subscribe(() => {
            expect(testEntity.evalTimes).toBe(2);
        });
});