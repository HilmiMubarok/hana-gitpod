import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import lodash from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-retrive',
  templateUrl: './retrive.component.html',
  styleUrls: ['./retrive.css'],
})
export class RetriveComponent extends AbstractEntityMaterialComponent<ICreditProposal> implements OnInit {
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
  public idrCurrency = 'IDR';
  isLoading = false;
  totalRows = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  public enabledLoadMore: boolean;

  dataSource: MatTableDataSource<object[]>;

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

  constructor(protected creditProposalService: CreditProposalService, protected _snackBar: MatSnackBar) {
    super(_snackBar, creditProposalService);
    this.page = 0;
    this.itemsPerPage = 10;
  }
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
    this.creditProposalService
      .getListRetrive(this.cifId, {
        page: this.page,
        size: this.itemsPerPage,
      })
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  initDataForMatTable(data: any, headers: HttpHeaders) {
    let customItem = [];
    customItem = this.addIdx(data.body);

    this.items = new MatTableDataSource(customItem);
    if (!this.items) {
      this.items.paginator = this.paginator;
    }
    this.paginatorLength = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSize = this.paginator.pageSize;
    this.loading = false;
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

  generateRetrive() {
    this.cifId =
      this.creditProposalItem?.customerNumber === undefined ? this.partyId.customerNumber : this.creditProposalItem.customerNumber;
    this.creditProposalService.getRetriveData(this.cifId).subscribe(res => {
      this.dataRetrive = res.body;
      this.retriveData = new MatTableDataSource(this.dataRetrive);
    });
  }

  protected postLoadDataLazy(): void {
    this.getRetriveDataHobis();
  }
}
