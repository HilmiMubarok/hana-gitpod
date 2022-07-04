import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDocument, Document } from '../document.model';

import { DocumentService } from './document.service';

describe('Document Service', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;
  let elemDefault: IDocument;
  let expectedResult: IDocument | IDocument[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      documentId: 'AAAAAAA',
      documentTypeId: 'AAAAAAA',
      documentTypeDescription: 'AAAAAAA',
      values: 'AAAAAAA',
      comments: 'AAAAAAA',
      valuesContentType: 'AAAAAAA',
      description: 'AAAAAAA',
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

    it('should create a Document', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Document()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Document', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          documentId: 'BBBBBB',
          documentTypeId: 'BBBBBB',
          documentTypeDescription: 'BBBBBB',
          values: 'BBBBBB',
          comments: 'BBBBBB',
          valuesContentType: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Document', () => {
      const patchObject = Object.assign(
        {
          documentId: 'BBBBBB',
          documentTypeId: 'BBBBBB',
          documentTypeDescription: 'BBBBBB',
          comments: 'BBBBBB',
          description: 'BBBBBB',
        },
        new Document()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Document', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          documentId: 'BBBBBB',
          documentTypeId: 'BBBBBB',
          documentTypeDescription: 'BBBBBB',
          values: 'BBBBBB',
          comments: 'BBBBBB',
          valuesContentType: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should delete a Document', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDocumentToCollectionIfMissing', () => {
      it('should add a Document to an empty array', () => {
        const document: IDocument = { id: 123 };
        expectedResult = service.addDocumentToCollectionIfMissing([], document);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(document);
      });

      it('should not add a Document to an array that contains it', () => {
        const document: IDocument = { id: 123 };
        const documentCollection: IDocument[] = [
          {
            ...document,
          },
          { id: 456 },
        ];
        expectedResult = service.addDocumentToCollectionIfMissing(documentCollection, document);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Document to an array that doesn't contain it", () => {
        const document: IDocument = { id: 123 };
        const documentCollection: IDocument[] = [{ id: 456 }];
        expectedResult = service.addDocumentToCollectionIfMissing(documentCollection, document);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(document);
      });

      it('should add only unique Document to an array', () => {
        const documentArray: IDocument[] = [{ id: 123 }, { id: 456 }, { id: 56891 }];
        const documentCollection: IDocument[] = [{ id: 123 }];
        expectedResult = service.addDocumentToCollectionIfMissing(documentCollection, ...documentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const document: IDocument = { id: 123 };
        const document2: IDocument = { id: 456 };
        expectedResult = service.addDocumentToCollectionIfMissing([], document, document2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(document);
        expect(expectedResult).toContain(document2);
      });

      it('should accept null and undefined values', () => {
        const document: IDocument = { id: 123 };
        expectedResult = service.addDocumentToCollectionIfMissing([], null, document, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(document);
      });

      it('should return initial array if no Document is added', () => {
        const documentCollection: IDocument[] = [{ id: 123 }];
        expectedResult = service.addDocumentToCollectionIfMissing(documentCollection, undefined, null);
        expect(expectedResult).toEqual(documentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
