import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOrganizationManagement, OrganizationManagement } from '../organization-management.model';

import { OrganizationManagementService } from './organization-management.service';

describe('OrganizationManagement Service', () => {
  let service: OrganizationManagementService;
  let httpMock: HttpTestingController;
  let elemDefault: IOrganizationManagement;
  let expectedResult: IOrganizationManagement | IOrganizationManagement[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrganizationManagementService);
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

    it('should create a OrganizationManagement', () => {
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

      service.create(new OrganizationManagement()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OrganizationManagement', () => {
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

    it('should partial update a OrganizationManagement', () => {
      const patchObject = Object.assign(
        {
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
        },
        new OrganizationManagement()
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

    it('should return a list of OrganizationManagement', () => {
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

    it('should delete a OrganizationManagement', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOrganizationManagementToCollectionIfMissing', () => {
      it('should add a OrganizationManagement to an empty array', () => {
        const organizationManagement: IOrganizationManagement = { id: 123 };
        expectedResult = service.addOrganizationManagementToCollectionIfMissing([], organizationManagement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationManagement);
      });

      it('should not add a OrganizationManagement to an array that contains it', () => {
        const organizationManagement: IOrganizationManagement = { id: 123 };
        const organizationManagementCollection: IOrganizationManagement[] = [
          {
            ...organizationManagement,
          },
          { id: 456 },
        ];
        expectedResult = service.addOrganizationManagementToCollectionIfMissing(organizationManagementCollection, organizationManagement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OrganizationManagement to an array that doesn't contain it", () => {
        const organizationManagement: IOrganizationManagement = { id: 123 };
        const organizationManagementCollection: IOrganizationManagement[] = [{ id: 456 }];
        expectedResult = service.addOrganizationManagementToCollectionIfMissing(organizationManagementCollection, organizationManagement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationManagement);
      });

      it('should add only unique OrganizationManagement to an array', () => {
        const organizationManagementArray: IOrganizationManagement[] = [{ id: 123 }, { id: 456 }, { id: 62042 }];
        const organizationManagementCollection: IOrganizationManagement[] = [{ id: 123 }];
        expectedResult = service.addOrganizationManagementToCollectionIfMissing(
          organizationManagementCollection,
          ...organizationManagementArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const organizationManagement: IOrganizationManagement = { id: 123 };
        const organizationManagement2: IOrganizationManagement = { id: 456 };
        expectedResult = service.addOrganizationManagementToCollectionIfMissing([], organizationManagement, organizationManagement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(organizationManagement);
        expect(expectedResult).toContain(organizationManagement2);
      });

      it('should accept null and undefined values', () => {
        const organizationManagement: IOrganizationManagement = { id: 123 };
        expectedResult = service.addOrganizationManagementToCollectionIfMissing([], null, organizationManagement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(organizationManagement);
      });

      it('should return initial array if no OrganizationManagement is added', () => {
        const organizationManagementCollection: IOrganizationManagement[] = [{ id: 123 }];
        expectedResult = service.addOrganizationManagementToCollectionIfMissing(organizationManagementCollection, undefined, null);
        expect(expectedResult).toEqual(organizationManagementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
