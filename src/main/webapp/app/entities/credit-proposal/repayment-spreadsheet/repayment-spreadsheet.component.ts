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
@Component({
  selector: 'jhi-repayment-spreadsheet',
  templateUrl: './repayment-spreadsheet.component.html',
})
export class RepaymentSpreadsheetComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, AfterContentInit {
  @Input() jhifilter: 'Total Exposure > IDR 15 Bn' | 'Total Exposure Back to Back' | '' = 'Total Exposure > IDR 15 Bn';
  private ngUnsubscribe = new Subject();
  @ViewChild('spreadsheet') public spreadsheetObj: SpreadsheetComponent;

  private bucket = 'hana';
  private key: string = 'credit_proposal/repayment_capability';
  private updateKey: string = '';
  private paramsId: string;
  private isIdHasData: boolean = true;
  private isMasterDataExist: boolean = false;

  private fileBeforeOpen: File = null;

  constructor(private storageService: StorageService, private actRoute: ActivatedRoute) {}

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
    console.log('changes', changes);
    console.log('filter', this.jhifilter);

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

  ngOnInit(): void {
    this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.paramsId = params['id'];
    });
    // this.getUpdatekey();
    this.created();
  }

  beforeOpen(args: BeforeOpenEventArgs): void {
    console.log(args);
    if (args && args.file) {
      const temp = args.file as File;
      if (temp.type !== '') {
        this.fileBeforeOpen = args.file as File;
        // if want to save data to minio when event open data
        this.storeFile();
      } else {
        console.warn('Spreadsheet Load from server');
      }
    }
  }

  storeFile(): void {
    const metaData = {
      objectName: this.isMasterDataExist
        ? `${this.key}/${this.paramsId}/${this.updateKey}/template_repayment_capability`
        : `${this.key}/${this.updateKey}/template_repayment_capability`,
    };
    const formData = new FormData();
    formData.append('file', this.fileBeforeOpen);

    this.storageService.uploadMeta('hana', formData, metaData).subscribe(res => {
      console.log(res);
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
    console.log(this.updateKey);
    if (this.paramsId) {
      this.storageService
        .getObjects(this.bucket, {
          key: this.isIdHasData ? `${this.key}/${this.paramsId}/${this.updateKey}` : `${this.key}/${this.updateKey}/`,
        })
        .pipe(retry(2), takeUntil(this.ngUnsubscribe))
        .subscribe((res: any) => {
          if (res.body.length === 1) {
            this.getFile(res.body[0]?.url);
            this.isIdHasData = true;
          } else if (res.body.length > 1) {
            this.isIdHasData = true;
            const result: any = this.findByID(res.body, `${this.paramsId}`);
            this.getFile(result.url);
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
  getFile(urlFile: string): void {
    this.storageService
      .fileBlob(urlFile)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const file = new File([res.body], 'template_repayment_capability.xlsx');
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
    console.log('dataaa', evt?.data);
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

  ngAfterViewInit(): void {
    console.log('run after view init');
    this.spreadsheetObj.clear({
      type: 'Clear All',
      range: 'A1:A2',
    });

    this.spreadsheetObj.saveAsJson();
  }

  ngAfterContentInit(): void {
    console.log('run after content init');
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
    // this.spreadsheetObj?.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A2:E2');
    // this.spreadsheetObj?.cellFormat({ fontStyle: 'italic', textAlign: 'center' }, 'A1');

    // this.spreadsheetObj?.numberFormat('$#,##0', 'B3:D12');
    // this.spreadsheetObj?.numberFormat('0%', 'E3:E12');

    // Adding custom function for calculating the percentage between two cells.
    // this.spreadsheetObj?.addCustomFunction(this.calculatePercentage, 'PERCENTAGE');
    // Calculate percentage using custom added formula in E12 cell.=VLOOKUP(U8,$Q:$R,2,FALSE)
    // this.spreadsheetObj?.updateCell({ formula: '=PERCENTAGE(C12,D12)' }, 'E12');
    // this.spreadsheetObj?.updateCell({ formula: '=SUM(B3:E3)' }, 'F3');
    // this.spreadsheetObj?.updateCell({ formula: '=U8' }, 'V8');
    // this.spreadsheetObj?.updateCell({ value: '2000' }, 'F12');
    // this.spreadsheetObj?.updateCell({ value: 'DL' }, 'C12');
    // this.spreadsheetObj.updateCell({ value: 'Fac-003' }, 'calculator!A5');

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
      this.spreadsheetObj.updateCell({ formula: `=CONCAT(B${startCell+ i},C${startCell+i},D${startCell+i},E${startCell+i})`, }, `calculator2!K${startCell + i}`);
      this.spreadsheetObj.updateCell({ formula: `=INDEX(ftp!$G$3:$G$8,MATCH(K${startCell+i},ftp!$A$3:$A$8,0))` }, `calculator2!L${startCell + i}`);
    }

    // for (let baris = 0; baris < 6; baris++) {
    //   for(let kol = 0; kol < baris; kol++){
    //     document.write(str);
    //   }
    //   document.write("<br/>")
    // }

    //   const temp = new Spreadsheet({
    //     sheets: [
    //       {
    //         name: 'Monthly Budget',
    //         selectedRange: 'D13',
    //         rows: [
    //           {
    //             cells: [
    //               { value: 'Category', style: { fontWeight: 'bold', textAlign: 'center' } },
    //               { value: 'Planned cost', style: { fontWeight: 'bold', textAlign: 'center' } },
    //               { value: 'Actual cost', style: { fontWeight: 'bold', textAlign: 'center' } },
    //               { value: 'Difference', style: { fontWeight: 'bold', textAlign: 'center' } },
    //             ],
    //           },
    //           {
    //             cells: [{ value: 'Food' }, { value: '$7000' }, { value: '$8120' }, { formula: '=B2-C2', format: '$#,##0.00' }],
    //           },
    //           {
    //             cells: [{ value: 'Loan' }, { value: '$1500' }, { value: '$1500' }, { formula: '=B3-C3', format: '$#,##0.00' }],
    //           },
    //           {
    //             cells: [{ value: 'Medical' }, { value: '$300' }, { value: '$0' }, { formula: '=B4-C4', format: '$#,##0.00' }],
    //           },
    //           {
    //             index: 5,
    //             cells: [
    //               { index: 2, value: 'Total Difference:', style: { fontWeight: 'bold', textAlign: 'right' } },
    //               { formula: '=D2+D4', format: '$#,##0.00', style: { fontWeight: 'bold' } },
    //             ],
    //           },
    //         ],
    //         columns: [{ width: 110 }, { width: 115 }, { width: 110 }, { width: 100 }],
    //       },
    //     ],
    //   });

    //  console.log(temp)

    // this.spreadsheetObj.updateCell(
    //   {
    //     value: 'Imal Zaya harahap',
    //   },
    //   'C12'
    // );

    // this.spreadsheetObj?.setRowHeight(30, 1);
  }

  // created() {
  //   console.log('running');
  // }
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
