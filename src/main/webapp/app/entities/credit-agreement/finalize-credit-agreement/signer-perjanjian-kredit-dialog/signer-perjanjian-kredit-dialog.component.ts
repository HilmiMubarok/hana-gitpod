import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';
import { CashCreditAgreementService } from '../../cash-credit-agreement.service';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'jhi-signer-perjanjian-kredit',
  templateUrl: './signer-perjanjian-kredit-dialog.component.html',
  styleUrls: ['../../credit-agreement.css'],
})
export class SignerPerjanjialKreditDialogComponent implements OnInit {
  public name: string;
  public nameDebitor: string;
  public debitor: string;
  public position: string;
  public optionKebHana: any[] = [];
  public optionDebitor: any[] = [];
  public employeePosition: any[] = [];
  public agreement: any[];
  public filterOptionKebHana: any[] = [];

  myOption = new FormControl();
  myName = new FormControl();
  public options: any[] = [];
  public nama: any[] = [];
  filteredOptions: Observable<string[]>;
  filteredName: Observable<string[]>;
  constructor(
    public organizationManagementService: OrganizationManagementService,
    public messageService: MessageService,
    public cashCreditAgreementService: CashCreditAgreementService,
    public positionTypeService: PositionTypeService,
    public employeeService: EmployeeService,
    public dialogRef: MatDialogRef<SignerPerjanjialKreditDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.element !== null) {
      this.nameDebitor = this.data.element.name;
      this.debitor = this.data.element.debitor;
      this.position = this.data.element.position;
    }
  }

  ngOnInit(): void {
    this.getEmployee().then(() => {
      this.filterPosition();
    });

    this.agreement = JSON.parse(this.data.creditProposal.agreements[0]?.attributes.SIGNERS);
  }

  generateRandomId(): string {
    let randomId: string;
    const idLength = 8; // You can adjust the length as needed

    do {
      randomId = this.generateRandomString(idLength);
    } while (this.isIdInArray(randomId));

    return randomId;
  }

  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  private isIdInArray(id: string): boolean {
    return this.agreement.some(item => item.id === id);
  }

  public getEmployee(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.employeeService
        .query({
          page: 0,
          size: 99999,
          sort: ['id', 'asc'],
        })
        .subscribe(
          (res: any) => {
            this.employeePosition = res.body;
            resolve();
          },
          (error: any) => {
            // Handle errors and reject the promise if necessary
            console.error('Error fetching employee data:', error);
            reject(error);
          }
        );
    });
  }

  public filterPosition() {
    let optionKebHana: any[] = [];

    this.positionTypeService
      .query({
        page: 0,
        size: 9999999,
        sort: ['id', 'asc'],
      })
      .subscribe((res1: any) => {
        this.filterOptionKebHana = res1.body;
        for (let i = 0; i < res1.body.length; i++) {
          optionKebHana = [...optionKebHana, res1.body[i].description];
        }

        this.optionDebitor = optionKebHana;
        if (this.data.element !== null) {
          this.getPositon();
          this.getName();
        }
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public onSelectPositon(event: any) {
    this.debitor = event.value;

    if (this.data.creditProposal.prospectPerson !== null) {
      if (this.debitor === 'Debitor') {
        this.nameDebitor = this.data.creditProposal.prospectPerson.name;
      } else {
        this.nameDebitor = '';

        for (let i = 0; i < this.employeePosition.length; i++) {
          this.nama = [...this.nama, this.employeePosition[i].person.name];
        }

        this.filteredName = this.myName.valueChanges.pipe(
          startWith(''),
          map(value => this._filterName(value))
        );
      }
    } else {
      if (this.debitor === 'PT Keb Hana Bank Indonesia') {
        this.options = this.optionDebitor;
        this.filteredOptions = this.myOption.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      } else {
        this.position = '';
        this.nameDebitor = '';
        this.nama = [];
        this.filteredName = this.myName.valueChanges.pipe(
          startWith(''),
          map(value => this._filterName(value))
        );
        this.options = [];
        this.filteredOptions = this.myOption.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    }
  }

  public getPositon() {
    this.options = [];

    if (this.debitor === 'Debitor') {
      this.options = [];
      this.filteredOptions = this.myOption.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    } else {
      this.options = this.optionDebitor;
      this.filteredOptions = this.myOption.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
  }

  public getName() {
    if (this.data.creditProposal.prospectPerson !== null) {
      if (this.debitor === 'Debitor') {
        this.nameDebitor = this.data.creditProposal.prospectPerson.name;
      } else {
        for (let i = 0; i < this.employeePosition.length; i++) {
          this.nama = [...this.nama, this.employeePosition[i].person.name];
        }

        this.filteredName = this.myName.valueChanges.pipe(
          startWith(''),
          map(value => this._filterName(value))
        );
      }
    } else {
      if (this.debitor === 'Debitor') {
        this.nama = [];
        this.filteredName = this.myName.valueChanges.pipe(
          startWith(''),
          map(value => this._filterName(value))
        );
      } else {
        const filter = this.filterOptionKebHana.filter((res: any) => res.description === this.position);

        const result = this.employeePosition.filter(obj =>
          obj.positions.some(innerObj => innerObj.positionTypeDescription === filter[0].description)
        );

        for (let i = 0; i < result.length; i++) {
          this.nama = [...this.nama, result[i].person.name];
        }
        this.filteredName = this.myName.valueChanges.pipe(
          startWith(''),
          map(value => this._filterName(value))
        );
      }
    }
  }

  onOptionSelected(event: any): void {
    if (this.debitor === 'Debitor') {
      this.nama = [];
      this.filteredName = this.myName.valueChanges.pipe(
        startWith(''),
        map(value => this._filterName(value))
      );
    } else {
      const filter = this.filterOptionKebHana.filter((res: any) => res.description === this.position);

      const result = this.employeePosition.filter(obj =>
        obj.positions.some(innerObj => innerObj.positionTypeDescription === filter[0].description)
      );

      for (let i = 0; i < result.length; i++) {
        this.nama = [...this.nama, result[i].person.name];
      }
      this.filteredName = this.myName.valueChanges.pipe(
        startWith(''),
        map(value => this._filterName(value))
      );
    }
  }

  private _filterName(value: string): string[] {
    const filterValue = value.toLowerCase();

    const data = this.nama.filter((nama: any) => (nama !== undefined ? nama.toLowerCase().indexOf(filterValue) === 0 : ''));
    return Array.from(new Set(data));
  }

  onSave(): void {
    if (this.data.creditProposal.agreements.length > 0) {
      this.dialogRef.close({
        id: this.data.element === null ? this.generateRandomId() : this.data.element.id,
        name: this.nameDebitor,
        debitor: this.debitor,
        position: this.position,
        element: this.data.element,
      });
    } else {
      this.messageService.add({ severity: 'warning', summary: 'Warning', detail: 'Data Agreements tidak ada' });
    }
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}
