import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { AccountService } from 'app/core/auth/account.service';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { INotes } from 'app/entities/notes/notes.model';
import { NoteDataService } from 'app/entities/note-data/note-data.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';
import { LoanAnalysService } from '../../loan-analys.service';
@Component({
  selector: 'jhi-loan-facility-approve-level-note',
  templateUrl: './approve-level-note.component.html',
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
export class LoanFacilityAproveLevelNoteComponent extends AbstractEntityMaterialComponent<INotes> implements OnInit {
  public displayColumns: string[] = ['approval_name', 'position', 'alternatename'];
  public displayedColumnsExpand = [...this.displayColumns, 'expand'];

  public idRelationType: string;
  public idApp: any;
  public selectedRelationType: string;
  public filteringItems: INotes[];
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
  public approvalStatus: string;
  @Output() newItemEvent = new EventEmitter<string>();
  public disabled: boolean;
  public hidden: boolean;
  public relationTypes = [];
  private LOS_REL = 'LOS_REL';
  public positionIdLocStor: any;

  constructor(
    protected router: Router,
    protected snackbar: MatSnackBar,
    protected loanAnalysService: LoanAnalysService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    public creditProposalService: CreditProposalService,
    public noteDataService: NoteDataService,
    protected relationTypeService: RelationTypeService
  ) {
    super(snackbar, noteDataService);
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
      this.selectedRelationType = this.creditProposal.approvalLc;
    } else {
      this.selectedRelationType = '';
    }
    this.getNoteData();
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

  public emailConfirmation(applicationId: number): any {
    const notesCp = this.creditProposal.notes.findIndex((notesRes: INotes) => notesRes.applicationId === applicationId);
    const status =
      this.creditProposal.notes[notesCp].received === null || this.creditProposal.notes[notesCp].received === false
        ? 'Not Confirmation'
        : 'Confirmation';
    return status;
  }

  public recomendation(applicationId: number): any {
    const notesCp = this.creditProposal.notes.findIndex((notesRes: INotes) => notesRes.applicationId === applicationId);
    return this.creditProposal.notes[notesCp].recomendation;
  }

  public selectRelationType(event): void {
    this.selectedRelationType = event.value;
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

  private loadRelationType(): void {
    this.relationTypeService
      .queryFilterBy({
        idParent: this.LOS_REL,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.relationTypes = res.body.filter(o => o.id === this.creditProposal.approvalLc);
      });
  }

  public recomendationData: string;
  public receivedData: string;

  public getNoteData() {
    this.noteDataService
      .queryFilterBy({
        size: 9999,
        page: 0,
        idApplication: this.creditProposal.id,
        type: 'loan_committee',
      })
      .subscribe(res => {
        this.filteringItems = res.body;
      });
  }
}
