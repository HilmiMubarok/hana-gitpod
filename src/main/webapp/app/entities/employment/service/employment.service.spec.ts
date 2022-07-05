import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmployment, Employment } from '../employment.model';

import { EmploymentService } from './employment.service';

describe('Employment Service', () => {
  let service: EmploymentService;
  let httpMock: HttpTestingController;
  let elemDefault: IEmployment;
  let expectedResult: IEmployment | IEmployment[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmploymentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fromDate: currentDate,
      thruDate: currentDate,
      relationTypeId: 'AAAAAAA',
      relationTypeDescription: 'AAAAAAA',
      partyToId: 'AAAAAAA',
      partyToName: 'AAAAAAA',
      partyFromId: 'AAAAAAA',
      partyFromName: 'AAAAAAA',
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

    it('should create a Employment', () => {
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

      service.create(new Employment()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Employment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          relationTypeId: 'BBBBBB',
          relationTypeDescription: 'BBBBBB',
          partyToId: 'BBBBBB',
          partyToName: 'BBBBBB',
          partyFromId: 'BBBBBB',
          partyFromName: 'BBBBBB',
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

    it('should partial update a Employment', () => {
      const patchObject = Object.assign(
        {
          relationTypeId: 'BBBBBB',
          partyFromId: 'BBBBBB',
          partyFromName: 'BBBBBB',
        },
        new Employment()
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

    it('should return a list of Employment', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          relationTypeId: 'BBBBBB',
          relationTypeDescription: 'BBBBBB',
          partyToId: 'BBBBBB',
          partyToName: 'BBBBBB',
          partyFromId: 'BBBBBB',
          partyFromName: 'BBBBBB',
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

    it('should delete a Employment', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEmploymentToCollectionIfMissing', () => {
      it('should add a Employment to an empty array', () => {
        const employment: IEmployment = { id: 123 };
        expectedResult = service.addEmploymentToCollectionIfMissing([], employment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employment);
      });

      it('should not add a Employment to an array that contains it', () => {
        const employment: IEmployment = { id: 123 };
        const employmentCollection: IEmployment[] = [
          {
            ...employment,
          },
          { id: 456 },
        ];
        expectedResult = service.addEmploymentToCollectionIfMissing(employmentCollection, employment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Employment to an array that doesn't contain it", () => {
        const employment: IEmployment = { id: 123 };
        const employmentCollection: IEmployment[] = [{ id: 456 }];
        expectedResult = service.addEmploymentToCollectionIfMissing(employmentCollection, employment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employment);
      });

      it('should add only unique Employment to an array', () => {
        const employmentArray: IEmployment[] = [{ id: 123 }, { id: 456 }, { id: 58167 }];
        const employmentCollection: IEmployment[] = [{ id: 123 }];
        expectedResult = service.addEmploymentToCollectionIfMissing(employmentCollection, ...employmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const employment: IEmployment = { id: 123 };
        const employment2: IEmployment = { id: 456 };
        expectedResult = service.addEmploymentToCollectionIfMissing([], employment, employment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employment);
        expect(expectedResult).toContain(employment2);
      });

      it('should accept null and undefined values', () => {
        const employment: IEmployment = { id: 123 };
        expectedResult = service.addEmploymentToCollectionIfMissing([], null, employment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employment);
      });

      it('should return initial array if no Employment is added', () => {
        const employmentCollection: IEmployment[] = [{ id: 123 }];
        expectedResult = service.addEmploymentToCollectionIfMissing(employmentCollection, undefined, null);
        expect(expectedResult).toEqual(employmentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
