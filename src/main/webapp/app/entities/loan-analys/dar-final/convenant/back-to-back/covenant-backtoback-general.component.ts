import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private generalParameterService: GeneralParameterService, private router: Router) {}

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
    if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
      const parsed = parsePreviousAtrribute(this.creditProposalItem);
      const darRevHistory = parsed['darRevHistory']?.convenant?.standardDataGridBackToBackGeneral;

      for (let i = 0; i < darRevHistory.length; i++) {
        this.statusValue[i] = darRevHistory[i].status;
        this.deviation[i] = darRevHistory[i].deviation;
        this.justification[i] = darRevHistory[i].justification;
      }
    } else {
      if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length !== 0) {
        for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length; i++) {
          this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].status;
          this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].deviation;
          this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].justification;
        }
      } else {
        for (let i = 0; i <= this.standardDataGridBackToBackGeneral.length; i++) {
          this.statusValue[i] = 'Applied';
          this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.status = this.statusValue[i];
        }
        this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = this.standardDataGridBackToBackGeneral;
      }
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
        const gridAbove = [];
        for (let i = 0; i < activeData.length; i++) {
          const num = i;
          gridAbove[i] = { id: num, covenant: activeData[i].value, status: 'Applied', deviation: '', justification: '' };
        }

        this.standardDataGridBackToBackGeneral = gridAbove;
        this.getBackToBackGeneral();

        if (!['CP_DAR_FINAL'].includes(this.creditProposalItem.statusId) && ['dar-final'].includes(this.router.url.split('/')[1])) {
          const parsed = parsePreviousAtrribute(this.creditProposalItem);
          const parsedConvenant = parsed['darRevHistory']?.convenant?.standardDataGridBackToBackGeneral;
          this.standardDataGridBackToBackGeneral = parsedConvenant;
        } else {
          if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length === 0) {
            this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = this.standardDataGridBackToBackGeneral;
          } else {
            for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length; i++) {
              this.standardDataGridBackToBackGeneral = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral;
            }
          }
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
