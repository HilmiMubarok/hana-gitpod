import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { forkJoin, map, Subject, takeUntil, tap } from 'rxjs';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

@Component({
  selector: 'jhi-covenant',
  templateUrl: './covenant.component.html',
  styleUrls: ['./covenant-style.css'],
  styles: [
    `
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(128, 128, 128, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999;
      }

      .spinner {
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
      }

      .text {
        margin-top: 40px;
        font-size: 40px;
        font-weight: bold;
        color: #3498db;
      }

      @-webkit-keyframes spin {
        0% {
          -webkit-transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class CovenantComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public _creditProposalItem: ICreditProposal;
  public status: string[] = ['Applied', 'To be waived', 'Waived'];
  public dataGrid: any = [];
  public dataGridDeposit: any = [];
  public dataGridGeneral: any = [];
  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];
  public statusValueDeposit: any = [];
  public deviationDeposit: any = [];
  public justificationDeposit: any = [];
  public statusValueGeneral: any = [];
  public deviationGeneral: any = [];
  public justificationGeneral: any = [];
  public loading: Boolean = false;

  @Input() isViewMode: Boolean = false;
  @Input() proposalType: string;
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  constructor(private generalParameterService: GeneralParameterService) {}

  public getCovenant(proposalType: string): void {
    this.loading = true;
    let param;

    if (proposalType === 'Total Exposure > IDR 15 Bio') {
      param = 'COVENANT_ABOVE_STANDARD';
    } else if (proposalType === 'Total Exposure <= IDR 15 Bio') {
      param = 'COVENANT_BELOW_STANDARD';
    } else {
      // handle backtoback
      this.getCovenantBackToBack();
      return;
    }

    this.generalParameterService
      .queryFilterBy({
        idParameterType: param,
        page: 0,
        size: 9999,
      })
      .pipe(
        map(res =>
          lodash.filter(res.body, function (o) {
            return o.statusId === 'ACTIVE';
          })
        ),
        tap(res => {
          const gridData = [];
          for (let i = 0; i < res.length; i++) {
            const num = i;
            gridData[i] = { id: num, covenant: res[i].value, status: 'Applied', deviation: '', justification: '' };
          }
          this.dataGrid = gridData;
          this.getDataGrid();
        })
      )
      .subscribe({
        next: res => {
          console.log('data', { res, param, dataGrid: this.dataGrid, attr: this.creditProposalItem.attributes['convenant'] });
          this.processCovenant();
        },
        error: err => {
          console.error('error', err);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  public getCovenantBackToBack(): void {
    this.loading = true;

    const deposit = this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BTB_TERMS_CONDITION',
        page: 0,
        size: 9999,
      })
      .pipe(
        map(res =>
          lodash.filter(res.body, function (o) {
            return o.statusId === 'ACTIVE';
          })
        )
      );

    const general = this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVENANT_BTB_GENERAL_TIMES_CONDITION',
        page: 0,
        size: 9999,
      })
      .pipe(
        map(res =>
          lodash.filter(res.body, function (o) {
            return o.statusId === 'ACTIVE';
          })
        )
      );

    forkJoin([deposit, general])
      .pipe(
        tap(responses => {
          const [res1, res2] = responses;
          const gridDataDeposit = [];
          const gridDataGeneral = [];
          let i = 0;
          let ii = 0;

          res1.forEach((item: any) => {
            gridDataDeposit.push({ id: i++, covenant: item.value, status: 'Applied', deviation: '', justification: '' });
          });

          res2.forEach((item: any) => {
            gridDataGeneral.push({ id: ii++, covenant: item.value, status: 'Applied', deviation: '', justification: '' });
          });

          this.dataGridDeposit = gridDataDeposit;
          this.dataGridGeneral = gridDataGeneral;
          this.getDataGrid();
        })
      )
      .subscribe({
        next: responses => {
          console.log('data', {
            responses,
            dataGridDeposit: this.dataGridDeposit,
            dataGridGeneral: this.dataGridGeneral,
            attr: this.creditProposalItem.attributes['convenant'],
          });
          this.processCovenant();
        },
        error: err => {
          console.error('error', err);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  private processCovenant(): void {
    switch (this.creditProposalItem.attributes['proposalType']) {
      case 'Total Exposure > IDR 15 Bio':
        if (this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length === 0) {
          this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.dataGrid;
        } else {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length; i++) {
            this.dataGrid[i] = {
              covenant: this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].covenant,
              deviation: this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].deviation,
              id: this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].id,
              justification: this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].justification,
              status: this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].status,
            };
          }

          this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.dataGrid;
        }
        break;

      case 'Total Exposure <= IDR 15 Bio':
        if (this.creditProposalItem.attributes['convenant'].standardCovenant.length === 0) {
          this.creditProposalItem.attributes['convenant'].standardCovenant = this.dataGrid;
        } else {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
            this.dataGrid[i] = {
              covenant: this.creditProposalItem.attributes['convenant'].standardCovenant[i].covenant,
              deviation: this.creditProposalItem.attributes['convenant'].standardCovenant[i].deviation,
              id: this.creditProposalItem.attributes['convenant'].standardCovenant[i].id,
              justification: this.creditProposalItem.attributes['convenant'].standardCovenant[i].justification,
              status: this.creditProposalItem.attributes['convenant'].standardCovenant[i].status,
            };
          }
          this.creditProposalItem.attributes['convenant'].standardCovenant = this.dataGrid;
        }
        break;

      default:
        // BACK TO BACK DEPOSIT
        if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length === 0) {
          this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = this.dataGridDeposit;
        } else {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length; i++) {
            this.dataGridDeposit = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit;
          }
        }
        // BACK TO BACK GENERAL
        if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length === 0) {
          this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = this.dataGridGeneral;
        } else {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length; i++) {
            this.dataGridGeneral = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral;
          }
        }
        break;
    }
  }

  private getDataGrid() {
    switch (this.proposalType) {
      case 'Total Exposure > IDR 15 Bio':
        if (this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length !== 0) {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length; i++) {
            this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].status;
            this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].deviation;
            this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].justification;
          }
        } else {
          for (let i = 0; i <= this.dataGrid.length; i++) {
            this.statusValue[i] = 'Applied';
            this.creditProposalItem.attributes['convenant'].standardDataGridAbove.status = this.statusValue[i];
          }
          this.creditProposalItem.attributes['convenant'].standardDataGridAbove = this.dataGrid;
        }
        break;

      case 'Total Exposure <= IDR 15 Bio':
        if (this.creditProposalItem.attributes['convenant'].standardCovenant.length !== 0) {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
            this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].status;
            this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].deviation;
            this.justification[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].justification;
          }
        } else {
          for (let i = 0; i <= this.dataGrid.length; i++) {
            this.statusValue[i] = 'Applied';
            this.creditProposalItem.attributes['convenant'].standardCovenant.status = this.statusValue[i];
          }
          this.creditProposalItem.attributes['convenant'].standardCovenant = this.dataGrid;
        }
        break;

      default:
        // BACK TO BACK DEPOSIT
        if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length !== 0) {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length; i++) {
            this.statusValueDeposit[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].status;
            this.deviationDeposit[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].deviation;
            this.justificationDeposit[i] =
              this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].justification;
          }
        } else {
          for (let i = 0; i <= this.dataGridDeposit.length; i++) {
            this.statusValueDeposit[i] = 'Applied';
            this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.status = this.statusValueDeposit[i];
          }

          this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = this.dataGridDeposit;
        }

        // BACK TO BACK GENERAL
        if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length !== 0) {
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length; i++) {
            this.statusValueGeneral[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].status;
            this.deviationGeneral[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].deviation;
            this.justificationGeneral[i] =
              this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].justification;
          }
        } else {
          for (let i = 0; i <= this.dataGridGeneral.length; i++) {
            this.statusValueGeneral[i] = 'Applied';
            this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.status = this.statusValueGeneral[i];
          }

          this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = this.dataGridGeneral;
        }
        break;
    }
  }

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.dataGrid.length; i++) {
      if (i === Number(data.index)) {
        this.dataGrid[i].status = input === 'status' ? event.value : this.dataGrid[i].status;
        console.log('status', this.dataGrid[i].status);
        this.dataGrid[i].deviation = input === 'deviation' ? event.target.value : this.dataGrid[i].deviation;
        this.dataGrid[i].justification = input === 'justification' ? event.target.value : this.dataGrid[i].justification;
      } else {
        this.dataGrid[i].status = this.statusValue[i];
        this.dataGrid[i].deviation = this.deviation[i];
        this.dataGrid[i].justification = this.justification[i];
      }
    }
    if (this.creditProposalItem.attributes['proposalType'] === 'Total Exposure > IDR 15 Bio') {
      this.creditProposalItem.attributes['convenant'].standardDataGridAbove = lodash.clone(this.dataGrid);
    } else {
      this.creditProposalItem.attributes['convenant'].standardCovenant = lodash.clone(this.dataGrid);
    }
  }

  public onKeyUpEventDeposit(input: string, event: any, data: any) {
    for (let i = 0; i < this.dataGridDeposit.length; i++) {
      if (i === Number(data.index)) {
        this.dataGridDeposit[i].status = input === 'status' ? event.value : this.dataGridDeposit[i].status;
        this.dataGridDeposit[i].deviation = input === 'deviation' ? event.target.value : this.dataGridDeposit[i].deviation;
        this.dataGridDeposit[i].justification = input === 'justification' ? event.target.value : this.dataGridDeposit[i].justification;
      } else {
        this.dataGridDeposit[i].status = this.statusValueDeposit[i];
        this.dataGridDeposit[i].deviation = this.deviationDeposit[i];
        this.dataGridDeposit[i].justification = this.justificationDeposit[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = lodash.clone(this.dataGridDeposit);
  }

  public onKeyUpEventGeneral(input: string, event: any, data: any) {
    for (let i = 0; i < this.dataGridGeneral.length; i++) {
      if (i === Number(data.index)) {
        this.dataGridGeneral[i].status = input === 'status' ? event.value : this.dataGridGeneral[i].status;
        this.dataGridGeneral[i].deviation = input === 'deviation' ? event.target.value : this.dataGridGeneral[i].deviation;
        this.dataGridGeneral[i].justification = input === 'justification' ? event.target.value : this.dataGridGeneral[i].justification;
      } else {
        this.dataGridGeneral[i].status = this.statusValueGeneral[i];
        this.dataGridGeneral[i].deviation = this.deviationGeneral[i];
        this.dataGridGeneral[i].justification = this.justificationGeneral[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = lodash.clone(this.dataGridGeneral);
  }

  public addBRBeforeDash(text: string): string {
    if (text === '' || text === undefined || text === null) {
      return text;
    } else {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
    }
  }

  private resetDataGrid() {
    this.dataGrid = [];
    this.statusValue = [];
    this.deviation = [];
    this.justification = [];
  }

  ngOnInit(): void {
    this.getCovenant(this.creditProposalItem.attributes['proposalType']);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.proposalType) {
      this.resetDataGrid();
      this.getCovenant(this.proposalType);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
