import { Component, Input, OnChanges, OnDestroy, OnInit, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { Observable, Subject, takeUntil } from 'rxjs';

import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { MemoBandingCollateralService } from '../memo-banding-collateral.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

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
            <!-- {{ countLV(element) | currency: 'IDR ':'symbol':'1.0-0' }} -->
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <!-- <p>{{ countTotalLVBefore() | currency: 'IDR ':'symbol':'1.0-0' }}</p> -->
            <!-- <p>{{ presentage(countTotalLVBefore() / totalPlafond, 'lv') }}</p> -->
          </td>
        </ng-container>
        <ng-container matColumnDef="mValueKjjp">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right" style="padding: 0px 50px">MV (KJJP)</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            <!-- {{ countKJJPMV(element) | currency: 'IDR ':'symbol':'1.0-0' }} -->
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <!-- <p>{{ countTotalMVKJJPBefore() | currency: 'IDR ':'symbol':'1.0-0' }}</p>
            <p>{{ presentage((countTotalMVKJJPBefore() / totalPlafond) * 100, 'mvKjjp') }}</p> -->
          </td>
        </ng-container>
        <ng-container matColumnDef="lValueKjjp">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right" style="padding: 0px 50px">LV (KJJP)</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            <!-- {{ countKJJPLV(element) | currency: 'IDR ':'symbol':'1.0-0' }} -->
          </td>

          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <!-- <p>{{ countTotalLVKJJPBefore() | currency: 'IDR ':'symbol':'1.0-0' }}</p>
            <p>{{ presentage(countTotalLVKJJPBefore() / totalPlafond, 'lvKjjp') }}</p> -->
          </td>
        </ng-container>
        <ng-container matColumnDef="marketability">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Marketability</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">
            <!-- {{ getMarketability(element) }} -->
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
            <!-- {{ findCertyficate(element) + ' ' + getOwnerShip(element) }} -->
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="certificateDueDate">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right">Certificate Due Date</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            <!-- {{ getExpiry(element) | date: 'yyyy/MM/dd' }} -->
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right"></td>
        </ng-container>
        <ng-container matColumnDef="insuredtype">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Insurance Type</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">
            <!-- {{ getInsuranceType(getInsurance(element).insuranceType) }} -->
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>
        <ng-container matColumnDef="insuredAmount">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right">Insured Amount</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            <!-- {{ getInsurance(element).insuranceAmount | currency: 'IDR ':'symbol':'1.0-0' }} -->
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right"></td>
        </ng-container>
        <ng-container matColumnDef="bindingType">
          <th mat-header-cell *matHeaderCellDef class="grid-index-left">Binding Type</th>
          <td mat-cell *matCellDef="let element" class="grid-index-left">
            <!-- {{ getBindingType(element.collBindingType) }} -->
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-left"></td>
        </ng-container>

        <ng-container matColumnDef="bindingValue">
          <th mat-header-cell *matHeaderCellDef class="grid-index-right">Binding Value</th>
          <td mat-cell *matCellDef="let element" class="grid-index-right">
            <!-- {{ 'IDR ' + (getBinding(element).bindingValueEqIdr | number) }} -->
          </td>
          <td mat-footer-cell *matFooterCellDef class="grid-index-right">
            <!-- <p>{{ biddingValueSum | currency: 'IDR ':'symbol':'1.0-0' }}</p>
            <p>{{ biddingValueCoverage }} x</p> -->
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
            <!-- {{ getCrossStatus(element.paripasuStatus) }} -->
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
  constructor(private memoBandingCollateralService: MemoBandingCollateralService) {
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

  get totalPlafond(): number {
    return this.previousOfferingLetterAttribute.facilityDetail.totalPlafond;
  }

  ngOnInit() {
    this.previousOfferingLetterAttribute = parsePreviousAtrribute(this.creditProposal).previousOfferingLetter;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.creditProposal && changes.creditProposal.currentValue) {
      this.creditProposal = changes.creditProposal.currentValue;
      this.memoBandingCollateralService.getParsedCollateral(this.creditProposal);
      this.previousOfferingLetterAttribute = parsePreviousAtrribute(this.creditProposal).previousOfferingLetter;
      console.log('previousOfferingLetterAttribute', this.previousOfferingLetterAttribute);
    }
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
