import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFactures } from '../factures.model';
import { FacturesService } from '../service/factures.service';
import { FacturesDeleteDialogComponent } from '../delete/factures-delete-dialog.component';

@Component({
  selector: 'jhi-factures',
  templateUrl: './factures.component.html',
})
export class FacturesComponent implements OnInit {
  factures?: IFactures[];
  isLoading = false;

  constructor(protected facturesService: FacturesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.facturesService.query().subscribe({
      next: (res: HttpResponse<IFactures[]>) => {
        this.isLoading = false;
        this.factures = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFactures): number {
    return item.id!;
  }

  delete(factures: IFactures): void {
    const modalRef = this.modalService.open(FacturesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.factures = factures;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
