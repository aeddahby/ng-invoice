import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FacturesService } from '../service/factures.service';
import { IFactures, Factures } from '../factures.model';

import { FacturesUpdateComponent } from './factures-update.component';

describe('Factures Management Update Component', () => {
  let comp: FacturesUpdateComponent;
  let fixture: ComponentFixture<FacturesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let facturesService: FacturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FacturesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FacturesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacturesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    facturesService = TestBed.inject(FacturesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const factures: IFactures = { id: 456 };

      activatedRoute.data = of({ factures });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(factures));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Factures>>();
      const factures = { id: 123 };
      jest.spyOn(facturesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ factures });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: factures }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(facturesService.update).toHaveBeenCalledWith(factures);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Factures>>();
      const factures = new Factures();
      jest.spyOn(facturesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ factures });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: factures }));
      saveSubject.complete();

      // THEN
      expect(facturesService.create).toHaveBeenCalledWith(factures);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Factures>>();
      const factures = { id: 123 };
      jest.spyOn(facturesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ factures });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(facturesService.update).toHaveBeenCalledWith(factures);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
