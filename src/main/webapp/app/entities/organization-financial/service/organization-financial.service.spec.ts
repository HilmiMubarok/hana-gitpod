import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrganizationFinancial, OrganizationFinancial } from '../organization-financial.model';

import { OrganizationFinancialService } from './organization-financial.service';

describe('OrganizationFinancial Service', () => {
  let service: OrganizationFinancialService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrganizationFinancial;
  let expectedResult: IOrganizationFinancial | IOrganizationFinancial[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrganizationFinancialService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fromDate: currentDate,
      thruDate: currentDate,
      organizationId: 'AAAAAAA',
      organizationName: 'AAAAAAA',
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

    it('should create a OrganizationFinancial', () => {
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

      service.create(new OrganizationFinancial()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrganizationFinancial', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          organizationId: 'BBBBBB',
          organizationName: 'BBBBBB',
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

    it('should partial update a OrganizationFinancial', () => {
      const patchObject = Object.assign(
        {
          thruDate: currentDate.format(DATE_TIME_FORMAT),
        },
        new OrganizationFinancial()
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

    it('should return a list of OrganizationFinancial', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          organizationId: 'BBBBBB',
          organizationName: 'BBBBBB',
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

    it('should delete a OrganizationFinancial', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrganizationFinancialToCollectionIfMissing', () => {
      it('should add a OrganizationFinancial to an empty array', () => {
        const organizationFinancial: IOrganizationFinancial = { id: 123 };
        expectedResult = service.addOrganizationFinancialToCollectionIfMissing([], organizationFinancial);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationFinancial);
      });

      it('should not add a OrganizationFinancial to an array that contains it', () => {
        const organizationFinancial: IOrganizationFinancial = { id: 123 };
        const organizationFinancialCollection: IOrganizationFinancial[] = [
          {
            ...organizationFinancial,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrganizationFinancialToCollectionIfMissing(organizationFinancialCollection, organizationFinancial);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrganizationFinancial to an array that doesn't contain it", () => {
        const organizationFinancial: IOrganizationFinancial = { id: 123 };
        const organizationFinancialCollection: IOrganizationFinancial[] = [{ id: 456 }];
        expectedResult = service.addOrganizationFinancialToCollectionIfMissing(organizationFinancialCollection, organizationFinancial);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationFinancial);
      });

      it('should add only unique OrganizationFinancial to an array', () => {
        const organizationFinancialArray: IOrganizationFinancial[] = [{ id: 123 }, { id: 456 }, { id: 37071 }];
        const organizationFinancialCollection: IOrganizationFinancial[] = [{ id: 123 }];
        expectedResult = service.addOrganizationFinancialToCollectionIfMissing(
          organizationFinancialCollection,
          ...organizationFinancialArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const organizationFinancial: IOrganizationFinancial = { id: 123 };
        const organizationFinancial2: IOrganizationFinancial = { id: 456 };
        expectedResult = service.addOrganizationFinancialToCollectionIfMissing([], organizationFinancial, organizationFinancial2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationFinancial);
        expect(expectedResult).toContain(organizationFinancial2);
      });

      it('should accept null and undefined values', () => {
        const organizationFinancial: IOrganizationFinancial = { id: 123 };
        expectedResult = service.addOrganizationFinancialToCollectionIfMissing([], null, organizationFinancial, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationFinancial);
      });

      it('should return initial array if no OrganizationFinancial is added', () => {
        const organizationFinancialCollection: IOrganizationFinancial[] = [{ id: 123 }];
        expectedResult = service.addOrganizationFinancialToCollectionIfMissing(organizationFinancialCollection, undefined, null);
        expect(expectedResult).toEqual(organizationFinancialCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
