import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantAbove, statusCovenantNotRefreshedFromMaster } from '../convenant.constant';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { replaceConvenantFromMaster } from '../convenant.helper';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-above',
  templateUrl: './credit-proposal-covenant-above.component.html',
  styleUrls: ['../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalCovenantAboveComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  // public standardDataGridAbove: any = dataCovenantAbove;
  public standardDataGridAbove: any = [];

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(private generalParameterService: GeneralParameterService) {}

  ngOnInit(): void {
    this.loadCovenantAboveData();
  }

  public onKeyUpEvent(input: string, event: any, data: any): void {
    const targetIndex = Number(data.index);

    this.standardDataGridAbove.forEach((item, index) => {
      if (index === targetIndex) {
        this.updateGridItemByInput(item, input, event);
      } else {
        this.restoreGridItemFromCache(item, index);
      }
    });

    this.creditProposalItem.attributes['convenant'].standardDataGridAbove = lodash.clone(this.standardDataGridAbove);
  }

  private updateGridItemByInput(item: any, input: string, event: any): void {
    switch (input) {
      case 'status':
        item.status = event.value;
        break;
      case 'deviation':
        item.deviation = event.target.value;
        break;
      case 'justification':
        item.justification = event.target.value;
        break;
    }
  }

  private restoreGridItemFromCache(item: any, index: number): void {
    item.status = this.statusValue[index];
    item.deviation = this.deviation[index];
    item.justification = this.justification[index];
  }

  private cacheStandardDataGridValues(): void {
    const savedGridData = this.creditProposalItem.attributes['convenant'].standardDataGridAbove;

    if (savedGridData.length !== 0) {
      savedGridData.forEach((item, index) => {
        this.statusValue[index] = item.status;
        this.deviation[index] = item.deviation;
        this.justification[index] = item.justification;
      });
    } else {
      this.standardDataGridAbove.forEach((_, index) => {
        this.statusValue[index] = 'Applied';
      });
      this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
    }
  }

  private loadCovenantAboveData(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_ABOVE_STANDARD',
        page: 0,
        size: 9999,
        sort: ['id,asc'],
      })
      .subscribe(res => {
        const activeData = this.filterActiveCovenants(res.body);
        const dataLength =  !statusCovenantNotRefreshedFromMaster.includes(this.creditProposalItem.statusId) ? activeData.length : this.creditProposalItem.attributes['convenant'].standardDataGridAbove;
        this.standardDataGridAbove = this.mapToGridAbove(dataLength);

        this.refreshCovenantFromMasterIfNeeded();
        this.cacheStandardDataGridValues();
        this.syncGridDataWithProposal();
      });
  }

  private filterActiveCovenants(data: any[]): any[] {
    return lodash.filter(data, covenant => covenant.statusId === 'ACTIVE');
  }

  private mapToGridAbove(data: any[]): any[] {
    return data.map((item, index) => ({
      id: index,
      covenant: item.value,
      status: 'Applied',
      deviation: '',
      justification: ''
    }));
  }

  private refreshCovenantFromMasterIfNeeded(): void {
    if (!statusCovenantNotRefreshedFromMaster.includes(this.creditProposalItem.statusId)) {
      this.creditProposalItem.attributes['convenant'].standardDataGridAbove = replaceConvenantFromMaster(
        this.standardDataGridAbove,
        this.creditProposalItem.attributes['convenant'].standardDataGridAbove
      );
    }
  }

  private syncGridDataWithProposal(): void {
    const savedGridData = this.creditProposalItem.attributes['convenant'].standardDataGridAbove;

    if (savedGridData.length === 0) {
      this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
    } else {
      this.standardDataGridAbove = savedGridData.map(item => ({
        id: item.id,
        covenant: item.covenant,
        status: item.status,
        deviation: item.deviation,
        justification: item.justification
      }));
      this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
    }
  }

  public addBRBeforeDash(text: string): string {
    if (!text) {
      return text;
    }
    return text.replace(/\n/g, '<br/>');
  }
}
