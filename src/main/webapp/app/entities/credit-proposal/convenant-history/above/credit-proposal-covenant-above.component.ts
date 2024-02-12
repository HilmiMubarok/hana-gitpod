import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { Subject, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-above-history',
  templateUrl: './credit-proposal-covenant-above.component.html',
  styleUrls: ['../back-to-back/covenant-backtoback.css'],
})
export class CreditProposalCovenantAboveHistoryComponent implements OnInit, OnDestroy {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGridAbove: any = [];

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  @Input() isViewMode: Boolean = false;

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  @Input() isOnCreditAgreement: Boolean = false;
  @Input() creditAgreement: string;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  constructor(private generalParameterService: GeneralParameterService) {
    this.loadCovenantAbove();
  }

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardDataGridAbove.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridAbove[i].status = input === 'status' ? event.value : this.standardDataGridAbove[i].status;
        this.standardDataGridAbove[i].deviation = input === 'deviation' ? event.target.value : this.standardDataGridAbove[i].deviation;
        this.standardDataGridAbove[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridAbove[i].justification;
      } else {
        this.standardDataGridAbove[i].status = this.statusValue[i];
        this.standardDataGridAbove[i].deviation = this.deviation[i];
        this.standardDataGridAbove[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridAbove = lodash.clone(this.standardDataGridAbove);
  }

  public parsedAttr: any;

  public historyData() {
    const { isOnCompareData, isCompareDar, isOnCreditAgreement, creditAgreement } = this;
    const { previousReturn, previousHistory, darRevHistory } = parsePreviousAtrribute(this.creditProposalItem);

    if (isOnCompareData) {
      if (isCompareDar) {
        return this.creditProposalItem.attributes;
      } else {
        return previousReturn;
      }
    } else {
      if (isOnCreditAgreement) {
        if (creditAgreement === 'FINAL CP') {
          return previousHistory;
        } else if (creditAgreement === 'PREVIOUS DAR') {
          return darRevHistory;
        } else if (creditAgreement === 'DAR REVISION') {
          return this.creditProposalItem.attributes;
        }
      }
      return previousHistory;
    }
  }

  ngOnInit(): void {
    this.parsedAttr = parsePreviousAtrribute(this.creditProposalItem);
    this.loadCovenantAbove();
  }

  public historyAbove() {
    console.log({ historyData: this.historyData(), parsed: parsePreviousAtrribute(this.creditProposalItem) });
    if (this.historyData().convenant.standardDataGridAbove.length !== 0) {
      for (let i = 0; i < this.historyData().convenant.standardDataGridAbove.length; i++) {
        this.statusValue[i] = this.historyData().convenant.standardDataGridAbove[i].status;
        this.deviation[i] = this.historyData().convenant.standardDataGridAbove[i].deviation;
        this.justification[i] = this.historyData().convenant.standardDataGridAbove[i].justification;
      }
    }
  }

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public loadCovenantAbove() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_ABOVE_STANDARD',
        page: 0,
        size: 9999,
      })
      .pipe(
        takeUntil(this.destroy$),
        map(res => {
          const activeData = res.body.filter(o => o.statusId === 'ACTIVE');
          const gridAbove = activeData.map((data, i) => ({
            id: i,
            covenant: data.value,
            status: 'Applied',
            deviation: '',
            justification: '',
          }));

          this.historyAbove();
          this.standardDataGridAbove = gridAbove;

          return parsePreviousAtrribute(this.creditProposalItem);
        }),
        tap(parsed => {
          const data = {
            finalCP: parsed['previousHistory']?.convenant?.standardDataGridAbove,
            previousDar: parsed['darRevHistory']?.convenant?.standardDataGridAbove,
            darRevision: this.standardDataGridAbove,
          };

          if (this.isOnCreditAgreement) {
            if (this.creditAgreement === 'FINAL CP') {
              this.standardDataGridAbove = data.finalCP;
            }
            if (this.creditAgreement === 'PREVIOUS DAR') {
              this.standardDataGridAbove = data.previousDar;
            }
            if (this.creditAgreement === 'DAR REVISION') {
              this.standardDataGridAbove = data.darRevision;
            }
          } else {
            const creditProposalConvenant = this.creditProposalItem.attributes['convenant']?.standardDataGridAbove;
            if (creditProposalConvenant && creditProposalConvenant.length === 0) {
              this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
            } else if (creditProposalConvenant) {
              this.standardDataGridAbove = creditProposalConvenant;
            }
          }
        })
      )
      .subscribe();
  }

  addBRBeforeDash(text: string): string {
    if (text === '' || text === undefined || text === null) {
      return text;
    } else {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
    }
  }
}
