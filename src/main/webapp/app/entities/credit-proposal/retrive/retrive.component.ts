import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import lodash from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

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
  public page = 0;
  public size = 10;
  public pageSize = 10;
  public idrCurrency = 'IDR';
  isLoading = false;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  public enabledLoadMore: boolean;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @Input()
  get creditProposalItem() {
    return this._creditProposal;
  }

  set creditProposalItem(item: any) {
    this._creditProposal = item;
  }

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

  getListCurrency() {
    this.isLoading = true;
    this.creditProposalService.getListCurency(this.page, 150).subscribe(
      res => {
        this.listOfValue = res.body;
        setTimeout(() => {
          this.paginator.pageIndex = this.page;
          this.paginator.length = res.body.count;
        });
        this.isLoading = false;
      },
      error => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  getRetriveDataHobis() {
    this.cifId =
      this.creditProposalItem?.customerNumber === undefined ? this.partyId.customerNumber : this.creditProposalItem.customerNumber;
    this.creditProposalService.getListRetrive(this.cifId, this.page, this.size).subscribe(res => {
      this.retriveData = res.body;
    });
  }

  // currency convert
  convertCurrency(value: string) {
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency(value, this.idrCurrency, this.setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyName = res.body[0]?.factor;
      if (value !== 'IDR') {
        for (let i = 0; i < this.retriveData.length; i++) {
          this.retriveData[i].currencyCode = value;
        }
        for (let j = 0; j < this.retriveData.length; j++) {
          this.retriveData[j].amount = this.retriveData[j].amount / this.currencyName;
        }
      } else if (value === 'IDR') {
        for (let i = 0; i < this.retriveData.length; i++) {
          this.retriveData[i].currencyCode = value;
        }
        for (let j = 0; j < this.retriveData.length; j++) {
          this.retriveData[j].amount = this.retriveData[j].amount * this.currencyName;
        }
      }
    });
  }

  // pagination
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex;
    this.getRetriveDataHobis();
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
