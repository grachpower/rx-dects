# RXJS Decorators
Rx-dects is a library with with typescript decorators which can help you to work with RxJs Observables. 

## Benefits
Declarative design to sharing and caching rxjs observables. 

## Installation and Usage

To install this library, run:

```bash
$ npm install rx-dects
```

You can import library in any application:

```typescript
  import { Observable, Observer } from 'rxjs';
  import { SharedObservable, CachedObservable } from 'rx-dects';
  
  @Injectable()
  export class DataService {
    public fetchSomeData(): Observable<any> {
      return this.generateObservable();
    }
  
    @SharedObservable()
    public fetchSharedData(): Observable<any> {
      return this.generateObservable();
    }
  
    @CachedObservable()
    public fetchCachedData(): Observable<any> {
      return this.generateObservable();
    }
  
    @SharedObservable()
    @CachedObservable()
    public fetchCachedAndSharedData(): Observable<any> {
      return this.generateObservable();
    }
  
    public generateObservable(): Observable<any> {
      return Observable.create((observer: Observer<string>) => {
        setTimeout(() => {
          observer.next(`Data: ${Math.random() * 100}`);
          observer.complete();
        }, 200);
      });
    }
  }
```

## Examples

 - [Stackblitz Demo](https://stackblitz.com/edit/rs-dects-example)

## Important
Important to install RxJS version 6 and above

## Building/Testing

- `npm run build` - builds everything
- `npm test` - runs tests

