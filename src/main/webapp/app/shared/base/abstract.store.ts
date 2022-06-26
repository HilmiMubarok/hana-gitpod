import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Action } from './abstract-entity.store';

const NO_OP = '[State] No Op';

@Injectable({ providedIn: 'root' })
export class AbstractStore<T> {
  protected stateSubject: BehaviorSubject<T> = new BehaviorSubject<T>(null);
  readonly state$: Observable<T> = this.stateSubject.asObservable();

  constructor() {}

  setState(value: T) {
    this.stateSubject.next(value);
  }

  protected reducer(state: T, action: Action): T {
    switch (action.type) {
      case NO_OP: {
        return state;
      }
    }
    return state;
  }

  dispatch(action: Action) {
    const state = this.reducer(this.stateSubject.getValue(), action);
    this.stateSubject.next(state);
  }
}
