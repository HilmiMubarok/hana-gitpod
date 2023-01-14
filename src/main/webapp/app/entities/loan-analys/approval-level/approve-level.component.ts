import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import lodash from 'lodash';
import { PositionReportingStructureService } from 'app/entities/position-reporting-structure/position-reporting-structure.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { LoanAnalysService } from '../loan-analys.service';
import { AccountService } from 'app/core/auth/account.service';
import { firstValueFrom } from 'rxjs';
import { Account } from 'app/core/auth/account.model';
import { PersonService } from 'app/entities/person/person.service';
import { IPerson } from 'app/entities/person/person.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';

@Component({
  selector: 'jhi-loan-facility-approve-level',
  templateUrl: './approve-level.component.html',
  styleUrls: ['./approve-level.css'],
})
export class LoanFacilityAproveLevelComponent extends AbstractEntityMaterialComponent<IApplicationRole> implements OnInit {
  public displayColumns: string[] = ['no', 'approval_name', 'position', 'date', 'available_status', 'recomendation'];
  public idRelationType: string;
  public dateCurren: any;
  public idApp: any;
  public relType: IOptionNode[];
  public selectedRelationType: string;
  public filteringItems: IApplicationRole[];
  public whoAmI: IPerson;
  public patch: any;
  public view: boolean;
  public statusId: boolean;
  // public field = false;

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

  constructor(
    protected router: Router,
    protected positionReportingStructureService: PositionReportingStructureService,
    protected snackbar: MatSnackBar,
    protected loanAnalysService: LoanAnalysService,
    protected activatedRoute: ActivatedRoute,
    protected applicationRoleService: ApplicationRoleService,
    protected personService: PersonService,
    protected accountService: AccountService,
    public creditProposalService: CreditProposalService
  ) {
    super(snackbar, positionReportingStructureService);
    this.loading = false;
    this.idApp = this.activatedRoute.snapshot.paramMap.get('id');
    this.relType = [];
    this.selectedRelationType = '';
    this.filteringItems = [];
  }

  ngOnInit(): void {
    this.getWhoAmI().then(res => {
      this.getApplicationRolesByApplicationId();
      console.log('sata', this.filteringItems);
      console.log('sata1', this.applicationRoleService);

      this.sableFeild();
    });
  }
  public sableFeild() {
    //    public removefield() {
    this.patch = this.router.url.split('/')[1];
    if (this.patch === 'la-analyst' || this.patch === 'la-SME-CRC' || this.patch === 'la-approval') {
      this.view = true;
    }
  }

  singleCheck(checkNode: any) {
    if (checkNode.target.classList.contains('checked')) {
      checkNode.target.classList.remove('checked');
    } else {
      checkNode.target.classList.add('checked');
    }
  }

  private filteringRelType(params: IApplicationRole[]): void {
    this.relType = this.applicationRoleService.filteringRelationTypes(params);
  }

  private async getWhoAmI(): Promise<void> {
    const account: Account = await firstValueFrom(this.accountService.identity());
    const persons: IPerson[] = (await firstValueFrom(this.personService.queryFilterBy({ page: 0, size: 99, userLogin: account.login })))
      .body;
    if (persons.length > 0) {
      this.whoAmI = persons[0];
    }
  }

  public selRelType(value: string): void {
    this.filteringItems = [];

    if (value !== '') {
      if (value.toLowerCase() !== 'credit_proposal') {
        for (let i = 0; i < this.items.length; i++) {
          const each: IApplicationRole = this.items[i];
          if (each.relationTypeId && each.relationTypeId.toLowerCase() === value.toLowerCase() && each.fromPartyId === this.whoAmI.id) {
            this.filteringItems.push(each);
          }
        }
      } else {
        for (let i = 0; i < this.items.length; i++) {
          const each: IApplicationRole = this.items[i];
          if (each.relationTypeId && each.relationTypeId.toLowerCase() === value.toLowerCase()) {
            this.filteringItems.push(each);
          }
        }
      }
    }
  }

  private getApplicationRolesByApplicationId(): void {
    this.applicationRoleService
      .queryFilterBy({
        idApplication: this.idApp,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.items = res.body;
        this.filteringRelType(this.items);

        this.creditProposalService.find(this.idApp).subscribe((response: any) => {
          for (let i = 0; i < this.statusList.length; i++) {
            if (this.statusList[i] === response.body.statusId) {
              this.selectedRelationType = 'CREDIT_PROPOSAL';
              this.selRelType('CREDIT_PROPOSAL');
            } else {
              this.selectedRelationType = this.relType[1].id;
              this.selRelType(this.relType[1].id);
            }
          }
        });
      });
  }
}
