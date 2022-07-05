export interface IDocument {
  id?: number;
  documentId?: string | null;
  documentTypeId?: string | null;
  documentTypeDescription?: string | null;
  values?: any | null;
  comments?: string | null;
  valuesContentType?: string | null;
  description?: string | null;
}

export class Document implements IDocument {
  constructor(
    public id?: number,
    public documentId?: string | null,
    public documentTypeId?: string | null,
    public documentTypeDescription?: string | null,
    public values?: any | null,
    public comments?: string | null,
    public valuesContentType?: string | null,
    public description?: string | null
  ) {}
}

export function getDocumentIdentifier(document: IDocument): number | undefined {
  return document.id;
}
