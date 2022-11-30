import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { ICreditProposal, CreditProposal } from '../../credit-proposal.model';
import {
  IApplicationProduct,
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProductAttribute,
} from '../../../application-product/application-product.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalLoanFacilityDialogComponent } from '../dialog/loan-facility-dialog.component';
import { Router } from '@angular/router';
import { CollateralAttribute } from 'app/entities/collateral/collateral.model';
import {
  CollateralProductRelation,
  ICollateralProductRelation,
} from 'app/entities/collateral-product-relation/collateral-product-relation.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-grid',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./loan.scss'],
})
export class CreditProposalTabLoanFacilityDetailGridComponent implements OnInit {
  public dataParty = [];
  @Input() isViewMode: Boolean = false;
  public _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public visibleDialog: boolean;
  public applicationProduct: IApplicationProduct;
  public collaterallInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: any;

  public displayColumns: string[] = [
    'no',
    'applicationType',
    'facilityType',
    'subLimit',
    'currency',
    'initialLimit',
    'outstanding',
    'changes',
    'totalCreditLimit',
    'interestrate',
    'provisionAmount',
    'provisionCcy',
    'tenor',
    'maturityDate',
    'action',
  ];

  public stateOfAction?: string;
  public format = { format: 'R$ #. ## 0,00' };
  public numericFormatOptions: Object;
  public loading: boolean;
  public cloneData: any;

