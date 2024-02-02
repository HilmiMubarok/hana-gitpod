import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { Subject, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-back-to-back-deposit-history',
  templateUrl: './covenant-backtoback-deposit.component.html',
  styleUrls: ['./covenant-backtoback.css'],
})
export class CovenantBackToBackDepositHistoryComponent implements OnInit, OnDestroy {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGridBackToBackDeposit: any = [];

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

  constructor(private generalParameterService: GeneralParameterService) {}

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardDataGridBackToBackDeposit.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridBackToBackDeposit[i].status =
          input === 'status' ? event.value : this.standardDataGridBackToBackDeposit[i].status;
        this.standardDataGridBackToBackDeposit[i].deviation =
          input === 'deviation' ? event.target.value : this.standardDataGridBackToBackDeposit[i].deviation;
        this.standardDataGridBackToBackDeposit[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridBackToBackDeposit[i].justification;
      } else {
        this.standardDataGridBackToBackDeposit[i].status = this.statusValue[i];
        this.standardDataGridBackToBackDeposit[i].deviation = this.deviation[i];
        this.standardDataGridBackToBackDeposit[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = lodash.clone(
      this.standardDataGridBackToBackDeposit
    );
  }

  public parseAttr: any;
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
    this.loadCovenantBtbDeposit();
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  historyBtbDeposit() {
    if (this.historyData().convenant.standardDataGridBackToBackDeposit.length !== 0) {
      for (let i = 0; i < this.historyData().convenant.standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = this.historyData().convenant.standardDataGridBackToBackDeposit[i].status;
        this.deviation[i] = this.historyData().convenant.standardDataGridBackToBackDeposit[i].deviation;
        this.justification[i] = this.historyData().convenant.standardDataGridBackToBackDeposit[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGridBackToBackDeposit.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }
  }

  public loadCovenantBtbDeposit() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BTB_TERMS_CONDITION',
        page: 0,
        size: 9999,
      })
      .pipe(
        takeUntil(this.destroy$),
        map(res => {
          const activeData = res.body.filter(o => o.statusId === 'ACTIVE');
          const gridBelow = activeData.map((data, i) => ({
            id: i,
            covenant: data.value,
            status: 'Applied',
            deviation: '',
            justification: '',
          }));

          this.historyBtbDeposit();
          this.standardDataGridBackToBackDeposit = gridBelow;

          return parsePreviousAtrribute(this.creditProposalItem);
        }),
        tap(parsed => {
          const data = {
            finalCP: parsed['previousHistory']?.convenant?.standardDataGridBackToBackDeposit,
            previousDar: parsed['darRevHistory']?.convenant?.standardDataGridBackToBackDeposit,
            darRevision: this.standardDataGridBackToBackDeposit,
          };

          if (this.isOnCreditAgreement) {
            if (this.creditAgreement === 'FINAL CP') {
              this.standardDataGridBackToBackDeposit = data.finalCP;
            }
            if (this.creditAgreement === 'PREVIOUS DAR') {
              this.standardDataGridBackToBackDeposit = data.previousDar;
            }
            if (this.creditAgreement === 'DAR REVISION') {
              this.standardDataGridBackToBackDeposit = data.darRevision;
            }
          } else {
            const creditProposalConvenant = this.creditProposalItem.attributes['convenant']?.standardDataGridBackToBackDeposit;
            if (creditProposalConvenant && creditProposalConvenant.length === 0) {
              this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = this.standardDataGridBackToBackDeposit;
            } else if (creditProposalConvenant) {
              this.standardDataGridBackToBackDeposit = creditProposalConvenant;
            }
          }
        })
      )
      .subscribe();
  }

  addBRBeforeDash(text: string): string {
    if (text === '') {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
    } else {
      return text;
    }
  }
}
