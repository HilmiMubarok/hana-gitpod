import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { DocumentEditorComponent, DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';

import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

import { StorageService } from 'app/entities/storage/storage.service';

import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

import moment from 'moment';

@Component({
  selector: 'jhi-loan-analys-dialog-opinion',
  templateUrl: './loan-analys-dialog-opinion.component.html',
  styleUrls: ['./loan-analys-dialog-opinion.css'],
})
export class LoanAnalysDialogOpinionComponent implements OnInit {
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  @ViewChild('document_editor_container_condition')
  public container_condition: DocumentEditorContainerComponent;

  public notes: any;
  public positionName: string;
  private creditProposalItem: ICreditProposal;
  private ngUnsubscribe = new Subject();
  private fileGet: File;
  private BUCKET: string;
  public approverName: string;

  public dateN: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
      item: ICreditProposal;
    },
    _dialog: MatDialogRef<LoanAnalysDialogOpinionComponent>,
    protected storageService: StorageService
  ) {
	this.notes = this.dataNotes.notes;
	this.creditProposalItem = this.dataNotes.item;
	this.positionName = this.notes.employeeFirstName + ' ' + this.notes.employeeLastName;

	if (this.notes['modifiedDate']) {
	  this.dateN = moment(new Date(this.notes['modifiedDate']))
		.utcOffset(moment(new Date(Date.now())).utcOffset())
		.format()
		.split('T')[0];
	} else {
	  this.dateN = moment(new Date(this.notes['createDate']))
		.utcOffset(moment(new Date(Date.now())).utcOffset())
		.format()
		.split('T')[0];
	}
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

  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();
      this.getContainerCondition();
    });
  }

  private getContainer(): void {
    const obj = {
      key: 'credit_proposal/remark/opinion-history/opinion/' + this.creditProposalItem.id + '/' + this.notes.path + '-opinion/sfdt',
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
                [res.body], this.notes.path + '.sfdt'
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
      key: 'credit_proposal/remark/opinion-history/condition/' + this.creditProposalItem.id + '/' + this.notes.path + '-condition/sfdt',
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
                [res.body], this.notes.path + '.sfdt'
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