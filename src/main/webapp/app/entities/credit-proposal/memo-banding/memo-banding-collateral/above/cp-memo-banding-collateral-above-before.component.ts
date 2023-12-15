import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { Observable, Subject, map, takeUntil } from 'rxjs';

import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { MemoBandingCollateralService } from '../memo-banding-collateral.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import {
  CreditProposalCollateralBinding,
  CreditProposalCollateralInsurance,
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
} from 'app/entities/credit-proposal/collateral-info/credit-proposal-collateral-info.model';

@Component({
  selector: 'jhi-memo-banding-collateral-above-before',
  styleUrls: ['../../../collateral-info/collateral-info-cp.style.scss'],
  template: `
    <div class="table-responsive-material">
      <table mat-table [dataSource]="collaterals$ | async" class="w-100">
        <ng-container matColumnDef="no">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right rounding-table-left">No</th>
          <td mat-cell *matCellDef="let i = index" class="grid-index-right">{{ i + 1 }}</td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <p>Total</p>
            <p>Collateral Coverage</p>
          </td>
        </ng-container>
        <ng-container matColumnDef="collateralType">
          <th mat-header-cell *matHeaderCellDef class="rounding-table-">Collateral Type</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">{{ element.collateralTypeDescription }}</td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="collateralAddress">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Address</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">{{ element.collateralAddress.address1 }}</td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="mvInternalOriginal">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right" style="padding: 0px 50px">MV (internal) (In Currency)</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            {{ element | getCurrency: collateralProperties }} {{ element | countMVOriginal: collateralProperties | number }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right"></td>
        </ng-container>
        <ng-container matColumnDef="marketValue">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right" style="padding: 0px 50px">MV (internal) (Equivalen to IDR)</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            {{ element | countMV: collateralProperties | currency: 'IDR ':'symbol':'1.0-0' }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <p>{{ countTotalMVBefore | currency: 'IDR ':'symbol':'1.0-0' }}</p>
            <p>{{ countTotalMVBefore / totalPlafond | customPercentage: 'mv':previousOfferingLetterAttribute }}</p>
          </td>
        </ng-container>
        <ng-container matColumnDef="liquidValue">
          <th mat-header-cell *matHeaderCellDef style="padding: 0px 50px" class="grid-index-right">LV (internal) (Equivalen to IDR)</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            {{ element | countLV: collateralProperties | currency: 'IDR ':'symbol':'1.0-0' }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <p>{{ countTotalLVBefore | currency: 'IDR ':'symbol':'1.0-0' }}</p>
            <p>{{ countTotalLVBefore / totalPlafond | customPercentage: 'lv':previousOfferingLetterAttribute }}</p>
          </td>
        </ng-container>
        <ng-container matColumnDef="mValueKjjp">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right" style="padding: 0px 50px">MV (KJJP)</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            {{ element | countKjjpMv: collateralProperties | currency: 'IDR ':'symbol':'1.0-0' }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <p>{{ ountTotalMVKJJPBefore | currency: 'IDR ':'symbol':'1.0-0' }}</p>
            <p>{{ (countTotalMVKJJPBefore / totalPlafond) * 100 | customPercentage: 'mvKjjp':previousOfferingLetterAttribute }}</p>
          </td>
        </ng-container>
        <ng-container matColumnDef="lValueKjjp">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right" style="padding: 0px 50px">LV (KJJP)</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            {{ element | countKjjpLv: collateralProperties | currency: 'IDR ':'symbol':'1.0-0' }}
          </td>

          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <p>{{ countTotalLVKJJPBefore | currency: 'IDR ':'symbol':'1.0-0' }}</p>
            <p>{{ countTotalLVKJJPBefore / totalPlafond | customPercentage: 'lvKjjp':previousOfferingLetterAttribute }}</p>
          </td>
        </ng-container>
        <ng-container matColumnDef="marketability">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Marketability</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">
            {{ element | getMarketability: collateralProperties }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="occupancy">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Occupancy</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">{{ element.occupancy }}</td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="ownership">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Ownership</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">
            {{ findCertificate(element) }} {{ element | getOwnership: collateralProperties }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="certificateDueDate">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right">Certificate Due Date</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            {{ element | getExpiry: collateralProperties | date: 'yyyy/MM/dd' }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right"></td>
        </ng-container>
        <ng-container matColumnDef="insuredtype">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Insurance Type</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">
            {{ getInsuranceType(_getInsurance(element).insuranceType) }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="insuredAmount">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right">Insured Amount</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            {{ _getInsurance(element).insuranceAmount | currency: 'IDR ':'symbol':'1.0-0' }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right"></td>
        </ng-container>
        <ng-container matColumnDef="bindingType">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Binding Type</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">
            {{ element.collBindingType | getBindingType: bindingTypesHobies }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>

        <ng-container matColumnDef="bindingValue">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right">Binding Value</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            {{ 'IDR ' + (_getBinding(element).bindingValueEqIdr | number) }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <p>{{ biddingValueSum | currency: 'IDR ':'symbol':'1.0-0' }}</p>
            <p>{{ biddingValueCoverage }} x</p>
          </td>
        </ng-container>
        <ng-container matColumnDef="collateralStatus">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Collateral Status</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">{{ element.statusId }}</td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="crossCollateral">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Cross Collateral</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">
            {{ getCrossStatus(element.paripasuStatus) }}
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="action">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left rounding-table-right"></th>
          <td mat-cell *matCellDef="let element" class="grid-index-left"></td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">No records found.</td>
        </tr>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        <tr mat-footer-row *matFooterRowDef="displayedColumns"></tr>
      </table>
    </div>
  `,
})
export class MemoBandingCollateralAboveBeforeComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    private memoBandingCollateralService: MemoBandingCollateralService,
    private partyCifService: PartyCifService,
    private generalParameterService: GeneralParameterService
  ) {
    this.memoBandingCollateralService.collateralProperties
      .pipe(takeUntil(this.destroy$))
      .subscribe((collateralProperties: ICollateralProperty[]) => {
        this.collateralProperties = collateralProperties;
      });
  }

  // !THIS IS COLLATERALS FROM PREVIOUSOFFERINGLETTER ATTRIBUTE
  public collaterals$: Observable<ICollateral[]> = this.memoBandingCollateralService.collaterals;

  public collateralProperties: ICollateralProperty[] = [];
  public previousOfferingLetterAttribute: any;
  public certificateType: any;
  public dataCertyficate: any;
  public bindingTypesHobies = [];
  public insuranceTypes = [];
  public biddingValueSum;
  public biddingValueCoverage;
  public displayedColumns: string[] = [
    'no',
    'collateralType',
    'collateralAddress',
    'mvInternalOriginal',
    'marketValue',
    'liquidValue',
    'mValueKjjp',
    'lValueKjjp',
    'marketability',
    'occupancy',
    'ownership',
    'certificateDueDate',
    'insuredtype',
    'insuredAmount',
    'bindingType',
    'bindingValue',
    'collateralStatus',
    'crossCollateral',
    'action',
  ];

  @Input() creditProposal: ICreditProposal;

  get countTotalMVBefore(): number {
    return this.previousOfferingLetterAttribute.collateralSummary.countTotalMV;
  }

  get countTotalLVBefore(): number {
    return this.previousOfferingLetterAttribute.collateralSummary.countTotalLV;
  }

  get countTotalMVKJJPBefore(): number {
    return this.previousOfferingLetterAttribute.coverageTotal.countTotalMVKJJP;
  }

  get countTotalLVKJJPBefore(): number {
    return this.previousOfferingLetterAttribute.coverageTotal.countTotalLVKJJP;
  }

  get totalPlafond(): number {
    return this.previousOfferingLetterAttribute.facilityDetail.totalPlafond;
  }

  private _getCertificateType() {
    this.partyCifService
      .getCertificate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.certificateType = res.body;
      });
  }

  private _getLovBindingType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_BINDING_TYPE',
        page: 0,
        size: 9999,
      })
      .pipe(
        takeUntil(this.destroy$),
        map(res => res.body.filter(o => o.statusId === 'ACTIVE'))
      )
      .subscribe(data => {
        this.bindingTypesHobies = data;
      });
  }

  private _getLovInsuranceTypes() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INSURANCE_TYPE',
        page: 0,
        size: 9999,
      })
      .pipe(
        takeUntil(this.destroy$),
        map(res => res.body.filter(o => o.statusId === 'ACTIVE'))
      )
      .subscribe(data => (this.insuranceTypes = data));
  }

  private _getBindingCalculate(res: any[]) {
    const array1 = res;
    const array2 = this.previousOfferingLetterAttribute.binding;
    const data = [];

    array1.forEach(({ id: value1, collateralTypeId: collateralTypeId }) => {
      const foundItem = array2.find(({ collateralId: value2 }) => value1 === value2 && collateralTypeId !== 'CORPORATEPERSONALGUARANTEE');
      if (foundItem !== undefined) {
        data.push(foundItem);
      }
    });

    this.biddingValueSum = data.reduce((a: any, b: any) => a + Number(b.bindingValueEqIdr), 0);
    this.biddingValueCoverage = this._convertNan(Number(this.biddingValueSum) / Number(this.totalPlafond));
  }

  private _convertNan(value: any): any {
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }
  }

  protected _getBinding(element: ICollateral): ICreditProposalCollateralBinding {
    if (this.previousOfferingLetterAttribute.binding.length > 0) {
      for (let i = 0; i < this.previousOfferingLetterAttribute.binding.length; i++) {
        const item: ICreditProposalCollateralBinding = this.previousOfferingLetterAttribute.binding[i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }
    return new CreditProposalCollateralBinding();
  }

  protected _getInsurance(element: ICollateral): ICreditProposalCollateralInsurance {
    if (this.previousOfferingLetterAttribute.insurance.length > 0) {
      for (let i = 0; i < this.previousOfferingLetterAttribute.insurance.length; i++) {
        const item: ICreditProposalCollateralInsurance = this.previousOfferingLetterAttribute.insurance[i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }
    return new CreditProposalCollateralInsurance();
  }

  public findCertificate(collateral: ICollateral): string {
    let data: ICollateralProperty;

    if (collateral) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.certificateType !== undefined) {
          if (this.certificateType) {
            this.dataCertyficate = this.certificateType.find(obj => obj.id === data.attributes.certificateType);
            if (this.dataCertyficate) {
              return this.dataCertyficate.label;
            }
            return '';
          }
        }
      }
    }
    return '';
  }

  public getCrossStatus(status: string) {
    if (status === 'N') {
      return 'NO';
    }
    if (status === 'Y') {
      return 'YES';
    }
    if (status === undefined) {
      return '';
    }
    return '';
  }
  public getInsuranceType(value) {
    if (this.insuranceTypes) {
      const data = this.insuranceTypes.find(obj => obj.code === value);
      if (data) {
        return data.value;
      }
    }
    return '';
  }

  ngOnInit() {
    this.previousOfferingLetterAttribute = parsePreviousAtrribute(this.creditProposal).previousOfferingLetter;
    this._getCertificateType();
    this._getLovBindingType();
    this._getBindingCalculate(this.memoBandingCollateralService.collaterals$.getValue());
    this._getLovInsuranceTypes();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.creditProposal && changes.creditProposal.currentValue) {
      this.creditProposal = changes.creditProposal.currentValue;
      this.memoBandingCollateralService.getParsedCollateral(this.creditProposal);
      this.previousOfferingLetterAttribute = parsePreviousAtrribute(this.creditProposal).previousOfferingLetter;
    }
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
