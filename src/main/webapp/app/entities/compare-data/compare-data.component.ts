import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CompareDataService } from './services/compare-data.service';
import { Subject } from 'rxjs';
import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-compare-data',
  templateUrl: './compare-data.component.html',
  styleUrls: ['../credit-agreement/credit-agreement.css'],
})
export class CompareDataComponent implements OnChanges, OnDestroy {
  // Tab Menu Compare Data
  public selectedMenu = 'DAR REVISION FINAL';
  public menuItemsAll: MenuItemModel[] = [{ text: 'DAR REVISION FINAL' }, { text: 'PREVIOUS DAR' }];
  public setMenu(value: any): void {
    this.selectedMenu = value.item.properties.text;
  }

  constructor(private compareDataService: CompareDataService) { }

  @Input() collateralPropertyGroupData!: ICollateralProperty[];
  @Input() collateralProperties!: ICollateralProperty[];
  @Input() creditProposal!: ICreditProposal;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.collateralPropertyGroupData) {
      this.collateralPropertyGroupData = changes.collateralPropertyGroupData.currentValue;
      this.compareDataService.setCollateralPropertyGroupData(this.collateralPropertyGroupData);
    }
    if (changes.collateralProperties) {
      this.collateralProperties = changes.collateralProperties.currentValue;
      this.compareDataService.setCollateralProperties(this.collateralProperties);
    }
    if (changes.creditProposal) {
      this.creditProposal = changes.creditProposal.currentValue;
      this.compareDataService.setCreditProposal(this.creditProposal);
    }
  }

  #destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy() {
    this.#destroy$.next(true);
    this.#destroy$.unsubscribe();
  }
}

@Component({
  selector: 'jhi-compare-data-not-found',
  template: `
    <div class="e-card">
      <div class="e-card-header">
        <div class="e-card-header-caption">
          <div class="e-card-header-title">{{ headerTitle }}</div>
        </div>
      </div>
      <div class="alert alert-warning m-3" role="alert">
        <span style="font-weight: bold">No previous data was found!</span>
      </div>
    </div>
  `,
  styleUrls: ['../credit-agreement/credit-agreement.css'],
})
export class CompareDataNotFoundComponent {
  @Input() headerTitle: string;
}
