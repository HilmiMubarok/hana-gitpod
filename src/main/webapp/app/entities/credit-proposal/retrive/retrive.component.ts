import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { PartyService } from 'app/entities/party/party.service';
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
  public listOfValue = {
    currencyList: ['USD', 'IDR'],
  };
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
  @Input()
  get creditProposalItem() {
    return this._creditProposal;
  }

  set creditProposalItem(item: any) {
    this._creditProposal = item;
  }

  constructor(protected creditProposalService: CreditProposalService, public partyService: PartyService) {}
  ngOnInit(): void {
    console.log('');
  }

  getCursCurrency() {
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.currenyIdr = res.body[0].factor;
    });
  }

  // currency convert
  convertCurrency(value: string) {
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency(value, 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyName = res.body[0]?.factor;
      if (value === 'USD') {
        this.dataRetrive.find(item => {});
        // this.dataRetrive.filter( item =>{
        //   item.aacAmt = item.accAmt / this.currencyName
        // })
      } else if (value === 'IDR') {
        // this.dataRetrive.filter( item =>{
        //   item.aacName = value
        // })
        // this.dataRetrive.filter( item =>{
        //   item.aacAmt = item.accAmt * this.currenyIdr
        // })
      }
    });
  }

  generateRetrive() {
    this.cifId = this.creditProposalItem.customerNumber;
    this.creditProposalService.getRetriveData(this.cifId).subscribe(res => {
      this.dataRetrive = JSON.parse(res.body.debtorData.attributes.finAnalysis);
      this.saveCPData = res.body.debtorData.attributes['finAnalysis'];
      this.creditProposalItem.attributes['retriveData'].retrive = lodash.clone(this.saveCPData);
      this.retriveData = new MatTableDataSource(this.dataRetrive);
    });
  }
}
