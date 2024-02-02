import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { Subject, takeUntil } from 'rxjs';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Router } from '@angular/router';

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

  constructor(private generalParameterService: GeneralParameterService, private router: Router) {}

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
    if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
      const parsed = parsePreviousAtrribute(this.creditProposalItem);
      const darRevHistory = parsed['darRevHistory']?.convenant?.standardDataGridBackToBackDeposit;

      for (let i = 0; i < darRevHistory.length; i++) {
        this.statusValue[i] = darRevHistory[i].status;
        this.deviation[i] = darRevHistory[i].deviation;
        this.justification[i] = darRevHistory[i].justification;
      }
    } else {
      if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length !== 0) {
        for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length; i++) {
          this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].status;
          this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].deviation;
          this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardDataGridBackToBackDeposit.length; i++) {
          this.statusValue[i] = 'Applied';
          this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.status = this.statusValue[i];
        }
        this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = this.standardDataGridBackToBackDeposit;
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
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        const activeData = res.body.filter(o => o.statusId === 'ACTIVE');
        const gridAbove = [];
        for (let i = 0; i < activeData.length; i++) {
          const num = i;
          gridAbove[i] = { id: num, covenant: activeData[i].value, status: 'Applied', deviation: '', justification: '' };
        }

        this.standardDataGridBackToBackDeposit = gridAbove;
        this.getBackToBackDeposit();

        if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
          const parsed = parsePreviousAtrribute(this.creditProposalItem);
          const parsedConvenant = parsed['darRevHistory']?.convenant?.standardDataGridBackToBackDeposit;
          this.standardDataGridBackToBackDeposit = parsedConvenant;
        } else {
          if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length === 0) {
            this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = this.standardDataGridBackToBackDeposit;
          } else {
            for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length; i++) {
              this.standardDataGridBackToBackDeposit = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit;
            }
          }
        }
      });
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
