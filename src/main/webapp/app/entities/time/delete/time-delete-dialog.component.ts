import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITime } from '../time.model';
import { TimeService } from '../service/time.service';

@Component({
  templateUrl: './time-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TimeDeleteDialogComponent {
  time?: ITime;

  protected timeService = inject(TimeService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.timeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
