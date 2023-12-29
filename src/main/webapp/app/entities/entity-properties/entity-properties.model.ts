export interface IEntityProperties {
  id?: number;
  entityPropertyTypeId?: string;
  loanApplicationId?: number;
  loanAgreementId?: number;
  dpdlNumber?: string;
  dpdlDate?: string;
  dpdlPic?: string;
  dpdlPlace?: string;
  approvalDebtorConditionStatus?: string;
  approvalDebtorConditionName?: string;
  approvalDebtorConditionNumber?: string;
  approvalDebtorConditionDate?: string;
  approvalDebtorConditionCivilRegistrationDate?: string;
  approvalDebtorConditionCivilRegistryDocumentNumber?: string;
  approvalDebtorConditionNotaryPublicPlace?: string;
  approvalDebtorConditionNotaryPublicName?: string;
}

export class EntityProperties implements IEntityProperties {
  constructor(
    public id?: number,
    public entityPropertyTypeId?: string,
    public loanApplicationId?: number,
    public loanAgreementId?: number,
    public dpdlNumber?: string,
    public dpdlDate?: string,
    public dpdlPic?: string,
    public dpdlPlace?: string,
    public approvalDebtorConditionStatus?: string,
    public approvalDebtorConditionName?: string,
    public approvalDebtorConditionNumber?: string,
    public approvalDebtorConditionDate?: string,
    public approvalDebtorConditionCivilRegistrationDate?: string,
    public approvalDebtorConditionCivilRegistryDocumentNumber?: string,
    public approvalDebtorConditionNotaryPublicPlace?: string,
    public approvalDebtorConditionNotaryPublicName?: string
  ) {}
}
