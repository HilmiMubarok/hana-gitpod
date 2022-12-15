import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ApplicationRole, IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import { IApplicationStateLog } from 'app/entities/application-state-log/application-state-log.model';
import { ApplicationStateLogService } from 'app/entities/application-state-log/application-state-log.service';
import { LoanAnalysService } from 'app/entities/loan-analys/loan-analys.service';
import { IPositionReportingStructure } from 'app/entities/position-reporting-structure/position-reporting-structure.model';
import { PositionReportingStructureService } from 'app/entities/position-reporting-structure/position-reporting-structure.service';
import { IPosition, Position } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import lodash from 'lodash';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
// import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-approve-user',
  templateUrl: './approve-user.component.html',
  styleUrls: ['./approve-user.css'],
})
export class CreditProposalApproveUserComponent extends AbstractEntityMaterialComponent<IPositionReportingStructure> implements OnInit {
  public displayColumns: string[] = ['no', 'position', 'name', 'remarks', 'available', 'alternatename'];
  public creditProposalStatusCodes = [
    'DRAFT',
    'RETURN TO CREDIT PROPOSAL (BU)',
    'APPROVAL SME HEAD',
    'APPROVAL BM',
    'APPROVAL SDH',
    'APPROVAL DIV HEAD',
    'CANCEL',
    'REJECT',
    'COMPLETE',
  ];
  public loading: boolean;
  public itemsPerPage = 10;
  public page = 0;
  public idRelationType: string;
  public items: any;
  public dateCurren: any;
  public idApp: any;
  public approvalUser = [];
  private _creditProposal: ICreditProposal;
  public position: IPosition[];
  public applicationRole: IApplicationRole;
  public applicationRoleId: number;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  constructor(
    protected snackbar: MatSnackBar,
    protected positionReportingStructureService: PositionReportingStructureService,
    private applicationStateLogService: ApplicationStateLogService,
    private positionService: PositionService,
    public applicationRoleService: ApplicationRoleService,
    protected activatedRoute: ActivatedRoute,
    protected loanAnalysService: LoanAnalysService
  ) {
    super(snackbar, positionReportingStructureService);
    this.loading = false;
    this.idApp = this.activatedRoute.snapshot.paramMap.get('id');
    this.applicationRole = new ApplicationRole();
  }
  ngOnInit(): void {
    this.setApprovalLevel();
    console.log(this.items);
  }

  // singleCheck(checkNode: any) {
  //   if (checkNode.target.classList.contains('checked')) {
  //     checkNode.target.classList.remove('checked');
  //   } else {
  //     checkNode.target.classList.add('checked');
  //   }
  // }

  // setCurrenDate() {
  //   this.items.fromDate = new Date();
  // }

  setApprovalLevel() {
    this.loanAnalysService.getAprovalLevel(this.idApp).subscribe(res => {
      this.items = res.body;
    });
    console.log('data', this.items);
  }
  // ngOnInit(): void {
  //   console.log('Ini TimeLine', this.showTimeLine());
  //   console.log('Ini TimeLine', this.creditProposal);
  // }

  // private convertToTimelineModel(data: IApplicationStateLog[]) {
  //   const result: ITimeline[] = [];
  //   if (data.length > 0) {
  //     let rs: ITimeline;
  //     let rz: IPosition;
  //     for (let i = 0; i < data.length; i++) {
  //       rs = new Timeline();
  //       rz = new Position();
  //       rs.title = data[i].status;
  //       rs.date = data[i].createdDate;
  //       rs.text = data[i].note;
  //       rs.createdBy = data[i].userName;

  //       console.log('ini text', rs.date);

  //       result.push(rs);
  //     }
  //   }
  //   return result;
  // }

  // public showTimeLine() {
  //   this.positionService.queryFilterBy({ idPositionType: this.creditProposal.id, size: 9999, page: 0 }).subscribe(res => {
  //     this.position = lodash.filter(res.body, function (o) {
  //       return o.partyId !== null;
  //     });
  //     this.applicationRoleService.find(this.creditProposal.id).subscribe(resApplicationRole => {
  //       if (resApplicationRole) {
  //         this.applicationRole = resApplicationRole.body;
  //         for (let i = 0; i < this.position.length; i++) {
  //           if (this.applicationRole.partyId === this.position[i].partyId) {
  //             this.applicationRoleId = this.position[i].id;
  //           }
  //         }
  //       }
  //     });
  //   });
  //   this.applicationStateLogService.findByBusinessKeyAndRefKey('CREDITPROPOSAL', this.creditProposal.id).subscribe(res => {
  //     this.approvalUser = this.convertToTimelineModel(res.body);
  //     // this.approvalUser = this.position;
  //     console.log('INI TABLE', this.approvalUser);
  //   });
  // }

  // public filterText(text: string): string {
  //   return text.replace(/_/g, ' ').replace('CP', '').toLowerCase();
  // }
}
