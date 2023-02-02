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
@Component({
  selector: 'jhi-loan-facility-approve-level',
  templateUrl: './approve-level.component.html',
  styleUrls: ['./approve-level.css'],
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
export class LoanFacilityAproveLevelComponent extends AbstractEntityMaterialComponent<IApplicationRole> implements OnInit {
  public displayColumns: string[]
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
  public dropDwon = false
  public approvalStatus: string;
  @Output() newItemEvent = new EventEmitter<string>();
  public disabled: boolean;
  public hidden: boolean;
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
    public noteDataService: NoteDataService
  ) {
    super(snackbar, positionReportingStructureService);
    this.loading = false;
    this.idApp = this.activatedRoute.snapshot.paramMap.get('id');
    this.relType = [];
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

  public displayedColumnsExpand = []

  ngOnInit(): void {
    
    this.getWhoAmI().then(res => {
      this.getApplicationRolesByApplicationId();
    });
    // this.approvalStatus = this.creditProposal?.attributes['approvalStatus'];
    // this.newItemEvent.emit(this.creditProposal?.attributes['approvalStatus']);
    if (this.creditProposal.statusId === 'LA_DAR_NOTIF') {
      this.displayColumns = [ 'approval_name', 'position', 'date', 'alternatename',];



     this.displayedColumnsExpand = [...this.displayColumns, 'expand'];
    }else{
      this.displayColumns = ['approval_name', 'position', 'date', 'alternatename'];
    }
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
          if (each.relationTypeId && each.relationTypeId.toLowerCase() === value.toLowerCase()) {
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

  public emailConfirmation(applicationId: number): any{
    const notesCp = this.creditProposal.notes.findIndex((notesRes: INotes) => notesRes.applicationId === applicationId)
    const status = this.creditProposal.notes[notesCp].received === null || this.creditProposal.notes[notesCp].received === false ? 'Not Confirmation' : 'Confirmation'
    return status
  }

  public recomendation(applicationId: number): any{
    console.log('app', this.filteringItems)
    const notesCp = this.creditProposal.notes.findIndex((notesRes: INotes) => notesRes.applicationId === applicationId)
    return this.creditProposal.notes[notesCp].recomendation

  }

  private getApplicationRolesByApplicationId(): void {
    this.applicationRoleService
      .queryFilterBy({
        idApplication: this.idApp,
        isActive: true,
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
              for (let j = 0; j < this.relType.length; j++) {
                if (this.relType[j].id !== 'CREDIT_PROPOSAL') {
                  if (this.router.url.split('=').indexOf('summary') > -1 !== true) {
                    this.selectedRelationType = this.relType[j].id;
                    this.selRelType(this.relType[j].id);
                  }else if (this.router.url.split('=').indexOf('summary') > -1 === true) {
                    this.selectedRelationType = 'CREDIT_PROPOSAL';
                  this.selRelType('CREDIT_PROPOSAL');
                  }
                 
                }
              }
            }
          }
        });
      });
  }

  public recomendationData: string
  public receivedData: string

  public getNoteDataByPartyIdAndApplicationId(element: IApplicationRole){

    this.noteDataService.queryFilterBy({
      idParty: element.partyId,
      idApplication: element.applicationId,
      size: 1,
      page: 0

    }).subscribe((res: any)=> {
      console.log('oke',res)
      this.recomendationData = res.body[0].recomendation
      this.receivedData = res.body[0].received === null || res.body[0].received === false ? 'Not Confirmation' : 'Confirmation'
    })
  }
}
