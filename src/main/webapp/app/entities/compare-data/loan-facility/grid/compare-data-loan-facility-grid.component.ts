import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CompareDataService } from '../../services/compare-data.service';
import { ICreditProposal } from '../../../credit-proposal/credit-proposal.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProduct,
  IApplicationProductAttribute,
} from '../../../application-product/application-product.model';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CompareDataLoanFacilityDialogComponent } from '../dialog/compare-data-loan-facility-dialog.component';

@Component({
  selector: 'jhi-compare-data-loan-facility-grid',
  templateUrl: './compare-data-loan-facility-grid.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/grid/loan.scss'],
})
export class CompareDataLoanFacilityGridComponent implements OnInit, OnChanges, OnDestroy {
  @Input() dataFrom!: string;

  public creditProposal!: ICreditProposal;
  public dataProduct: IApplicationProduct[];
  public applicationProduct: IApplicationProduct;
  public collaterallInfo: any;
  public displayColumns: string[] = [
    'no',
    'approvalNo',
    'facilityCategory',
    'applicationType',
    'facilityType',
    'subLimit',
    'currency',
    'initialLimit',
    'outstanding',
    'changes',
    'totalCreditLimit',
    'interestrate',
    'proposeRate',
    'provisionAmount',
    'tenor',
    'maturityDate',
    'firstDisbursementDate',
    'action',
  ];

  constructor(private compareDataService: CompareDataService, public dialog: MatDialog) {
    this.compareDataService.creditProposal.pipe(takeUntil(this.#destroy)).subscribe((data: ICreditProposal): void => {
      this.creditProposal = data;
      this.dataProduct = this.creditProposal.products;
      console.log('creditProposal grid', this.creditProposal);
    });
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();
  }

  ngOnInit(): void {
    console.error('creditProposal grid', this.creditProposal);
    this.getHistoryAttributes();
    this.dataProduct = this.cpDynamicAttributeData.products;
    this.collaterallInfo = this.cpDynamicAttributeData.collaterals;
  }

  #destroy: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.#destroy.next(true);
    this.#destroy.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataFrom) {
      this.dataFrom = changes.dataFrom.currentValue;
    }
  }

  public cpDynamicAttributeData: any;
  getHistoryAttributes() {
    if (this.dataFrom === 'previousHistory') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.previousHistory;
    } else if (this.dataFrom === 'previousReturn') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.previousReturn;
    } else if (this.dataFrom === 'darRevHistory') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.darRevHistory;
    } else {
      this.cpDynamicAttributeData = this.creditProposal;
    }
  }

  public getFacilityType(element: IApplicationProduct) {
    if (element.productTypeId !== undefined && element.productTypeId !== null) {
      if (element.applicationType === 'Existing') {
        if (!element.attributes.facilityType) {
          element.attributes.facilityType = element.productTypeId;
        }
      }
      return element.productTypeId;
    } else if (element.attributes.facilityType) {
      element.productTypeId = element.attributes.facilityType;
      return element.attributes.facilityType;
    }
  }

  public printElements(element: any) {
    if (element === null || element === 'null') {
      return 0;
    }
    return element;
  }

  public printElement(element: any) {
    let sublimit: string;
    sublimit = '';
    if (element === true || element === 'true') {
      sublimit = 'Yes';
    } else if (element === false || element === 'false') {
      sublimit = 'No';
    }
    return sublimit;
  }

  public getCurrencyType(element: any) {
    if (element !== null) {
      return element;
    }
    return '';
  }

  public getdataNull(element: any) {
    if (element !== null) {
      return element;
    }
    return '';
  }

  public getPricingRate(value: any) {
    if (value) {
      return value + '%';
    } else {
      return '0%';
    }
  }

  public getCurrency(element: IApplicationProduct) {
    if (element.provisionFeeType === 'Amount IDR') {
      return 'IDR';
    }

    if (element.provisionFeeType === 'Amount USD') {
      return 'USD';
    }
    return '';
  }

  public getCurrency2(element: IApplicationProduct) {
    if (element.provisionFeeType === '%p.a') {
      return '%p.a';
    }
    return '';
  }

  public openDialog(param: IApplicationProduct = null): void {
    if (param) {
      this.applicationProduct = param;
    } else {
      this.applicationProduct = new ApplicationProduct();
      const attr: IApplicationProductAttribute = new ApplicationProductAttribute();
      const nomorUrutFasilitasUnsorted = [];
      if (this.creditProposal.products) {
        if (this.creditProposal.products.length > 0) {
          for (let i = 0; i < this.creditProposal.products.length; i++) {
            nomorUrutFasilitasUnsorted.push(this.creditProposal.products[i].nomorUrutFasilitas);
          }
          const nomorUrutFasilitasSorted = nomorUrutFasilitasUnsorted.sort((a, b) => (a > b ? 1 : -1));
          if (nomorUrutFasilitasSorted) {
            if (nomorUrutFasilitasSorted.length > 0) {
              this.applicationProduct.nomorUrutFasilitas = Number(nomorUrutFasilitasSorted[nomorUrutFasilitasSorted.length - 1]) + 1;
            }
          }
        } else if (this.creditProposal.products.length === 0) {
          this.applicationProduct.nomorUrutFasilitas = 1;
        }
      }
      this.applicationProduct.attributes = attr;
    }

    const dialogRef = this.dialog.open(CompareDataLoanFacilityDialogComponent, {
      width: '80vw',

      data: {
        item: this.creditProposal,
        creditProposaldata: this.creditProposal,
        applicationProduct: this.applicationProduct,
        collateralInfo: this.collaterallInfo,
      },
    });
    dialogRef.afterClosed().subscribe();
  }
}
