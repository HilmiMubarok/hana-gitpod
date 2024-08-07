import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';

import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

import { StorageService } from 'app/entities/storage/storage.service';

import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-dialog-opinion-history',
  templateUrl: './credit-proposal-dialog-opinion-history.component.html',
  styleUrls: ['../opinion-history.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalDialogOpinionHistoryComponent implements OnInit {
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  @ViewChild('document_editor_container_condition')
  public container_condition: DocumentEditorContainerComponent;

  public notes: any;
  private creditProposalItem: ICreditProposal;
  private ngUnsubscribe = new Subject();
  private fileGet: File;
  private getObj: any;
  private BUCKET: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
      creditProposalItem: ICreditProposal;
    },
    _dialog: MatDialogRef<CreditProposalDialogOpinionHistoryComponent>,
    protected storageService: StorageService
  ) {
    this.notes = this.dataNotes.notes;
    this.creditProposalItem = this.dataNotes.creditProposalItem;
  }

  ngOnInit(): void {
    this.getWord();
  }

  public onDocumentChange() {
    this.container.restrictEditing = true;
  }

  public onDocumentChanges() {
    this.container_condition.restrictEditing = true;
  }

  private getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();
      this.getContainerCondition();
    });
  }

  private getContainer(): void {
    this.getObj = {
      key: 'credit_proposal/remark/opinion-history/opinion/' + this.creditProposalItem.id + '/' + this.notes.path + '-opinion/sfdt',
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
              this.fileGet = new File([res.body], this.notes.path + '.sfdt');
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
    const getObj = {
      key: 'credit_proposal/remark/opinion-history/condition/' + this.creditProposalItem.id + '/' + this.notes.path + '-condition/sfdt',
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
              this.fileGet = new File([res.body], this.notes.path + '.sfdt');
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
