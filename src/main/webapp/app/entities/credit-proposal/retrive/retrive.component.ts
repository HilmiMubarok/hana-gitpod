import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import lodash from 'lodash';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'jhi-retrive',
  templateUrl: './retrive.component.html',
  styleUrls: ['./retrive.css'],
})
export class RetriveComponent implements OnInit {
  public displayColumns: string[] = ['year', 'amountcode', 'accountname', 'currency', 'amount1'];
  public listOfValue: any;
  public showHide = false;
  public getMenu: string;
  selected;

  public cursCurrency: any;
  public currencyName: any;
  public setDate: string;

  public dataRetrive: [];

  public _creditProposal: ICreditProposal;
  public activeRoute: string;
  public cifId: string;
  public saveCPData: [];
  public retriveData: any;
  currenyIdr: any;
  public _partyId: string;
  public page: number;
  public size: 10;

  @Input()
  get creditProposalItem() {
    return this._creditProposal;
  }

  set creditProposalItem(item: any) {
    this._creditProposal = item;
  }

  // test partycif
  @Input()
  get partyId() {
    return this._partyId;
  }

  set partyId(item: any) {
    this._partyId = item;
  }

  constructor(protected creditProposalService: CreditProposalService) {}
  ngOnInit(): void {
    this.getListCurrency();
    this.getRetriveDataHobis();
  }

  getCursCurrency() {
    this.setDate = new Date().toISOString().split('T')[0];
    // this.creditProposalService.getCurrency('USD', 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
    //   this.currenyIdr = res.body[0].factor;
    // });
  }

  getListCurrency() {
    this.creditProposalService.getListCurency(0, 99).subscribe(res => {
      this.listOfValue = res.body;
    });
  }

  getRetriveDataHobis() {
    this.cifId =
      this.creditProposalItem?.customerNumber === undefined ? this.partyId.customerNumber : this.creditProposalItem.customerNumber;
    this.creditProposalService.getListRetrive(this.cifId, 0, 10).subscribe(res => {
      this.retriveData = res.body;
    });
  }

  // currency convert
  convertCurrency(value: string) {
    console.log('value b', value);
    this.setDate = new Date().toISOString().split('T')[0];
    // this.creditProposalService.getCurrency(value, 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
    //   for(let i = 0; i < res.body.length; i++ ){
    //     this.currencyName = res.body[i].factor
    //   }
    this.retriveData.currencyCode = value;
    this.retriveData.amount / this.currencyName;

    // });
  }

  generateRetrive() {
    this.cifId =
      this.creditProposalItem?.customerNumber === undefined ? this.partyId.customerNumber : this.creditProposalItem.customerNumber;
    this.creditProposalService.getRetriveData(this.cifId).subscribe(res => {
      this.dataRetrive = JSON.parse(res.body.debtorData.attributes.finAnalysis);
      this.saveCPData = res.body.debtorData.attributes['finAnalysis'];
      this.creditProposalItem.attributes['retriveData'].retrive = lodash.clone(this.saveCPData);
      this.retriveData = new MatTableDataSource(this.dataRetrive);
    });
  }
}
