import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CashPositionService } from 'app/entities/cash-position/cash-position.service';
import { ILoanApplication, LoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { IPosition } from 'app/entities/position/position.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { DIRECTION, POSITION_TYPE, RELATION_TYPE } from 'app/shared/constants/base.constants';
import { STATUS } from 'app/shared/constants/status.constants';
import lodash from 'lodash';
import { firstValueFrom } from 'rxjs';
import { CorrectionApplication, ICorrectionApplication } from './correction-application.model';
import { CorrectionApplicationService } from './correction-application.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-correction-application-edit-info',
  templateUrl: './correction-application-edit-info.component.html',
})
export class CorrectionApplicationEditInfoComponent {
  public infoContent: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
    this.infoContent = data;
  }
}
@Component({
  selector: 'jhi-correction-application-edit',
  templateUrl: './correction-application-edit.component.html',
  styleUrls: ['./correction-application.scss'],
})
export class CorrectionApplicationEditComponent extends AbstractEntityMaterialComponent<IPosition> implements OnInit {
  public displayColumns: string[] = ['no', 'internal', 'name', 'position', 'select'];
  private idApplication: number;
  public isDppkReview: Boolean = false;
  public loanApplication: ILoanApplication = new LoanApplication();
  constructor(
    private loanApplicationService: LoanApplicationService,
    private route: ActivatedRoute,
    private _snackbar: MatSnackBar,
    private cashPositionService: CashPositionService,
    private router: Router,
    private correctionApplicationService: CorrectionApplicationService,
    private dialog: MatDialog
  ) {
    super(_snackbar, loanApplicationService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.loading = true;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.route.paramMap.subscribe(params => {
      this.idApplication = parseInt(params.get('id'), 10);
    });
  }

  ngOnInit(): void {
    this.getById().then(() => {
      this.getPositions();
      this.loading = false;
    });
  }

  public async getById(): Promise<void> {
    this.loanApplication = (await firstValueFrom(this.loanApplicationService.find(this.idApplication))).body;
  }

  private async getPositions(): Promise<void> {
    const statusId: string = this.loanApplication.statusId;

    let param: object = {};
    param = {
      page: 0,
      size: 9999,
      sort: ['id', 'desc'],
    };

    switch (statusId) {
      case STATUS.CP_ASSIGNMENT: {
        param['active'] = true;
        // const dataAssignToCRO: object = JSON.parse(this.loanApplication.attributes['dataAssignToCRO']);
        // param['idParty'] = dataAssignToCRO['partyId'];
        param['idPositionType'] = POSITION_TYPE.CRO;
        break;
      }
      case STATUS.CP_CHECKER: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CRC;
        break;
      }
      case STATUS.CP_LOAN_APPROVAL: {
        param['active'] = true;
        param['relationType'] = this.loanApplication.approvalLc;
        break;
      }
      case STATUS.CP_LOAN_COMMITTEE: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CRO;
        break;
      }
      case STATUS.CP_DAR_FINAL: {
        param['active'] = true;
        // const dataAssignToCRO: object = JSON.parse(this.loanApplication.attributes['dataAssignToCRO']);
        // param['idParty'] = dataAssignToCRO['partyId'];
        param['idPositionType'] = POSITION_TYPE.CRO;
        break;
      }
      case STATUS.CP_DAR_CHECKER: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.DAR;
        param['idPositionType'] = POSITION_TYPE.CRC + ',' + POSITION_TYPE.HCR1 + ',' + POSITION_TYPE.HCR2;
        break;
      }
      case STATUS.LA_DAR_NOTIF: {
        param['active'] = true;
        // const dataAssignToCRO: object = JSON.parse(this.loanApplication.attributes['dataAssignToCRO']);
        // param['idParty'] = dataAssignToCRO['partyId'];
        param['idPositionType'] = POSITION_TYPE.CRO;
        break;
      }
      case STATUS.CP_CC_ANALYST: {
        param['active'] = true;
        // const dataAssignToCCAdmin: object = JSON.parse(this.loanApplication.attributes['dataAssignToCCAdmin']);
        // param['idParty'] = dataAssignToCCAdmin['partyId'];
        param['idPositionType'] = POSITION_TYPE.CC_ANALYST;
        break;
      }
      case STATUS.OL_ASSIGNED: {
        param['active'] = true;
        // const dataAssignToLegalOfficer: object = JSON.parse(this.loanApplication.attributes['dataAssignToLegalOfficer']);
        // param['idParty'] = dataAssignToLegalOfficer['partyId'];
        param['idPositionType'] = POSITION_TYPE.LEGAL_OFFICER;
        param['code'] = 'LEGAL_OFFICER';
        break;
      }
      case STATUS.CP_APPROVAL_BM: {
        param['active'] = true;
        param['idInternal'] = this.loanApplication.ownerPosition.internalId;
        param['idPositionType'] = POSITION_TYPE.BM;
        break;
      }
      case STATUS.CP_APPROVAL_DEPTHEAD: {
        param['hierarchyInternal'] = true;
        param['hierarchyLevel'] = 2;
        param['hierarchyDirection'] = DIRECTION.SUPERORDINATE;
        param['idPositionType'] = POSITION_TYPE.DEPT_HEAD;
        param['idInternal'] = this.loanApplication.ownerPosition.internalId;
        break;
      }
      case STATUS.CP_RETURN_TO_RM: {
        param['active'] = true;
        param['idParty'] = this.loanApplication.ownerPosition.partyId;
        param['idPositionType'] = POSITION_TYPE.RM;
        break;
      }
      case STATUS.CP_APPROVAL_SME_HEAD: {
        param['hierarchyInternal'] = true;
        param['hierarchyLevel'] = 1;
        param['hierarchyDirection'] = DIRECTION.SUPERORDINATE;
        param['idPositionType'] = POSITION_TYPE.SME_HEAD;
        param['idInternal'] = this.loanApplication.ownerPosition.internalId;
        break;
      }
      case STATUS.CP_APPROVAL_DH: {
        param['hierarchyInternal'] = true;
        param['hierarchyLevel'] = 2;
        param['hierarchyDirection'] = DIRECTION.SUPERORDINATE;
        param['idPositionType'] = POSITION_TYPE.DH;
        param['idInternal'] = this.loanApplication.ownerPosition.internalId;
        break;
      }
      case STATUS.CP_APPROVAL_SDH: {
        param['hierarchyInternal'] = true;
        param['hierarchyLevel'] = 2;
        param['hierarchyDirection'] = DIRECTION.SUPERORDINATE;
        param['idPositionType'] = POSITION_TYPE.SDH;
        param['idInternal'] = this.loanApplication.ownerPosition.internalId;
        break;
      }
      case STATUS.CP_APPROVE_TO_LA: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CRA;
        break;
      }
      case STATUS.RETURN_TO_RM_CRA: {
        param['active'] = true;
        param['idParty'] = this.loanApplication.ownerPosition.partyId;
        param['idPositionType'] = POSITION_TYPE.RM;
        break;
      }
      case STATUS.CP_CC_DISTRIBUTION: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CC_ADMIN;
        break;
      }
      case STATUS.CP_CC_DIV_HEAD: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CC_DH;
        break;
      }
      case STATUS.CP_CC_DEPT_HEAD: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CC_DEPT_HEAD;
        break;
      }
      case STATUS.OL_DISTRIBUTION: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CREDIT_LEGAL_LEAD;
        break;
      }
      case STATUS.CP_CC_DIRECTOR: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CREDIT_LEGAL_LEAD;
        break;
      }
      case STATUS.OL_REVIEW_TEAMLEAD: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.OL_APPROVAL;
        param['idPositionType'] = POSITION_TYPE.LEGAL_TEAM_LEAD;
        break;
      }
      case STATUS.OL_REVIEW_LEAD: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CREDIT_LEGAL_LEAD;
        break;
      }
      case STATUS.OL_REVIEW_HEAD: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.LEGAL_HEAD;
        break;
      }
      case STATUS.OL_APPEAL: {
        param['active'] = true;
        param['idParty'] = this.loanApplication.ownerPosition.partyId;
        param['idPositionType'] = POSITION_TYPE.RM;
        break;
      }
      case STATUS.OL_CONFIRMATION: {
        param['active'] = true;
        param['idParty'] = this.loanApplication.ownerPosition.partyId;
        param['idPositionType'] = POSITION_TYPE.RM;
        break;
      }

      // NEW STATUSES
      case STATUS.PK_FINALIZE: {
        const dataAssignToLegalOfficer = JSON.parse(this.loanApplication.attributes.dataAssignToLegalOfficer);
        param['idParty'] = dataAssignToLegalOfficer['partyId'];
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.OFFERING_LETTER;
        param['idPositionType'] = POSITION_TYPE.LEGALOFFICER_OUTREGION;
        param['code'] = 'LEGAL_OFFICER';
        break;
      }

      case STATUS.PK_RETURN_TO_RM: {
        param['active'] = true;
        param['idParty'] = this.loanApplication.ownerPosition.partyId;
        param['idPositionType'] = POSITION_TYPE.RM;
        param['relationType'] = RELATION_TYPE.CREDIT_PROPOSAL;
        break;
      }

      case STATUS.PK_RETURN_TO_OL: {
        const dataAssignToLegalOfficer: object = JSON.parse(this.loanApplication.attributes['dataAssignToLegalOfficer']);
        param['idParty'] = dataAssignToLegalOfficer['partyId'];
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.LEGALOFFICER_OUTREGION;
        param['relationType'] = RELATION_TYPE.OFFERING_LETTER;
        param['code'] = 'LEGAL_OFFICER';
        break;
      }

      case STATUS.PK_REVIEW_TEAMLEAD: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.OL_APPROVAL;
        param['idPositionType'] = POSITION_TYPE.LEGAL_TEAM_LEAD;
        break;
      }

      case STATUS.PK_DAR_REVISION: {
        const dataAssignToLegalOfficer: object = JSON.parse(this.loanApplication.attributes['dataAssignToLegalOfficer']);
        param['idParty'] = dataAssignToLegalOfficer['partyId'];
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.LOAN_ANALYSIS;
        param['idPositionType'] = POSITION_TYPE.CRO;
        break;
      }

      case STATUS.PK_DAR_REVISION_CHECKER: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.DAR;
        param['idPositionType'] = POSITION_TYPE.CRC + ',' + POSITION_TYPE.HCR1 + ',' + POSITION_TYPE.HCR2;
        break;
      }

      case STATUS.PK_REVIEW_LEAD: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.CREDIT_LEGAL_LEAD;
        param['relationType'] = RELATION_TYPE.OL_APPROVAL;
        break;
      }

      case STATUS.PK_GENERATED: {
        const dataAssignToLegalOfficer: object = JSON.parse(this.loanApplication.attributes['dataAssignToLegalOfficer']);
        param['idParty'] = dataAssignToLegalOfficer['partyId'];
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.OFFERING_LETTER;
        param['idPositionType'] = POSITION_TYPE.LEGAL_OFFICER;
        param['code'] = 'LEGAL_OFFICER';
        break;
      }

      case STATUS.DPDL_FINALIZE: {
        const dataAssignToLegalOfficer: object = JSON.parse(this.loanApplication.attributes['dataAssignToLegalOfficer']);
        param['idParty'] = dataAssignToLegalOfficer['partyId'];
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.OFFERING_LETTER;
        param['idPositionType'] = POSITION_TYPE.LEGAL_OFFICER;
        param['code'] = 'LEGAL_OFFICER';
        break;
      }

      case STATUS.DPDL_RETURN_TO_RM: {
        param['active'] = true;
        param['idParty'] = this.loanApplication.ownerPosition.partyId;
        param['idPositionType'] = POSITION_TYPE.RM;
        param['relationType'] = RELATION_TYPE.CREDIT_PROPOSAL;
        break;
      }

      case STATUS.DPDL_REVIEW_TEAMLEAD: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.OL_APPROVAL;
        param['idPositionType'] = POSITION_TYPE.LEGAL_TEAM_LEAD;
        break;
      }

      case STATUS.DPDL_REVIEW_LEAD: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.OL_APPROVAL;
        param['idPositionType'] = POSITION_TYPE.CREDIT_LEGAL_LEAD;
        break;
      }

      // NEW PHASE 2

      case STATUS.DPDL_REVIEW_HEAD: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.OL_APPROVAL;
        param['idPositionType'] = POSITION_TYPE.ROLE_LEGAL_HEAD;
        break;
      }

      case STATUS.DPPK_FINALIZE: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.DPPK;
        param['idPositionType'] = POSITION_TYPE.ROLE_CREDIT_ADMIN;
        break;
      }

      case STATUS.LOAN_OPS_DISTRIBUTION: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.LOAN_OPERATION;
        param['idPositionType'] = POSITION_TYPE.LOAN_OPS_ADMIN;
        break;
      }
      case STATUS.LOAN_OPS_CHECKING: {
        const dataAssignToLoanOpsOfficer: object = JSON.parse(this.loanApplication.attributes.dataAssignToLoanOpsOfficer);
        param['idParty'] = dataAssignToLoanOpsOfficer['partyId'];
        param['relationType'] = RELATION_TYPE.LOAN_OPERATION;
        break;
      }
      case STATUS.LOAN_OPS_REVIEW: {
        param['active'] = true;
        param['relationType'] = RELATION_TYPE.LOAN_OPERATION_APPROVAL;
        param['idPositionType'] = POSITION_TYPE.LOAN_OPS_SPV;
        break;
      }

      // DPPK REVIEW is SPECIAL CASE.
      case STATUS.DPPK_REVIEW: {
        this.isDppkReview = true;
        this.getDppkReview2();

        const dataAssignToDPPKReview1: object = JSON.parse(this.loanApplication.attributes.dataAssignToDPPKReview1);
        param['idParty'] = dataAssignToDPPKReview1['partyId'];
        break;
      }

      default: {
        param = {};
        break;
      }
    }

    const resp: HttpResponse<IPosition[]> = await firstValueFrom(this.cashPositionService.filterBy(param));
    this.initDataForMatTable(resp, resp.headers);
  }

  dppkReviewDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  getDppkReview2() {
    const params = {
      page: 0,
      size: 999,
      idParty: JSON.parse(this.loanApplication.attributes.dataAssignToDPPKReview2)['partyId'],
      sort: ['id', 'desc'],
    };

    this.cashPositionService.filterBy(params).subscribe(res => (this.dppkReviewDataSource = res.body as any));
  }

  private validate(loanApplication: ILoanApplication, positions: IPosition[]): void {
    const statusId: string = loanApplication.statusId;
    switch (statusId) {
      case STATUS.CP_DAR_CHECKER: {
        const filterSelectedPositions: IPosition[] = lodash.filter(positions, function (o) {
          return o['checked'] === true;
        });

        let isCRC: boolean;
        let isHCR1: boolean;
        let isHCR2: boolean;
        isHCR1 = false;
        isHCR2 = false;
        isCRC = false;

        for (let i = 0; i < filterSelectedPositions.length; i++) {
          if (!isCRC && filterSelectedPositions[i].positionTypeId === POSITION_TYPE.CRC) {
            isCRC = true;
          }

          if (!isHCR1 && filterSelectedPositions[i].positionTypeId === POSITION_TYPE.HCR1) {
            isHCR1 = true;
          }

          if (!isHCR2 && filterSelectedPositions[i].positionTypeId === POSITION_TYPE.HCR2) {
            isHCR2 = true;
          }
        }

        /* if (!isCRC || !isHCR1 || !isHCR2) {
          throw new Error('Please check selected person position requirement');
        } */

        if (isCRC || isHCR1 || isHCR2) {
          // throw new Error('Please check selected person position requirement');
          const j = 'ok';
        } else {
          throw new Error('Please check selected person position requirement');
        }

        break;
      }
      default: {
        break;
      }
    }
  }

  public save(data: MatTableDataSource<IPosition>): void {
    try {
      this.validate(this.loanApplication, data.filteredData);
      const filterSelectedPositions: IPosition[] = lodash.filter(data.filteredData, function (o) {
        return o['checked'] === true;
      });

      const correctionAppraisal: ICorrectionApplication = new CorrectionApplication();
      correctionAppraisal.applicationId = this.idApplication;
      correctionAppraisal.selectedPosition = filterSelectedPositions;

      this.correctionApplicationService.create(correctionAppraisal).subscribe({
        next: res => {
          this.router.navigate(['/options/correction-application']);
        },
        error: (err: HttpErrorResponse) => {
          this.showErrorWithSnackBarMaterial(err.error['detail']);
        },
      });
    } catch (error: any) {
      this.showErrorWithSnackBarMaterial(error);
    }
  }

  public openInfo(): void {
    const statusId: string = this.loanApplication.statusId;
    const statusDesc: string = this.loanApplication.statusDescription;
    let content: string;
    switch (statusId) {
      case STATUS.CP_ASSIGNMENT: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Credit Reviewer Officer';
        +' with active status';
        break;
      }
      case STATUS.CP_CHECKER: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Credit Reviewer Checker' + ' with active status';
        break;
      }
      case STATUS.CP_LOAN_APPROVAL: {
        content = 'Status ' + statusDesc;
        break;
      }
      case STATUS.CP_LOAN_COMMITTEE: {
        content = 'Status ' + statusDesc;
        break;
      }
      case STATUS.CP_DAR_FINAL: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Credit Reviewer Officer' + ' with active status';
        break;
      }
      case STATUS.CP_DAR_CHECKER: {
        content =
          'Status ' +
          statusDesc +
          ' searching for position data ' +
          'Credit Reviewer Checker' +
          ',' +
          'Head of Credit Review 1' +
          ',' +
          'Head of Credit Review 2' +
          ' with active status';
        break;
      }
      case STATUS.LA_DAR_NOTIF: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Credit Reviewer Officer' + ' with active status';
        break;
      }
      case STATUS.CP_CC_ANALYST: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Compliance Analyst' + ' with active status';
        break;
      }
      case STATUS.OL_ASSIGNED: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Legal Officer' + ' with active status';
        break;
      }
      case STATUS.CP_APPROVAL_BM: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Branch Manager' + ' with active status';
        break;
      }
      case STATUS.CP_APPROVAL_DEPTHEAD: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Department Head' + ' with active status';
        break;
      }
      case STATUS.CP_RETURN_TO_RM: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Relationship Manager' + ' with active status';
        break;
      }
      case STATUS.CP_APPROVAL_SME_HEAD: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'SME Head' + ' with active status';
        break;
      }
      case STATUS.CP_APPROVAL_DH: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Division Head' + ' with active status';
        break;
      }
      case STATUS.CP_APPROVAL_SDH: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Sales & Dist. Head' + ' with active status';
        break;
      }
      case STATUS.CP_APPROVE_TO_LA: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Credit Reviewer Admin' + ' with active status';
        break;
      }
      case STATUS.RETURN_TO_RM_CRA: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Relationship Manager' + ' with active status';
        break;
      }
      case STATUS.CP_CC_DISTRIBUTION: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Compliance Admin' + ' with active status';
        break;
      }
      case STATUS.CP_CC_DIV_HEAD: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Head of Compliance' + ' with active status';
        break;
      }
      case STATUS.CP_CC_DEPT_HEAD: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Compliance Dept Head' + ' with active status';
        break;
      }
      case STATUS.OL_DISTRIBUTION: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Credit Legal Lead' + ' with active status';
        break;
      }
      case STATUS.CP_CC_DIRECTOR: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Credit Legal Lead' + ' with active status';
        break;
      }
      case STATUS.OL_REVIEW_TEAMLEAD: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Credit Legal Team Lead' + ' with active status';
        break;
      }
      case STATUS.OL_REVIEW_LEAD: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Credit Legal Lead' + ' with active status';
        break;
      }
      case STATUS.OL_REVIEW_HEAD: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Head of Legal' + ' with active status';
        break;
      }
      case STATUS.OL_APPEAL: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Relationship Manager' + ' with active status';
        break;
      }
      case STATUS.OL_CONFIRMATION: {
        content = 'Status ' + statusDesc + ' searching for position data ' + 'Relationship Manager' + ' with active status';
        break;
      }
      default: {
        content = 'Status ini tidak terdapat content';
        break;
      }
    }
    this.dialog.open(CorrectionApplicationEditInfoComponent, {
      width: '800px',
      data: content,
    });
  }
}
