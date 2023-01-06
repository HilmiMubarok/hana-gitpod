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

@Component({
  selector: 'jhi-approve-user',
  templateUrl: './approve-user.component.html',
  styleUrls: ['./approve-user.css'],
})
export class CreditProposalApproveUserComponent extends AbstractEntityMaterialComponent<IApplicationRole> implements OnInit {
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
  public relType: IOptionNode[];
  public idApp: any;
  public position: IPosition[];
  public applicationRoleId: number;
  public filteringItems: IApplicationRole[];
  public selectedRelationType: string;

  private _creditProposal: ICreditProposal;
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
    public applicationRoleService: ApplicationRoleService,
    protected activatedRoute: ActivatedRoute,
    protected loanAnalysService: LoanAnalysService
  ) {
    super(snackbar, applicationRoleService);
    this.loading = false;
    this.idApp = this.activatedRoute.snapshot.paramMap.get('id');
    this.relType = [];
    this.filteringItems = [];
    this.selectedRelationType = '';
  }

  ngOnInit(): void {
    this.getApplicationRoles();
  }

  private filteringRelType(params: IApplicationRole[]): void {
    this.relType = this.applicationRoleService.filteringRelationTypes(params);
  }

  public async selRelType(value: string): Promise<void> {
    this.selectedRelationType = value;
    if (value !== '') {
      this.filteringItems = lodash.filter(this.items, function (o: IApplicationRole) {
        return o.relationTypeId === value;
      });
      return;
    }

    this.filteringItems = [];
  }

  private getApplicationRoles(): void {
    this.applicationRoleService
      .queryFilterBy({
        idApplication: this.idApp,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.items = res.body;
        this.filteringRelType(this.items);

        this.selRelType(this.relType[0].id);
      });
  }
}
