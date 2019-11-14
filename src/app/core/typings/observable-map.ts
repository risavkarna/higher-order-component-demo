import { Observable } from 'rxjs';

export type ObservableMap<T> = {
  [P in keyof T]: Observable<T[P]>;
};
