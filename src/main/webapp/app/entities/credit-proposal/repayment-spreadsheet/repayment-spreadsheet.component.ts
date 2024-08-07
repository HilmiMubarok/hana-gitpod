import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject } from 'rxjs';
import { retry, takeUntil } from 'rxjs/operators';

import { MessageService } from 'primeng/api';
import { ICreditProposal } from '../credit-proposal.model';

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-repayment-spreadsheet',
  templateUrl: './repayment-spreadsheet.component.html',
})
export class RepaymentSpreadsheetComponent implements OnInit, OnDestroy, OnChanges {
  @Input() jhifilter: 'Total Exposure > IDR 15 Bio' | 'Total Exposure Back to Back' | 'Total Exposure <= IDR 15 Bio';
  private ngUnsubscribe = new Subject();
  @ViewChild('spreadsheet') public spreadsheetObj: SpreadsheetComponent;
  @ViewChild('spreadsheetDisabled') public spreadsheetDisabledObj: SpreadsheetComponent;
  public saveWord = false;
  private bucket: string;
  private key = 'credit_proposal/financial_analysis';
  private updateKey = '';
  private paramsId: string;
  private isIdHasData = true;
  private isMasterDataExist = false;
  @Input() saveWordMinio: any;
  private fileBeforeOpen: File = null;

  public _creditProposalItem: ICreditProposal;

  public protectSheet() {
    this.spreadsheetObj.sheets.forEach(sheet => {
      this.spreadsheetObj.protectSheet(sheet.name, {
        selectCells: true,
        formatCells: true,
        formatRows: true,
        formatColumns: true,
      });
    });
  }

  constructor(private storageService: StorageService, private actRoute: ActivatedRoute, protected messageService: MessageService) {
    this.bucket = '';
  }

  mockData: ICalculator[] = [
    {
      id: '1',
      facilityType: 'DL',
      referenceRateType: 'JIBOR 12M',
      tenor: '12',
      currency: 'IDR',
      collectability: '1',
      collateral: 'Unsecured',
      typeRating: 'B3',
      industry: 'Non Bank FI - Other (Securities, Venture Capital & Insurance)',
      currentInterestRate: '7.50%',
    },
    {
      id: '2',
      facilityType: 'DL',
      referenceRateType: 'JIBOR 12M',
      tenor: '36',
      currency: 'IDR',
      collectability: '1',
      collateral: 'Unsecured',
      typeRating: 'B3',
      industry: 'Non Bank FI - Other (Securities, Venture Capital & Insurance)',
      currentInterestRate: '7.50%',
    },
    {
      id: '3',
      facilityType: 'DL',
      referenceRateType: 'JIBOR 12M',
      tenor: '6',
      currency: 'IDR',
      collectability: '1',
      collateral: 'Unsecured',
      typeRating: 'B3',
      industry: 'Non Bank FI - Other (Securities, Venture Capital & Insurance)',
      currentInterestRate: '7.50%',
    },
    {
      id: '4',
      facilityType: 'DL',
      referenceRateType: 'JIBOR 12M',
      tenor: '3',
      currency: 'USD',
      collectability: '1',
      collateral: 'Unsecured',
      typeRating: 'B3',
      industry: 'Non Bank FI - Other (Securities, Venture Capital & Insurance)',
      currentInterestRate: '7.50%',
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.jhifilter?.currentValue !== changes?.jhifilter?.previousValue) {
      this.getUpdatekey();
      this.created();
    }
    if (changes?.saveWordMinio?.currentValue) {
      this.saveWord = true;
    } else {
      this.saveWord = false;
    }
  }

