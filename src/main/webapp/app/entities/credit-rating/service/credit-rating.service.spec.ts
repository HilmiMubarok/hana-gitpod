import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICreditRating, CreditRating } from '../credit-rating.model';

import { CreditRatingService } from './credit-rating.service';

describe('CreditRating Service', () => {
  let service: CreditRatingService;
  let httpMock: HttpTestingController;
  let elemDefault: ICreditRating;
  let expectedResult: ICreditRating | ICreditRating[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CreditRatingService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fromDate: currentDate,
      thruDate: currentDate,
      collateralTypeId: 'AAAAAAA',
      collateralTypeDescription: 'AAAAAAA',
      partyId: 'AAAAAAA',
      partyName: 'AAAAAAA',
      applicationId: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a CreditRating', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fromDate: currentDate,
          thruDate: currentDate,
        },
        returnedFromService
      );

      service.create(new CreditRating()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CreditRating', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          collateralTypeId: 'BBBBBB',
          collateralTypeDescription: 'BBBBBB',
          partyId: 'BBBBBB',
          partyName: 'BBBBBB',
          applicationId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fromDate: currentDate,
          thruDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CreditRating', () => {
      const patchObject = Object.assign(
        {
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          partyId: 'BBBBBB',
        },
        new CreditRating()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fromDate: currentDate,
          thruDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CreditRating', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          collateralTypeId: 'BBBBBB',
          collateralTypeDescription: 'BBBBBB',
          partyId: 'BBBBBB',
          partyName: 'BBBBBB',
          applicationId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fromDate: currentDate,
          thruDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a CreditRating', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCreditRatingToCollectionIfMissing', () => {
      it('should add a CreditRating to an empty array', () => {
        const creditRating: ICreditRating = { id: 123 };
        expectedResult = service.addCreditRatingToCollectionIfMissing([], creditRating);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditRating);
      });

      it('should not add a CreditRating to an array that contains it', () => {
        const creditRating: ICreditRating = { id: 123 };
        const creditRatingCollection: ICreditRating[] = [
          {
            ...creditRating,
          },
          { id: 456 },
        ];
        expectedResult = service.addCreditRatingToCollectionIfMissing(creditRatingCollection, creditRating);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CreditRating to an array that doesn't contain it", () => {
        const creditRating: ICreditRating = { id: 123 };
        const creditRatingCollection: ICreditRating[] = [{ id: 456 }];
        expectedResult = service.addCreditRatingToCollectionIfMissing(creditRatingCollection, creditRating);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditRating);
      });

      it('should add only unique CreditRating to an array', () => {
        const creditRatingArray: ICreditRating[] = [{ id: 123 }, { id: 456 }, { id: 74156 }];
        const creditRatingCollection: ICreditRating[] = [{ id: 123 }];
        expectedResult = service.addCreditRatingToCollectionIfMissing(creditRatingCollection, ...creditRatingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const creditRating: ICreditRating = { id: 123 };
        const creditRating2: ICreditRating = { id: 456 };
        expectedResult = service.addCreditRatingToCollectionIfMissing([], creditRating, creditRating2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditRating);
        expect(expectedResult).toContain(creditRating2);
      });

      it('should accept null and undefined values', () => {
        const creditRating: ICreditRating = { id: 123 };
        expectedResult = service.addCreditRatingToCollectionIfMissing([], null, creditRating, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditRating);
      });

      it('should return initial array if no CreditRating is added', () => {
        const creditRatingCollection: ICreditRating[] = [{ id: 123 }];
        expectedResult = service.addCreditRatingToCollectionIfMissing(creditRatingCollection, undefined, null);
        expect(expectedResult).toEqual(creditRatingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
