/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, AfterContentInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  BeforeOpenEventArgs,
  BeforeSaveEventArgs,
  CellRenderEventArgs,
  DataSourceChangedEventArgs,
  Spreadsheet,
  SpreadsheetComponent,
} from '@syncfusion/ej2-angular-spreadsheet';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject } from 'rxjs';
import { retry, takeUntil } from 'rxjs/operators';

import { MessageService } from 'primeng/api';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
@Component({
  selector: 'jhi-repayment-spreadsheet',
  templateUrl: './repayment-spreadsheet.component.html',
})
export class RepaymentSpreadsheetComponent implements OnInit, OnDestroy, OnChanges {
  @Input() jhifilter: 'Total Exposure > IDR 15 Bn' | 'Total Exposure Back to Back' | '' = 'Total Exposure > IDR 15 Bn';
  private ngUnsubscribe = new Subject();
  @ViewChild('spreadsheet') public spreadsheetObj: SpreadsheetComponent;

  private bucket = 'hana';
  // private key: string = 'credit_proposal/repayment_capability';
  private key: string = 'credit_proposal/financial_analysis';
  private updateKey: string = '';
  private paramsId: string;
  private isIdHasData: boolean = true;
  private isMasterDataExist: boolean = false;

  private fileBeforeOpen: File = null;

  private messageService: MessageService;
  // public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;

  constructor(private storageService: StorageService, private actRoute: ActivatedRoute) { }

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
  }

  getUpdatekey(): void {
    if (this.jhifilter === '' || this.jhifilter === 'Total Exposure > IDR 15 Bn') {
      this.updateKey = 'above';
    } else if (this.jhifilter === 'Total Exposure Back to Back') {
      this.updateKey = 'back-to-back';
    }
    console.log(this.updateKey);
  }

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }
  ngOnInit(): void {
    console.log('INI DATA partyId', this.creditProposalItem.cif.partyId);
    console.log('INI DATA cpId', this.creditProposalItem.id);

    const predicateIdd: Object = {
      key: `/cif/${this.creditProposalItem.cif.partyId}/financial_analysis/`,
    };
    const predicateTemplate: Object = {
      key: `/template/financial_analysis/${this.updateKey}/`,
    };

    const cpTemplate: Object = {
      key: `/credit_proposal/financial_analysis/${this.creditProposalItem.id}/`,
    };

    this.storageService.getObjects(this.bucket, cpTemplate).subscribe((resCp: any) => {

      if (resCp.body.length > 0) {
        this.getFile(resCp.body[0].url, false);
      } else {
        this.storageService.getObjects(this.bucket, predicateIdd).subscribe((resIdd: any) => {

          if (resIdd.body.length > 0) {
            this.getFile(resIdd.body[0].url, true);
          } else {
            this.storageService.getObjects(this.bucket, predicateTemplate).subscribe((resTemp: any) => {

              if (resTemp.body.length > 0) {
                this.getFile(resTemp.body[0].url, true);
                // this.storeFile();
              }
            });
          }
        });
      }
    });
    this.selectedMenu = 'UPLOAD';
  }

  // SUCCESS SAVE DATA FROM OPEN FILE
  beforeOpen(args: BeforeOpenEventArgs): void {
    console.log('ww', args);
    if (args && args.file) {
      const temp = args.file as File;
      if (temp.type !== '') {
        this.fileBeforeOpen = args.file as File;
        // if want to save data to minio when event open data

        const metaData = {
          objectName: null,
        };

        metaData.objectName = `${this.key}/${this.creditProposalItem.id}/template_repayment_capability.xlsx`;
        const formData = new FormData();
        formData.append('file', this.fileBeforeOpen);

        // this.accountService.identity().subscribe(resAccount => {
        //   metaData.createdBy = resAccount.login;

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(res => {

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
        });
      } else {
        console.warn('Spreadsheet Load from server');
      }
    }
  }

  // AFTER
  // beforeOpen(args: BeforeOpenEventArgs): void {
  //   console.log(args);
  //   if (args && args.file) {
  //     const temp = args.file as File;
  //     if (temp.type !== '') {
  //       this.fileBeforeOpen = args.file as File;
  //       // if want to save data to minio when event open data
  //       const metaData = {
  //         objectName: null,
  //       };
  //       metaData.objectName = `/credit_proposal/financial_analysis/${this._creditProposalItem.id}/template_repayment_capability.xlsx`;
  //       const formData = new FormData();
  //       formData.append('file', this.fileBeforeOpen);
  //       // this.storeFile();
  //       console.log("Ini Init eforeOpen", this.storeFile());

  //     } else {
  //       console.warn('Spreadsheet Load from server');
  //     }
  //   }
  // }

  // SUCCESS CLONE DATA FILE IN BUCKET hana/credit_proposal/financial_analysis/id/template_repayment_capability.xlsx
  storeFile(): void {
    const metaData = {
      objectName: `${this.key}/${this.creditProposalItem.id}/template_repayment_capability.xlsx`,
    };
    const formData = new FormData();
    formData.append('file', this.fileBeforeOpen);

    this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(res => {

    });
  }

  beforeSave(args: BeforeSaveEventArgs): void {
    // args.fileName = 'template_repayment_capability';
    // args.saveType = 'Xlsx';
    // args.needBlobData = true;
    console.log(args);
    // if want to save data to minio when event save
    // this.storeFile();

  }

  created(): void {
    console.log('cek', this.updateKey);
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
              console.warn('Master data empty, please insert master data');
              this.isMasterDataExist = false;
              this.spreadsheetObj.open({});
              this.spreadsheetObj.clear({});
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

  // GET FILE AFTER
  // getFile(urlFile: string): void {
  //   this.storageService
  //     .fileBlob(urlFile)
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(res => {
  //       const file = new File([res.body], 'template_repayment_capability.xlsx');
  //       this.spreadsheetObj.open({ file });
  //       this.spreadsheetObj.clear({
  //         type: 'Clear All',
  //         range: 'A1:A2',
  //       });

  //       this.spreadsheetObj.clear({});
  //     });
  // }

  // DONE GET FILE
  getFile(urlFile: string, isNew: boolean): void {
    this.storageService
      .fileBlob(urlFile)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        console.log('cek1');
        const file = new File([res.body], 'template_repayment_capability.xlsx');
        this.fileBeforeOpen = file;

        const metaData = {
          objectName: null,
        };

        metaData.objectName = `/${this.key}/${this.creditProposalItem.id}/${file.name}`;
        const formData = new FormData();
        formData.append('file', file);

        if (isNew === true) {
          this.storeFile();
        }

        this.spreadsheetObj.open({ file });
        this.spreadsheetObj.clear({
          type: 'Clear All',
          range: 'A1:A2',
        });

        this.spreadsheetObj.clear({});
      });
  }

  dataSourceChange(evt: DataSourceChangedEventArgs): void {
    console.log(evt);

  }

  beforeCellRender(args: CellRenderEventArgs): void {
    console.log(args);
    // if (this.spreadsheetObj.sheets.length > 1) {
    //   const data = this.spreadsheetObj.sheets.map((item: any) =>
    //     item.properties.name === 'Dashboard'
    //       ? { ...item, properties: { ...item.properties, state: 'Visible' } }
    //       : { ...item, properties: { ...item.properties, state: 'Hidden' } }
    //   );
    //   this.spreadsheetObj.sheets = data;
    // }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  findByID(arr: any[], id: string): object {
    console.log('ini arr');
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
    const startCell: number = 5;
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
  public menuItems: MenuItemModel[] = [{ text: 'UPLOAD' }, { text: 'RETRIVE' }];
  selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
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
