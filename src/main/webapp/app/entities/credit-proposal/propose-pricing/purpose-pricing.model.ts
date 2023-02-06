export interface IPurposePricing {
  industry?: string;
  usdToIdr?: number;
  industryCode?: number;
}

export class PurposePricing implements IPurposePricing {
  constructor(public industry?: any, public usdToIdr?: number, public industryCode?: number) {
    this.industry = '';
    this.usdToIdr = 0;
    this.industryCode = 0
  }
}
