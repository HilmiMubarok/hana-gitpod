import { Component, ViewChild, OnInit } from '@angular/core';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, PageService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { ICreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-bank-account-analysis',
  templateUrl: './credit-proposal-bank-account-analysis.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
  providers: [ToolbarService, PageService],
})
export class CreditProposalBankAccountAnalysisComponent extends AbstractEntityComponent<ICreditProposal> implements OnInit {
  @ViewChild('ddbank')
  public dropDownListObject: DropDownListComponent;
  public dataDropdown: string[] = ['Hana Bank', 'Bank 1', 'Bank 2'];
  public numericFormatOptions: Object;

  @ViewChild('gridRow')
  public gridRow: GridComponent;
  public toolbar: ToolbarItems[] = ['Add'];
  public editSettings: Object = { allowAdding: true, newRowPosition: 'Bottom' };

  public gridData: Object[] = [
    {
      no: '1',
    },
    {
      no: '2',
    },
    {
      no: '3',
    },
  ];
  public totalGridData: Object[] = [
    {
      name: 'Total',
    },
    {
      name: 'Average',
    },
    {
      name: 'Average (Other CCY)',
    },
  ];
  public pageSettings: { pageCount: 5 };

  public addRow(e: any): void {
    this.gridRow.editModule.addRecord({
      //   no: this.gridRow.dataSourceChange.no + 1,
    });
    console.log(this.gridRow.getAllDataRows(true));
  }
  // ringkasan mutasi rekening
  public mutationData?: any = [
    {
      bank: 'Hana Bank',
      accountNumber: '1234567890',
      accountName: 'Hana Bank',
      ccy: 'Kredit',
      debit: '0',
      fqDebit: '0',
      credit: '0',
      fqCredit: '0',
      avgBalance: '0',
    },
  ];

  save() {
    console.log('saved');
  }

  ngOnInit(): void {
    this.numericFormatOptions = { format: 'N' };
  }
}
