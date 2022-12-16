export interface IDocumentNode {
  name?: string;
  key?: string;
  size?: number;
  url?: string;
  tags?: object[];
  metaData?: object[];
}

export class DocumentNode implements IDocumentNode {
  constructor(
    public name?: string,
    public key?: string,
    public size?: number,
    public url?: string,
    public tags?: object[],
    public metaData?: object[]
  ) {}
}
