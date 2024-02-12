import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MasterFinancialInstitutionService } from '../master-parameter/financial-institution/master-financial-institution.service';
import { IBankAcountModel } from './bank-account.model';
import { FormControl } from '@angular/forms';
import { IMasterFinancialInstitution } from '../master-parameter/financial-institution/master-financial-institution.model';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'jhi-bank-account-dialog',
  templateUrl: './bank-account-dialog.component.html',
  styleUrls: ['./bank-account-detail.style.css'],
})
export class BankAccountDialogComponent implements OnInit {
  public dataBankAccount: IBankAcountModel;
  constructor(
    private dialog: MatDialog,
    private _dialog: MatDialogRef<BankAccountDialogComponent>,
    private masterFinancialInstitutionService: MasterFinancialInstitutionService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: IBankAcountModel;
    }
  ) {
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.dataBankAccount = data.item;
  }

  ngOnInit(): void {
    this.loadFinancialInstitution();
  }

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
        this._dialog.close();
      }
    });
  }

  private loadFinancialInstitution(): void {
    this.masterFinancialInstitutionService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataMasterFinancialInstitution = res.body;
        this.filteredMVOri();
        if (this.dataBankAccount.finInstituteId) {
          this.MVOriCcy = this.dataMasterFinancialInstitution.find(obj => obj.code === this.dataBankAccount.finInstituteCode);
        }
      });
  }

  public myControlMVOri = new FormControl();
  public dataMasterFinancialInstitution: IMasterFinancialInstitution[];
  public filteredOptionsMVOri: Observable<IMasterFinancialInstitution[]>;
  public MVOriCcy: IMasterFinancialInstitution;

  filteredMVOri() {
    this.filteredOptionsMVOri = this.myControlMVOri.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVOri(name as string) : this.dataMasterFinancialInstitution.slice();
      })
    );
  }

  displayFnMVOri(item: IMasterFinancialInstitution): string {
    return item && item.description ? item.description : '';
  }

  private _filterMVOri(description: string): IMasterFinancialInstitution[] {
    const filterValue = description.toLowerCase();
    return this.dataMasterFinancialInstitution.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  getDataBank() {
    this.dataBankAccount.finInstituteId = this.MVOriCcy.id;
  }

  getDataBankView() {
    if (this.MVOriCcy) {
      return this.MVOriCcy.description;
    }
    return this.dataBankAccount.finInstituteId;
  }

  onSave() {
    this._dialog.close(this.dataBankAccount);
  }
}
