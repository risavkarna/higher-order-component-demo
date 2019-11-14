import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';

import { StatefulnessComponent } from './core/statefulness/statefulness.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends StatefulnessComponent {
  value$ = new Subject<number>();
  state = this.connect({
    count: this.value$.pipe(
    startWith(0),
    scan((count, next) => count + next, 0)
  )});
}
