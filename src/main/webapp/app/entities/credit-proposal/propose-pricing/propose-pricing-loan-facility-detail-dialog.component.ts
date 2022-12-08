import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-propose-pricing-detail-dialog',
  templateUrl: './propose-pricing-loan-facility-detail-dialog.component.html',
  styleUrls: ['./propose-pricing.scss'],
})
export class ProposePricingLoanFacilityDetailDialogComponent {
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  creditProposal: ICreditProposal;
  public aplicationProducts: IApplicationProduct;
  public dataEdit;

  public stateOfAction: string;
  public initialState = false;
  public view: boolean;
  public detailStats = false;
  public listOfValue = {
    applicationTypeList: ['New', 'Additional / Top Up', 'Renewal', 'Restructure', 'No Changes', 'Others'],
    facilityTypeList: ['OD', 'WCI', 'DL', 'MML', 'FL', 'TR', 'E-ARC', 'IL', 'BG', 'LC', 'FN - Syndicate loan / club deal'],
    periodTypeList: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    sublimitFromExistingFacilityList: [],
    currencyList: ['IDR', 'USD'],
    interestRateTypeList: ['Fixed', 'Tidak Ada', 'Variable'],
    rateAmountTypeList: ['Rate Percentage', 'Amount'],
    gracePeriodTypeList: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ],
    refrenceRate: ['Jibor', 'Term SOFR', 'BSBY'],
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      aplicationProducts: IApplicationProduct;
      view: boolean;
      proposePricing: any;
    },
    private _dialog: MatDialogRef<ProposePricingLoanFacilityDetailDialogComponent>
  ) {
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.aplicationProducts = this.data.aplicationProducts;
    this.dataEdit = this.data.proposePricing;
  }
  public onOverlayClick(): void {
    this.stateOfAction = '';
    this.initialState = false;
    this.ejDialog.hide();
  }

  // ngOnInit() {
  //   console.log('nganu', this.dataEdit);
  //   console.log('aplikasi', this.aplicationProducts);
  //   console.log('abed', this.data.proposePricing);
  // }

  public save(): void {
    this._dialog.close({ aplicationProduct: this.aplicationProducts, action: 'cencel' });
  }
  // public close() {
  //   this._dialog.close({ action: 'cancel' });
  // }
}
