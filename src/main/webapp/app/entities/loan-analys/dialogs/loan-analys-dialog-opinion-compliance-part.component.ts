import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentEditorComponent, DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';
import { AccountService } from 'app/core/auth/account.service';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Component({
  selector: 'jhi-loan-analys-dialog-opinion-compliance-part',
  templateUrl: './loan-analys-dialog-opinion-compliance-part.component.html',
  styleUrls: ['./loan-analys-dialog-opinion.css'],
})
export class LoanAnalysDialogOpinionCompliancePartComponent implements OnInit {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  @ViewChild('document_editor_container_condition')
  public container_condition: DocumentEditorContainerComponent;

  public notes: any;
  public nameLabel: any;
  public radioButtonPurpose: any;
  public radioButtonCondition: any;
  public radioButtonNotRecommend: any;
  public valueRadioPurpose: any;
  public valueRadioCondition: any;
  public valueRadioRecommend: any;

  creditProposalItem: ICreditProposal;
  public recommendation: any;
  public tempStat: boolean;

  private ngUnsubscribe = new Subject();
  private fileGet: File;
  public userId: any;
  public getObj: any;
  public positionUserId: any;
  public resourceUrl: string;
  private BUCKET: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
      item: ICreditProposal;
    },
    _dialog: MatDialogRef<LoanAnalysDialogOpinionCompliancePartComponent>,
    protected router: Router,
    private storageService: StorageService,
    protected activatedRoute: ActivatedRoute,
    public accountService: AccountService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {
    this.notes = this.dataNotes.notes;
    this.creditProposalItem = this.dataNotes.item;
  }
  ngOnInit(): void {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
    this.conditionOpinion();
    this.getWord();
  }

  public conditionOpinion() {
    // Opinion Condition in loan commite approval
    if (this.creditProposalItem.notes.length) {
      for (let i = 0; i < this.creditProposalItem.notes.length; i++) {
        this.recommendation = this.creditProposalItem.notes[i].recomendation;
        if (
          this.recommendation === 'Approved as Propose' ||
          this.recommendation === 'Approved With Condition' ||
          this.recommendation === 'Not Approved'
        ) {
          this.nameLabel = 'Approved Status';
          this.radioButtonPurpose = 'Approved as Propose';
          this.valueRadioPurpose = 'Approved as Propose';
          this.radioButtonCondition = 'Approved With Condition';
          this.valueRadioCondition = 'Approved With Condition';
          this.radioButtonNotRecommend = 'Not Approved';
          this.valueRadioRecommend = 'Not Approved';
          this.tempStat = true;
        } else {
          this.nameLabel = 'Recomendation';
          this.radioButtonPurpose = 'Recommend as Propose';
          this.valueRadioPurpose = 'Recommend as propose';
          this.radioButtonCondition = 'Recommend With Condition';
          this.valueRadioCondition = 'Recommend With Condition';
          this.radioButtonNotRecommend = 'Not Recommend';
          this.valueRadioRecommend = 'Not Recommend';
          this.tempStat = false;
        }
      }
    }
  }

  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  onDocumentChanges() {
    this.container_condition.restrictEditing = true;
  }

  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();
      this.getContainerCondition();
    });
  }

  private getContainer(): void {
    const obj = {
      key: 'credit_proposal/remark/opinion-history/compliance/opinion/' + this.creditProposalItem.id + '/' + this.notes.condition + + '-opinion/sfdt',
    };
    this.storageService
      .getObjects(this.BUCKET, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File(
                [res.body], this.notes.condition + '.sfdt'
              );
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                const contents: any = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
            });
        }
      });
  }

  private getContainerCondition(): void {
    const obj = {
      key:
        'credit_proposal/remark/opinion-history/compliance/condition/' + this.creditProposalItem.id + '/' + this.notes.condition + '-condition/sfdt',
    };
    this.storageService
      .getObjects(this.BUCKET, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File(
                [res.body], this.notes.condition + '.sfdt'
              );
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.container_condition?.documentEditor as DocumentEditorComponent;
                const contents: string = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
            });
        }
      });
  }
}
