import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import {
  DocumentDpdlLegalMetaData,
  IDocumentDpdlLegalMetaData,
  IDocumentLegalDpdl,
} from 'app/entities/dpdl-finalize/dpdl-document/document-dpdl.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { TboLegalMonitoringDetailComponent } from './dialog/tbo-legal-monitoring-detail.component';
import lodash from 'lodash';
import { IDocumentNode } from 'app/entities/document-node/document-node.model';
import { TboLegalMonitoringViewComponent } from './dialog/tbo-legal-monitoring-view.component';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { ITboLegalMonitoringMetaData, TboLegalMonitoringMetaData } from './tbo-legal-monitoring.model';
import { ApplicationDocument, IApplicationDocument } from 'app/entities/application-document/application-document.model';
import { ApplicationDocumentService } from 'app/entities/application-document/application-document.service';
import { MasterDocumentTermService } from 'app/entities/master-parameter/master-document-term/master-document-term.service';
import { MasterDocumentTermComponent } from 'app/entities/master-parameter/master-document-term/master-document-term.component';
import { MasterDocumentTerm } from 'app/entities/master-parameter/master-document-term/master-document-term.model';

@Component({
  selector: 'jhi-tbo-legal-monitoring',
  templateUrl: './tbo-legal-monitoring.component.html',
  styleUrls: ['./tbo-legal-monitoring.style.scss'],
})
export class TboLegalMonitoringComponent implements OnChanges {
  public _creditProposal: ICreditProposal;

  @Input()
  get creditProposal(): ICreditProposal {
    return this._creditProposal;
  }

  set creditProposal(value: ICreditProposal) {
    this._creditProposal = value;
  }

  public metaData: ITboLegalMonitoringMetaData = new TboLegalMonitoringMetaData();
  public applicationDocument: IApplicationDocument[];
  // public docDpdl: IDocumentLegalDpdl;

  public files: Object[];
  public folders: any[];
  private bucket: string;
  public change: any;
  public parentIdValue = [];

  public key: string;
  dateDifference: number;

  public parentPath = this.router.url.split('/')[1];

