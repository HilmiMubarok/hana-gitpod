export interface IDocumentType {
  id?: number;
  documentTypeId?: string | null;
  description?: string | null;
}

export class DocumentType implements IDocumentType {
  constructor(public id?: number, public documentTypeId?: string | null, public description?: string | null) {}
}

export function getDocumentTypeIdentifier(documentType: IDocumentType): number | undefined {
  return documentType.id;
}