  constructor(public partyCifService: PartyCifService, public dialog: MatDialog, public _router: Router) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }

  ngOnInit(): void {
    this.partyCifFunc();
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;
  }
  partyCifFunc() {
    this.partyCifService
      .queryFilterBy({
        page: 0,
        size: 1,
        idParty: this._creditProposal.cif.partyId,
        sort: ['desc'],
      })
      .subscribe((response: any) => {
        this.dataFunc(response);
      });

    for (let i = 0; i < this.creditProposal.products.length; i++) {
      if (this.creditProposal.products[i].attributes.remark !== 'Data From Hobbies') {
        this.dataParty.push(this.creditProposal.products[i]);
      }
    }
  }

  dataFunc(response: any) {
    this.partyCifService.find('cif/retrieve-cp-facility/' + response.body[0].customerNumber).subscribe((res: any) => {
      const cpFacility = JSON.parse(res.body.debtorData.attributes['cpFacility'])[0];
      this.dataParty = [
        ...this.dataParty,
        {
          amount: null,
          applicationId: 851,

          currencyId: null,
          currentProduct: {},
          groupCompanyId: null,
          groupCompanyName: null,
          id: 1285,
          productId: 1270,
          tenor: null,

          attributes: {
            adminFee: '0',
            adminFeeRateAmountType: '',
            applicationType: 'New',
            availableLimit: '0',
            availablePeriod: '',
            availablePeriodType: '',
            changes: '10000',
            commitedLine: 'false',
            currency: cpFacility.LNB_BASE_LON_CCY,
            currentInterestRate: cpFacility.FICH22_RATE_GB,
            dateOS: '2022-11-24T10:57:14.435Z',
            disbursementCondition: '',
            facilityType: '',
            gracePeriod: '0',
            gracePeriodType: '',
            indexFacilityMain: '',
            indexRate: '0',
            initialLimit: '10000',
            installmentMethod: 'Maturity Repayment',
            instalmentEstimation: '0',
            interestRatePeriod: '',
            interestRatePeriodType: 'Month',
            interestRateType: '',
            keterangan: '',
            kurs: '0',
            loanPurpose: '',
            loanType: '',
            maturity: '0',
            maturityDate: cpFacility.FILN10_TOT_EXP_IL,
            maturityPeriodType: '',
            memoDate: '2022-11-24T10:57:14.435Z',
            memoNo: '',
            nomorUrutFasilitas: '2',
            outstanding: cpFacility.LNB_BASE_LON_JAN,
            principalFrequency: '0',
            principalFrequencyPeriodType: '',
            provitionFee: '0',
            provitionFeeRateAmountType: '',
            remark: 'Data From Hobbies',
            restructMethod: '',
            restructuredStatus: 'false',
            spreadOfMargin: '0',
            subLimit: 'false',
            subLimitFromExitingFacility: '',
            sublimitFromExistingFacility: '',
            totalPlafond: '20000',
            totalRate: '0',
            hobbies: true,
          },
        },
      ];
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        if (this.creditProposal.products[i].attributes.remark !== 'Data From Hobbies') {
          this.creditProposal.products = this.dataParty;
        }
      }
    });
  }

  public openDialog(param: IApplicationProduct = null): void {
    if (param) {
      this.applicationProduct = param;
      if (this.applicationProduct.attributes && typeof this.applicationProduct.attributes !== 'object') {
        this.applicationProduct.attributes = JSON.parse(this.applicationProduct.attributes);
      }
      if (this.applicationProduct.attributes.commitedLine === 'true') {
        this.applicationProduct.attributes.commitedLine = true;
      } else if (this.applicationProduct.attributes.commitedLine === 'false') {
        this.applicationProduct.attributes.commitedLine = false;
      }
      if (this.applicationProduct.attributes.subLimit === 'true') {
        this.applicationProduct.attributes.subLimit = true;
      } else if (this.applicationProduct.attributes.subLimit === 'false') {
        this.applicationProduct.attributes.subLimit = false;
      }
      if (this.applicationProduct.attributes.restructuredStatus === 'true') {
        this.applicationProduct.attributes.restructuredStatus = true;
      } else if (this.applicationProduct.attributes.restructuredStatus === 'false') {
        this.applicationProduct.attributes.restructuredStatus = false;
      }
    } else {
      this.applicationProduct = new ApplicationProduct();
      const attr: IApplicationProductAttribute = new ApplicationProductAttribute();
      attr.nomorUrutFasilitas = this.creditProposal.products.length + 1;
      this.applicationProduct.attributes = attr;
    }

    const dialogRef = this.dialog.open(CreditProposalLoanFacilityDialogComponent, {
      width: '80vw',

      data: {
        item: this.creditProposal,
        creditProposaldata: this.creditProposal,
        applicationProduct: this.applicationProduct,
        collateralInfo: this.collaterallInfo,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.applicationProduct = res.applicationProduct;
        this.creditProposal.collateralProductRelations = [...res.creditProposal.collateralProductRelations];
        this.onSave();
      }
    });
  }

  public onSave(): void {
    const appProduct: IApplicationProduct = this.applicationProduct;
    let idx: number;
    if (!this.applicationProduct.id) {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.uniqueKey === appProduct.uniqueKey;
      });

      if (idx === -1) {
        const copyApplicationProduct: IApplicationProduct = Object.assign({}, this.applicationProduct);
        copyApplicationProduct.applicationId = this.creditProposal.id;
        this.dataParty = [...this.dataParty, this.applicationProduct];
        this.creditProposal.products = [...this.creditProposal.products, this.applicationProduct];
      } else {
        this.creditProposal.products[idx] = appProduct;
        this.dataParty[idx] = appProduct;
      }
    } else {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.id === appProduct.id;
      });
      this.creditProposal.products[idx] = appProduct;
      this.dataParty[idx] = appProduct;
    }
  }

  public onDelete(element: IApplicationProduct) {
    const dataGrid = this.creditProposal.products.filter(({ attributes }) => attributes !== element.attributes);
    this.dataParty = dataGrid;
    this.creditProposal.products = this.dataParty;
  }

  public parseStringToInt(data: string): number {
    return parseInt(data, 10);
  }

  public printElement(element) {
    let subLimit: string;
    subLimit = '';
    if (element === true || element === 'true') {
      subLimit = 'Yes';
    } else if (element === false || element === 'false') {
      subLimit = 'No';
    }
    return subLimit;
  }

  print() {
    console.log(this._creditProposal);
  }
}
