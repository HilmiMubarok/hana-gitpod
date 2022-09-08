import { Component, ViewChild } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ColumnModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-credit-proposal-slik-summary-list',
  templateUrl: './credit-proposal-slik-summary-list.component.html',
  styleUrls: ['./credit-proposal-slik-summary.css'],
})
export class CreditProposalListSlikSummaryListComponent {
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('gridDebitur') gridDebitur: GridComponent;
  public dialogVisible: boolean;

  public collateralColumns: ColumnModel[] = [
    {
      field: '',
      headerText: 'Type',
      textAlign: 'Left',
      headerTextAlign: 'Center',
    },
    {
      field: '',
      headerText: 'IDR Mio',
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
  ];

  public dataDebitur: any = [];
  public dataPengurusDanPemegangSaham: any = [];

  public dataBound(args: any) {
    this.gridDebitur.autoFitColumns(); // autofit all the columns
  }

  public onOpen(args: any) {
    args.preventFocus = true;
  }

  public onOpenDialog(): void {
    this.ejDialog.show();
  }

  public onhideClick(): void {
    this.ejDialog.hide();
  }

  public comparison: any = [
    {
      number: 1,
      bank: 'BCA',
      limitPrev: 'Rp. 50.000.000',
      balancePrev: 'Rp. 100.000.000',
      limitCur: 'Rp. 55.000.000',
      balanceCur: 'Rp. 110.000.000',
    },
  ];

  public previous: ColumnModel[] = [
    {
      field: 'limitPrev',
      headerText: 'Limit',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
    {
      field: 'balancePrev',
      headerText: 'Balance',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
  ];

  public current: ColumnModel[] = [
    {
      field: 'limitCur',
      headerText: 'Limit',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
    {
      field: 'balanceCur',
      headerText: 'Balance',
      width: 200,
      textAlign: 'Right',
      headerTextAlign: 'Center',
    },
  ];

  public focusOut(target: HTMLElement): void {
    target.parentElement.classList.remove('e-input-focus');
  }
}
