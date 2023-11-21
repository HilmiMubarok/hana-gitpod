import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CompareDataService } from './services/compare-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-compare-data',
  templateUrl: './compare-data.component.html',
  styleUrls: ['./compare-data.component.scss'],
})
export class CompareDataComponent implements OnChanges, OnInit, OnDestroy {
  constructor(private compareDataService: CompareDataService) {
    this.compareDataService.creditProposal.pipe(takeUntil(this.#destroy$)).subscribe(data => {
      console.log('creditProposal service', data);
    });
    this.compareDataService.collateralProperties.pipe(takeUntil(this.#destroy$)).subscribe(data => {
      console.log('collateralProperties service', data);
    });
    this.compareDataService.collateralPropertyGroupData.pipe(takeUntil(this.#destroy$)).subscribe(data => {
      console.log('collateralPropertyGroupData service', data);
    });
  }

  @Input() collateralPropertyGroupData!: ICollateralProperty[];
  @Input() collateralProperties!: ICollateralProperty[];
  @Input() creditProposal!: ICreditProposal;

  ngOnChanges(changes: SimpleChanges) {
    console.group('CompareDataComponent ngOnChanges');
    if (changes.collateralPropertyGroupData) {
      console.log('collateralPropertyGroupData changed', Math.random());
      this.collateralPropertyGroupData = changes.collateralPropertyGroupData.currentValue;
      this.compareDataService.setCollateralPropertyGroupData(this.collateralPropertyGroupData);
    }
    if (changes.collateralProperties) {
      console.log('collateralProperties changed', Math.random());
      this.collateralProperties = changes.collateralProperties.currentValue;
      this.compareDataService.setCollateralProperties(this.collateralProperties);
    }
    if (changes.creditProposal) {
      console.log('creditProposal changed', Math.random());
      this.creditProposal = changes.creditProposal.currentValue;
      this.compareDataService.setCreditProposal(this.creditProposal);
    }
    console.groupEnd();
  }

  ngOnInit() {
    console.log('OnInit', {
      collateralPropertyGroupData: this.collateralPropertyGroupData,
      collateralProperties: this.collateralProperties,
      creditProposal: this.creditProposal,
    });
  }

  #destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy() {
    this.#destroy$.next(true);
    this.#destroy$.unsubscribe();
    this.compareDataService.completeData();
  }
}
