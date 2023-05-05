import { Component, ViewChild, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IApplicationRole } from 'app/entities/application-role/application-role.model';
import { ApplicationRoleService } from 'app/entities/application-role/application-role.service';
import lodash, { size } from 'lodash';
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
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { INotes } from 'app/entities/notes/notes.model';
import { NoteDataService } from 'app/entities/note-data/note-data.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IRelationType } from 'app/entities/relation-type/relation-type.model';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';
import { IPositionReportingStructure } from 'app/entities/position-reporting-structure/position-reporting-structure.model';
import { Data } from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'jhi-loan-facility-approve-matrix',
  templateUrl: './approve-matrix.component.html',
  styleUrls: ['./approve-matrix.css'],
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
export class LoanFacilityAproveMatrixComponent extends AbstractEntityMaterialComponent<IApplicationRole> implements OnInit {
  // public displayColumns: string[];
  public idRelationType: string;
  public dateCurren: any;
  public idApp: any;
  public selectedRelationType: string;
  public filteringItems: IPositionReportingStructure[];
  public whoAmI: IPerson;
  public patch: any;
  public view: boolean;
  public statusId: boolean;
  // public field = false;
  public _creditProposal: ICreditProposal;
  public statusList = ['CP_ASSIGNMENT'];
  public dropDwon = false;
  public approvalStatus: string;
  @Output() newItemEvent = new EventEmitter<string>();
  public disabled: boolean;
  public hidden: boolean;
  public relationTypes: IOptionNode[];
  public data = [];
  public displayColumns: string[] = ['approval_name', 'position', 'date', 'alternatename'];
  public displayedColumnsExpand = [...this.displayColumns, 'expand'];

  constructor(
    protected router: Router,
    protected positionReportingStructureService: PositionReportingStructureService,
    protected snackbar: MatSnackBar,
    protected loanAnalysService: LoanAnalysService,
    protected activatedRoute: ActivatedRoute,
    protected applicationRoleService: ApplicationRoleService,
    protected personService: PersonService,
    protected accountService: AccountService,
    public creditProposalService: CreditProposalService,
    public noteDataService: NoteDataService,
    protected relationTypeService: RelationTypeService
  ) {
    super(snackbar, positionReportingStructureService);
    this.loading = false;
    this.idApp = this.activatedRoute.snapshot.paramMap.get('id');
    this.selectedRelationType = '';
    this.filteringItems = [];
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  ngOnInit(): void {
    console.log(this.selectedRelationType);
    this.getApplicationRolesByApplicationId();

    // this.hidePleaseSelect();
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

  private loadRelationType(params: IPositionReportingStructure[]): void {
    this.relationTypeService
      .queryFilterBy({
        idParent: this.creditProposal.applicationTypeId,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.data = res.body;
        console.log('ini data', this.data);
        if (this.data.length) {
          const index = this.data.length - 1;
          if (this.data[index].id === this.creditProposal.approvalLcDefault) {
            this.relationTypes = [];
          } else {
            this.relationTypes = lodash.filter(
              this.data,
              o => o.id !== this.creditProposal.approvalLcDefault && o.id > this.creditProposal.approvalLcDefault
            );
          }
        }
      });
  }

  public selectRelationType(value: string): void {
    this.selectedRelationType = value;
    // this.filteringItems = [];
    // if (value !== '') {
    //   for (let i = 0; i < this.items.length; i++) {
    //     const each: IPositionReportingStructure = this.items[i];
    //     if (each.relationTypeId && each.relationTypeId === value) {
    //       this.filteringItems.push(each);
    //     }
    //   }
    // }
    this.getApplicationRolesByApplicationId();
  }

  private getApplicationRolesByApplicationId(): void {
    this.positionReportingStructureService
      .queryFilterBy({
        idRelationType: this.idRelationType,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.items = res.body;
        this.loadRelationType(this.items);
      });
  }
}
