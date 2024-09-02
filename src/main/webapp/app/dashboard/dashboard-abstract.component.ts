import { Component, OnInit } from '@angular/core';

@Component({ template: '' })
export class DashboardAbstractComponent {
  public appraisalStatus = '';
  public creditProposalStatus = '';
  constructor() {}

  public setAppraisalStatus(): void {
    switch (this.getLocStor('POSO')) {
      case 'ADMIN_APPRAISER':
        this.appraisalStatus = 'ASSIGNMENT,RETURN_TO_ADMIN';
        break;
      case 'SURVEYOR':
        this.appraisalStatus = 'ASSIGNED,VISITED,RETURN_TO_OFFICER';
        break;
      case 'TL':
        this.appraisalStatus = 'APPROVAL_TL';
        break;
      case 'APR_DEPT_HEAD':
        this.appraisalStatus = 'APPROVAL_DEPT_HEAD';
        break;
      case 'APR_DH':
        this.appraisalStatus = 'APPROVAL_DH';
        break;
      default:
        this.appraisalStatus = 'DRAFT,RETURN_TO_RM,APPROVED';
        break;
    }
  }

  public setCreditProposalStatus(): void {
    switch (this.getLocStor('POSO')) {
      case 'BM':
        this.creditProposalStatus = 'CP_APPROVAL_BM';
        break;
      case 'SME_HEAD':
        this.creditProposalStatus = 'CP_APPROVAL_SME_HEAD';
        break;
      case 'DEPT_HEAD':
        this.creditProposalStatus = 'CP_APPROVAL_DEPTHEAD';
        break;
      case 'DH':
        this.creditProposalStatus = 'CP_APPROVAL_DH,CP_LOAN_APPROVAL';
        break;
      case 'CRA':
        this.creditProposalStatus = 'CP_APPROVE_TO_LA';
        break;
      case 'CRO':
        this.creditProposalStatus = 'CP_ASSIGNMENT,CP_DAR_FINAL,CP_LOAN_COMMITTEE,LA_DAR_NOTIF,PK_DAR_REVISION';
        break;
      case 'CRC':
        this.creditProposalStatus = 'CP_DAR_CHECKER,PK_DAR_REVISION_CHECKER';
        break;
      case 'CHECKER1':
        this.creditProposalStatus = 'CP_LOAN_APPROVAL';
        break;
      case 'CHECKER2':
        this.creditProposalStatus = 'CP_LOAN_APPROVAL';
        break;
      case 'HCR1':
        this.creditProposalStatus = 'CP_LOAN_APPROVAL,CP_LOAN_COMMITTEE';
        break;
      case 'HCR2':
        this.creditProposalStatus = 'CP_LOAN_APPROVAL,CP_LOAN_COMMITTEE';
        break;
      case 'BUSINESS_SUPPORT':
        this.creditProposalStatus = 'CP_LOAN_APPROVAL,CP_LOAN_COMMITTEE';
        break;
      case 'CREDIT_DIR':
        this.creditProposalStatus = 'CP_LOAN_APPROVAL,CP_LOAN_COMMITTEE';
        break;
      case 'FINANCE_DIR':
        this.creditProposalStatus = 'CP_LOAN_APPROVAL,CP_LOAN_COMMITTEE';
        break;
      case 'CC_ADMIN':
        this.creditProposalStatus = 'CP_CC_DISTRIBUTION';
        break;

      case 'CC_ANALYST':
        this.creditProposalStatus = 'CP_CC_ANALYST';
        break;
      case 'CC_DEPT_HEAD':
        this.creditProposalStatus = 'CP_CC_DEPT_HEAD';
        break;
      case 'CC_DH':
        this.creditProposalStatus = 'CP_CC_DIV_HEAD';
        break;
      case 'CC_DIR':
        this.creditProposalStatus = 'CP_CC_DIRECTOR';
        break;
      case 'LEGAL_OFFICER':
        this.creditProposalStatus = 'OL_ASSIGNED,PK_FINALIZE,PK_GENERATED,DPDL_FINALIZE,PK_RETURN_TO_OL';
        break;
      case 'LEGALOFFICER_OUTREGION':
        this.creditProposalStatus = 'OL_ASSIGNED,PK_FINALIZE,PK_GENERATED,DPDL_FINALIZE,PK_RETURN_TO_OL';
        break;
      case 'LEGAL_TEAM_LEAD':
        this.creditProposalStatus = 'OL_REVIEW_TEAMLEAD,PK_REVIEW_TEAMLEAD,DPDL_REVIEW_TEAMLEAD';
        break;
      case 'CREDIT_LEGAL_LEAD':
        this.creditProposalStatus = 'OL_DISTRIBUTION,OL_REVIEW_LEAD,PK_REVIEW_LEAD,DPDL_REVIEW_LEAD';
        break;
      case 'LEGAL_HEAD':
        this.creditProposalStatus = 'OL_REVIEW_HEAD,DPDL_REVIEW_HEAD';
        break;
      case 'CREDIT_ADMIN':
        this.creditProposalStatus = 'DPPK_FINALIZE';
        break;
      case 'CREDIT_ADMIN_DEPT_HEAD':
        this.creditProposalStatus = 'DPPK_REVIEW';
        break;
      case 'CREDIT_ADMIN_DIV_HEAD':
        this.creditProposalStatus = 'DPPK_REVIEW';
        break;
      case 'CREDIT_ADMIN_TEAM_LEAD':
        this.creditProposalStatus = 'DPPK_REVIEW';
        break;
      case 'CREDIT_ADMIN_UNIT_HEAD':
        this.creditProposalStatus = 'DPPK_REVIEW';
        break;
      case 'LOAN_OPS_ADMIN':
        this.creditProposalStatus = 'LOAN_OPS_DISTRIBUTION';
        break;
      case 'LOAN_OPS_OFFICER':
        this.creditProposalStatus = 'LOAN_OPS_CHECKING';
        break;
      case 'LOAN_OPS_SPV':
        this.creditProposalStatus = 'LOAN_OPS_REVIEW';
        break;
      default:
        this.creditProposalStatus =
          'DRAFT,CP_RETURN_TO_RM,CP_RETURN_TO_CR,RETURN_TO_RM_CRA,OL_APPEAL,RETURN_TO_RM_LEGAL,PK_RETURN_TO_RM,DPDL_RETURN_TO_RM,OL_CONFIRMATION';
        break;
    }
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }
}
