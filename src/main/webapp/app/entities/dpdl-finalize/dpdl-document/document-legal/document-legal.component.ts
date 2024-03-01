import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IDocumentNode } from 'app/entities/document-node/document-node.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import lodash from 'lodash';
import { IDocumentLegalDpdl, DocumentDpdlLegalMetaData, IDocumentDpdlLegalMetaData } from '../document-dpdl.model';
import { DocumentLegalDetailDialogComponent } from './document-legal-detail-dialog.component';
import { MessageService } from 'primeng/api';
import _ from 'lodash';
import { StorageService } from 'app/entities/storage/storage.service';
import { DocumentLegalDialogComponent } from './document-legal-dialog.component';

@Component({
  selector: 'jhi-document-legal',
  templateUrl: './document-legal.component.html',
  styleUrls: ['../document.scss'],
})
export class DocumentLegalComponent implements OnChanges {
  public _creditProposal: ICreditProposal;

  @Input()
  get creditProposal(): ICreditProposal {
    return this._creditProposal;
  }

  set creditProposal(value: ICreditProposal) {
    this._creditProposal = value;
  }

  public metaData: IDocumentDpdlLegalMetaData = new DocumentDpdlLegalMetaData();
  public docDpdl: IDocumentLegalDpdl;

  public files: Object[];
  public folders: Object[];
  private bucket: string;
  public change: any;
  public parentIdValue = [];

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
      this.changeDocumentType();
      this.loadAll();

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

    const dialogRef = this.dialog.open(DocumentLegalDialogComponent, predicate);
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

    const dialogRef = this.dialog.open(DocumentLegalDialogComponent, predicate);
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

    const dialogRef = this.dialog.open(DocumentLegalDetailDialogComponent, predicate);
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
        key: `/dpdl/${id}/legal/`,
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
          const matchDocumentType = this.parentIdValue.find(parentId => parentId.id === val[0]['tags']['parentId']);
          const documentType = matchDocumentType.description;

          const z = val.find(values => values['tags']['parentId'] !== 'DOC_DPDL_LEGAL_COVERNOTE');
          const documentName = this.documentTypes.find(type => type.id === val[0]['tags']['documentId']);

          return {
            folder: key,
            documentDate: val[0]['tags']['documentDate'],
            files: val,
            nameFile: val[0]['name'],
            documentType,
            documentId: documentName ? documentName.description : val[0]['tags']['documentId'],
            category: val[0]['tags']['category'],
            status: val[0]['tags']['status'],
            attributes: JSON.parse(val[0]['tags']['attributes']),
            id: val[0]['tags']['id'],
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
      this.docDpdl = res;

      for (let i = 0; i < res.files.length; i++) {
        const files = res.datePipe.transform(new Date(), 'yyyy-MM-dd:hh:mm:ss') + '-' + res.files[i].name.replace('&', '');

        this.metaData.id = id;
        this.metaData.applicationId = res.creditProposal.id;
        this.metaData.rootId = res.rootId;
        this.metaData.parentId = res.parentId;
        this.metaData.documentId = res.documentId;
        this.metaData.category = res.category;
        this.metaData.status = res.status;
        this.metaData.documentDate = res.documentDate;
        this.metaData.attributes = JSON.stringify(this.changeCharacter(res.attributes));

        const formData = new FormData();
        formData.append('file', res.files[i]);

        this.metaData.objectName = `/dpdl/${res.creditProposal.id}/legal/${res.rootId}/${res.parentId}/${res.documentId}/${id}/${files}`;

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
            file.tags['documentDate'] = res.documentDate;
            file.tags['parentId'] = res.parentId;
            file.tags['documentId'] = res.documentId;
            file.tags['category'] = res.category;
            file.tags['attributes'] = JSON.stringify(this.changeCharacter(res.attributes));
            file.tags['status'] = res.status;

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
      .query({
        lvl2: true,
        page: 0,
        size: 9999,
        sort: ['id', 'desc'],
      })
      .subscribe(res => {
        const data = res.body.filter(
          res1 =>
            res1.parentId === 'DOC_DPDL_LEGAL_AKAD' ||
            res1.parentId === 'DOC_DPDL_LEGAL_BIAYA' ||
            res1.parentId === 'DOC_DPDL_LEGAL_COVERNOTE' ||
            res1.parentId === 'DOC_DPDL_LEGAL_LAMPIRAN'
        );
        this.documentTypes = data;
      });
  }

  documentRootId = 'DOC_DPDL_LEGAL';
  public changeDocumentType(): void {
    const value = this.documentRootId;

    this.documentTypeService.listDocumentType(value).subscribe(res => {
      this.parentIdValue = res.body;
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
      parentPath.match(/review-dppk/g) ||
      this.creditProposal.statusId === 'DPDL_REVIEW_LEAD' ||
      this.creditProposal.statusId === 'DPDL_REVIEW_HEAD' ||
      this.creditProposal.statusId === 'DPDL_REVIEW_TEAMLEAD' ||
      this.creditProposal.statusId === 'DPDL_RETURN_TO_RM'
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
