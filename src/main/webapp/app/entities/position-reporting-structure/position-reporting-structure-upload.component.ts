import { Component } from '@angular/core';
import {
  IPositionReportingStructure,
  IPositionReportingStructureDownload,
  PositionReportingStructure,
} from './position-reporting-structure.model';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { read, utils } from 'xlsx';
import { firstValueFrom } from 'rxjs';
import { CashPositionReportingStructureService } from './cash-position-reporting-structure.service';

@Component({
  selector: 'jhi-position-reporting-structure-upload',
  templateUrl: './position-reporting-structure-upload.component.html',
})
export class PositionReportingStructureUploadComponent {
  public listOfData: IPositionReportingStructureDownload[];
  constructor(
    protected _dialog: MatDialogRef<PositionReportingStructureUploadComponent>,
    private cashPositionReportingStructure: CashPositionReportingStructureService,
    private snackBar: MatSnackBar
  ) {
    this.listOfData = [];
  }

  private manipulateData(data: IPositionReportingStructureDownload[]): IPositionReportingStructure[] {
    const result: IPositionReportingStructure[] = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const item: IPositionReportingStructureDownload = data[i];
        const newData: IPositionReportingStructure = new PositionReportingStructure();
        newData.positionFromId = item.positionFromId;
        newData.positionToId = item.positionToId;
        newData.relationTypeId = item.relationTypeId;
        result.push(newData);
      }
    }
    return result;
  }

  public async upload(): Promise<void> {
    const newData: IPositionReportingStructure[] = this.manipulateData(this.listOfData);
    if (newData.length > 0) {
      try {
        const result: string = (await firstValueFrom(this.cashPositionReportingStructure.bulkData(newData, {}))).body;
        this.snackBar.open('Upload succesfully', null, {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
        });
        this._dialog.close(result);
      } catch (err) {
        console.log('err', err);

        this.snackBar.open(err['error']['detail'], null, {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
        });
      }
    }
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
