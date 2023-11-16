import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';
import { CashCreditAgreementService } from '../../cash-credit-agreement.service';
@Component({
  selector: 'jhi-signer-perjanjian-kredit',
  templateUrl: './signer-perjanjian-kredit-dialog.component.html',
  styleUrls: ['../../credit-agreement.css'],
})
export class SignerPerjanjialKreditDialogComponent implements OnInit {
  public name: string;
  public debitor: string;
  public position: string;

  myOption = new FormControl();
  myName = new FormControl();
  public options: any[] = [];
  public nama: any[] = [];
  filteredOptions: Observable<string[]>;
  filteredName: Observable<string[]>;
  constructor(
    public organizationManagementService: OrganizationManagementService,
    public cashCreditAgreementService: CashCreditAgreementService,
    public dialogRef: MatDialogRef<SignerPerjanjialKreditDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
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
          this.options = [...this.options, res.body[i].attributes.position];
        }

        this.filteredOptions = this.myOption.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  public onSelectPositon(event: any) {
    this.debitor = event.value;
  }

  onOptionSelected(event: any): void {
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

  private _filterName(value: string): string[] {
    const filterValue = value.toLowerCase();

    const data = this.nama.filter((nama: any) => (nama !== undefined ? nama.toLowerCase().indexOf(filterValue) === 0 : ''));
    return Array.from(new Set(data));
  }

  onSave(): void {
    this.dialogRef.close({
      name: this.name,
      debitor: this.debitor,
      position: this.position,
    });
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}
