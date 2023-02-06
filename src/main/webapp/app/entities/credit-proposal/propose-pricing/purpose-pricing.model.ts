export interface IPurposePricing {
  industry?: string;
  usdToIdr?: number;
  industryCode?: string;
}

export class PurposePricing implements IPurposePricing {
  constructor(public industry?: any, public usdToIdr?: number, public industryCode?: string) {
    this.industry = '';
    this.usdToIdr = 0;
    this.industryCode = ''
  }
}
