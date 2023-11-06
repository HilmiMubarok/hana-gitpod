import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { Subject, takeUntil } from 'rxjs';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-dar-covenant-back-to-back-deposit',
  templateUrl: './covenant-backtoback-deposit.component.html',
  styleUrls: ['./covenant-backtoback.css'],
})
export class DarCovenantBackToBackDepositComponent implements OnInit, OnDestroy {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  // public standardDataGridBackToBackDeposit: any = dataCovenantBackToBackDeposit;
  public standardDataGridBackToBackDeposit: any = [];

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() isViewMode: Boolean = false;

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

  ngOnInit(): void {
    this.loadCovenantBtbDeposit();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getBackToBackDeposit() {
    const parsed = parsePreviousAtrribute(this.creditProposalItem);
    const darRevHistory = parsed['darRevHistory']?.convenant?.standardDataGridBackToBackDeposit || [];
    const convenant = this.creditProposalItem.attributes['convenant']?.standardDataGridBackToBackDeposit || [];

    const data = darRevHistory.length !== 0 ? darRevHistory : convenant;

    data.forEach((item, i) => {
      this.statusValue[i] = item.status;
      this.deviation[i] = item.deviation;
      this.justification[i] = item.justification;
    });

    if (data.length === 0) {
      this.statusValue = Array(this.standardDataGridBackToBackDeposit.length).fill('Applied');
      this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = this.standardDataGridBackToBackDeposit;
    }
  }

  public loadCovenantBtbDeposit() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BTB_TERMS_CONDITION',
        page: 0,
        size: 9999,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        const activeData = res.body.filter(o => o.statusId === 'ACTIVE');
        const gridBelow = activeData.map((data, i) => ({
          id: i,
          covenant: data.value,
          status: 'Applied',
          deviation: '',
          justification: '',
        }));

        this.getBackToBackDeposit();
        this.standardDataGridBackToBackDeposit = gridBelow;

        const parsed = parsePreviousAtrribute(this.creditProposalItem);
        const parsedConvenant = parsed['darRevHistory']?.convenant?.standardDataGridBackToBackDeposit;

        if (parsedConvenant) {
          this.standardDataGridBackToBackDeposit = parsedConvenant;
        } else {
          const creditProposalConvenant = this.creditProposalItem.attributes['convenant']?.standardDataGridBackToBackDeposit;
          if (creditProposalConvenant && creditProposalConvenant.length === 0) {
            this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = this.standardDataGridBackToBackDeposit;
          } else if (creditProposalConvenant) {
            this.standardDataGridBackToBackDeposit = creditProposalConvenant;
          }
        }
      });
  }
}
