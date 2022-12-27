import { IPurposeType } from 'app/entities/purpose-type/purpose-type.model';

export interface IPostalAddressWharehouse {
  address1?: string;
  address2?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  contactTypeDescription?: string;
  attributes?: any;
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
  villageCode?: string;
  villageId?: number;
  rt?: string;
  rw?: string;
  countryBoundaryId?: string;
}

export class PostalAddressWarehouse implements IPostalAddressWharehouse {
  constructor(
    public address1?: string,
    public address2?: string,
    public description?: string,
    public latitude?: number,
    public longitude?: number,
    public attributes?: any,
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
    public villageCode?: string,
    public villageId?: number,
    public rt?: string,
    public rw?: string,
    public countryBoundaryId?: string
  ) {}
}
