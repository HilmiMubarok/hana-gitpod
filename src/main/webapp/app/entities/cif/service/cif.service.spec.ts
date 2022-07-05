import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICif, Cif } from '../cif.model';

import { CifService } from './cif.service';

describe('Cif Service', () => {
  let service: CifService;
  let httpMock: HttpTestingController;
  let elemDefault: ICif;
  let expectedResult: ICif | ICif[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CifService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      number: 'AAAAAAA',
      partyId: 'AAAAAAA',
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

    it('should create a Cif', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Cif()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cif', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          number: 'BBBBBB',
          partyId: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cif', () => {
      const patchObject = Object.assign(
        {
          partyId: 'BBBBBB',
        },
        new Cif()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cif', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          number: 'BBBBBB',
          partyId: 'BBBBBB',
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

    it('should delete a Cif', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCifToCollectionIfMissing', () => {
      it('should add a Cif to an empty array', () => {
        const cif: ICif = { id: 123 };
        expectedResult = service.addCifToCollectionIfMissing([], cif);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cif);
      });

      it('should not add a Cif to an array that contains it', () => {
        const cif: ICif = { id: 123 };
        const cifCollection: ICif[] = [
          {
            ...cif,
          },
          { id: 456 },
        ];
        expectedResult = service.addCifToCollectionIfMissing(cifCollection, cif);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cif to an array that doesn't contain it", () => {
        const cif: ICif = { id: 123 };
        const cifCollection: ICif[] = [{ id: 456 }];
        expectedResult = service.addCifToCollectionIfMissing(cifCollection, cif);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cif);
      });

      it('should add only unique Cif to an array', () => {
        const cifArray: ICif[] = [{ id: 123 }, { id: 456 }, { id: 19065 }];
        const cifCollection: ICif[] = [{ id: 123 }];
        expectedResult = service.addCifToCollectionIfMissing(cifCollection, ...cifArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cif: ICif = { id: 123 };
        const cif2: ICif = { id: 456 };
        expectedResult = service.addCifToCollectionIfMissing([], cif, cif2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cif);
        expect(expectedResult).toContain(cif2);
      });

      it('should accept null and undefined values', () => {
        const cif: ICif = { id: 123 };
        expectedResult = service.addCifToCollectionIfMissing([], null, cif, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cif);
      });

      it('should return initial array if no Cif is added', () => {
        const cifCollection: ICif[] = [{ id: 123 }];
        expectedResult = service.addCifToCollectionIfMissing(cifCollection, undefined, null);
        expect(expectedResult).toEqual(cifCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
