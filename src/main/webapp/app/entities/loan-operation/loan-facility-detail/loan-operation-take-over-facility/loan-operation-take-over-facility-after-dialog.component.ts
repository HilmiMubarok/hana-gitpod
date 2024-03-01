import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IApplicationProductTakeOverBank } from 'app/entities/credit-proposal/loan-facility/application-product-take-over-after-bank/application-product-take-over-after-bank.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-loan-operation-take-over-facility-after-dialog',
  templateUrl: './loan-operation-take-over-facility-after-dialog.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/grid/loan.scss'],
})
export class LoanOperationTakeOverFacilityAfterDialogComponent implements OnInit {
  @Input() isViewMode: Boolean = false;
  public _creditProposal: ICreditProposal;
  public dataFacilityType = [];
  public logoCcy;
  view: boolean;
  facilityTakeOverAfterBank: IApplicationProductTakeOverBank;
  public periodTypeList: any = ['Week', 'Month', 'Year'];

  public lock: boolean;
  public lihat = true;
  public idFacilityTakeOver: any = [];

  parentPath: any;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      facilityTakeOverAfterBank: IApplicationProductTakeOverBank;
      view: false;
    },
    public router: Router,
    private _dialog: MatDialogRef<LoanOperationTakeOverFacilityAfterDialogComponent>
  ) {
    if (data['view'] === false) {
      _dialog.disableClose = true;
      _dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }

    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.facilityTakeOverAfterBank = this.data.facilityTakeOverAfterBank;
    this.parentPath = this.router.url.split('/')[1];
  }

  ngOnInit(): void {
    this.getFacilityTypeTakeOver();
    this.changeLogo(this.facilityTakeOverAfterBank.currency);
    this.lock = true;
  }

  public selectFacility(): void {
    if (this.creditProposal.products.length > 0) {
      const element = [];
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].productTypeId !== '') {
          element.push({
            id: this._creditProposal.products[i].nomorUrutFasilitas,
            label: this._creditProposal.products[i].productTypeId,
          });
        }
        this.dataFacilityType = element.filter(idFacility => !this.idFacilityTakeOver.includes(idFacility.id));
      }
    }
  }

  public getFacilityTypeTakeOver(): void {
    const element: any = [];
    if (
      this.creditProposal.attributes['facilityTakeOverAfterBank'].length > 0 ||
      this.creditProposal.attributes['facilityTakeOverAfterBank'] !== null
    ) {
      for (let i = 0; i < this.creditProposal.attributes['facilityTakeOverAfterBank'].length; i++) {
        element.push(this.creditProposal.attributes['facilityTakeOverAfterBank'][i].facilityTypeOverBank['id']);
      }
      this.idFacilityTakeOver = element;
      this.selectFacility();
    }
  }

  public Onsave(): void {
    this._dialog.close(this.facilityTakeOverAfterBank);
  }
  public buttonSaveDisable() {
    let lock: boolean;
    lock = true;
    if (this.facilityTakeOverAfterBank.facilityTypeOverBank !== undefined) {
      lock = false;
    }
    return lock;
  }
  public changeFacility(event) {
    if (event !== undefined || event !== '') {
      const result = this._creditProposal.products.find(obj => obj.nomorUrutFasilitas === event.value.id);
      if (result !== undefined) {
        this.lock = false;
        this.facilityTakeOverAfterBank.maturityBankOver = result.initialLimit;
        this.facilityTakeOverAfterBank.initialLimitBankOver = result.tenor;
        this.facilityTakeOverAfterBank.outstandingBankOver = result.outstanding;
        this.facilityTakeOverAfterBank.maturityPeriodType = result.periodType;
        this.facilityTakeOverAfterBank.changes = result.changes;
        this.facilityTakeOverAfterBank.currency = result.currencyId;
        // this.changeLogo(result.attributes.currency);
      } else {
        this.lock = true;
      }
    }
  }

  public changeLogo(data: string) {
    if (data) {
      if (data === 'IDR') {
        this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
      }
      if (data === 'USD') {
        this.logoCcy = {};
      }
    }
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
        this._dialog.close();
      }
    });
  }
}
