export interface IPartyCifDocumentChecklis {
  documentType?: string;
  document?: string;
  category?: string;
  dueDate?: string;
  status?: string;
  remarks?: string;
}

export interface ITags {
  tags?: IPartyCifDocumentChecklis;
}

export interface IElement {
  element?: ITags;
}

export interface IPartyCifDocumentChecklisData {
  body?: IElement[];
}
