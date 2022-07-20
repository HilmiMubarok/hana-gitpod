interface attributesCif {
  additionalProp1?: string;
  additionalProp2?: string;
  additionalProp3?: string;
}

export interface ICif {
  id?: number;
  number?: string;
  customerStatus?: string;
  customerType?: string;
  partyId?: string;
  partyTypeId?: string;
  nmRm?: string;
  nmRm1?: string;
  nmRm2?: string;
  nmRm3?: string;
  regional?: string;
  segmentBusiness?: string;
  openingBranch?: string;
  riskProfile?: string;
  tinSsnEin?: string;
  attributes?: attributesCif;
}

export class Cif implements ICif {
  constructor(
    public id?: number,
    public number?: string,
    public customerStatus?: string,
    public customerType?: string,
    public partyId?: string,
    public partyTypeId?: string,
    public nmRm?: string,
    public nmRm1?: string,
    public nmRm2?: string,
    public nmRm3?: string,
    public regional?: string,
    public segmentBusiness?: string,
    public openingBranch?: string,
    public riskProfile?: string,
    public tinSsnEin?: string,
    public attributes?: attributesCif
  ) {}
}
