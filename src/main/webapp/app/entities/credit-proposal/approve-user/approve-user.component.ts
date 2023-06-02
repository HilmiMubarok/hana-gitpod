import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import { LoanAnalysService } from 'app/entities/loan-analys/loan-analys.service';
import { PositionReportingStructureService } from 'app/entities/position-reporting-structure/position-reporting-structure.service';
import { IPosition } from 'app/entities/position/position.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IOptionNode } from 'app/shared/model/option-node.model';
import lodash from 'lodash';
import { ICreditProposal } from '../credit-proposal.model';
import { IPositionReportingStructure } from 'app/entities/position-reporting-structure/position-reporting-structure.model';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';

@Component({
  selector: 'jhi-approve-user',
  templateUrl: './approve-user.component.html',
  styleUrls: ['./approve-user.css'],
})
export class CreditProposalApproveUserComponent extends AbstractEntityMaterialComponent<IApplicationRole> implements OnInit {
  public displayColumns: string[] = ['no', 'approval_name', 'position'];
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

  public position: IPosition[];

  private _creditProposal: ICreditProposal;
  public selectedRelationType: string;
  public filteringItems: IPositionReportingStructure[];
  public positionIdLocStor: any;

  public relationTypes = [];
  private LOS_REL = 'LOS_REL';
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
    protected activatedRoute: ActivatedRoute,
    protected loanAnalysService: LoanAnalysService,
    protected relationTypeService: RelationTypeService
  ) {
    super(snackbar, positionReportingStructureService);
    this.selectedRelationType = 'CREDIT_PROPOSAL';
    this.loading = false;
  }

  ngOnInit(): void {
    this.positionIdLocStor = this.getLocStor('POS');
    this.getReportingStructureByCP();
    this.loadRelationType();
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
    this.positionReportingStructureService.findPositionReportingStructureCp(this.positionIdLocStor).subscribe(res => {
      this.filteringItems = res.body;
    });
  }

  public selectRelationType(event: any): void {
    event = this.selectedRelationType;
    console.log('evt', event);

    this.getReportingStructureByCP();
  }

  private loadRelationType(): void {
    this.relationTypeService
      .queryFilterBy({
        idParent: this.LOS_REL,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.relationTypes = res.body.filter(o => o.id === 'CREDIT_PROPOSAL');
        if (this.selectedRelationType === 'CREDIT_PROPOSAL') {
          this.getReportingStructureByCP();
        } else {
          this.items = [];
        }
      });
  }
}
