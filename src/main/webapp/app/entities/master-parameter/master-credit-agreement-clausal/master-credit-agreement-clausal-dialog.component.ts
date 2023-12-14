import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
} from '@syncfusion/ej2-angular-documenteditor';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'app/entities/storage/storage.service';
import { IMasterCreditAgreementClausal } from './master-credit-agreement-clausal.model';
import { MasterCreditAgreementClausalService } from './master-credit-agreement-clausal.service';

@Component({
  selector: 'jhi-credit-agreement-clausal-dialog',
  templateUrl: './master-credit-agreement-clausal-dialog.component.html',
  styleUrls: ['./master-credit-agreement-clausal.css'],
})
export class MasterCreditAgreementClausalDialogComponent implements OnInit {
  @ViewChild('document_editor_containers')
  public containers: DocumentEditorContainerComponent;
  public masterCreditAgreementClausal: IMasterCreditAgreementClausal;
  public statusValue = [
    {
      statusId: 'ACTIVE',
      statusDescription: 'Active',
      statusCode: 'ACTIVE',
    },
    {
      statusId: 'NON_ACTIVE',
      statusDescription: 'Non Active',
      statusCode: 'NON_ACTIVE',
    },
  ];
  public parameterCategory = [
    {
      parameterCategoryId: 'NEW',
      parameterCategoryDescription: 'New',
    },
    {
      parameterCategoryId: 'ADENDUM',
      parameterCategoryDescription: 'Adendum',
    },
  ];

