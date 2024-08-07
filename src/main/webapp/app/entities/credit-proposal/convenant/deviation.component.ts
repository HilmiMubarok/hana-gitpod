import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ICreditProposal } from '../credit-proposal.model';
import lodash from 'lodash';

@Component({
  selector: 'jhi-deviation',
  templateUrl: './deviation.component.html',
  styleUrls: ['./covenant-style.css'],
})
export class DeviationComponent implements OnInit, OnChanges {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public _creditProposalItem: ICreditProposal;

  public status: string[] = ['To be waived', 'Waived'];
  public readonly = true;
  public dataGrid: any;
  public dataGridDeposit: any;
  public dataGridGeneral: any;
  public copyDataGrid: any;
  public copyDataGridDeposit: any;
  public copyDataGridGeneral: any;

  public covenant?: string;
  public statusValue: any = [];
  public statusValueDeposit: any = [];
  public statusValueGeneral: any = [];
  public deviation: any = [];
  public deviationDeposit: any = [];
  public deviationGeneral: any = [];
  public justification: any = [];
  public justificationDeposit: any = [];
  public justificationGeneral: any = [];

  @Input() isViewMode: Boolean = false;
  @Input() proposalType: string;
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public getDeviation(proposalType: string) {
    switch (proposalType) {
      case 'Total Exposure > IDR 15 Bio':
        if (this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length !== 0) {
          const deletedItem = this.creditProposalItem.attributes['convenant'].standardDataGridAbove.filter(
            item => item.status !== 'Applied'
          );
          this.dataGrid = deletedItem;
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridAbove.length; i++) {
            this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].status;
            this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].deviation;
            this.justification[i] = this.creditProposalItem.attributes['convenant'].standardDataGridAbove[i].justification;
          }
        } else {
          this.dataGrid = [];
        }
        break;
      case 'Total Exposure <= IDR 15 Bio':
        if (this.creditProposalItem.attributes['convenant'].standardCovenant.length !== 0) {
          const deletedItem = this.creditProposalItem.attributes['convenant'].standardCovenant.filter(item => item.status !== 'Applied');
          this.dataGrid = deletedItem;
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
            this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].status;
            this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].deviation;
            this.justification[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].justification;
          }
        } else {
          this.dataGrid = [];
        }
        break;

      default:
        // DEPOSIT
        if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length !== 0) {
          const deletedItem = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.filter(
            item => item.status !== 'Applied'
          );
          this.dataGridDeposit = deletedItem;
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit.length; i++) {
            this.statusValueDeposit[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].status;
            this.deviationDeposit[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].deviation;
            this.justificationDeposit[i] =
              this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit[i].justification;
          }
        } else {
          this.dataGridDeposit = [];
        }
        // GENERAL
        if (this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length !== 0) {
          const deletedItem = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.filter(
            item => item.status !== 'Applied'
          );
          this.dataGridGeneral = deletedItem;
          for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral.length; i++) {
            this.statusValueGeneral[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].status;
            this.deviationGeneral[i] = this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].deviation;
            this.justificationGeneral[i] =
              this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral[i].justification;
          }
        } else {
          this.dataGridGeneral = [];
        }

        break;
    }
  }

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.copyDataGrid.length; i++) {
      if (i === Number(data.index)) {
        this.copyDataGrid[i].status = input === 'status' ? event.value : this.dataGrid[i].status;
        this.copyDataGrid[i].deviation = input === 'deviation' ? event.target.value : this.dataGrid[i].deviation;
        this.copyDataGrid[i].justification = input === 'justification' ? event.target.value : this.dataGrid[i].justification;
      } else {
        this.copyDataGrid[i].status = this.statusValue[i];
        this.copyDataGrid[i].deviation = this.deviation[i];
        this.copyDataGrid[i].justification = this.justification[i];
      }
    }
    if (this.creditProposalItem.attributes['proposalType'] === 'Total Exposure > IDR 15 Bio') {
      this.creditProposalItem.attributes['convenant'].standardDataGridAbove = lodash.clone(this.copyDataGrid);
    } else if (this.creditProposalItem.attributes['proposalType'] === 'Total Exposure <= IDR 15 Bio') {
      this.creditProposalItem.attributes['convenant'].standardCovenant = lodash.clone(this.copyDataGrid);
    } else {
      // handle backtoback
    }
  }

  public onKeyUpEventDeposit(input: string, event: any, data: any) {
    for (let i = 0; i < this.copyDataGridDeposit.length; i++) {
      if (i === Number(data.index)) {
        this.copyDataGridDeposit[i].status = input === 'status' ? event.value : this.dataGridDeposit[i].status;
        this.copyDataGridDeposit[i].deviation = input === 'deviation' ? event.target.value : this.dataGridDeposit[i].deviation;
        this.copyDataGridDeposit[i].justification = input === 'justification' ? event.target.value : this.dataGridDeposit[i].justification;
      } else {
        this.copyDataGridDeposit[i].status = this.statusValue[i];
        this.copyDataGridDeposit[i].deviation = this.deviation[i];
        this.copyDataGridDeposit[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackDeposit = lodash.clone(this.copyDataGridDeposit);
  }

  public onKeyUpEventGeneral(input: string, event: any, data: any) {
    for (let i = 0; i < this.copyDataGridGeneral.length; i++) {
      if (i === Number(data.index)) {
        this.copyDataGridGeneral[i].status = input === 'status' ? event.value : this.dataGridGeneral[i].status;
        this.copyDataGridGeneral[i].deviation = input === 'deviation' ? event.target.value : this.dataGridGeneral[i].deviation;
        this.copyDataGridGeneral[i].justification = input === 'justification' ? event.target.value : this.dataGridGeneral[i].justification;
      } else {
        this.copyDataGridGeneral[i].status = this.statusValue[i];
        this.copyDataGridGeneral[i].deviation = this.deviation[i];
        this.copyDataGridGeneral[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGridBackToBackGeneral = lodash.clone(this.copyDataGridGeneral);
  }

  public addBRBeforeDash(text: string): string {
    if (text === '' || text === undefined || text === null) {
      return text;
    } else {
      const hasil = text.replace(/\n/g, '<br/>');
      return hasil;
    }
  }

  ngOnInit(): void {
    this.getDeviation(this.proposalType);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.proposalType) {
      this.getDeviation(this.proposalType);
    }

    if (changes.creditProposalItem) {
      switch (this.proposalType) {
        case 'Total Exposure > IDR 15 Bio':
          this.dataGrid = [...this.dataGrid, changes.creditProposalItem.currentValue.attributes['convenant'].standardDataGridAbove];
          break;
        case 'Total Exposure <= IDR 15 Bio':
          this.dataGrid = [...this.dataGrid, changes.creditProposalItem.currentValue.attributes['convenant'].standardDataGridAbove];
          break;
        default:
          break;
      }
    }
  }
}