  getUpdatekey(): void {
    if (this.jhifilter === 'Total Exposure > IDR 15 Bio') {
      this.updateKey = 'above';
    } else if (this.jhifilter === 'Total Exposure <= IDR 15 Bio') {
      this.updateKey = 'below';
    } else if (this.jhifilter === 'Total Exposure Back to Back') {
      this.updateKey = 'back-to-back';
    }
  }

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  ngOnInit(): void {
    this.getBucket().then(res => {
      const predicateIdd: Object = {
        key: `/cif/${this.creditProposalItem.cif.partyId}/financial_analysis/`,
      };

      const cpTemplate: Object = {
        key: `/credit_proposal/financial_analysis/${this.creditProposalItem.id}/`,
      };

      this.storageService.getObjects(this.bucket, cpTemplate).subscribe((resIdd: any) => {
        if (resIdd.body.length > 0) {
          this.getFile(resIdd.body[0].url, true);
        } else {
          this.storageService.getObjects(this.bucket, predicateIdd).subscribe((resTemp: any) => {
            if (resTemp.body.length > 0) {
              this.getFile(resTemp.body[0].url, true);
            }
          });
        }
      });
    });

    this.selectedMenu = 'UPLOAD';
  }

  created(): void {
    if (this.paramsId) {
      this.storageService
        .getObjects(this.bucket, {
          key: this.isIdHasData ? `${this.key}/${this.paramsId}/${this.updateKey}` : `${this.key}/${this.updateKey}/`,
        })
        .pipe(retry(2), takeUntil(this.ngUnsubscribe))
        .subscribe((res: any) => {
          if (res.body.length === 1) {
            this.getFile(res.body[0]?.url, true);
            this.isIdHasData = true;
          } else if (res.body.length > 1) {
            this.isIdHasData = true;
            const result: any = this.findByID(res.body, `${this.paramsId}`);
            this.getFile(result.url, true);
          } else {
            if (this.isIdHasData === false && res.body.length === 0) {
              this.isMasterDataExist = false;
              this.spreadsheetObj.open({});
              this.spreadsheetObj.clear({});

              this.spreadsheetDisabledObj.open({});
              this.spreadsheetDisabledObj.clear({});
              return;
            } else {
              this.isIdHasData = false;
              this.created();
              this.isMasterDataExist = true;
            }
          }
        });
    }
  }

