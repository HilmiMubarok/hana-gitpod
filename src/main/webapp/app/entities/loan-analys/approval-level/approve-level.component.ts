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
import { IPositionReportingStructure } from 'app/entities/position-reporting-structure/position-reporting-structure.model';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';
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
export class LoanFacilityAproveLevelComponent extends AbstractEntityMaterialComponent<IPositionReportingStructure> implements OnInit {
  public displayColumns: string[];
  public idRelationType: string;
  public dateCurren: any;
  public idApp: any;
  public relType: IOptionNode[];
  public selectedRelationType: string;
  public filteringItems: IPositionReportingStructure[];
  public whoAmI: IPerson;
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
  public dropDwon = false;
  public approvalStatus: string;
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
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public displayedColumnsExpand = [];

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
    // this.getWhoAmI().then(res => {
    //   this.getApplicationRolesByApplicationId();
    // });
    // this.approvalStatus = this.creditProposal?.attributes['approvalStatus'];
    // this.newItemEvent.emit(this.creditProposal?.attributes['approvalStatus']);
    if (this.creditProposal.statusId === 'LA_DAR_NOTIF') {
      this.displayColumns = ['approval_name', 'position', 'alternatename'];

      this.displayedColumnsExpand = [...this.displayColumns, 'expand'];
    } else {
      this.displayColumns = ['approval_name', 'position', 'alternatename'];
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

  // private async getWhoAmI(): Promise<void> {
  //   const account: Account = await firstValueFrom(this.accountService.identity());
  //   const persons: IPerson[] = (await firstValueFrom(this.personService.queryFilterBy({ page: 0, size: 99, userLogin: account.login })))
  //     .body;
  //   if (persons.length > 0) {
  //     this.whoAmI = persons[0];
  //   }
  // }

  public emailConfirmation(applicationId: number): any {
    const notesCp = this.creditProposal.notes.findIndex((notesRes: INotes) => notesRes.applicationId === applicationId);
    const status =
      this.creditProposal.notes[notesCp].received === null || this.creditProposal.notes[notesCp].received === false
        ? 'Not Confirmation'
        : 'Confirmation';
    return status;
  }

  public recomendation(applicationId: number): any {
    console.log('app', this.filteringItems);
    const notesCp = this.creditProposal.notes.findIndex((notesRes: INotes) => notesRes.applicationId === applicationId);
    return this.creditProposal.notes[notesCp].recomendation;
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
      .subscribe(res => {
        if (res.body.length > 0) {
          this.filteringItems = res.body.filter(e => e.relationTypeId === this.selectedRelationType);
        }
      });
  }

  public recomendationData: string;
  public receivedData: string;

  public getNoteDataByPartyIdAndApplicationId(element: IApplicationRole) {
    this.noteDataService
      .queryFilterBy({
        idParty: element.partyId,
        idApplication: element.applicationId,
        size: 1,
        page: 0,
      })
      .subscribe((res: any) => {
        console.log('oke', res);
        this.recomendationData = res.body[0].recomendation;
        this.receivedData = res.body[0].received === null || res.body[0].received === false ? 'Not Confirmation' : 'Confirmation';
      });
  }
}
