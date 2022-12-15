import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentEditorComponent, DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';
import { AccountService } from 'app/core/auth/account.service';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-loan-analys-dialog-opinion',
  templateUrl: './loan-analys-dialog-opinion.component.html',
  styleUrls: ['./loan-analys-dialog-opinion.css'],
})
export class LoanAnalysDialogOpinionComponent {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  @ViewChild('document_editor_container_condition')
  public container_condition: DocumentEditorContainerComponent;

  public notes: any;
  // public parentPath = this.router.url.split('/')[1];
  public nameLabel: any;
  public radioButtonPurpose: any;
  public radioButtonCondition: any;
  public radioButtonNotRecommend: any;
  public valueRadioPurpose: any;
  public valueRadioCondition: any;
  public valueRadioRecommend: any;

  creditProposalItem: ICreditProposal;

  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;
  public userId: any;
  public getObj: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
      item: ICreditProposal;
    },
    _dialog: MatDialogRef<LoanAnalysDialogOpinionComponent>,
    protected router: Router,
    private storageService: StorageService,
    protected activatedRoute: ActivatedRoute,
    public accountService: AccountService
  ) {
    this.notes = this.dataNotes.notes;
    this.creditProposalItem = this.dataNotes.item;
    this.conditionOpinion();
    this.getLogin();
    console.log('this is login', this.userId);
  }

  public getLogin() {
    this.accountService.identity().subscribe(account => {
      this.userId = account.login;
    });
  }
  public recommendation: any;
  public conditionOpinion() {
    for (let i = 0; i < this.creditProposalItem.notes.length; i++) {
      this.recommendation = this.notes.recomendation;
      if (
        this.recommendation === 'Approved With Propose' ||
        this.recommendation === 'Approved With Condition' ||
        this.recommendation === 'Not Approved'
      ) {
        this.nameLabel = 'Approved';
        this.radioButtonPurpose = 'Approved With Propose';
        this.radioButtonCondition = 'Approved With Condition';
        this.radioButtonNotRecommend = 'Not Approved';
        this.valueRadioPurpose = 'Approved With Propose';
        this.valueRadioCondition = 'Approved With Condition';
        this.valueRadioRecommend = 'Not Approved';
      }
      if (
        this.recommendation === 'Recommend as propose' ||
        this.recommendation === 'Recommend With Condition' ||
        this.recommendation === 'Not Recommend'
      ) {
        this.nameLabel = 'Recomendation';
        this.radioButtonPurpose = 'Recommend as Propose';
        this.radioButtonCondition = 'Recommend With Condition';
        this.radioButtonNotRecommend = 'Not Recommend';

        this.valueRadioPurpose = 'Recommend as propose';
        this.valueRadioCondition = 'Recommend With Condition';
        this.valueRadioRecommend = 'Not Recommend';
      }
    }
  }
  // console.log('tes',this.getKey.split('/')[6]);

  onDocumentChange() {
    this.container.restrictEditing = true;

    this.getOpiniObj();
  }

  onDocumentChanges() {
    this.container_condition.restrictEditing = true;
    this.getConditionObj();
  }

  public getConditionObj() {
    this.bucket = 'hana';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/opinion-history/condition/' + this.creditProposalItem.id + '/' + this.userId + '/sfdt';
      this.getContainerCondition();
    });
  }

  public getOpiniObj() {
    this.bucket = 'hana';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/opinion-history/opinion/' + this.creditProposalItem.id + '/' + this.userId + '/sfdt';
      this.getContainer();
    });
  }

  private getContainer(): void {
    this.getObj = {
      key: 'credit_proposal/remark/opinion-history/opinion/' + this.creditProposalItem.id + '/' + this.notes.userId + '/sfdt',
    };
    this.storageService
      .getObjects(this.bucket, this.getObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File(
                [res.body],
                'credit-proposal-remark-' + this.creditProposalItem.id + '-' + this.notes.userId + '-opinion-sfdt.sfdt'
              );
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                const contents: any = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
              console.log('ini file get', this.fileGet);
            });
        }
      });
  }

  private getContainerCondition(): void {
    const getObj = {
      key: 'credit_proposal/remark/opinion-history/condition/' + this.creditProposalItem.id + '/' + this.notes.userId + '/sfdt',
    };
    this.storageService
      .getObjects(this.bucket, getObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File(
                [res.body],
                'credit-proposal-remark-' + this.creditProposalItem.id + '-' + this.notes.userId + '-opinion' + 'condition-sfdt.sfdt'
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