  // DONE GET FILE
  getFile(urlFile: string, isNew: boolean): void {
    this.storageService
      .fileBlob(urlFile)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const file = new File([res.body], 'template_repayment_capability.xlsx');
        this.fileBeforeOpen = file;

        const metaData = {
          objectName: null,
        };

        metaData.objectName = `/${this.key}/${this.creditProposalItem.id}/${file.name}`;
        const formData = new FormData();
        formData.append('file', file);

        this.spreadsheetObj?.open({ file });
        this.spreadsheetObj.clear({
          type: 'Clear All',
          range: 'A1:A2',
        });

        this.spreadsheetObj.clear({});

        this.spreadsheetDisabledObj?.open({ file });
        // this.spreadsheetDisabledObj.clear({
        //   type: 'Clear All',
        //   range: 'A1:A2',
        // });

        // this.spreadsheetDisabledObj.clear({});
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  findByID(arr: any[], id: string): object {
    const result = arr.map(a => a.key.split('/').some(w => w === id)).indexOf(true) === -1 ? false : true;
    let obj: object;
    if (result === false) {
      obj = arr.find(o => o.key === 'credit_proposal/repayment_capability/template_repayment_capability');
    }
    return obj;
  }

  data: object[] = [
    {
      Category: 'Household Utilities',
      'Monthly Spend': '=C3/12', // Setting formula through data binding
      'Annual Spend': 3000,
      'Last Year Spend': 3000,
      'Percentage Change': '=C3/D3', // You can set the expression or formula as string
    },
    {
      Category: 'Food',
      'Monthly Spend': '=C4/12',
      'Annual Spend': 2500,
      'Last Year Spend': 2250,
      'Percentage Change': { formula: '=C4/D4' }, // You can also set as object with formula field
    },
    {
      Category: 'Gasoline',
      'Monthly Spend': '=C5/12',
      'Annual Spend': 1500,
      'Last Year Spend': 1200,
      'Percentage Change': { formula: '=C5/D5' },
    },
    {
      Category: 'Clothes',
      'Monthly Spend': '=C6/12',
      'Annual Spend': 1200,
      'Last Year Spend': 1000,
      'Percentage Change': '=C6/D6',
    },
    {
      Category: 'Insurance',
      'Monthly Spend': '=C7/12',
      'Annual Spend': 1500,
      'Last Year Spend': 1500,
      'Percentage Change': '=C7/D7',
    },
    {
      Category: 'Taxes',
      'Monthly Spend': '=C8/12',
      'Annual Spend': 3500,
      'Last Year Spend': 3500,
      'Percentage Change': '=C8/D8',
    },
    {
      Category: 'Entertainment',
      'Monthly Spend': '=C9/12',
      'Annual Spend': 2000,
      'Last Year Spend': 2250,
      'Percentage Change': '=C9/D9',
    },
    {
      Category: 'Vacation',
      'Monthly Spend': '=C10/12',
      'Annual Spend': 1500,
      'Last Year Spend': 2000,
      'Percentage Change': '=C10/D10',
    },
    {
      Category: 'Miscellaneous',
      'Monthly Spend': '=C11/12',
      'Annual Spend': 1250,
      'Last Year Spend': 1558,
      'Percentage Change': '=C11/D11',
    },
  ];

  // Custom function to calculate percentage between two cell values.
  calculatePercentage(firstCell: string, secondCell: string): number {
    return Number(firstCell) / Number(secondCell);
  }

  onclick() {
    const startCell = 5;
    for (let i = 0; i < this.mockData.length; i++) {
      this.spreadsheetObj.updateCell({ value: `Fac-00${this.mockData[i].id}` }, `calculator2!A${startCell + i}`);
      this.spreadsheetObj.updateCell({ value: `${this.mockData[i].facilityType}` }, `calculator2!B${startCell + i}`);
      this.spreadsheetObj.updateCell({ value: `${this.mockData[i].referenceRateType}` }, `calculator2!C${startCell + i}`);
      this.spreadsheetObj.updateCell({ value: `${this.mockData[i].tenor}` }, `calculator2!D${startCell + i}`);
      this.spreadsheetObj.updateCell({ value: `${this.mockData[i].currency}` }, `calculator2!E${startCell + i}`);
      this.spreadsheetObj.updateCell({ value: `${this.mockData[i].collectability}` }, `calculator2!F${startCell + i}`);
      this.spreadsheetObj.updateCell({ value: `${this.mockData[i].collateral}` }, `calculator2!G${startCell + i}`);
      this.spreadsheetObj.updateCell({ value: `${this.mockData[i].typeRating}` }, `calculator2!H${startCell + i}`);
      this.spreadsheetObj.updateCell({ value: `${this.mockData[i].industry}` }, `calculator2!I${startCell + i}`);
      this.spreadsheetObj.updateCell({ value: `${this.mockData[i].currentInterestRate}` }, `calculator2!J${startCell + i}`);
      this.spreadsheetObj.updateCell(
        { formula: `=CONCAT(B${startCell + i},C${startCell + i},D${startCell + i},E${startCell + i})` },
        `calculator2!K${startCell + i}`
      );
      this.spreadsheetObj.updateCell(
        { formula: `=INDEX(ftp!$G$3:$G$8,MATCH(K${startCell + i},ftp!$A$3:$A$8,0))` },
        `calculator2!L${startCell + i}`
      );
    }
    this.spreadsheetObj?.numberFormat('0.00%', '=L5:L10');
    // this.spreadsheetObj?.setRowHeight(30, 1);
  }

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'UPLOAD' }, { text: 'FINANCIAL ANALYSIS' }];
  public menuItemsLainnya: MenuItemModel[] = [{ text: 'UPLOAD' }, { text: 'FINANCIAL ANALYSIS' }];

  selectMenuItem(args: MenuEventArgs): void {
    if (this.creditProposalItem.attributes.proposalType === 'Total Exposure > IDR 15 Bio') {
      this.selectedMenu = args.item.text;
    }
  }
  selectMenuItemLainnya(args: MenuEventArgs): void {
    if (
      this.creditProposalItem.attributes.proposalType === 'Total Exposure <= IDR 15 Bio' ||
      this.creditProposalItem.attributes.proposalType === 'Total Exposure Back to Back'
    ) {
      this.selectedMenu = args.item.text;
    }
  }
}

interface ICalculator {
  id: string;
  facilityType: string;
  referenceRateType: string;
  tenor: string;
  currency: 'IDR' | 'USD';
  collectability: string;
  collateral: string;
  typeRating: string;
  industry: string;
  currentInterestRate: string;
}
