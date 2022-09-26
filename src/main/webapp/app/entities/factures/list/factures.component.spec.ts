import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FacturesService } from '../service/factures.service';

import { FacturesComponent } from './factures.component';

describe('Factures Management Component', () => {
  let comp: FacturesComponent;
  let fixture: ComponentFixture<FacturesComponent>;
  let service: FacturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FacturesComponent],
    })
      .overrideTemplate(FacturesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacturesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FacturesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.factures?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
