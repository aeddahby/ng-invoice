import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFactures, Factures } from '../factures.model';
import { FacturesService } from '../service/factures.service';

@Component({
  selector: 'jhi-factures-update',
  templateUrl: './factures-update.component.html',
})
export class FacturesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    object: [],
    description: [],
    creationDate: [],
  });

  constructor(protected facturesService: FacturesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ factures }) => {
      this.updateForm(factures);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const factures = this.createFromForm();
    if (factures.id !== undefined) {
      this.subscribeToSaveResponse(this.facturesService.update(factures));
    } else {
      this.subscribeToSaveResponse(this.facturesService.create(factures));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFactures>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(factures: IFactures): void {
    this.editForm.patchValue({
      id: factures.id,
      object: factures.object,
      description: factures.description,
      creationDate: factures.creationDate,
    });
  }

  protected createFromForm(): IFactures {
    return {
      ...new Factures(),
      id: this.editForm.get(['id'])!.value,
      object: this.editForm.get(['object'])!.value,
      description: this.editForm.get(['description'])!.value,
      creationDate: this.editForm.get(['creationDate'])!.value,
    };
  }
}
