import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
import { ICollateral } from '../collateral/collateral.model';
import { StorageService } from '../storage/storage.service';
import { DocumentUploadDialogComponent } from './document-upload-dialog.component';
import lodash from 'lodash';
import { DocumentDialogDialogV2Component } from './document-detail-dialog-v2.component';
import { STATUS } from 'app/shared/constants/status.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Document, DocumentMetaData, IDocument } from './document.model';
import { IDocumentNode } from '../document-node/document-node.model';
@Component({
  selector: 'jhi-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.scss'],
})
export class DocumentComponent implements OnChanges, OnInit {
  public _collateral: ICollateral;

  @Input()
  get collateral(): ICollateral {
    return this._collateral;
  }

  set collateral(value: ICollateral) {
    this._collateral = value;
  }

  @Input()
  public _appraisal: ICollateralAppraisal;

  @Input()
  get appraisal(): ICollateralAppraisal {
    return this._appraisal;
  }

  set appraisal(value: ICollateralAppraisal) {
    this._appraisal = value;
  }

  @Input()
  public document: ICollateralAppraisal;

  @Input()
  public status: string;
  public booleanRouter: boolean;

  public displayedColumns: string[] = ['no', 'docName', 'docDate', 'action'];
  public files: Object[];
  public documents: string;
  public account: Account;
  public folders: Object[];
  private bucket: string;
  public IfRmEnable: boolean;
  public showButton: boolean;
  public change: any;
  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    private collateralAppraisalService: CollateralAppraisalService,
    private accountService: AccountService,
    private router: Router,
    protected activatedRoute: ActivatedRoute
  ) {
    this.files = [];
    this.folders = [];
    this.booleanRouter = this.router.url.includes('party-cif');
  }
  ngOnInit(): void {
    this.checkLogin();
    this.setMatrixInput();
    this.showButtonInApproval();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.change = changes;
    if (changes['collateral']) {
      this.documents = 'document-collateral';
      this.getBucket().then(res => {
        this.getFiles('collateral', this.collateral.id);
      });
    }

    if (changes['appraisal']) {
      this.documents = 'document-lainnya';
      this.getBucket().then(res => {
        this.getFiles('appraisal', this.appraisal.id);
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

  public update(element: object) {
    const predicate: object = {
      width: '80vw',
      data: {
        collateral: null,
        appraisal: null,
        bucket: this.bucket,
        view: 'edit',
        obj: element,
      },
    };

    if (this.collateral) {
      predicate['data']['collateral'] = this.change.collateral['currentValue'];
    }

    if (this.appraisal) {
      predicate['data']['appraisal'] = this.change.appraisal['currentValue'];
    }

    predicate['data']['documents'] = this.documents;
    predicate['data']['change'] = this.change;

    const dialogRef = this.dialog.open(DocumentUploadDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      this.save(res).then(() => {
        if (res.collateral !== undefined) {
          this.getFiles('collateral', this.change.collateral['currentValue'].id);
        }

        if (res.appraisal !== undefined) {
          this.getFiles('appraisal', this.change.appraisal['currentValue'].id);
        }
      });

      this.edit(res).then(() => {
        if (res.collateral !== undefined) {
          this.getFiles('collateral', this.change.collateral['currentValue'].id);
        }

        if (res.appraisal !== undefined) {
          this.getFiles('appraisal', this.change.appraisal['currentValue'].id);
        }
      });
    });
  }

  public view(object: object): void {
    const predicate: object = {
      width: '80vw',
      data: object,
    };

    const dialogRef = this.dialog.open(DocumentDialogDialogV2Component, predicate);
    dialogRef.afterClosed().subscribe();
  }

  // Delete Confirmation
  dataKey: any;
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
          if (this.collateral) {
            this.storageService.deleteFile(this.bucket, element.files[i].key).subscribe(data => {
              this.getBucket().then(() => {
                this.getFiles('collateral', this.collateral.id);
              });
            });
            this.dataKey = element;
          }

          if (this.appraisal) {
            this.storageService.deleteFile(this.bucket, element.files[i].key).subscribe(data => {
              this.getBucket().then(() => {
                this.getFiles('appraisal', this.appraisal.id);
              });
            });
            this.dataKey = element;
          }
        }
      }
    });
  }

  public openDialog(): void {
    const predicate: object = {
      width: '80vw',
      data: {
        collateral: null,
        appraisal: null,
        bucket: this.bucket,
        view: 'add',
      },
    };

    if (this.collateral) {
      predicate['data']['collateral'] = this.change.collateral['currentValue'];
    }

    if (this.appraisal) {
      predicate['data']['appraisal'] = this.change.appraisal['currentValue'];
    }

    predicate['data']['documents'] = this.documents;
    predicate['data']['change'] = this.change;

    const dialogRef = this.dialog.open(DocumentUploadDialogComponent, predicate);
    dialogRef.afterClosed().subscribe((res: any) => {
      this.save(res).then(() => {
        if (res.collateral !== undefined) {
          this.getFiles('collateral', this.change.collateral['currentValue'].id);
        }

        if (res.appraisal !== undefined) {
          this.getFiles('appraisal', this.change.appraisal['currentValue'].id);
        }
      });

      this.edit(res).then(() => {
        if (res.collateral !== undefined) {
          this.getFiles('collateral', this.change.collateral['currentValue'].id);
        }

        if (res.appraisal !== undefined) {
          this.getFiles('appraisal', this.change.appraisal['currentValue'].id);
        }
      });
    });
  }

  private doUpload(frmData: FormData, metaData: object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.uploadMeta(this.bucket, frmData, metaData).subscribe({
        next: res => resolve(),
        error: err => reject(),
      });
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

  public save(res: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.accountService.identity().subscribe(resAccount => {
        const id = res.view === 'add' ? this.generateUniqueRandomId(6, res.existingIds) : res.id;
        const promises: Array<any> = new Array<any>();
        for (let i = 0; i < res.files.length; i++) {
          const metaData = new DocumentMetaData();

          const files = res.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-' + res.files[i].name.replace('&', '');
          metaData.id = id;
          metaData.folder = res.documentNumber.replace('&', 'codeSpecialDan');
          metaData.docDate = res.documentDate;
          metaData.docNo = res.documentNumber.replace('&', 'codeSpecialDan');
          metaData.docType = res.documentType;
          metaData.createdDate = new Date();
          metaData.createdBy = resAccount.login;

          const formData = new FormData();
          formData.append('file', res.files[i]);
          // if (this.data.collateral) {
          //   metaData.objectName = `/collateral/${this.data.collateral.id}/document/${id.replace('&', 'codeSpecialDan')}/${files}`;
          //   metaData.entityId = this.data.collateral.id;
          // }

          if (res.appraisal !== undefined) {
            metaData.objectName = `/appraisals/${res.appraisal.id}/document-lainnya/${id}/${files}`;
            metaData.entityId = res.appraisal.id;
          }
          if (res.collateral !== undefined) {
            metaData.objectName = `/collateral/${res.collateral.id}/document/${id}/${files}`;
            metaData.entityId = res.collateral.id;
          }

          promises.push(this.doUpload(formData, metaData));
        }

        if (promises.length === res.files.length) {
          Promise.all(promises).then(res1 => {
            resolve(res1);
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  public edit(res: any): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('fsdsf');
      if (res.folderFiles.length > 0) {
        this.accountService.identity().subscribe(resAccount => {
          const promises: Array<any> = new Array<any>();
          const fileRes = [];
          const files: IDocumentNode[] = res.folderFiles;
          if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              const file: IDocumentNode = files[i];
              file.tags['id'] = res.view === 'add' ? this.generateUniqueRandomId(6, res.existingIds) : res.id;
              file.tags['docDate'] = new Date(res.documentDate);
              file.tags['docType'] = res.documentType;
              file.tags['docNo'] = res.documentNumber.replace('&', 'codeSpecialDan');
              file.tags['folder'] = res.documentNumber.replace('&', 'codeSpecialDan');
              file.tags['createdBy'] = resAccount.login;
              // console.log('ompuyy', file);
              this.storageService.update(this.bucket, file.tags, { key: file.key }).subscribe(res1 => {
                fileRes.push(res1);
              });
            }
          }

          if (fileRes.length === files.length) {
            resolve(fileRes[0]);
          }
        });
      } else {
        resolve(null);
      }
    });
  }

  private getFiles(owner: string, id: number): void {
    if (owner === 'collateral') {
      if (this.change.collateral !== undefined) {
        if (this.change.collateral['currentValue'] !== undefined) {
          const predicate: Object = {
            key: `/collateral/${id}/document`,
          };
          this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
            this.groupByFolder(res.body);

            this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
          });
        }
      }
    } else if (owner === 'appraisal') {
      if (this.change.appraisal !== undefined) {
        if (this.change.appraisal['currentValue'] !== undefined) {
          const predicate: Object = {
            key: `/appraisals/${id}/document-lainnya`,
          };
          this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
            this.groupByFolder(res.body);
            this.collateralAppraisalService.totalDataDocumentLainya = res.body;
          });
        }
      }
    }
  }

  private groupByFolder(param: Object[]): void {
    this.folders = [];
    if (param.length > 0) {
      this.folders = lodash
        .chain(param)
        .groupBy('tags.id')
        .map((val, key) => ({
          folder: key,
          date: val[0]['tags']['docDate'],
          files: val,
          nameFile: val[0]['name'],
          nameDoc: val[0]['tags']['docNo'],
        }))
        .value();
    }
  }

  public documentCollateral(id: number) {
    this.storageService.getBucketName().subscribe(r => {
      const predicate: Object = {
        key: `/collateral/${id}/document`,
      };

      this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
        this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
        console.log('kkfff', res.body);
      });
    });
  }

  public documentLainnya(id: number) {
    this.storageService.getBucketName().subscribe(r => {
      const predicate: Object = {
        key: `/appraisals/${id}/document-lainnya`,
      };
      this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
        this.groupByFolder(res.body);
        this.collateralAppraisalService.totalDataDocumentLainya = res.body;
        console.log('qwe', res.body);
      });
    });
  }

  @Output() forwardTo = new EventEmitter();
  public validateDocument() {
    this.forwardTo.emit(this.collateralAppraisalService.totalDataDocumentCollateral.length);
  }
  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public isRm(): any {
    return this.account.authorities.includes('ROLE_RM');
  }
  public isDeptHead(): any {
    return this.account.authorities.includes('ROLE_APR_DEPT_HEAD');
  }

  private setMatrixInput() {
    if (this.isRm()) {
      if (this.account.authorities.length <= 2) {
        if (this.status !== STATUS.COMPLETE) {
          this.IfRmEnable = false;
        } else {
          this.IfRmEnable = true;
        }
      }
    } else {
      if (this.status === STATUS.COMPLETE || this.status === STATUS.APPROVE) {
        this.IfRmEnable = true;
      } else {
        this.IfRmEnable = false;
      }
    }
  }

  public getAuthority() {
    if (this.account.authorities.includes('ROLE_SURVEYOR')) {
      console.log('User has ROLE_SURVEYOR authority');
    } else {
      console.log('User does not have ROLE_SURVEYOR authority');
    }
  }

  public showButtonInApproval(): void {
    const route = this.router.url.split('/')[3].slice(0, 13).split('?');
    if (route[0] === 'edit-external') {
      if (this.account.authorities.includes('ROLE_APR_DEPT_HEAD')) {
        if (
          this.status === STATUS.ASSIGNMENT ||
          this.status === STATUS.RETURNTOADMIN ||
          this.status === STATUS.APPROVAL_TL ||
          this.status === STATUS.APPROVE
        ) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      }
      if (this.account.authorities.includes('ROLE_TL')) {
        if (
          this.status === STATUS.ASSIGNMENT ||
          this.status === STATUS.RETURNTOADMIN ||
          this.status === STATUS.APPROVAL_TL ||
          this.status === STATUS.APPROVE
        ) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      }
      if (this.account.authorities.includes('ROLE_APR_DH')) {
        if (
          this.status === STATUS.ASSIGNMENT ||
          this.status === STATUS.RETURNTOADMIN ||
          this.status === STATUS.APPROVAL_TL ||
          this.status === STATUS.APPROVE
        ) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      }
    }

    if (route[0] === 'edit-internal') {
      if (this.account.authorities.includes('ROLE_APR_DEPT_HEAD')) {
        if (
          this.status === STATUS.ASSIGNMENT ||
          this.status === STATUS.ASSIGNED ||
          this.status === STATUS.VISITED ||
          this.status === STATUS.RETURN_TO_OFFICER ||
          this.status === STATUS.RETURNTOADMIN ||
          this.status === STATUS.APPROVAL_TL ||
          this.status === STATUS.APPROVAL_DEPT_HEAD ||
          this.status === STATUS.APPROVAL_DH ||
          this.status === STATUS.APPROVE
        ) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      }
      if (this.account.authorities.includes('ROLE_TL')) {
        if (
          this.status === STATUS.ASSIGNMENT ||
          this.status === STATUS.ASSIGNED ||
          this.status === STATUS.VISITED ||
          this.status === STATUS.RETURN_TO_OFFICER ||
          this.status === STATUS.RETURNTOADMIN ||
          this.status === STATUS.APPROVAL_TL ||
          this.status === STATUS.APPROVAL_DEPT_HEAD ||
          this.status === STATUS.APPROVAL_DH ||
          this.status === STATUS.APPROVE
        ) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      }
      if (this.account.authorities.includes('ROLE_APR_DH')) {
        if (
          this.status === STATUS.ASSIGNMENT ||
          this.status === STATUS.ASSIGNED ||
          this.status === STATUS.VISITED ||
          this.status === STATUS.RETURN_TO_OFFICER ||
          this.status === STATUS.RETURNTOADMIN ||
          this.status === STATUS.APPROVAL_TL ||
          this.status === STATUS.APPROVAL_DEPT_HEAD ||
          this.status === STATUS.APPROVAL_DH ||
          this.status === STATUS.APPROVE
        ) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      }
    }

    if (this.account.authorities.includes('ROLE_RM')) {
      if (this.appraisal.apprOfficer === 'External') {
        if (this.status === STATUS.APPROVE) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      }
    }
  }

  public testDate() {
    if (this.folders.length !== undefined) {
      for (let i = 0; i < this.folders.length; i++) {
        const date = this.folders[i]['date'];
      }
    }
  }

  // fungsi ini di hilangkan atas persetujuan anjar
  public convert(str) {
    const mnths = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
      },
      date = str.split(' ');

    return [date[3], mnths[date[1]], date[2]].join('-');
  }
}
