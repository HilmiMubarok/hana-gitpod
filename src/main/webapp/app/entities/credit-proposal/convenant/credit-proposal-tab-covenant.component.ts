import { Component, OnInit, SimpleChanges, OnChanges, Input } from '@angular/core';

import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

import { dataCovenant } from './convenant.constant';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant',
  templateUrl: './credit-proposal-tab-covenant.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabCovenantComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public standardDataGrid: any = dataCovenant;
  public otherDataGrid: any = [];
  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];
  public otherCovenant?: string;
  public otherStatus?: string;
  public otherDeviation?: string;
  public otherJustification?: string;

  public dialogAddVisible = false;
  public dialogEditVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  public onOverlayAddClick(): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public onDetail(): void {
    this.dialogAddVisible = true;
    this.dialogEditVisible = false;
  }

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  public clearTextBox(): void {
    this.otherCovenant = '';
    this.otherStatus = '';
    this.otherDeviation = '';
    this.otherJustification = '';
  }

  ngOnInit(): void {
    this.otherDataGrid = this.creditProposalItem.attributes['convenant'].otherCovenant;
    console.log('convenant', this.creditProposalItem.attributes['convenant']);
  }

  addToGrid() {
    this.otherDataGrid = [
      ...this.otherDataGrid,
      {
        otherCovenant: this.otherCovenant,
        otherStatus: this.otherStatus,
        otherDeviation: this.otherDeviation,
        otherJustification: this.otherJustification,
      },
    ];
    this.creditProposalItem.attributes['convenant'] = this.getFinalDataGrid();

    this.clearTextBox();
    this.dialogAddVisible = false;
  }

  public finalData: any;
  getFinalDataGrid() {
    this.standardDataGrid.map((item, index) => {
      this.standardDataGrid[index].status = this.statusValue[index];
      this.standardDataGrid[index].deviation = this.deviation[index];
      this.standardDataGrid[index].justification = this.justification[index];
    });

    this.finalData = {
      standardCovenant: this.standardDataGrid,
      otherCovenant: this.otherDataGrid,
    };

    return this.finalData;
  }

  public status: string[] = ['Applied', 'Proposed waived', 'Waived'];
}
