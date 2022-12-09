import { Component, Input, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import {
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProduct,
  IApplicationProductAttribute,
} from 'app/entities/application-product/application-product.model';
import {
  ICollateralProductRelation,
  CollateralProductRelation,
} from 'app/entities/collateral-product-relation/collateral-product-relation.model';
import { ICreditProposal } from '../credit-proposal.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { StorageService } from 'app/entities/storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { CreditProposalLoanFacilityDialogComponent } from '../loan-facility/dialog/loan-facility-dialog.component';
import { MatDialogRef } from '@angular/material/dialog/dialog-ref';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import lodash from 'lodash';
import { ProposePricingLoanFacilityDetailDialogComponent } from './propose-pricing-loan-facility-detail-dialog.component';
import { PurposePricing } from './purpose-pricing.model';

@Component({
  selector: 'jhi-credit-proposal-propose-pricing-loan-facility-detail',
  templateUrl: './propose-pricing-loan-facility-detail.component.html',
  styleUrls: ['./propose-pricing.scss'],
})
export class ProposePricingLoanFacilityDetailComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @Output() spreadPerFacility = new EventEmitter();
  private _creditProposal: ICreditProposal;
  public aplicationProducts: IApplicationProduct[];
  public collateralProductRelation: ICollateralProductRelation[];
  public aplicationProductsCustom: any[];
  public initialState = false;
  public stateOfAction: string;
  public dataEdit: any;
  public detailStats = false;
  public status = false;
  public discountProposal = [];
  public reverenceRate = [];
  public numericFormatOptions: Object;
  private resourceUrl: string;
  private BUCKET: string;
  public ReferenceRateFunct: any;

  public collaterallInfo: any;
  public aplicationProduct = [];
  public displayColumns: string[] = [
    'no',
    'facilityType',
    'tenor',
    'sublimit',
    'ccy',
    'plafond',
    'o/s',
    'availableLimit',
    'currentInterestRate',
    'ftp',
    'ckpn',
    'expectedLoss',
    'industrySpread',
    'targetMargin',
    'normalRate',
    'discountProposal',
    'proposedRate',
    'typeReferenceRate',
    'referenceRate',
    'requiredSpread',
    'maturityDate',
    'action',
  ];

  constructor(
    public dialog: MatDialog,
    public _router: Router,
    private http: HttpClient,
    private storageService: StorageService,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
    this.aplicationProducts = item.products;

    for (let i = 0; i < this.aplicationProducts.length; i++) {
      console.log('test', this.creditProposal.products[i].attributes.discountProposal);
      this.aplicationProducts[i].attributes.ftp = '0%';
      this.aplicationProducts[i].attributes.ckpn = '0%';
      this.aplicationProducts[i].attributes.industrySpread = '0%';
      this.aplicationProducts[i].attributes.targetMargin = '0%';
      this.aplicationProducts[i].attributes.normalRate = '0%';
      this.aplicationProducts[i].attributes.discountProposal = item.products[i].attributes['discountProposal'];
      this.aplicationProducts[i].attributes.proposedRate = '0%';
      this.aplicationProducts[i].attributes.referenceRate = '0%';
      this.aplicationProducts[i].attributes.requiredSpread = '0%';
      this.aplicationProducts[i].attributes.cost = '0%';
      this.aplicationProducts[i].attributes.roaa = '0%';
      this.aplicationProducts[i].attributes.subLimit = item.products[i].attributes['subLimit'];
      this.aplicationProducts[i].attributes.typeReferenceRateFun =
        item.products[i].attributes['interestRateType'] +
        ' ' +
        item.products[i].attributes['interestRatePeriod'] +
        ' ' +
        item.products[i].attributes['interestRatePeriodType'];
    }
  }
  public dataBound(args: any) {
    // this.grid.autoFitColumns(["Name"]); // autoFit particular column
    this.grid.autoFitColumns(); // autofit all the columns
    // this.grid.width = (this.grid.getContentTable() as any).offsetWidth;
  }
  ngOnInit(): void {
    this.dataEdit = {
      no: 0,
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
      typeReferenceRate: '',
    };

    for (let i = 0; i < this.creditProposal.products.length; i++) {
      this.reverenceRate[i] = this.creditProposal.products[i].attributes.typeReferenceRate;
      this.discountProposal[i] = this.creditProposal.products[i].attributes.discountProposal;
      this.creditProposal.products[i].attributes.No = 0 + Number(i);
    }

    this.numericFormatOptions = { format: 'N' };

    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');

    this.getBucketNameSummary().then(res => {
      this.BUCKET = res['body']['bucket'];
    });
    this.getName();
    this.printElement();
    console.log('data', this.aplicationProducts);

    // this.grid.autoFitColumns();
  }

  private getBucketNameSummary(): Promise<Object> {
    return new Promise<Object>((resolve, reject) => {
      this.http.get<Object>(this.resourceUrl + '/bucket', { observe: 'response' }).subscribe(response => {
        resolve(response);
      });
    });
  }

  // public onEdit(element: ProposePricingLoanFacilityDetailDialogComponent = null): void {
  //   const predicate = {
  //     width: '80vw',
  //     data: { object: this.creditProposal },
  //   };
  // }

  // public save(): void {
  //   this.aplicationProduct = this.aplicationProducts;
  // }

  // onEdit(status: any, data: any) {
  //   this.initialState = true;
  //   this.stateOfAction = status;
  //   this.ejDialog.show();
  //   this.dataEdit = data.attributes;
  // }
  public onEdit(element: IApplicationProduct = null): void {
    const predicate = { width: '80vw', data: { object: this.creditProposal } };
    if (element) {
      predicate.data['proposePricing'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['proposePricing'] = new PurposePricing();
      predicate.data['view'] = false;
    }
    const dialogRef = this.dialog.open(ProposePricingLoanFacilityDetailDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res.action !== 'cancel') {
        this.creditProposal.attributes['proposePricing'] = [...this.creditProposal.attributes['proposePricing'], res.tradeCheckingSupplier];
        this.creditProposal.attributes['proposePricing'] = [...this.creditProposal.attributes['proposePricing'], res.tradeCheckingSupplier];
      }
    });
  }

  public onOverlayClick(): void {
    this.stateOfAction = '';
    this.initialState = false;
    this.ejDialog.hide();
  }

  keyFunc(event: any, id: number) {
    for (let i = 0; i < this.creditProposal.products.length; i++) {
      if (this.creditProposal.products[i].attributes.No === Number(id)) {
        this.creditProposal.products[i].attributes.typeReferenceRate = event.value;
        this.creditProposal.products[i].attributes.discountProposal = this.discountProposal[i];
      }
    }
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
    refrenceRate: ['Jibor', 'Term SOFR', 'BSBY'],
  };

  onGetApplicationProduct(value: any) {}

  public generate(): void {
    this.http.get('/services/report/api/report/propose_pricing/xls/' + this.creditProposal.id).subscribe(res => {
      for (let i = 0; i < this.aplicationProducts.length; i++) {
        this.aplicationProducts[i].attributes['ftp'] = res['proposePricing'][i]['ftp'];
        this.aplicationProducts[i].attributes['ckpn'] = res['proposePricing'][i]['ckpn'];
        this.aplicationProducts[i].attributes['expectedLoss'] = res['proposePricing'][i]['expectedLoss'];
        this.aplicationProducts[i].attributes['industrySpread'] = res['proposePricing'][i]['industrySpread'];
        this.aplicationProducts[i].attributes['targetMargin'] = res['proposePricing'][i]['targetMargin'];
        this.aplicationProducts[i].attributes['normalRate'] = res['proposePricing'][i]['normalRate'];
        this.aplicationProducts[i].attributes['discountProposal'] = res['proposePricing'][i]['discountProposal'];
        this.aplicationProducts[i].attributes['proposedRate'] = res['proposePricing'][i]['proposedRate'];
        this.aplicationProducts[i].attributes['referenceRate'] = res['proposePricing'][i]['referenceRate'];
        this.aplicationProducts[i].attributes['requiredSpread'] = res['proposePricing'][i]['requiredSpread'];
        this.aplicationProducts[i].attributes['cost'] = res['proposePricing'][i]['cost'];
        this.aplicationProducts[i].attributes['roaa'] = res['proposePricing'][i]['roaa'];
      }
      this.grid.refresh();
      // this.grid.autoFitColumns();
      this.spreadPerFacility.emit(this.aplicationProducts);
    });
  }

  public downloadExcel(): void {
    const predicate: Object = {
      key: `/credit_proposal/propose_pricing/` + this.creditProposal.id,
    };
    this.storageService.getObjects(this.BUCKET, predicate).subscribe(res => {
      this.storageService.fileBlob(res.body[0]['url']).subscribe(res0 => {
        saveAs(res0.body!, 'Propose-Pricing.xls');
      });
    });
  }

  public typeReferenceRateFuncttion = [];
  public getName() {
    for (let i = 0; i < this.creditProposal.products.length; i++) {
      this.ReferenceRateFunct =
        this.creditProposal.products[i].attributes['interestRateType'] +
        ' ' +
        this.creditProposal.products[i].attributes['interestRatePeriod'] +
        ' ' +
        this.creditProposal.products[i].attributes['interestRatePeriodType'];
      this.typeReferenceRateFuncttion.push(this.ReferenceRateFunct);
    }
  }

  public printElement() {
    for (let i = 0; i < this.creditProposal.products.length; i++) {
      if (this.aplicationProducts[i].attributes['subLimit'] === 'true') {
        // this.subLimit.push('Yes');
        this.aplicationProducts[i].attributes['subLimitFun'] = 'Yes';
      } else if (this.aplicationProducts[i].attributes['subLimit'] === 'false') {
        this.aplicationProducts[i].attributes['subLimitFun'] = 'No';
      }
    }
  }
}
