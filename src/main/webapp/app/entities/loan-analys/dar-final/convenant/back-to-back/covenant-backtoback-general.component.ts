import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-dar-covenant-back-to-back-general',
  templateUrl: './covenant-backtoback-general.component.html',
  styleUrls: ['./covenant-backtoback.css'],
})
export class DarCovenantBackToBackGeneralComponent implements OnInit, OnDestroy {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  // public standardDataGridBackToBackGeneral: any = dataCovenantBackToBackGeneral;
  public standardDataGridBackToBackGeneral: any = [];

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
    for (let i = 0; i < this.standardDataGridBackToBackGeneral.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGridBackToBackGeneral[i].status =
          input === 'status' ? event.value : this.standardDataGridBackToBackGeneral[i].status;
        this.standardDataGridBackToBackGeneral[i].deviation =
          input === 'deviation' ? event.target.value : this.standardDataGridBackToBackGeneral[i].deviation;
        this.standardDataGridBackToBackGeneral[i].justification =
          input === 'justification' ? event.target.value : this.standardDataGridBackToBackGeneral[i].justification;
      } else {
        this.standardDataGridBackToBackGeneral[i].status = this.statusValue[i];
        this.standardDataGridBackToBackGeneral[i].deviation = this.deviation[i];
        this.standardDataGridBackToBackGeneral[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = lodash.clone(
      this.standardDataGridBackToBackGeneral
    );
  }

  ngOnInit(): void {
    this.loadCovenantBtbGeneral();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getBackToBackGeneral() {
    const parsed = parsePreviousAtrribute(this.creditProposalItem);
    const darRevHistory = parsed['darRevHistory']?.convenant?.standardDataGridBackToBackGeneral || [];
    const convenant = this.creditProposalItem.attributes['convenant']?.standardDataGridBackToBackGeneral || [];

    const data = darRevHistory.length !== 0 ? darRevHistory : convenant;

    data.forEach((item, i) => {
      this.statusValue[i] = item.status;
      this.deviation[i] = item.deviation;
      this.justification[i] = item.justification;
    });

    if (data.length === 0) {
      this.statusValue = Array(this.standardDataGridBackToBackGeneral.length).fill('Applied');
      this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = this.standardDataGridBackToBackGeneral;
    }
  }

  public loadCovenantBtbGeneral() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BTB_GENERAL_TIMES_CONDITION',
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

        this.getBackToBackGeneral();
        this.standardDataGridBackToBackGeneral = gridBelow;

        const parsed = parsePreviousAtrribute(this.creditProposalItem);
        const parsedConvenant = parsed['darRevHistory']?.convenant?.standardDataGridBackToBackGeneral;

        if (parsedConvenant) {
          this.standardDataGridBackToBackGeneral = parsedConvenant;
        } else {
          const creditProposalConvenant = this.creditProposalItem.attributes['convenant']?.standardDataGridBackToBackGeneral;
          if (creditProposalConvenant && creditProposalConvenant.length === 0) {
            this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = this.standardDataGridBackToBackGeneral;
          } else if (creditProposalConvenant) {
            this.standardDataGridBackToBackGeneral = creditProposalConvenant;
          }
        }
      });
  }
}