  private ngUnsubscribe = new Subject();
  private fileGet: File;
  public customHeadersJWT: any;
  private bucket: string;
  private getKey: string;
  constructor(
    private dialog: MatDialog,
    protected messageService: MessageService,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      masterCreditAgreementClausal: IMasterCreditAgreementClausal;
    },
    private _dialog: MatDialogRef<MasterCreditAgreementClausalDialogComponent>,
    protected masterCreditAgreementClausalService: MasterCreditAgreementClausalService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.masterCreditAgreementClausal = this.data.masterCreditAgreementClausal;
  }
  ngOnInit(): void {
    this.getcustomJWT();
  }

  public onSave(): void {
    this.validate().then(() => this.save());
  }

  public save() {
    if (this.masterCreditAgreementClausal.id) {
      // update
      this.masterCreditAgreementClausalService.update(this.masterCreditAgreementClausal).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this.triggeredSave();
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.masterCreditAgreementClausalService.create(this.masterCreditAgreementClausal).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this.triggeredSave();

        this._dialog.close(res.body);
      });
    }
  }

  /**
   * Validation
   */
  private _validateProcess(toValidate: object) {
    let isAllTrue = true;
    for (const key in toValidate) {
      if (Object.prototype.hasOwnProperty.call(toValidate, key)) {
        if (toValidate[key] === false) {
          isAllTrue = false;
          break;
        }
      }
    }

    return isAllTrue;
  }

  private _showNotification(severity: string, message: string): void {
    const severityCaptitalized = severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({ severity, summary: severityCaptitalized, detail: message, life: 3000 });
  }

  public checkMustValidated() {
    const mustValidate = {
      code: true,
      parameterCategoryId: true,
      sequence: true,
      statusId: true,
      description: true,
    };
    if (!this.masterCreditAgreementClausal.sequence) {
      this._showNotification('error', 'Masukkan Sequence terlebih dahulu');
      mustValidate.sequence = false;
    }
    if (!this.masterCreditAgreementClausal.code) {
      this._showNotification('error', 'Masukkan Code terlebih dahulu');
      mustValidate.code = false;
    }
    if (!this.masterCreditAgreementClausal.description) {
      this._showNotification('error', 'Masukkan Description terlebih dahulu');
      mustValidate.description = false;
    }
    if (!this.masterCreditAgreementClausal.parameterCategoryId) {
      this._showNotification('error', 'Masukkan Category terlebih dahulu');
      mustValidate.parameterCategoryId = false;
    }
    if (!this.masterCreditAgreementClausal.statusId) {
      this._showNotification('error', 'Masukkan Status terlebih dahulu');
      mustValidate.statusId = false;
    }

    return this._validateProcess(mustValidate);
  }

  public validateMasterLov(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Master Credit Agreement Clausal Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterLov().then(() => resolve(true));
    });
  }

  /**
   * End Validation
   */

  /**
   * Opens the cancel dialog.
   *
   * @return {void}
   */
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }

  /**
   * EJ2 Document
   */

  /**
   * Updates the general parameter code.
   *
   * @returns {void} - This function does not return a value.
   */

  /**
   * Retrieves the bucket name from the storage service and sets it
   * to the 'bucket' property. It also logs the 'containers' and calls
   * the 'getContainers' function.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  /**
   * Generates a custom JWT token.
   *
   * @return {void} Does not return a value.
   */
  public getcustomJWT() {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.getKey = `template/credit-agreement/clausal/${this.formatCode(this.masterCreditAgreementClausal.code)}/sfdt`;
    this.getBucket().then(res => {
      this.getContainers();
    });
  }

  /**
   * Formats the given code by replacing spaces with dashes and converting to lowercase if the code contains whitespace or special characters.
   *
   * @param {string} code - The code to format.
   * @return {string} - The formatted code.
   */
  private formatCode(code: string): string {
    if (/\s/.test(code) || /[&%^*@#!()+=`\-?<>/\\]/.test(code)) {
      return this.changeCharacter(code.replace(/\s+/g, '-').toLowerCase());
    } else {
      return code;
    }
  }

  /**
   * Replaces certain characters in a string with their corresponding representations.
   *
   * @param {string} code - The input string to be modified.
   * @return {string} The modified string with replaced characters.
   */ private changeCharacter(code: string): string {
    // Ganti karakter
    const replacements = {
      '&': 'and',
      '%': 'percent',
      '^': 'caret',
      '*': 'asterisk',
      '@': 'at',
      '#': 'hash',
      '!': 'exclamation',
      '(': 'open-parenthesis',
      ')': 'close-parenthesis',
      '+': 'plus',
      '=': 'equal',
      '`': 'backtick',
      '-': '-',
      '?': 'question-mark',
      '<': 'less-than',
      '>': 'greater-than',
      '/': 'slash',
      '\\': 'backslash',
    };

    // Penggantian karakter
    return code.replace(/[&%^*@#!()+=`\-?<>/\\]/g, (match: string) => replacements[match] || match);
  }

  /**
   * Retrieves the value of a token from the specified cookie.
   *
   * @param {string} cookieName - The name of the cookie to retrieve the token from.
   * @return {any} The value of the token if found, otherwise null.
   */
  private getToken(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });
    return result;
  }

  /**
   * A description of the entire function.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  public onDocumentChangePa() {
    this.containers.restrictEditing = true;
  }

  /**
   * Retrieves the containers.
   *
   * @private
   * @return {void}
   */
  private getContainers(): void {
    const obj = {
      key: `template/credit-agreement/clausal/${this.formatCode(this.masterCreditAgreementClausal.code)}/sfdt`,
    };
    this.storageService
      .getObjects(this.bucket, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File(
                [res.body],
                `credit-agreement-clausal-${this.formatCode(this.masterCreditAgreementClausal.code)}.sfdt`
              );
              console.log('file', this.fileGet);
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.containers?.documentEditor as DocumentEditorComponent;
                const contents: string = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
            });
        }
      });
  }

  /**
   * Initializes the onCreate function.
   *
   * @return {void} This function does not return anything.
   */
  onCreate(): void {
    this.containers.serviceUrl = '/services/los/api/wordeditor/';
  }

  /**
   * Handles the key down event for the document editor.
   *
   * @param {DocumentEditorKeyDownEventArgs} args - The event arguments for the key down event.
   * @return {void} This function does not return a value.
   */
  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  /**
   * Triggers a save operation for the document.
   *
   * @return {void} This function does not return a value.
   */
  public triggeredSave(): void {
    const key = `template/credit-agreement/clausal/${this.formatCode(this.masterCreditAgreementClausal.code)}`;

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.containers?.documentEditor as DocumentEditorComponent;
    if (docEditor !== undefined) {
      docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const fileType = 'word';
        // const fileName = 'credit-proposal-remark-' + this.codeClausual + '-project-analysis-' + fileType + '.docs';
        const fileName = `credit-agreement-clausal-${this.formatCode(this.masterCreditAgreementClausal.code)}.docs`;
        const metaData = {
          objectName: `${key}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileType = 'sfdt';
        const fileName = `credit-agreement-clausal-${this.formatCode(this.masterCreditAgreementClausal.code)}.sfdt`;
        const metaData = {
          objectName: `${key}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });
    }
  }
}
