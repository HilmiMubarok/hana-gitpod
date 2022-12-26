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
  countryName?: string;
  countryId?: number;
  provinceName?: string;
  provinceId?: number;
  postalCode?: string;
  cityName?: string;
  cityId?: number;
  districtName?: string;
  districtId?: number;
  villageName?: string;
  villageId?: number;
  rt?: string;
  rw?: string;
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
    public countryName?: string,
    public countryId?: number,
    public provinceName?: string,
    public provinceId?: number,
    public postalCode?: string,
    public cityName?: string,
    public cityId?: number,
    public districtName?: string,
    public districtId?: number,
    public villageName?: string,
    public villageId?: number,
    public rt?: string,
    public rw?: string
  ) {}
}
