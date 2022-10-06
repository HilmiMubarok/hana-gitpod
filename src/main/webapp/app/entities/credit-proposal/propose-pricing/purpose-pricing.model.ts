export interface IPurposePricing {
  industry?: string;
  usdToIdr?: number;
}

export class PurposePricing implements IPurposePricing {
  constructor(public industry?: any, public usdToIdr?: number) {
    this.industry = '';
    this.usdToIdr = 0;
  }
}
