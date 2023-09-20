import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Employee, IEmployee, IEmployeeDownload } from './employee.model';
import { read, utils } from 'xlsx';
import { CashEmployeeService } from './cash-employee.service';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialSnackbarContentComponent } from 'app/miscellaneous/material-snackbar-content.component';

@Component({
  selector: 'jhi-employee-upload',
  templateUrl: './employee-upload.component.html',
})
export class EmployeeUploadComponent {
  public listOfData: IEmployeeDownload[] = [];
  constructor(
    protected _dialog: MatDialogRef<EmployeeUploadComponent>,
    private cashEmployeeService: CashEmployeeService,
    private snackBar: MatSnackBar
  ) {}

  private convert(data: IEmployeeDownload[]): IEmployee[] {
    const result: IEmployee[] = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const item: IEmployeeDownload = data[i];
        const newEmployee = new Employee();
        newEmployee.internalId = item.internalId.toString();
        newEmployee.person.firstName = item.firstName;
        newEmployee.person.lastName = item.lastName;
        newEmployee.person.userLogin = item.userLogin;
        newEmployee.person.personalEmail = item.personalEmail;
        newEmployee.statusId = 'ACTIVE';
        newEmployee.roleId = 'EMPLOYEE';

        result.push(newEmployee);
      }
    }

    return result;
  }

  public async upload(): Promise<void> {
    const res: IEmployee[] = this.convert(this.listOfData);
    try {
      const res2: string = (await firstValueFrom(this.cashEmployeeService.bulkData(res, {}))).body;
      this._dialog.close();
    } catch (err: any) {
      const message: string = err['error']['detail'];
      this.snackBar.openFromComponent(MaterialSnackbarContentComponent, {
        data: {
          html: message,
        },
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000,
      });
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
