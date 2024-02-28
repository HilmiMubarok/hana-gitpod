import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-covenant-loan-above',
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

  constructor(private generalParameterService: GeneralParameterService, private router: Router) {}

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
    if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
      const parsed = parsePreviousAtrribute(this.creditProposalItem);
      const darRevHistory = parsed['darRevHistory']?.convenant?.standardDataGridAbove;

      for (let i = 0; i < darRevHistory.length; i++) {
        this.statusValue[i] = darRevHistory[i].status;
        this.deviation[i] = darRevHistory[i].deviation;
        this.justification[i] = darRevHistory[i].justification;
      }
    } else {
      if (this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length !== 0) {
        for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length; i++) {
          this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].status;
          this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].deviation;
          this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardDataGridAbove.length; i++) {
          this.statusValue[i] = 'Applied';
          this.creditProposalItem.attributes['convenant'].standardDataGridAbove.status = this.statusValue[i];
        }
        this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
      }
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
        const gridAbove = [];
        for (let i = 0; i < activeData.length; i++) {
          const num = i;
          gridAbove[i] = { id: num, covenant: activeData[i].value, status: 'Applied', deviation: '', justification: '' };
        }

        this.standardDataGridAbove = gridAbove;
        this.getStandardDataGridAbove();

        if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
          const parsed = parsePreviousAtrribute(this.creditProposalItem);
          const parsedConvenant = parsed['darRevHistory']?.convenant?.standardDataGridAbove;
          this.standardDataGridAbove = parsedConvenant;
        } else {
          if (this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length === 0) {
            this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
          } else {
            for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length; i++) {
              this.standardDataGridAbove = this.creditProposalItem.attributes['convenant'].standardDataGridAbove;
            }
          }
          this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.standardDataGridAbove;
        }
      });
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
