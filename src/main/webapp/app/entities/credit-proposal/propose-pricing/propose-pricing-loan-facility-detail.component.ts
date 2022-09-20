import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { ICreditProposal } from '../credit-proposal.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
@Component({
  selector: 'jhi-credit-proposal-propose-pricing-loan-facility-detail',
  templateUrl: './propose-pricing-loan-facility-detail.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class ProposePricingLoanFacilityDetailComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  private _creditProposal: ICreditProposal;
  public aplicationProducts: IApplicationProduct[];
  public applicationProduct: any = {};
  public initialState = false;
  public stateOfAction: string;
  public dataEdit: any;
  public detailStats = false;
  public status = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
    this.aplicationProducts = item.products;
    this.applicationProduct = item.products;
  }
  public dataBound(args: any) {
    // this.grid.autoFitColumns(["Name"]); // autoFit particular column
    this.grid.autoFitColumns(); // autofit all the columns
  }
  ngOnInit(): void {
    this.dataEdit = {
      nomorUrutFasilitas: '',
      applicationType: '',
      facilityType: '',
      maturity: '',
      maturityPeriodType: '',
      maturityDate: '',
      subLimit: '',
      sublimitFromExistingFacility: '',
      commitedLine: '',
      currency: '',
      kurs: '',
      initialLimit: '',
      outstanding: '',
      dateOS: '',
      changes: '',
      totalPlafond: '',
      restructuredStatus: '',
      memoNo: '',
      memoDate: '',
      keterangan: '',
      interestRateType: '',
      interestRatePeriod: '',
      interestRatePeriodType: '',
      indexRate: '',
      spreadOfMargin: '',
      totalRate: '',
      provitionFee: '',
      provitionFeeRateAmountType: '',
      adminFee: '',
      adminFeeRateAmountType: '',
      gracePeriod: '',
      gracePeriodType: '',
      availableLimit: '',
      availablePeriod: '',
      availablePeriodType: '',
      instalmentEstimation: '',
      principalFrequency: '',
      principalFrequencyPeriodType: '',
      loanPurpose: '',
      remark: '',
      discountProposal: '',
      typeReferenceRate: '10000',
    };
  }

  onEdit(status: any, data: any) {
    this.initialState = true;
    this.stateOfAction = status;
    this.ejDialog.show();
    this.dataEdit = data.attributes;
  }

  public onOverlayClick(): void {
    this.stateOfAction = '';
    this.initialState = false;
    this.ejDialog.hide();
  }

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
  };

  saveData() {
    this.aplicationProducts[0].attributes = this.dataEdit;
    this.ngOnInit();
    console.log('data edit', this.aplicationProducts[0]);
  }

  onGetApplicationProduct(value: any) {}
}
