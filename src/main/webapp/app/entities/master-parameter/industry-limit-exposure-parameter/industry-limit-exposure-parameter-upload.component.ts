import { Component } from '@angular/core';
import { read, utils } from 'xlsx';
import { IIndustryLimitExposureParameter } from './industry-limit-exposure-parameter.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IndustryLimitExposureParameterService } from './industry-limit-exposure-parameter.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'jhi-industry-limit-exposure-parameter-upload',
  templateUrl: './industry-limit-exposure-parameter-upload.component.html',
  styleUrls: ['./industry-limit-exposure-parameter.css'],
})
export class MasterParameterIndustryLimitExposureUploadComponent {
  public listOfData: IIndustryLimitExposureParameter[] = [];
  constructor(
    private _snackBar: MatSnackBar,
    protected industryLimitExposureParameterService: IndustryLimitExposureParameterService,
    protected _dialog: MatDialogRef<MasterParameterIndustryLimitExposureUploadComponent>
  ) {}

  public upload(): void {
    this.industryLimitExposureParameterService.bulkUpdate(this.listOfData).subscribe({
      next: value => this.onSuccess(),
      error: err => this.onError(err),
    });
  }

  private onSuccess() {
    this._dialog.close();
  }

  private onError(err: any) {
    const msg: string = err['error']['detail'];
    this._snackBar.open(msg, null, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  public fileChanged(e: any): void {
    const file: any = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = o => {
      const buffer: any = fileReader.result;
      const data = new Uint8Array(buffer);
      const arr = [];
      for (let i = 0; i < data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = read(bstr, {
        type: 'binary',
      });
      const first_sheet_name: any = workbook.SheetNames[0];
      const worksheet: any = workbook.Sheets[first_sheet_name];
      this.listOfData = utils.sheet_to_json(worksheet, {
        raw: true,
        defval: '',
      });
    };
    fileReader.readAsArrayBuffer(file);
  }
}
