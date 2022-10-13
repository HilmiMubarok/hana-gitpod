import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow, dataCovenantAbove } from './convenant.constant';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant',
  templateUrl: './credit-proposal-tab-covenant.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabCovenantComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'COVENANT' }, { text: 'DEVIATION' }];

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGrid: any = dataCovenantBelow;

  public otherDataGrid: any = [];

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  public otherCovenant?: string;
  public otherStatus?: string;
  public otherDeviation?: string;
  public otherJustification?: string;

  public finalData: any;

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

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
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

  public onKeyUpEvent(input: string, event: any, data: any) {
    for (let i = 0; i < this.standardDataGrid.length; i++) {
      if (i === Number(data.index)) {
        this.standardDataGrid[i].status = input === 'status' ? event.value : this.standardDataGrid[i].status;
        this.standardDataGrid[i].deviation = input === 'deviation' ? event.target.value : this.standardDataGrid[i].deviation;
        this.standardDataGrid[i].justification = input === 'justification' ? event.target.value : this.standardDataGrid[i].justification;
      } else {
        this.standardDataGrid[i].status = this.statusValue[i];
        this.standardDataGrid[i].deviation = this.deviation[i];
        this.standardDataGrid[i].justification = this.justification[i];
      }
    }
    this.creditProposalItem.attributes['convenant'].standardDataGrid = lodash.clone(this.standardDataGrid);
  }

  public deleteData(Id: any): void {
    const data1 = this.otherDataGrid.filter(({ id }) => id !== Id);
    this.otherDataGrid = data1;
    const data = this.creditProposalItem.attributes['convenant'].otherCovenant.filter(({ id }) => id !== Id);
    this.creditProposalItem.attributes['convenant'].otherCovenant = data;
  }

  ngOnInit(): void {
    this.selectedMenu = 'COVENANT';
    this.otherDataGrid = this.creditProposalItem.attributes['convenant'].otherCovenant;
    if (this.creditProposalItem.attributes['convenant'].standardCovenant.length !== 0) {
      for (let i = 0; i < this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
        this.statusValue[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].status;
        this.deviation[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].deviation;
        this.justification[i] = this.creditProposalItem.attributes['convenant'].standardCovenant[i].justification;
      }
    } else {
      for (let i = 0; i <= this.standardDataGrid.length; i++) {
        this.statusValue[i] = 'Applied';
      }
    }

    // console.log('proposal-type', this.creditProposalItem[])
  }

  addToGrid() {
    this.otherDataGrid = [
      ...this.otherDataGrid,
      {
        id: this.creditProposalItem.attributes['convenant'].otherCovenant.length + 1,
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
}
