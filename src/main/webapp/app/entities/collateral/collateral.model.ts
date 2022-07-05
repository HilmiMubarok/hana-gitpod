import dayjs from 'dayjs/esm';

export interface ICollateral {
  id?: number;
  fromDate?: dayjs.Dayjs | null;
  thruDate?: dayjs.Dayjs | null;
  collateralTypeId?: string | null;
  collateralTypeDescription?: string | null;
  partyId?: string | null;
  partyName?: string | null;
  applicationId?: number | null;
}

export class Collateral implements ICollateral {
  constructor(
    public id?: number,
    public fromDate?: dayjs.Dayjs | null,
    public thruDate?: dayjs.Dayjs | null,
    public collateralTypeId?: string | null,
    public collateralTypeDescription?: string | null,
    public partyId?: string | null,
    public partyName?: string | null,
    public applicationId?: number | null
  ) {}
}

export function getCollateralIdentifier(collateral: ICollateral): number | undefined {
  return collateral.id;
}