  masterDocTermComponent: MasterDocumentTermComponent;
  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private documentTypeService: DocumentTypeService,
    private messageService: MessageService,
    private applicationDocumentService: ApplicationDocumentService,
    protected masterDocumentTermService: MasterDocumentTermService
  ) {
    this.files = [];
    this.folders = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.change = changes;
    if (changes['creditProposal']) {
      this.changeDocumentType();
      this.loadAll();
      this.getDocumentTerm();

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

    const dialogRef = this.dialog.open(TboLegalMonitoringDetailComponent, predicate);
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

    const dialogRef = this.dialog.open(TboLegalMonitoringDetailComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.save(res).then(() => {
          this.getFiles(this.creditProposal.id);
        });
        this.edit(res).then(() => {
          // this.getFiles(this.creditProposal.id);
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

    const dialogRef = this.dialog.open(TboLegalMonitoringViewComponent, predicate);
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
  public getFiles(id: number): void {
    if (this.change.creditProposal !== undefined && this.change.creditProposal['currentValue'] !== undefined) {
      const predicate: Object = {
        key: `/document-tbo/document-legal/${id}/legal/`, // Mengganti ini sesuai dengan struktur key di minio Anda
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        this.getApplicationDocument(res.body);
      });
    }
  }

  public getApplicationDocument(minioData: any[]): void {
    // Mendapatkan daftar dokumen aplikasi
    const statuses = ['DRAFT', 'ACTIVE'];
    const page = 0;
    const size = 9999;
    const sort = ['id,desc'];

    this.applicationDocumentService
      .getListApplicationDocument(this.creditProposal.id, { statusId: statuses, page, size, sort })
      .subscribe(res => {
        // Menginisialisasi array untuk menyimpan dokumen aplikasi dengan informasi tambahan
        const augmentedApplicationDocuments: IApplicationDocument[] = [];
        this.folders = res.body.filter(e => e.initialStatusId === 'TBO');
        console.log('folders:', this.folders);
        console.log('minioData:', minioData);

        // Iterasi melalui setiap dokumen aplikasi
        this.folders.forEach(appDoc => {
          // Mencari data Minio yang sesuai dengan dokumen aplikasi
          // const minioDocument = minioData.find(m => m.tags.id === appDoc.attributes.docId);
          const minioDocuments = minioData.filter(m => m.tags.id === appDoc.attributes.docId);
          console.log('minioDocuments:', minioDocuments);

          // Jika ditemukan, tambahkan informasi tambahan ke dokumen aplikasi
          if (minioDocuments.length > 0) {
            const files = [];
            minioDocuments.forEach(minioDocument => {
              const filesTemp = {
                name: minioDocument.name,
                key: minioDocument.key,
                type: minioDocument.metaData.Value,
                url: minioDocument.url,
              };
              files.push(filesTemp);
            });
            const augmentedAppDoc: IApplicationDocument = {
              // Salin semua properti dari dokumen aplikasi
              ...appDoc,
              // Tambahkan properti tambahan
              files,
            };

            // Tambahkan dokumen aplikasi yang diperbarui ke array
            augmentedApplicationDocuments.push(augmentedAppDoc);
          } else {
            // Jika tidak ditemukan, tambahkan dokumen aplikasi asli ke array
            const files = [];
            const augmentedAppDoc: IApplicationDocument = {
              // Salin semua properti dari dokumen aplikasi
              ...appDoc,
              // Tambahkan properti tambahan
              files,
            };

            // Tambahkan dokumen aplikasi yang diperbarui ke array
            augmentedApplicationDocuments.push(augmentedAppDoc);
          }
        });

        // Gunakan dokumen aplikasi yang telah diperbarui
        this.applicationDocument = augmentedApplicationDocuments;

        // Debugging: Tampilkan dokumen aplikasi yang telah diperbarui
        console.log('Augmented application documents:', this.applicationDocument);
      });
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
            // proposedStatus: val[0]['tags']['proposedStatus'],
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
      // this.docDpdl = res;

      console.log('res cek', res);

      for (let i = 0; i < res.files.length; i++) {
        const files = res.datePipe.transform(new Date(), 'yyyy-MM-dd:hh:mm:ss') + '-' + res.files[i].name.replace('&', '');

        const splitPath = res.path.split('/');

        this.metaData.id = res.docIdTags;
        this.metaData.applicationId = this.creditProposal.id;
        this.metaData.rootId = splitPath[4];
        this.metaData.parentId = splitPath[5];
        // this.metaData.documentTypeParent = res.documentTypeParent;
        this.metaData.documentId = res.documentTypeId;
        this.metaData.category = res.category;
        this.metaData.status = res.status;
        // this.metaData.proposedStatus = res.proposedStatus;
        this.metaData.documentDate = res.documentDate;
        this.metaData.attributes = JSON.stringify(this.changeCharacter(res.attributes));

        const formData = new FormData();
        formData.append('file', res.files[i]);

        this.metaData.objectName =
          splitPath[0] +
          '/' +
          splitPath[1] +
          '/' +
          splitPath[2] +
          '/' +
          splitPath[3] +
          '/' +
          splitPath[4] +
          '/' +
          splitPath[5] +
          '/' +
          splitPath[6] +
          '/' +
          splitPath[7] +
          '/' +
          files;

        // this.metaData.objectName = `/document-tbo/document-legal/${this.creditProposal.id}/legal/${res.rootId}/${res.parentId}/${res.documentId}/${id}/${files}`;
        // this.metaData.objectName = `/document-tbo/document-legal/${this.creditProposal.id}/legal/${res.rootId}/${res.parentId}/${res.documentId}/${id}/${files}`;

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

  // public edit(res: any): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     if (res && res.folderFiles && res.folderFiles.length > 0) {
  //       console.log('Edit:', res);
  //       const promises: Array<any> = new Array<any>();
  //       const fileRes = [];
  //       const files: IDocumentNode[] = res.folderFiles;
  //       if (files.length > 0) {
  //         for (let i = 0; i < files.length; i++) {
  //           const file: IDocumentNode = files[i];
  //           file.tags['id'] = res.id;
  //           file.tags['applicationId'] = this.creditProposal.id;
  //           file.tags['rootId'] = res.rootId;
  //           file.tags['documentDate'] = res.documentDate;
  //           file.tags['parentId'] = res.parentId;
  //           file.tags['documentId'] = res.documentId;
  //           file.tags['category'] = res.category;
  //           file.tags['attributes'] = JSON.stringify(this.changeCharacter(res.attributes));
  //           file.tags['status'] = res.status;
  //           // file.tags['proposedStatus'] = res.proposedStatus;

  //           this.storageService.update(this.bucket, file.tags, { key: file.key }).subscribe(res1 => {
  //             fileRes.push(res1);
  //             this.getFiles(this.creditProposal.id);
  //           });
  //         }
  //       }

  //       if (fileRes.length === files.length) {
  //         resolve(fileRes[0]);
  //       }
  //     } else {
  //       resolve(null);
  //     }
  //   });
  // }

  public edit(res: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // if (res && res.folderFiles && res.folderFiles.length > 0) {
      console.log('Edit:', res);

      const documentName = this.documentTypes.find(type => type.id === res.documentTypeId);
      const resultDocName = documentName ? documentName.description : res.documentTypeId;
      const DocName =
        res.documentTypeId === 'DOC_DPDL_LEGAL_COVERNOTE' || res.documentTypeId === 'DOC_DPDL_LEGAL_LAMPIRAN' ? res.name : resultDocName;

      const attributesObj = typeof res.attributes === 'string' ? JSON.parse(res.attributes) : res.attributes;

      const updatedDocument: IApplicationDocument = {
        id: res.id,
        applicationId: this.creditProposal.id,
        documentTypeId: res.documentTypeId,
        // attributes: attributesObj,
        statusAppDocId: res.statusAppDocId,
        initialStatusId: res.initialStatusId,
        date: res.date,
        dueDate: res.dueDate,
        path: res.path,
        applicationNumber: this.creditProposal.applicationNumber,
        name: DocName,
        category: res.category,
        attributes: {
          docId: res.attributes.docId,
          documentDate: res.attributes.documentDate,
          proposedDate: res.attributes.proposedDate,
          proposedStatus: res.attributes.proposedStatus,
          remarks: res.attributes.remarks,
          description: res.attributes.description,
          total: res.attributes.total,
          notaryNumber: res.attributes.notaryNumber,
          notaryName: res.attributes.notaryName,
          batasWaktuPenyelesaian: res.attributes.batasWaktuPenyelesaian,
        },
      };

      this.applicationDocumentService.update(updatedDocument).subscribe(updatedRes => {});

      // const promises: Array<any> = new Array<any>();
      // const fileRes = [];
      // const files: IDocumentNode[] = res;
      // console.log('files', files);
      // if (files.length > 0) {
      //   for (let i = 0; i < files.length; i++) {
      //     const file: IDocumentNode = files[i];
      //     file.tags['id'] = res.idDoc;
      //     file.tags['applicationId'] = this.creditProposal.id;
      //     file.tags['rootId'] = res.documentRootId;
      //     file.tags['documentDate'] = res.documentDate;
      //     file.tags['parentId'] = res.documentTypeParent;
      //     file.tags['documentId'] = res.documentTypeId;
      //     file.tags['category'] = res.category;
      //     file.tags['attributes'] = JSON.stringify(this.changeCharacter(res.attributes));
      //     file.tags['status'] = res.statusAppDocId;
      //     // file.tags['proposedStatus'] = res.proposedStatus;

      //     console.log('files ', file);
      //     // Memperbarui DocumentNode
      //     this.storageService.update(this.bucket, file.tags, { key: file.key }).subscribe(res1 => {
      //       console.log('res update minio :', res1);
      //       fileRes.push(res1);
      //       // this.getFiles(this.creditProposal.id);
      //     });
      //     console.log('file res ', fileRes);

      //     // Memperbarui ApplicationDocument
      //   }
      // }

      //   if (fileRes.length === files.length) {
      //     resolve(fileRes[0]);
      //   }
      // } else {
      //   resolve(null);
      // }
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

  // calculateDateDifference(documentDate: string, proposedDate: string): number {
  //   const current = new Date(documentDate);

  //   const proposed = new Date(proposedDate);

  //   // Check if the dates are valid
  //   if (isNaN(current.getTime()) || isNaN(proposed.getTime())) {
  //     return 0; // Or any other default value you prefer
  //   }

  //   const differenceInTime = current.getTime() - proposed.getTime(); // Difference in milliseconds

  //   const differenceInDays = Math.abs(differenceInTime / (1000 * 3600 * 24));

  //   return Math.floor(differenceInDays); // Return the difference in number of days
  // }

  calculateDateDifference(date: string, dueDate: string): number {
    let differenceInDays: number;

    if (dueDate !== null) {
      const current = new Date(date);
      const proposed = new Date(dueDate);
      const differenceInTime = current.getTime() - proposed.getTime(); // Difference in milliseconds
      differenceInDays = Math.abs(differenceInTime / (1000 * 3600 * 24));
    } else {
      return 0;
    }

    return Math.floor(differenceInDays); // Return the difference in number of days
  }

  getStatusAppDocId(statusAppDocId: string): string {
    return statusAppDocId === '_NA_' ? '' : statusAppDocId;
  }

  public docTerm: MasterDocumentTerm[];
  public getDocumentTerm() {
    this.masterDocumentTermService.getMasterDocumentTerms().subscribe(res => {
      this.docTerm = res.body;
    });
  }

  public generateDocTerm(num: number): string {
    if (this.docTerm.length === 0) {
      return '-';
    }

    for (let i = 0; i < this.docTerm.length; i++) {
      const item: MasterDocumentTerm = this.docTerm[i];
      if (item.fromDays <= num && item.toDays >= num) {
        return item.name;
      }
    }

    return '-';
  }
}
