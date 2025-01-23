import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ITime } from '../time.model';

@Component({
  selector: 'jhi-time-detail',
  templateUrl: './time-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class TimeDetailComponent {
  time = input<ITime | null>(null);

  previousState(): void {
    window.history.back();
  }
}
