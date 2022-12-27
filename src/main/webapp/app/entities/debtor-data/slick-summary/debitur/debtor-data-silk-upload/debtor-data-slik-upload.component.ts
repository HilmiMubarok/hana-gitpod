import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { AccountService } from 'app/core/auth/account.service';
import { Document, IDocument } from '../../../../document/document.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPDFSlik, PDFSlik } from 'app/shared/ocr/pdf-slik.model';
import { PDFService } from 'app/shared/ocr/pdf.service';

@Component({
  selector: 'jhi-debtor-data-slik-upload',
  templateUrl: './debtor-data-slik-upload.component.html',
  styleUrls: ['./debtor-data-slik-upload.scss'],
})
export class DebtorDataSlikUploadComponent implements OnInit {
  public datas = [];
  public files: File[] = [];
  public file: File;
  public document: IDocument;
  public documentTypes: any;
  public multiple: Boolean = false;
  public indeks = 0;
  public mode: 'add' | 'view'

  private partyId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cif: string; partyId: string },
    private _dialog: MatDialogRef<DebtorDataSlikUploadComponent>,
    private _snackBar: MatSnackBar,
    private pdfService: PDFService
  ) {
    this.document = new Document();
    this.file = null;
    this.partyId = this.data.partyId;
  }

  ngOnInit(): void {
    console.log('this dialog', this.data);
  }

  protected convertDateFromServer(res: HttpResponse<IPartySlik>): HttpResponse<IPartySlik> {
    res.body.arrearsDate = res.body.arrearsDate != null ? new Date(res.body.arrearsDate) : null;
    return res;
  }
  protected itemPreLoad(item: any): any {
    return item;
  }

  protected preLoadItem(res: HttpResponse<any>): HttpResponse<any> {
    this.itemPreLoad(res.body);
    return res;
  }

  private async update(entity: any): Promise<IPDFSlik[]> {
    return (await firstValueFrom(this.pdfService.extractSlikFromFile(entity, {}, this.partyId))).body;
  }

  public async save(): Promise<void> {
    let flag = 0;
    if (this.files.length === 0) {
      this._snackBar.open('Choose file for upload', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    for (let i = 0; i < this.files.length; i++) {
      const formData = new FormData();
      formData.append('file', this.files[i]);
      const result: IPDFSlik[] = await this.update(formData);
      flag++;
      if (flag === this.files.length) {
        this._snackBar.open('Upload Berhasil', null, {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        });
        this._dialog.close({data: result, files: this.files});
      }
      return;
    }
  }

  public onSelect(event: any) {
    console.log('event', event.addedFiles);
    this.files.push(...event.addedFiles);
  }

  public onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onNoClick(): void {
    console.log('click');
    this._dialog.close();
  }
}
