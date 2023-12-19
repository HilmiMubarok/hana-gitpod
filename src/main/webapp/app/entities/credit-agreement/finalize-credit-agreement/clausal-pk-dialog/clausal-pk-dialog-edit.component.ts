import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreditAgreementService } from '../../credit-agreement.service';
import { CreditAgreementClausal, ICreditAgreementClausal } from '../agreement-clausal.model';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
} from '@syncfusion/ej2-angular-documenteditor';

@Component({
  selector: 'jhi-clausal-pk-dialog-edit',
  templateUrl: './clausal-pk-dialog-edit.component.html',
  styleUrls: ['../../credit-agreement.css'],
})
export class ClausalPkDialogComponentEditComponent {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  public category: string;
  public code: string;
  public description: string;

  constructor(
    public dialogRef: MatDialogRef<ClausalPkDialogComponentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public creditAgreementService: CreditAgreementService
  ) {
    this.category = this.data.dataClausal.category;
    this.description = this.data.dataClausal.notes;
    this.code = this.data.dataClausal.agreementClausalParameterCode;
  }

  onCreate(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
      console.log('ini paste');
    }
  }

  public close() {
    this.dialogRef.close(null);
  }

  public save() {
    this.data.dataClausal = {
      ...this.data.dataClausal,
      category: this.category,
      notes: this.description,
    };
    this.creditAgreementService.updateClausalAgreement(this.data.dataClausal).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
