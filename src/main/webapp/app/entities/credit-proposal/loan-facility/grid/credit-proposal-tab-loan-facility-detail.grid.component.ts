import { Component, Input, OnInit } from '@angular/core';
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
import { IProduct } from 'app/entities/product/product.model';
import { PageEvent } from '@angular/material/paginator';

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

  length: number;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent;

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

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngOnInit(): void {
    console.log('credit proposal', this.creditProposal.products);
    this.partyCifFunc();
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;
  }
  partyCifFunc() {
    if (this.creditProposal.attributes['loanHobbies'] === 'true' || this.creditProposal.attributes['loanHobbies'] === true) {
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        this.dataParty.push(this.creditProposal.products[i]);
        console.log('data party 1', this.dataParty);
      }
    } else {
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        this.dataParty.push(this.creditProposal.products[i]);
        console.log('data party 2', this.dataParty);
      }
      this.creditProposal.attributes['loanHobbies'] = 'false';
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
    }
  }

  public getCurrency(element: IApplicationProduct) {
    if (element.attributes.provitionFeeRateAmountType === 'Amount IDR') {
      return 'IDR';
    }

    if (element.attributes.provitionFeeRateAmountType === 'Amount USD') {
      return 'USD';
    }
    return '';
  }

  public getCurrency2(element: IApplicationProduct) {
    if (element.attributes.provitionFeeRateAmountType === '%p.a') {
      return '%p.a';
    }
    return '';
  }

  dataFunc(response: any) {
    this.partyCifService.find('cif/retrieve-cp-facility/' + response.body[0].customerNumber).subscribe((res: any) => {
      const cpFacility = JSON.parse(res.body.debtorData.attributes['cpFacility']);

      const dataParty = [];
      for (let i = 0; i < cpFacility.length; i++) {
        const aYear = [];
        const date2 = new Date(cpFacility[i].FILN10_TOT_EXP_IL);
        const date1 = new Date(cpFacility[i].FXFIG_TRX_DT);
        aYear.push(Math.round(Math.round((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24) / 360)));
        const data = {
          adminFee: '0',
          adminFeeRateAmountType: '',
          applicationType: 'Existing',
          availableLimit: '0',
          availablePeriod: '',
          availablePeriodType: '',
          changes: '0',
          commitedLine: 'false',
          currency: cpFacility[i].LNB_BASE_LON_CCY,
          currentInterestRate:
            cpFacility[i].FILN10_ROLL_GAP +
            ' ' +
            cpFacility[i].FILN10_ROLL_GAP_GB_NM +
            ' ' +
            ' ' +
            cpFacility[i].FIX_FLT_GB_NM +
            ' ' +
            cpFacility[i].FILN11_SPREAD_RT,
          dateOS: '2022-11-24T10:57:14.435Z',
          disbursementCondition: '',
          facilityType: cpFacility[i].FILN11_COM_NM,
          gracePeriod: '0',
          gracePeriodType: cpFacility[i].FILN10_ROLL_GAP_GB,
          indexFacilityMain: '',
          indexRate: '0',
          initialLimit: cpFacility[i].FILN10_CONTRACT_AMT,
          installmentMethod: 'Maturity Repayment',
          instalmentEstimation: '0',
          interestRatePeriod: cpFacility[i].FILN10_ROLL_GAP,
          interestRatePeriodType: 'Month',
          interestRateType: cpFacility[i].FIX_FLT_GB_NM,
          keterangan: '',
          kurs: '0',
          loanPurpose: '',
          loanType: cpFacility[i].FILN11_COM_NM,
          maturity: aYear[i],
          maturityDate: '2022-11-24T10:57:14.435Z',
          maturityPeriodType: cpFacility[i].FILN10_ROLL_GAP_GB_NM,
          memoDate: '2022-11-24T10:57:14.435Z',
          memoNo: '',
          nomorUrutFasilitas: '2',
          outstanding: cpFacility[i].LNB_BASE_LON_JAN,
          principalFrequency: '0',
          principalFrequencyPeriodType: '',
          provitionFee: '0',
          provitionFeeRateAmountType: '',
          remark: '',
          restructMethod: '',
          restructuredStatus: 'false',
          spreadOfMargin: '0',
          subLimit: 'false',
          subLimitFromExitingFacility: '',
          sublimitFromExistingFacility: '',
          totalPlafond: cpFacility[i].FILN10_CONTRACT_AMT,
          totalRate: '0',
          hobbies: true,
          loanAccount: cpFacility[i].LNB_BASE_AGR_REF_NO,
        };

        dataParty.push(data);
      }

      const appProduct: IApplicationProduct = this.applicationProduct;
      let idx: number;
      if (!this.applicationProduct.id) {
        idx = lodash.findIndex(this.creditProposal.products, function (o) {
          return o.uniqueKey === appProduct.uniqueKey;
        });

        const countDataHobbies = [];
        for (let i = 0; i < this.dataParty.length; i++) {
          if (this.dataParty[i].attributes !== undefined) {
            if (this.dataParty[i].attributes['hobbies'] !== undefined) {
              if (this.dataParty[i].attributes['hobbies'] === 'true' || this.dataParty[i].attributes['hobbies'] === true) {
                countDataHobbies.push(this.dataParty[i]);
              }
            }
          }
        }

        if (countDataHobbies.length < 1) {
          for (let i = 0; i < dataParty.length; i++) {
            const copyApplicationProduct: IApplicationProduct = Object.assign({}, this.applicationProduct);
            copyApplicationProduct.applicationId = this.creditProposal.id;
            this.applicationProduct = {
              attributes: dataParty[i],
            };

            this.dataParty = [...this.dataParty, this.applicationProduct];
            this.length = this.dataParty.length;
          }

          this.creditProposal.attributes['loanHobbies'] = 'true';
          this.creditProposal.products = this.dataParty;
        } else {
          if (dataParty.length > 0) {
            this.creditProposal.attributes['loanHobbies'] = 'true';
          } else {
            this.creditProposal.attributes['loanHobbies'] = 'false';
          }
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
