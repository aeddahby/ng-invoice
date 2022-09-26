import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFactures } from '../factures.model';
import { FacturesService } from '../service/factures.service';

@Component({
  templateUrl: './factures-delete-dialog.component.html',
})
export class FacturesDeleteDialogComponent {
  factures?: IFactures;

  constructor(protected facturesService: FacturesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.facturesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
