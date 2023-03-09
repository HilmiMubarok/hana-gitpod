export interface IRequestSlik {
  id?: number;
}

export class RequestSlik implements IRequestSlik {
  constructor(public id?: number) {}
}
