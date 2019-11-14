import { OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, concat, from } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';

import { ObservableMap } from '../typings/observable-map';

const OnInitSubject = Symbol('OnInitSubject');
const OnDestroySubject = Symbol('OnDestroySubject');

export abstract class StatefulnessComponent implements OnInit, OnDestroy {
  private [OnInitSubject] = new ReplaySubject<true>(1);
  private [OnDestroySubject] = new ReplaySubject<true>(1);

  connect<T>(sources: ObservableMap<T>): T {
    const sink = {} as T;
    const sourceKeys = Object.keys(sources) as (keyof T)[];
    const updateSink$ = from(sourceKeys).pipe(
      mergeMap(sourceKey => {
        return sources[sourceKey].pipe(
          tap((sinkValue: any) => (sink[sourceKey] = sinkValue))
        );
      })
    );
    concat(this.onInit$, updateSink$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        // () => markDirty(this)
      );
    return sink;
  }

  ngOnInit() {
    this[OnInitSubject].next(true);
    this[OnInitSubject].complete();
  }

  ngOnDestroy() {
    this[OnDestroySubject].next(true);
    this[OnDestroySubject].complete();
  }

  get onInit$() {
    return this[OnInitSubject].asObservable();
  }

  get onDestroy$() {
    return this[OnDestroySubject].asObservable();
  }
}
