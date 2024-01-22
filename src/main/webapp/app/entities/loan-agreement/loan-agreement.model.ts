export interface ILoanAgreement {
  id?: number | null;
  attributes: any;
  agreementNumber?: string | null;
  dateAgreement?: Date | null;
  description?: string | null;
  name?: string | null;
  internalId?: string | null;
  internalName?: string | null;
  notes?: string | null;
  fromDate?: Date | null;
  thruDate?: Date | null;
  statusId?: string | null;
  statusCode?: string | null;
  statusDescription?: string | null;
  agreementTypeId?: string | null;
  agreementTypeDescription?: string | null;
  applicationId?: number | null;
  toPartyId?: string;
}
