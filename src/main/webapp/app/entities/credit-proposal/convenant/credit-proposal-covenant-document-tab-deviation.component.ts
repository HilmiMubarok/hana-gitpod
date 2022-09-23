import { Component, Input } from '@angular/core';
import { ICreditProposal, CreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';

@Component({
  selector: 'jhi-credit-proposal-tab-deviation',
  templateUrl: './credit-proposal-covenant-document-tab-deviation.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalCovenantDocumentTabDeviationComponent
  extends AbstractEntityEj2GridComponent<ICreditProposal>
{
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  public dataGridOtherDeviation: any = [];

  public standardDataGrid: any = [];

  public condition?: string;
  public deviation?: any = [];
  public justification?: any = [];
  public status?: any = [];

  public otherCondition?: string;
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

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
	this.standardDataGrid = this.filterDataGrid(this.creditProposalItem.attributes['convenant'].standardCovenant);
  }

  public clearTextBox(): void {
    this.otherCondition = '';
    this.otherDeviation = '';
    this.otherJustification = '';
  }

  public onKeyUpEvent() {
    for (let i = 0; i <= this.creditProposalItem.attributes['convenant'].standardCovenant.length; i++) {
      this.creditProposalItem.attributes['convenant'].standardCovenant[i].deviation = this.deviation[i];
      this.creditProposalItem.attributes['convenant'].standardCovenant[i].justification = this.justification[i];
    }
    this.creditProposalItem.attributes['convenant'].standardCovenant = this.standardDataGrid;
  }

  private filterDataGrid(data: any) {
    if (data.length > 0) {
      const dataStatus = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === 'Waived') {
          dataStatus.push(data[i]);
        }
      }
	  return dataStatus;
    }
    return data;
  }

  public getDataOtherDeviation() {
    this.dataGridOtherDeviation = [
      ...this.dataGridOtherDeviation,
      {
        id: this.creditProposalItem.attributes['deviation'].dataOtherDeviation.length + 1,
        otherCondition: this.otherCondition,
        otherDeviation: this.otherDeviation,
        otherJustification: this.otherJustification,
      },
    ];
    this.creditProposalItem.attributes['deviation'] = this.getDataDeviation();
    this.clearTextBox();
    this.dialogAddVisible = false;
  }

  public getDataDeviation() {
    
  }

  public deleteData(Id: any): void {
    const deleteChild = this.dataGridOtherDeviation.filter(({ id }) => id !== Id);
    this.dataGridOtherDeviation = deleteChild;

    const deleteParent = this.creditProposalItem.attributes['deviation'].dataOtherDeviation.filter(({ id }) => id !== Id);
    this.creditProposalItem.attributes['deviation'].dataOtherDeviation = deleteParent;
  }
}