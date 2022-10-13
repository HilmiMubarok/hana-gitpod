import { Component, Inject, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { ICreditProposal } from '../../credit-proposal.model';
// import

@Component({
  selector: 'jhi-loan-facility-dialog',
  templateUrl: './loan-facility-dialog.component.html',
  styleUrls: ['./dialog-facility.css'],
})
export class CreditProposalLoanFacilityDialogComponent {
  private _collateral: ICollateral;
  private _creditproposal: ICreditProposal;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
    this.checkData();
  }

  @Input()
  get creditProposal() {
    return this._creditproposal;
  }
  set creditProposal(param: ICreditProposal) {
    this._creditproposal = param;
    // this.checkData();
  }

  public dateNow = new Date();
  public checked = false;
  public detailStats = false;
  public statIntRate = false;
  public listOfValue = {
    applicationTypeList: [
      'New',
      'Additional / Top Up',
      'Renewal',
      'Restructure',
      'Existing',
      'Others',
      'Renewal + Additional',
      'Renewal + Decrease',
    ],
    facilityTypeList: ['OD', 'WCI', 'DL', 'MML', 'FL', 'TR', 'E-ARC', 'IL', 'BG', 'LC', 'FN - Syndicate loan / club deal'],
    installmentMethodList: [
      'Maturity Repayment',
      'Even Installment',
      'Even Installment(First Uneven)',
      'Even Installment(Last Uneven)',
      'Uneven Installment',
      'Annuity(All)',
      'Annuity(Partial)',
      'Annuity(All) In Advance',
    ],
    periodTypeList: ['Week', 'Month', 'Year'],
    sublimitFromExistingFacilityList: [],
    currencyList: ['IDR', 'USD'],
    restructList: [
      'Penurunan suku bunga kredit',
      'Perpanjangan jangka waktu kredit',
      'Pengurangan tunggakan pokok kredit',
      'Pengurangan tunggakan bunga kredit',
      'Penambahan fasilitas kredit',
      'Konversi kredit menjadi penyertaan modal sementara',
      'Penambahan fasilitas kredit dan pengurangan tunggakan bunga kredit',
      'Penambahan fasilitas kredit dan perpanjangan jangka waktu kredit',
      'Penambahan fasilitas kredit dan penurunan suku bunga kredit',
      'Penambahan fasilitas kredit, pengurungan tunggakan bunga kredit dan penurunan suku bunga kredit',
      'Penambahan fasilitas kredit, pengurangan tunggakan bunga kredit dan perpanjangan jangka waktu kredit',
      'Lainnya',
    ],
    interestRateTypeList: ['FIXED', 'LIBOR', 'JIBOR', 'TIBOR', 'HIBOR', 'EURIBOR', 'EURO-LIBOR', 'FED FUND', 'OTHER', 'BSBY', 'TERM SOFR'],

    rateAmountTypeList: ['Rate Percentage', 'Amount IDR', 'Amount USD'],
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

  public displayColumns: string[] = ['no', 'collateralType', 'address', 'lvInternal', 'mvInternal', 'bindingValue', 'select'];

  public applicationProduct: IApplicationProduct;
  public status = false;
  public unComitted = true;
  public com = true;
  public uncom = false;
  public collateralInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: any;
  selection = true;
  applicationProdCustom: any;
  dataProductId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      applicationProduct: IApplicationProduct;
      collateralInfo: any;
      collateralProductRelations: any;
      creditProposaldata: any;
    },
    private _dialog: MatDialogRef<CreditProposalLoanFacilityDialogComponent>
  ) {
    this.applicationProduct = this.data.applicationProduct;
    this.collateralInfo = this.data.collateralInfo;
    this.creditProposaldata = this.data.creditProposaldata;
    this.collateralProductRelations = this.data.collateralProductRelations;
    this.applicationProdCustom = this.collateralInfo && this.applicationProduct;
  }

  public save(): void {
    this._dialog.close(this.applicationProdCustom);
  }

  public changeIntRateType(event: any): void {
    console.log(event);
    if (event === 'OTHER' || event === 'FIXED' || event === 'FED FUND') {
      this.statIntRate = true;
    } else {
      this.statIntRate = false;
    }
  }

  public berubah(event: any): void {
    if (event === 'FN - Syndicate loan / club deal') {
      this.status = true;
    } else {
      this.status = false;
    }
  }

  public calTotalPlafond(): number {
    this.applicationProduct.attributes.totalPlafond =
      Number(this.applicationProduct.attributes.initialLimit) + Number(this.applicationProduct.attributes.changes);
    return Number(this.applicationProduct.attributes.initialLimit) + Number(this.applicationProduct.attributes.changes);
  }

  // setbidingvalue
  private setAttribute(): void {
    if (!lodash.has(this.collateralInfo.attributes, 'bindingValue')) {
      const attr: object = this.collateralInfo.attributes;
      this.collateralInfo.attributes = lodash.merge({}, attr, new CollateralAttribute());
    }
  }

  public checkData() {
    if (this.collateralProductRelations.length > 0) {
      for (let j = 0; j < this.collateralProductRelations.length; j++) {
        for (let i = 0; i < this.collateralInfo.length; i++) {
          this.collateralInfo[i].attributes.bindingValue = '';
          if (this.collateralInfo[i].id === this.collateralProductRelations[j].collateral.id) {
            this.collateralInfo[i].attributes.bindingValue = this.collateralProductRelations.bindingValue;
            // this.collateralInfo[i].attributes.bindingValue = this.collateralProductRelations.collateral.id;
            break;
          }
        }
      }
    }
  }

  bindingValueChange(event: number, index: any) {
    this.setAttribute();
    this.collateralInfo[index].attributes['bindingValue'] = event;
  }

  // cekBox
  private setAttributeCheckBox(): void {
    if (!lodash.has(this.collateralInfo.attributes, 'mappingStatus')) {
      const attr: object = this.collateralInfo.attributes;
      this.collateralInfo.attributes = lodash.merge({}, attr, new CollateralAttribute());
    }
  }

  changeBuildingFacility(event: MatCheckboxChange, index: any): void {
    const value: boolean = event.checked;
    this.setAttributeCheckBox();
    this.collateralInfo[index].attributes['mappingStatus'] = value === true ? 'yes' : 'no';
    if (value === true) {
      const dataData = this.applicationProduct;
      if (this.creditProposaldata.collateralProductRelations[index].id != null) {
        this.creditProposaldata.collateralProductRelations.splice(1);
        // console.log('cek daya',  this.creditProposaldata.collateralProductRelations[index].bindingValue)
        this.creditProposaldata.collateralProductRelations.push({
          id: this.creditProposaldata.collateralProductRelations[index].id,
          collateralId: this.collateralInfo[index].id,
          bindingValue: this.collateralInfo[index].attributes['bindingValue'],
          applicationProduct: dataData,
        });
      }
    } else if (value === false) {
      this.creditProposaldata.collateralProductRelations.splice(1);

      const collateralId = this.creditProposaldata.collateralProductRelations[index].id;
      const arr = this.creditProposaldata.collateralProductRelations.filter(item => item !== collateralId);
      return arr;
    }
  }
}
