import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-covenant-dar-above',
  templateUrl: './credit-proposal-covenant-above.component.html',
  styleUrls: ['../back-to-back/covenant-backtoback.css'],
})
export class DarCovenantAboveComponent implements OnInit, OnDestroy {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGridAbove: any = [];

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

  ngOnInit(): void {
    this.loadCovenantAbove();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public getStandardDataGridAbove() {
    const parsed = parsePreviousAtrribute(this.creditProposalItem);
    const darRevHistory = parsed['darRevHistory']?.convenant?.standardDataGridAbove || [];
    const convenant = this.creditProposalItem.attributes['convenant']?.standardDataGridAbove || [];

    const data = darRevHistory.length !== 0 ? darRevHistory : convenant;

    data.forEach((item, i) => {
      this.statusValue[i] = item.status;
      this.deviation[i] = item.deviation;
      this.justification[i] = item.justification;
    });

    if (data.length === 0) {
      this.statusValue = Array(this.standardDataGridAbove.length).fill('Applied');
      this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
    }
  }

  public loadCovenantAbove() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_ABOVE_STANDARD',
        page: 0,
        size: 9999,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        const activeData = res.body.filter(o => o.statusId === 'ACTIVE');
        const gridAbove = activeData.map((data, i) => ({
          id: i,
          covenant: data.value,
          status: 'Applied',
          deviation: '',
          justification: '',
        }));

        this.getStandardDataGridAbove();
        this.standardDataGridAbove = gridAbove;

        const parsed = parsePreviousAtrribute(this.creditProposalItem);
        const parsedConvenant = parsed['darRevHistory']?.convenant?.standardDataGridAbove;

        if (parsedConvenant) {
          this.standardDataGridAbove = parsedConvenant;
        } else {
          const creditProposalConvenant = this.creditProposalItem.attributes['convenant']?.standardDataGridAbove;
          if (creditProposalConvenant && creditProposalConvenant.length === 0) {
            this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
          } else if (creditProposalConvenant) {
            this.standardDataGridAbove = creditProposalConvenant;
          }
        }
      });
  }
}
