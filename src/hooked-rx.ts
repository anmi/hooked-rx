import { useState, useEffect } from 'react';
import { Observable, Subject } from 'rxjs';

export function useRx<TSource, TOutput>(
  value: TSource,
  initialOutput: TOutput,
  operator: (source: Observable<TSource>) => Observable<TOutput>
) {
  const [sourceObservable$] = useState(new Subject<TSource>());
  const [outputValue, setOutputValue] = useState(initialOutput);

  useEffect(() => {
    const subscription = sourceObservable$
      .pipe(operator)
      .subscribe(setOutputValue);
    
    return () => {
      subscription.unsubscribe();
    };
  }, [sourceObservable$, setOutputValue]);

  useEffect(() => {
    sourceObservable$.next(value);
  }, [sourceObservable$, value]);

  return [outputValue];
}
