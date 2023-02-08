import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { MatDialog } from '@angular/material/dialog';
import { DocumentChecklist, IDocumentChecklist } from './document-checklist.model';
import { DocumentChecklistDialogHistoryComponent } from './document-checklist-dialog-history.component';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import { dataCovenantAbove } from '../convenant/convenant.constant';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-document-checklist-history',
  templateUrl: './credit-proposal-document-checklist-history.component.html',
})
export class CreditProposalDocumentChecklistHistoryComponent implements OnChanges, OnInit {
  private _creditProposal: ICreditProposal;
  public folders = [];
  public displayedColumns: string[] = ['no', 'document', 'category', 'dueDate', 'status', 'remarks', 'action'];
  public files: Object[];
  private bucket: string;
  public _isViewMode: boolean;
  public parsedData: any;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  @Input()
  get isViewMode() {
    return this._isViewMode;
  }

  set isViewMode(data: boolean) {
    this._isViewMode = data;
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

  ngOnInit(): void {
    this.parsedData = parsePreviousAtrribute(this.creditProposal);
    this.getBucket().then(res => {
      this.getFiles(this.creditProposal.id);
    });
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        // console.log('bucket', res.body['bucket']);
        resolve();
      });
    });
  }

  public convertDan(value: string): any{
    if(value !== null && value !== undefined){
      return value.replace('codeSpecialDan', '&')
    }else{
      return ''
    }
    
  }

  private getFiles(id: any): void {
    // let predicate;
    // console.log('this.parsedData', {
    //   parsed: this.parsedData,
    //   history: this.parsedData.previousHistory.hasDocumentChecklistHistory,
    //   isHasHistory: typeof this.parsedData.previousHistory.hasDocumentChecklistHistory,
    // });
    // if (this.parsedData.previousHistory) {
    //   if (this.parsedData.previousHistory.hasDocumentChecklistHistory === true) {
    //     predicate = {
    //       key: `/credit_proposal/${id}/document-history`,
    //     };
    //   } else {
    //     predicate = {
    //       key: `/credit_proposal/${id}/document`,
    //     };
    //   }
    // }
    // console.log('predicate', predicate);
    // this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
    //   console.log('res', res.body);
    //   this.groupByFolder(res.body);
    // });
    this.storageService.getObjects(this.bucket, { key: `/credit_proposal/${id}/document-history` }).subscribe(res => {
      if (res.body.length > 0) {
        this.groupByFolder(res.body);
      } else {
        this.storageService.getObjects(this.bucket, { key: `/credit_proposal/${id}/document` }).subscribe(res2 => {
          this.groupByFolder(res2.body);
        });
      }
    });
  }

  private groupByFolder(param: any[]): void {
    this.folders = [];
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
          nameFile: val[0].name,

          files: val,
        }))
        .value();
    } else {
      this.folders = [];
    }
  }

  public openDialog(element: IDocumentChecklist = null, view: string): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['view'] = false;
    predicate.data['creditProposal'] = this.creditProposal;
    predicate.data['bucket'] = this.bucket;
    predicate.data['files'] = this.files;
    if (element) {
      predicate.data['documentChecklist'] = element;
      predicate.data['view'] = view;
    } else {
      predicate.data['documentChecklist'] = new DocumentChecklist();
      predicate.data['view'] = view;
    }

    const dialogRef = this.dialog.open(DocumentChecklistDialogHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res !== null) {
        this.getBucket().then(() => {
          this.getFiles(this.creditProposal.id);
        });
      } else {
        this.getBucket().then(() => {
          this.getFiles(this.creditProposal.id);
        });
      }
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
