import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPartyGroup, PartyGroup } from '../party-group.model';

import { PartyGroupService } from './party-group.service';

describe('PartyGroup Service', () => {
  let service: PartyGroupService;
  let httpMock: HttpTestingController;
  let elemDefault: IPartyGroup;
  let expectedResult: IPartyGroup | IPartyGroup[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PartyGroupService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      groupName: 'AAAAAAA',
      prefix: 'AAAAAAA',
      officePhone: 'AAAAAAA',
      otherPhone: 'AAAAAAA',
      officeMail: 'AAAAAAA',
      faxOffice: 'AAAAAAA',
      taxIdNumber: 'AAAAAAA',
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

    it('should create a PartyGroup', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PartyGroup()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PartyGroup', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          groupName: 'BBBBBB',
          prefix: 'BBBBBB',
          officePhone: 'BBBBBB',
          otherPhone: 'BBBBBB',
          officeMail: 'BBBBBB',
          faxOffice: 'BBBBBB',
          taxIdNumber: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PartyGroup', () => {
      const patchObject = Object.assign(
        {
          otherPhone: 'BBBBBB',
          officeMail: 'BBBBBB',
          faxOffice: 'BBBBBB',
        },
        new PartyGroup()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PartyGroup', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          groupName: 'BBBBBB',
          prefix: 'BBBBBB',
          officePhone: 'BBBBBB',
          otherPhone: 'BBBBBB',
          officeMail: 'BBBBBB',
          faxOffice: 'BBBBBB',
          taxIdNumber: 'BBBBBB',
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

    it('should delete a PartyGroup', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPartyGroupToCollectionIfMissing', () => {
      it('should add a PartyGroup to an empty array', () => {
        const partyGroup: IPartyGroup = { id: 123 };
        expectedResult = service.addPartyGroupToCollectionIfMissing([], partyGroup);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partyGroup);
      });

      it('should not add a PartyGroup to an array that contains it', () => {
        const partyGroup: IPartyGroup = { id: 123 };
        const partyGroupCollection: IPartyGroup[] = [
          {
            ...partyGroup,
          },
          { id: 456 },
        ];
        expectedResult = service.addPartyGroupToCollectionIfMissing(partyGroupCollection, partyGroup);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PartyGroup to an array that doesn't contain it", () => {
        const partyGroup: IPartyGroup = { id: 123 };
        const partyGroupCollection: IPartyGroup[] = [{ id: 456 }];
        expectedResult = service.addPartyGroupToCollectionIfMissing(partyGroupCollection, partyGroup);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partyGroup);
      });

      it('should add only unique PartyGroup to an array', () => {
        const partyGroupArray: IPartyGroup[] = [{ id: 123 }, { id: 456 }, { id: 15526 }];
        const partyGroupCollection: IPartyGroup[] = [{ id: 123 }];
        expectedResult = service.addPartyGroupToCollectionIfMissing(partyGroupCollection, ...partyGroupArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const partyGroup: IPartyGroup = { id: 123 };
        const partyGroup2: IPartyGroup = { id: 456 };
        expectedResult = service.addPartyGroupToCollectionIfMissing([], partyGroup, partyGroup2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(partyGroup);
        expect(expectedResult).toContain(partyGroup2);
      });

      it('should accept null and undefined values', () => {
        const partyGroup: IPartyGroup = { id: 123 };
        expectedResult = service.addPartyGroupToCollectionIfMissing([], null, partyGroup, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(partyGroup);
      });

      it('should return initial array if no PartyGroup is added', () => {
        const partyGroupCollection: IPartyGroup[] = [{ id: 123 }];
        expectedResult = service.addPartyGroupToCollectionIfMissing(partyGroupCollection, undefined, null);
        expect(expectedResult).toEqual(partyGroupCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
