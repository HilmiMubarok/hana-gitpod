import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { MatDialog } from '@angular/material/dialog';
import { DocumentChecklist, IDocumentChecklist } from './document-checklist.model';
import { DocumentChecklistDialogComponent } from './document-checklist-dialog.component';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';
@Component({
  selector: 'jhi-credit-proposal-document-checklist',
  templateUrl: './credit-proposal-document-checklist.component.html',
})
export class CreditProposalDocumentChecklistComponent implements OnChanges {
  private _creditProposal: ICreditProposal;
  public folders = [];
  public displayedColumns: string[] = ['no', 'document', 'category', 'dueDate', 'status', 'remarks', 'action'];
  public files: Object[];
  private bucket: string;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  constructor(public dialog: MatDialog, private storageService: StorageService, private messageService: MessageService) {
    this.files = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.getBucket().then(res => {
        this.getFiles(this.creditProposal.id);
      });
    }
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        console.log('bucket', res.body['bucket']);
        resolve();
      });
    });
  }

  private groupByFolder(param: any[]): void {
    if (param.length > 0) {
      this.folders = lodash
        .chain(param)
        .groupBy('tags.document')
        .map((val, key) => ({
          folder: key,
          key: val[0].key,
          data: val,
          documentType: val[0]['tags']['documentType'],
          document: val[0]['tags']['document'],
          category: val[0]['tags']['category'],
          dueDate: val[0]['tags']['dueDate'],
          status: val[0]['tags']['status'],
          remarks: val[0]['tags']['remarks'],

          files: val,
        }))
        .value();
    } else {
      this.folders = [];
    }
  }

  private getFiles(id: number): void {
    const predicate: Object = {
      key: `/credit_proposal/${id}/document`,
    };
    this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
      this.groupByFolder(res.body);
    });
  }

  public openDialog(element: IDocumentChecklist = null): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['view'] = false;
    predicate.data['creditProposal'] = this.creditProposal;
    predicate.data['bucket'] = this.bucket;
    predicate.data['files'] = this.files;
    if (element) {
      predicate.data['documentChecklist'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['documentChecklist'] = new DocumentChecklist();
    }

    const dialogRef = this.dialog.open(DocumentChecklistDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(() => {
      this.getBucket().then(() => {
        this.getFiles(this.creditProposal.id);
      });
    });
  }

  dataKey: any;
  public deleteFile(element: any): void {
    this.dataKey = element;

    for (let i = 0; i < element.files.length; i++) {
      this.storageService.deleteFile(this.bucket, element.files[i].key).subscribe(data => {
        this.getFiles(this.creditProposal.id);
      });
    }
  }
}
