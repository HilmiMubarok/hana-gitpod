import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { IDocumentChecklistDebtorData, DocumentChecklistDebtorData } from './debtor-data-document-checklist';
import { DebtorDataDocumentChecklistDialogComponent } from './debtor-data-document-checklis-dialog.component';
import { IDebtorData } from '../debtor-data.model';
import lodash from 'lodash';
@Component({
  selector: 'jhi-deptor-data-document-checklist',
  templateUrl: './document-checklis-deptor-data.component.html',
})
export class DeptorDataDocumentChecklistComponent implements OnInit {
  public files: any[];
  public bucket: string;
  public searchCifInput: string;
  private _partyCif: IDebtorData;
  private dataKey: any;
  public folders: Object[];
  constructor(private storageService: StorageService, public dialog: MatDialog, private messageService: MessageService) {}
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(item: IDebtorData) {
    this._partyCif = item;
  }

  ngOnInit(): void {
    this.getBucket().then(res => {
      this.getFiles(this.partyCif.partyId);
    });
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
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

  private getFiles(id: string): void {
    const predicate: Object = {
      key: `/cif/${id}/document`,
    };
    this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
      this.groupByFolder(res.body);
    });
  }

  public deleteFile(element: IDocumentChecklistDebtorData = null): void {
    this.dataKey = element;

    for (let i = 0; i < element.files.length; i++) {
      this.storageService.deleteFile(this.bucket, element.files[i].key).subscribe(data => {
        this.getFiles(this.partyCif.partyId);
      });
    }
  }

  public openDialog(element: IDocumentChecklistDebtorData = null, view: string): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['view'] = false;
    predicate.data['partyId'] = this.partyCif.partyId;
    predicate.data['bucket'] = this.bucket;
    predicate.data['files'] = this.files;
    if (element) {
      predicate.data['documentChecklist'] = element;
      predicate.data['view'] = view;
    } else {
      predicate.data['documentChecklist'] = new DocumentChecklistDebtorData();
      predicate.data['view'] = view;
    }

    const dialogRef = this.dialog.open(DebtorDataDocumentChecklistDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(() => {
      this.getBucket().then(() => {
        this.getFiles(this.partyCif.partyId);
      });
    });
  }
}
