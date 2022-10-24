export interface IslikSummmary {
  bank?: string;
  limit?: number;
  outstanding?: number;
  facilityType?: string;
  rate?: number;
  period?: string;
  collateralType?: string;
  collateralIdrMio?: string;
  tenor?: number;
  lastCollectability?: string;
  worstCollectability?: string;
  restructureFrequency?: string;
}

// export class slilSummary implements IslikSummmary{
//     constructor(public bank?: string, public limit?: number, public outstanding?: number,public facilityType?: string,public rate?: number,public periode?: string, public collateralType?: string, public collateralIdrMio?: string, public tenor?: number, ){

//     }
// }
