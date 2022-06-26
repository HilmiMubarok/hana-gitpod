export interface IVendorProduct {
  id?: number;
  dropShipment?: boolean;
  orderRatio?: number;
  qtyOrder?: number;
  fromDate?: Date;
  thruDate?: Date;
  productName?: string;
  productId?: number;
  organizationName?: string;
  organizationId?: string;
  vendorName?: string;
  vendorId?: string;
}

export class VendorProduct implements IVendorProduct {
  constructor(
    public id?: number,
    public dropShipment?: boolean,
    public orderRatio?: number,
    public qtyOrder?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public productName?: string,
    public productId?: number,
    public organizationName?: string,
    public organizationId?: string,
    public vendorName?: string,
    public vendorId?: string
  ) {
    this.dropShipment = this.dropShipment || false;
  }
}
