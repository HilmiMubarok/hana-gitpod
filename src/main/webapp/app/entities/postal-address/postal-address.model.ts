import { IPurposeType } from 'app/entities/purpose-type/purpose-type.model';

export interface IPostalAddress {
  id?: number;
  address1?: string;
  address2?: string;
  latitude?: number;
  longitude?: number;
  contactTypeDescription?: string;
  contactTypeId?: string;
  purposes?: IPurposeType[];
  countryDescription?: string;
  countryId?: number;
  provinceDescription?: string;
  provinceId?: number;
  cityDescription?: string;
  cityId?: number;
  districtDescription?: string;
  districtId?: number;
  villageDescription?: string;
  villageId?: number;
}

export class PostalAddress implements IPostalAddress {
  constructor(
    public id?: number,
    public address1?: string,
    public address2?: string,
    public latitude?: number,
    public longitude?: number,
    public contactTypeDescription?: string,
    public contactTypeId?: string,
    public purposes?: IPurposeType[],
    public countryDescription?: string,
    public countryId?: number,
    public provinceDescription?: string,
    public provinceId?: number,
    public cityDescription?: string,
    public cityId?: number,
    public districtDescription?: string,
    public districtId?: number,
    public villageDescription?: string,
    public villageId?: number
  ) {}
}
