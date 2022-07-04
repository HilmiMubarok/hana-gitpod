import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrganizationLegal, OrganizationLegal } from '../organization-legal.model';

import { OrganizationLegalService } from './organization-legal.service';

describe('OrganizationLegal Service', () => {
  let service: OrganizationLegalService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrganizationLegal;
  let expectedResult: IOrganizationLegal | IOrganizationLegal[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrganizationLegalService);
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

    it('should create a OrganizationLegal', () => {
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

      service.create(new OrganizationLegal()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrganizationLegal', () => {
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

    it('should partial update a OrganizationLegal', () => {
      const patchObject = Object.assign(
        {
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          organizationId: 'BBBBBB',
        },
        new OrganizationLegal()
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

    it('should return a list of OrganizationLegal', () => {
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

    it('should delete a OrganizationLegal', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrganizationLegalToCollectionIfMissing', () => {
      it('should add a OrganizationLegal to an empty array', () => {
        const organizationLegal: IOrganizationLegal = { id: 123 };
        expectedResult = service.addOrganizationLegalToCollectionIfMissing([], organizationLegal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationLegal);
      });

      it('should not add a OrganizationLegal to an array that contains it', () => {
        const organizationLegal: IOrganizationLegal = { id: 123 };
        const organizationLegalCollection: IOrganizationLegal[] = [
          {
            ...organizationLegal,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrganizationLegalToCollectionIfMissing(organizationLegalCollection, organizationLegal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrganizationLegal to an array that doesn't contain it", () => {
        const organizationLegal: IOrganizationLegal = { id: 123 };
        const organizationLegalCollection: IOrganizationLegal[] = [{ id: 456 }];
        expectedResult = service.addOrganizationLegalToCollectionIfMissing(organizationLegalCollection, organizationLegal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationLegal);
      });

      it('should add only unique OrganizationLegal to an array', () => {
        const organizationLegalArray: IOrganizationLegal[] = [{ id: 123 }, { id: 456 }, { id: 5494 }];
        const organizationLegalCollection: IOrganizationLegal[] = [{ id: 123 }];
        expectedResult = service.addOrganizationLegalToCollectionIfMissing(organizationLegalCollection, ...organizationLegalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const organizationLegal: IOrganizationLegal = { id: 123 };
        const organizationLegal2: IOrganizationLegal = { id: 456 };
        expectedResult = service.addOrganizationLegalToCollectionIfMissing([], organizationLegal, organizationLegal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationLegal);
        expect(expectedResult).toContain(organizationLegal2);
      });

      it('should accept null and undefined values', () => {
        const organizationLegal: IOrganizationLegal = { id: 123 };
        expectedResult = service.addOrganizationLegalToCollectionIfMissing([], null, organizationLegal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationLegal);
      });

      it('should return initial array if no OrganizationLegal is added', () => {
        const organizationLegalCollection: IOrganizationLegal[] = [{ id: 123 }];
        expectedResult = service.addOrganizationLegalToCollectionIfMissing(organizationLegalCollection, undefined, null);
        expect(expectedResult).toEqual(organizationLegalCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
