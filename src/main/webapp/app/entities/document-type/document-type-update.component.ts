import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDocumentType, DocumentType } from './document-type.model';
import { DocumentTypeService } from './document-type.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-document-type-update',
  templateUrl: './document-type-update.component.html',
  styleUrls: ['./document-type.css'],
})
export class DocumentTypeUpdateComponent extends AbstractEntityBaseViewComponent<IDocumentType> implements OnInit {
  public documentType: IDocumentType;
  public parentIdValue: IDocumentType[];
  public idDocumentType = [];
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
  public customerTypeValue = ['CORPORATE', 'PERSONAL', 'ALL'];

  public categoryValue = ['A', 'B', 'C'];
  public documentName: IDocumentType[];

  private id: string;

  post: any = '';
  organizationData: any = '';

  constructor(
    private dialog: MatDialog,
    private documentTypeService: DocumentTypeService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(documentTypeService);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.loadData();
    this.selectParentIdValue();
  }

  loadData(): void {
    this.documentType = new DocumentType();
    this.documentTypeService.find(this.id).subscribe(result => {
      this.documentType = result.body;
    });
  }

  public selectParentIdValue() {
    this.documentTypeService
      .filterTableData({
        lvl2: true,
        sort: ['asc'],
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.parentIdValue = res.body;
      });
  }

  public submit() {
    if (this.documentType.id) {
      this.documentTypeService.update(this.documentType).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });

        if (res.body) {
          this.router.navigate(['/document-type']);
        }
      });
    }
  }

  previousState(): void {
    window.history.back();
  }

  public saveData() {
    this.validate().then(() => this.submit());
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

  // cancel confrimation dialog
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
        this.previousState();
      }
    });
  }
}
