import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { DocumentDpdlUploadDialogComponent } from './document-dpdl-upload-dialog.component';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentDpdlMetaData, IDocumentDpdl, IDocumentDpdlMetaData } from '../document-dpdl.model';
import lodash from 'lodash';
import { IDocumentNode } from 'app/entities/document-node/document-node.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { DocumentDpdlDetailDialogComponent } from './document-dpdl-detail-dialog.component';
import _ from 'lodash';

@Component({
  selector: 'jhi-document-legal-upload',
  templateUrl: './document-legal-upload.component.html',
  styleUrls: ['../document.scss'],
})
export class DocumentLegalUploadComponent implements OnChanges {
  public _creditProposal: ICreditProposal;

  @Input()
  get creditProposal(): ICreditProposal {
    return this._creditProposal;
  }

  set creditProposal(value: ICreditProposal) {
    this._creditProposal = value;
  }

  public metaData: IDocumentDpdlMetaData = new DocumentDpdlMetaData();
  public docDpdl: IDocumentDpdl;

  public files: Object[];
  public folders: Object[];
  private bucket: string;
  public change: any;

  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private documentTypeService: DocumentTypeService,
    private messageService: MessageService
  ) {
    this.files = [];
    this.folders = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.change = changes;
    if (changes['creditProposal']) {
      this.loadAll();

      this.getBucket().then(res => {
        this.getFiles(this.creditProposal.id);
      });
    }
  }

  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace('codeSpecialDan', '&');
    } else {
      return '';
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

  public openDialog(): void {
    const predicate: object = {
      width: '80vw',
      data: {
        creditProposal: null,
        bucket: this.bucket,
        view: 'add',
      },
    };

    if (this.creditProposal) {
      predicate['data']['creditProposal'] = this.change.creditProposal['currentValue'];
    }

    predicate['data']['change'] = this.change;

    const dialogRef = this.dialog.open(DocumentDpdlUploadDialogComponent, predicate);
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.save(res).then(() => {
          this.getFiles(this.creditProposal.id);
        });
        this.edit(res).then(() => {
          this.getFiles(this.creditProposal.id);
        });
      }
    });
  }

  public update(element: object) {
    const predicate: object = {
      width: '80vw',
      data: {
        creditProposal: null,
        bucket: this.bucket,
        view: 'edit',
        obj: element,
      },
    };

    if (this.creditProposal) {
      predicate['data']['creditProposal'] = this.change.creditProposal['currentValue'];
    }

    predicate['data']['change'] = this.change;

    const dialogRef = this.dialog.open(DocumentDpdlUploadDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.save(res).then(() => {
          this.getFiles(this.creditProposal.id);
        });
        this.edit(res).then(() => {
          this.getFiles(this.creditProposal.id);
        });
      }
    });
  }
  dataKey;
  public delete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Document',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(respond => {
      if (respond) {
        for (let i = 0; i < element.files.length; i++) {
          if (this.creditProposal) {
            this.storageService.deleteFile(this.bucket, element.files[i].key).subscribe(data => {
              this.getBucket().then(() => {
                this.getFiles(this.creditProposal.id);
              });
            });
            this.dataKey = element;
          }
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Document deleted successfully` });
      }
    });
  }

  public view(object: object): void {
    const predicate: object = {
      width: '80vw',
      data: object,
    };

    const dialogRef = this.dialog.open(DocumentDpdlDetailDialogComponent, predicate);
    dialogRef.afterClosed().subscribe();
  }

  private doUpload(frmData: FormData, metaData: object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.uploadMeta(this.bucket, frmData, metaData).subscribe({
        next: res => resolve(),
        error: err => reject(),
      });
    });
  }

  private getFiles(id: number): void {
    if (this.change.creditProposal !== undefined && this.change.creditProposal['currentValue'] !== undefined) {
      const predicate: Object = {
        key: `/dpdl/${id}/upload/`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        this.groupByFolder(res.body);
      });
    }
  }

  private groupByFolder(param: Object[]): void {
    this.folders = [];

    if (param.length > 0) {
      this.folders = lodash
        .chain(param)
        .groupBy('tags.id')
        .map((val, key) => {
          const matchingDocumentType = this.documentTypes.find(docType => docType.id === val[0]['tags']['documentId']);
          const documentName = matchingDocumentType.description;

          return {
            folder: key,
            files: val,
            id: val[0]['tags']['id'],
            documentDate: val[0]['tags']['documentDate'],
            nameFile: val[0]['name'],
            remarks: val[0]['tags']['remarks'],
            documentId: documentName,
          };
        })
        .value();

      // Apply sorting after grouping
      this.folders = this.sortByDateDesc(this.folders, 'documentDate');
    }
  }

  public save(res: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const promises: Array<any> = new Array<any>();
      const id = res.view === 'add' ? this.generateUniqueRandomId(6, res.existingIds) : res.id;
      for (let i = 0; i < res.files.length; i++) {
        const files = res.datePipe.transform(new Date(), 'yyyy-MM-dd:hh:mm:ss') + '-' + res.files[i].name.replace('&', '');

        this.metaData.id = id;
        this.metaData.applicationId = res.creditProposal.id;
        this.metaData.rootId = res.rootId;
        this.metaData.parentId = res.parentId;
        this.metaData.documentId = res.documentId;
        this.metaData.category = res.category;
        this.metaData.remarks = this.changeCharacter(res.remarks);
        this.metaData.status = res.status;
        this.metaData.documentDate = res.documentDate;

        const formData = new FormData();
        formData.append('file', res.files[i]);

        this.metaData.objectName = `/dpdl/${res.creditProposal.id}/upload/${res.rootId}/${res.parentId}/${res.documentId}/${id}/${files}`;

        promises.push(this.doUpload(formData, this.metaData));
      }

      if (promises.length === res.files.length) {
        Promise.all(promises).then(res1 => {
          resolve(res1);
        });
      } else {
        resolve(null);
      }
    });
  }

  public edit(res: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (res && res.folderFiles && res.folderFiles.length > 0) {
        const promises: Array<any> = new Array<any>();
        const fileRes = [];
        const files: IDocumentNode[] = res.folderFiles;
        if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const file: IDocumentNode = files[i];
            file.tags['id'] = res.id;
            file.tags['applicationId'] = this.creditProposal.id;
            file.tags['rootId'] = res.rootId;
            file.tags['parentId'] = res.parentId;
            file.tags['documentId'] = res.documentId;
            file.tags['category'] = res.category;
            file.tags['remarks'] = this.changeCharacter(res.remarks);
            file.tags['status'] = res.status;
            file.tags['documentDate'] = res.documentDate;
            this.storageService.update(this.bucket, file.tags, { key: file.key }).subscribe(res1 => {
              fileRes.push(res1);
              this.getFiles(this.creditProposal.id);
            });
          }
        }

        if (fileRes.length === files.length) {
          resolve(fileRes[0]);
        }
      } else {
        resolve(null);
      }
    });
  }

  public checkIdExists(id: string, existingIds: string[]): boolean {
    return existingIds.includes(id);
  }
  public generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  }

  public generateUniqueRandomId(length: number, existingIds: string[]): string {
    let randomId = this.generateRandomId(length);

    while (this.checkIdExists(randomId, existingIds)) {
      randomId = this.generateRandomId(length);
    }

    return randomId;
  }
  public documentTypes = [];
  private loadAll(): void {
    this.documentTypeService
      .filterTableData({
        lvl2: true,
        parentId: 'DOC_DPDL_UPLOAD_LEGAL',
        page: 0,
        size: 9999,
        sort: ['id', 'desc'],
      })
      .subscribe(res => {
        this.documentTypes = res.body;
      });
  }

  changeCharacter(inputString: string): string {
    if (typeof inputString === 'string') {
      // Replace '&' with a specific letter, for example 'X'
      return inputString.replace(/&/g, 'dan');
    }
    return inputString;
  }

  public conditionReviewDpdlDocument(): boolean {
    const parentPath = this.router.url.split('/')[1];
    if (
      parentPath.match(/review-dpdl/g) ||
      parentPath.match(/finalize-dppk/g) ||
      parentPath.match(/loan-ops-distribution/g) ||
      parentPath.match(/loan-ops-checking/g) ||
      parentPath.match(/loan-ops-review/g) ||
      parentPath.match(/review-dppk/g)
    ) {
      return false;
    } else {
      return true;
    }
  }

  private sortByDateDesc(items: any[], datePropertyName: string): any[] {
    const sortedItems = lodash.orderBy(items, [item => new Date(item[datePropertyName])], ['desc']);
    return sortedItems;
  }
}
