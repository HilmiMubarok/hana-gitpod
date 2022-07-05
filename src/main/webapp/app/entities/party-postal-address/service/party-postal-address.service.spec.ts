import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPartyPostalAddress, PartyPostalAddress } from '../party-postal-address.model';

import { PartyPostalAddressService } from './party-postal-address.service';

describe('PartyPostalAddress Service', () => {
  let service: PartyPostalAddressService;
  let httpMock: HttpTestingController;
  let elemDefault: IPartyPostalAddress;
  let expectedResult: IPartyPostalAddress | IPartyPostalAddress[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PartyPostalAddressService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fromDate: currentDate,
      thruDate: currentDate,
      partyId: 'AAAAAAA',
      partyName: 'AAAAAAA',
      addressId: 0,
      addressDescription: 'AAAAAAA',
      purposeTypeId: 'AAAAAAA',
      purposeTypeDescription: 'AAAAAAA',
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

    it('should create a PartyPostalAddress', () => {
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

      service.create(new PartyPostalAddress()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PartyPostalAddress', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          partyId: 'BBBBBB',
          partyName: 'BBBBBB',
          addressId: 1,
          addressDescription: 'BBBBBB',
          purposeTypeId: 'BBBBBB',
          purposeTypeDescription: 'BBBBBB',
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

    it('should partial update a PartyPostalAddress', () => {
      const patchObject = Object.assign(
        {
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          partyName: 'BBBBBB',
          addressId: 1,
          purposeTypeDescription: 'BBBBBB',
        },
        new PartyPostalAddress()
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

    it('should return a list of PartyPostalAddress', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fromDate: currentDate.format(DATE_TIME_FORMAT),
          thruDate: currentDate.format(DATE_TIME_FORMAT),
          partyId: 'BBBBBB',
          partyName: 'BBBBBB',
          addressId: 1,
          addressDescription: 'BBBBBB',
          purposeTypeId: 'BBBBBB',
          purposeTypeDescription: 'BBBBBB',
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

    it('should delete a PartyPostalAddress', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPartyPostalAddressToCollectionIfMissing', () => {
      it('should add a PartyPostalAddress to an empty array', () => {
        const partyPostalAddress: IPartyPostalAddress = { id: 123 };
        expectedResult = service.addPartyPostalAddressToCollectionIfMissing([], partyPostalAddress);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partyPostalAddress);
      });

      it('should not add a PartyPostalAddress to an array that contains it', () => {
        const partyPostalAddress: IPartyPostalAddress = { id: 123 };
        const partyPostalAddressCollection: IPartyPostalAddress[] = [
          {
            ...partyPostalAddress,
          },
          { id: 456 },
        ];
        expectedResult = service.addPartyPostalAddressToCollectionIfMissing(partyPostalAddressCollection, partyPostalAddress);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PartyPostalAddress to an array that doesn't contain it", () => {
        const partyPostalAddress: IPartyPostalAddress = { id: 123 };
        const partyPostalAddressCollection: IPartyPostalAddress[] = [{ id: 456 }];
        expectedResult = service.addPartyPostalAddressToCollectionIfMissing(partyPostalAddressCollection, partyPostalAddress);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partyPostalAddress);
      });

      it('should add only unique PartyPostalAddress to an array', () => {
        const partyPostalAddressArray: IPartyPostalAddress[] = [{ id: 123 }, { id: 456 }, { id: 92674 }];
        const partyPostalAddressCollection: IPartyPostalAddress[] = [{ id: 123 }];
        expectedResult = service.addPartyPostalAddressToCollectionIfMissing(partyPostalAddressCollection, ...partyPostalAddressArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const partyPostalAddress: IPartyPostalAddress = { id: 123 };
        const partyPostalAddress2: IPartyPostalAddress = { id: 456 };
        expectedResult = service.addPartyPostalAddressToCollectionIfMissing([], partyPostalAddress, partyPostalAddress2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partyPostalAddress);
        expect(expectedResult).toContain(partyPostalAddress2);
      });

      it('should accept null and undefined values', () => {
        const partyPostalAddress: IPartyPostalAddress = { id: 123 };
        expectedResult = service.addPartyPostalAddressToCollectionIfMissing([], null, partyPostalAddress, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partyPostalAddress);
      });

      it('should return initial array if no PartyPostalAddress is added', () => {
        const partyPostalAddressCollection: IPartyPostalAddress[] = [{ id: 123 }];
        expectedResult = service.addPartyPostalAddressToCollectionIfMissing(partyPostalAddressCollection, undefined, null);
        expect(expectedResult).toEqual(partyPostalAddressCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
