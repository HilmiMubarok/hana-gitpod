import { Component, Inject, SimpleChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { ICreditProposal } from '../../credit-proposal.model';
import { AccountService } from 'app/core/auth/account.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Component({
  selector: 'jhi-credit-proposal-dialog-opinion-history',
  templateUrl: './credit-proposal-dialog-opinion-history.component.html',
  styleUrls: ['../opinion-history.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalDialogOpinionHistoryComponent implements OnInit {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  @ViewChild('document_editor_container_condition')
  public container_condition: DocumentEditorContainerComponent;

  public notes: any;
  public creditProposalItem: ICreditProposal;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;
  private userId: any;
  private getObj: any;
  private paramId: string;
  public resourceUrl: string;
  private BUCKET: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
      creditProposalItem: ICreditProposal;
    },
    _dialog: MatDialogRef<CreditProposalDialogOpinionHistoryComponent>,
    private storageService: StorageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public accountService: AccountService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {
    this.notes = this.dataNotes.notes;
    this.creditProposalItem = this.dataNotes.creditProposalItem;
  }
  ngOnInit(): void {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
    this.getLogin();
    this.getWord();
  }

  public getLogin() {
    this.accountService.identity().subscribe(account => {
      this.userId = account.login;
    });
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
    this.getObj = {
      key:
        'credit_proposal/remark/opinion-history/opinion/' +
        this.creditProposalItem.id +
        '/' +
        this.notes.positionUserId +
        '-' +
        this.notes.userId +
        '/sfdt',
    };
    this.storageService
      .getObjects(this.BUCKET, this.getObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File(
                [res.body],
                'credit-proposal-remark-' +
                  this.creditProposalItem.id +
                  '-' +
                  this.notes.positionUserId +
                  '-' +
                  this.notes.userId +
                  '-opinion-sfdt.sfdt'
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
      key:
        'credit_proposal/remark/opinion-history/condition/' +
        this.creditProposalItem.id +
        '/' +
        this.notes.positionUserId +
        '-' +
        this.notes.userId +
        '/sfdt',
    };
    this.storageService
      .getObjects(this.BUCKET, getObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File(
                [res.body],
                'credit-proposal-remark-' +
                  this.creditProposalItem.id +
                  '-' +
                  this.notes.positionUserId +
                  '-' +
                  this.notes.userId +
                  '-opinion-' +
                  'condition-sfdt.sfdt'
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
