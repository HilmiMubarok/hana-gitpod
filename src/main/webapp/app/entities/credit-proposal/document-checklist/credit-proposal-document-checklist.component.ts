import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { MatDialog } from '@angular/material/dialog';
import { DocumentChecklist, IDocumentChecklist } from './document-checklist.model';
import { DocumentChecklistDialogComponent } from './document-checklist-dialog.component';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'jhi-credit-proposal-document-checklist',
  templateUrl: './credit-proposal-document-checklist.component.html',
})
export class CreditProposalDocumentChecklistComponent implements OnChanges {
  private _creditProposal: ICreditProposal;
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
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  private getFiles(id: number): void {
    const predicate: Object = {
      key: `/credit_proposal/${id}/document`,
    };
    this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
      this.files = res.body;
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
  public deleteFile(element: IDocumentChecklist = null): void {
    this.dataKey = element;
    this.storageService.deleteFile(this.bucket, this.dataKey.key).subscribe(data => {
      this.getBucket().then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Delete Success',
        });
        this.getFiles(this.creditProposal.id);
      });
    });
  }
}
