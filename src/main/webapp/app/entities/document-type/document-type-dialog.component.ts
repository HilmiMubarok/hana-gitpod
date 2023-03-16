import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDocumentType } from './document-type.model';
import { DocumentTypeService } from './document-type.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-document-type-dialog',
  templateUrl: './document-type-dialog.component.html',
  styleUrls: ['./document-type.css'],
})
export class DocumentTypeDialogComponent implements OnInit {
  public statusValue = [
    {
      id: 'ACTIVE',
      description: 'Active',
    },
    {
      id: 'NON_ACTIVE',
      description: 'Non Active',
    },
  ];

  public categoryValue = ['A', 'B', 'C'];
  public documentType: IDocumentType;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      documentType: IDocumentType;
    },
    private documentTypeService: DocumentTypeService,
    protected messageService: MessageService,

    private _dialog: MatDialogRef<DocumentTypeDialogComponent>
  ) {
    this.documentType = this.data.documentType;
    this.documentType.description = '';
    this.documentType.category = '';
    this.documentType.statusDescription = '';
  }
  ngOnInit(): void {
    this.findValueById();
  }

  public save(): void {
    this.validate().then(() => this._dialog.close(this.documentType));
  }

  public findValueById() {
    this.documentTypeService.find(this.documentType.parentId).subscribe(result => {
      this.documentType.rootId = result.body.parentId;
      this.documentType.rootDescription = result.body.parentDescription;
      this.documentType.parentId = result.body.id;
      this.documentType.parentDescription = result.body.description;
    });
  }

  private _showNotification(severity: string, message: string): void {
    const severityCaptitalized = severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({ severity, summary: severityCaptitalized, detail: message, life: 3000 });
  }

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

  public checkMustValidated() {
    const mustValidateDocument = {
      description: true,
      category: true,
      status: true,
    };

    if (!this.documentType.description) {
      this._showNotification('error', 'Masukkan Document Name terlebih dahulu');
      mustValidateDocument.description = false;
    }
    if (!this.documentType.category) {
      this._showNotification('error', 'Masukkan Category Document terlebih dahulu');
      mustValidateDocument.category = false;
    }
    if (!this.documentType.statusId) {
      this._showNotification('error', 'Masukkan Status Document terlebih dahulu');
      mustValidateDocument.status = false;
    }

    return this._validateProcess(mustValidateDocument);
  }

  public validateDocument(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Document Type Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateDocument().then(() => resolve(true));
    });
  }
}
