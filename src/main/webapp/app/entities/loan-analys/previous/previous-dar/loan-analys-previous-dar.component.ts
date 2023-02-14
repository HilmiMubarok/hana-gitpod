import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { LoanAnalysService } from '../../loan-analys.service';

@Component({
  selector: 'jhi-loan-analys-previous-dar',
  templateUrl: './loan-analys-previous-dar.component.html',
  styleUrls: ['../loan-analys-previous-dar.css'],
})
export class LoanAnalysPreviousDarComponent implements OnInit {
  public selectedMenu: string;
  public menuCovenant = 'COVENANT';
  public menuDeviation = 'DEVIATION';
  public dataToCompare: any;
  public isDataToCompareExist: Boolean = false;

  public menuItemsAll: MenuItemModel[] = [{ text: 'PREVIOUS DAR' }, { text: 'PREVIOUS PROPOSAL' }];
  ngOnInit(): void {
    this.selectedMenu = 'PREVIOUS DAR';
    this.selectedMenu === 'PREVIOUS DAR' && this.getDarData();
  }

  constructor(private loanAnalysService: LoanAnalysService) {}

  public getDarData() {
    this.loanAnalysService
      .getLaDarCheckerNotif(this.creditProposal.customerId.toString(), {
        page: 0,
        size: 999,
      })
      .subscribe(res => this.getDataToCompare(res.body));
  }

  public getDataToCompare(data: any) {
    // if data length === 0, then set this.dataToCompare = {}
    // if data length === 1, then set this.dataToCompare = data[0]
    // if data length > 1, then set this.dataToCompare = newest data by createdDate
    if (data.length === 0) {
      this.dataToCompare = {};
    } else {
      data.filter((item, index) => {
        if (index === 0) {
          this.dataToCompare = item;
          this.isDataToCompareExist = true;
        } else {
          if (item.createdDate > this.dataToCompare.createdDate) {
            this.dataToCompare = item;
            this.isDataToCompareExist = true;
          }
        }
      });
    }

    console.log('res', {
      ori: data,
      final: this.dataToCompare,
      isExist: this.isDataToCompareExist,
    });
  }

  public setMenu(value): void {
    this.selectedMenu = value.item.properties.text;
  }

  public onProposalTypeChange(value: any): void {
    this.setMenu(value.value);
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public _creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(param: ICreditProposal) {
    this._creditProposal = param;
  }
}
