import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';
import { CashCreditAgreementService } from '../../cash-credit-agreement.service';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { EmployeeService } from 'app/entities/employee/employee.service';
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

    this.agreement = JSON.parse(this.data.creditProposal.agreements[0].attributes.SIGNERS);
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
    let optionDebitor: any[] = [];
    this.organizationManagementService
      .queryFilterBy({
        cifNumber: this.data.creditProposal.customerNumber,
        organizationManagementType: 'MANAGEMENT_DATA',
        page: 0,
        size: 999999999,
        sort: ['id,desc'],
      })
      .subscribe((res: any) => {
        for (let i = 0; i < res.body.length; i++) {
          optionDebitor = [...optionDebitor, res.body[i].attributes.position];
        }

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

            this.optionKebHana = optionKebHana;
            this.optionDebitor = optionDebitor;
            if (this.data.element !== null) {
              this.getPositon();
              this.getName();
            }
          });
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public onSelectPositon(event: any) {
    this.debitor = event.value;
    this.options = [];

    if (this.debitor === 'Debitor') {
      this.options = this.optionKebHana;
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

  public getPositon() {
    this.options = [];

    if (this.debitor === 'Debitor') {
      this.options = this.optionKebHana;
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
    this.nama = [];
    if (this.debitor === 'Debitor') {
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
    } else {
      this.cashCreditAgreementService.cashOrganizationManagements('MANAGEMENT_DATA', 'position', this.position).subscribe((res: any) => {
        for (let i = 0; i < res.body.length; i++) {
          this.nama = [...this.nama, res.body[i].organization?.name];
        }
        this.filteredName = this.myName.valueChanges.pipe(
          startWith(''),
          map(value => this._filterName(value))
        );
      });
    }
  }

  onOptionSelected(event: any): void {
    this.nama = [];
    if (this.debitor === 'Debitor') {
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
    } else {
      const selectedValue = event.option.value;
      this.cashCreditAgreementService.cashOrganizationManagements('MANAGEMENT_DATA', 'position', selectedValue).subscribe((res: any) => {
        for (let i = 0; i < res.body.length; i++) {
          this.nama = [...this.nama, res.body[i].organization?.name];
        }
        this.filteredName = this.myName.valueChanges.pipe(
          startWith(''),
          map(value => this._filterName(value))
        );
      });
    }
  }

  private _filterName(value: string): string[] {
    const filterValue = value.toLowerCase();

    const data = this.nama.filter((nama: any) => (nama !== undefined ? nama.toLowerCase().indexOf(filterValue) === 0 : ''));
    return Array.from(new Set(data));
  }

  onSave(): void {
    this.dialogRef.close({
      id: this.data.element === null ? this.generateRandomId() : this.data.element.id,
      name: this.nameDebitor,
      debitor: this.debitor,
      position: this.position,
      element: this.data.element,
    });
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}
