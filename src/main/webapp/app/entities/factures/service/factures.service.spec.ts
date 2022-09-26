import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFactures, Factures } from '../factures.model';

import { FacturesService } from './factures.service';

describe('Factures Service', () => {
  let service: FacturesService;
  let httpMock: HttpTestingController;
  let elemDefault: IFactures;
  let expectedResult: IFactures | IFactures[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FacturesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      object: 'AAAAAAA',
      description: 'AAAAAAA',
      creationDate: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Factures', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Factures()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Factures', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          object: 'BBBBBB',
          description: 'BBBBBB',
          creationDate: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Factures', () => {
      const patchObject = Object.assign(
        {
          object: 'BBBBBB',
          description: 'BBBBBB',
          creationDate: 'BBBBBB',
        },
        new Factures()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Factures', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          object: 'BBBBBB',
          description: 'BBBBBB',
          creationDate: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Factures', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFacturesToCollectionIfMissing', () => {
      it('should add a Factures to an empty array', () => {
        const factures: IFactures = { id: 123 };
        expectedResult = service.addFacturesToCollectionIfMissing([], factures);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(factures);
      });

      it('should not add a Factures to an array that contains it', () => {
        const factures: IFactures = { id: 123 };
        const facturesCollection: IFactures[] = [
          {
            ...factures,
          },
          { id: 456 },
        ];
        expectedResult = service.addFacturesToCollectionIfMissing(facturesCollection, factures);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Factures to an array that doesn't contain it", () => {
        const factures: IFactures = { id: 123 };
        const facturesCollection: IFactures[] = [{ id: 456 }];
        expectedResult = service.addFacturesToCollectionIfMissing(facturesCollection, factures);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(factures);
      });

      it('should add only unique Factures to an array', () => {
        const facturesArray: IFactures[] = [{ id: 123 }, { id: 456 }, { id: 15208 }];
        const facturesCollection: IFactures[] = [{ id: 123 }];
        expectedResult = service.addFacturesToCollectionIfMissing(facturesCollection, ...facturesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const factures: IFactures = { id: 123 };
        const factures2: IFactures = { id: 456 };
        expectedResult = service.addFacturesToCollectionIfMissing([], factures, factures2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(factures);
        expect(expectedResult).toContain(factures2);
      });

      it('should accept null and undefined values', () => {
        const factures: IFactures = { id: 123 };
        expectedResult = service.addFacturesToCollectionIfMissing([], null, factures, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(factures);
      });

      it('should return initial array if no Factures is added', () => {
        const facturesCollection: IFactures[] = [{ id: 123 }];
        expectedResult = service.addFacturesToCollectionIfMissing(facturesCollection, undefined, null);
        expect(expectedResult).toEqual(facturesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
