import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionReportingStructureService } from 'app/entities/position-reporting-structure/position-reporting-structure.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { AccountService } from 'app/core/auth/account.service';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IPositionReportingStructure } from 'app/entities/position-reporting-structure/position-reporting-structure.model';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';
import { LoanAnalysService } from '../../loan-analys.service';
import { map } from 'rxjs';
@Component({
  selector: 'jhi-loan-facility-approve-level-reporting',
  templateUrl: './approve-level-reporting.component.html',
  styleUrls: ['../approve-level.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LoanFacilityAproveLevelReportingComponent
  extends AbstractEntityMaterialComponent<IPositionReportingStructure>
  implements OnInit
{
  public displayColumns: string[] = ['approval_name', 'position', 'alternatename'];
  public idRelationType: string;
  public idApp: any;
  public selectedRelationType: string;
  public filteringItems: IPositionReportingStructure[];
  public patch: any;
  public view: boolean;
  public statusId: boolean;
  public _creditProposal: ICreditProposal;
  public statusList = [
    'CP_DRAFT',
    'CP_RETURN_TO_RM_BU',
    'CP_APPROVAL_BM',
    'CP_APPROVAL_SME_HEAD',
    'CP_APPROVAL_DEPTHEAD',
    'CP_APPROVAL_DH',
    'CP_CANCEL',
    'CP_REJECT',
    'CP_COMPLETE',
  ];
  @Output() newItemEvent = new EventEmitter<string>();
  public disabled: boolean;
  public hidden: boolean;
  public relationTypes = [];
  private LOS_REL = 'LOS_REL';
  public positionIdLocStor: any;

  constructor(
    protected router: Router,
    protected positionReportingStructureService: PositionReportingStructureService,
    protected snackbar: MatSnackBar,
    protected loanAnalysService: LoanAnalysService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    public creditProposalService: CreditProposalService,
    protected relationTypeService: RelationTypeService
  ) {
    super(snackbar, positionReportingStructureService);
    this.loading = false;
    this.idApp = this.activatedRoute.snapshot.paramMap.get('id');
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  ngOnInit(): void {
    this.positionIdLocStor = this.getLocStor('POS');

    if (this.selectedRelationType !== null) {
      if (this.creditProposal.statusId === 'CP_APPROVE_TO_LA') {
        this.selectedRelationType = 'CREDIT_PROPOSAL';
      } else if (this.creditProposal.statusId === 'CP_ASSIGNMENT') {
        this.selectedRelationType = this.creditProposal.approvalLcDefault;
      } else {
        this.selectedRelationType = this.creditProposal.approvalLc;
      }
    } else {
      this.selectedRelationType = '';
    }
    this.loadRelationType();

    this.hidePleaseSelect();
  }

  public hidePleaseSelect() {
    this.patch = this.router.url.split('/')[1];
    if (this.patch === 'credit-proposal-status' || this.patch === 'cp-status-approval') {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }

  singleCheck(checkNode: any) {
    if (checkNode.target.classList.contains('checked')) {
      checkNode.target.classList.remove('checked');
    } else {
      checkNode.target.classList.add('checked');
    }
  }

  public selectRelationType(event): void {
    this.selectedRelationType = event.value;
    // this.getReportingStructureLoanAnalys();
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

  private getReportingStructureByCP(): void {
    this.positionReportingStructureService.findPositionReportingStructureCp(this.creditProposal.id).subscribe(res => {
      this.filteringItems = res.body;
    });
  }
  private loadRelationType(): void {
    this.relationTypeService
      .queryFilterBy({
        idParent: this.LOS_REL,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        if (this.creditProposal.statusId === 'CP_ASSIGNMENT') {
          this.relationTypes = res.body.filter(o => o.id === this.creditProposal.approvalLcDefault);
          this.getReportingStructureLoanAnalys();
        } else if (this.creditProposal.statusId === 'CP_APPROVE_TO_LA') {
          this.relationTypes = res.body.filter(o => o.id === 'CREDIT_PROPOSAL');
          this.getReportingStructureByCP();
        } else {
          this.relationTypes = res.body.filter(o => o.id === this.creditProposal.approvalLc);
          this.getReportingStructureLoanAnalys();
        }
      });
  }

  private getReportingStructureLoanAnalys(): void {
    this.positionReportingStructureService
      .query({
        page: 0,
        size: 9999,
      })
      .pipe(map(res => res.body.filter(o => new Date(o.thruDate) >= new Date())))
      .subscribe(res => (this.filteringItems = res.filter(e => e.relationTypeId === this.selectedRelationType)));
  }
}
