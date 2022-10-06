/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { Subject } from 'rxjs';
import { retry, takeUntil } from 'rxjs/operators';
import { BeforeOpenEventArgs, BeforeSaveEventArgs, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { StorageService } from 'app/entities/storage/storage.service';
import { ActivatedRoute } from '@angular/router';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'jhi-credit-proposal-propose-pricing',
  templateUrl: './credit-proposal-propose-pricing.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalProposePricingComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownlistdata')
  public dropDownListObject: DropDownListComponent;
  private _creditProposal: ICreditProposal;
  public selectedMenu: string;
  public availabelLimitArray = [];
  public OSArray = [];
  public plafontArray = [];
  public countOS: number;
  public availableLimit: number;
  public totalPlafon: number;
  public industry: string;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public industryList: object = [
    'Agriculture (Farm Food Crops)',
    'Construction',
    'Consumer - Household',
    'Education Services',
    'Fishery',
    'Health Services',
    'Hotel',
    'IT Services',
    'Livestock',
    'Logistic - Port Handling, Warehousing & Packaging Handling',
    'Manufacturing - Apparel',
    'Manufacturing - Automotive',
    'Manufacturing - Basic Metals',
    'Manufacturing - Chemical Product (Incl. Pharmaceutical)',
    'Manufacturing - F&B',
    'Manufacturing - Furniture',
    'Manufacturing - Leather Footwear',
    'Manufacturing - Machinery & Electronic',
    'Manufacturing - Metal Products',
    'Manufacturing - Non Metallic Quarrying',
    'Manufacturing - Other Transport',
    'Manufacturing - Plastic & Plastics Products',
    'Manufacturing - Publishing & Printing',
    'Manufacturing - Pulp & Paper',
    'Manufacturing - Rubber & Rubber Products',
    'Manufacturing - Textile',
    'Manufacturing - Wood & Rattan Products',
    'Mining & Quarrying Metal Ores',
    'Mining & Quarrying-Coal, Rock, Clay, Sand, Oil & Gas',
    'Non Bank FI - BPR',
    'Non Bank FI - Multifinance',
    'Non Bank FI - Other (Securities, Venture Capital & Insurance)',
    'Other Services - Renting, Consultancy, Advertising, Cleaning, Etc.',
    'Real Estate - Industrial',
    'Real Estate - Office',
    'Real Estate - Residential',
    'Real Estate - Retail',
    'Restaurant',
    'Telecommunication',
    'Tourism',
    'Trading',
    'Transportation - Land And Water',
    'Transportation - Railway And Aviation',
    'Utility And Power Plant',
  ];

  /**
   * Propose Pricing
   */
  private ngUnsubscribe = new Subject();
  @ViewChild('spreadsheet') public spreadsheetObj: SpreadsheetComponent;

  private bucket = 'hana';
  private key: string = 'credit_proposal/propose_pricing';
  private updateKey: string = '';
  private paramsId: string;
  private isIdHasData: boolean = true;
  private isMasterDataExist: boolean = false;
  private fileBeforeOpen: File = null;

  constructor(private storageService: StorageService, private actRoute: ActivatedRoute) {
    this.countOS = 0;
    this.availableLimit = 0;
    this.totalPlafon = 0;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;

    this.setValue(creditProposal);
  }

  setValue(creditProposal: any) {
    for (let i = 0; i < creditProposal.products.length; i++) {
      if (creditProposal.products[i].attributes.availableLimit !== undefined) {
        this.availabelLimitArray.push(creditProposal.products[i].attributes.availableLimit);
      } else {
        this.availabelLimitArray = [];
      }

      if (creditProposal.products[i].attributes.os !== undefined) {
        this.OSArray.push(creditProposal.products[i].attributes.os);
      } else {
        this.OSArray = [];
      }

      if (creditProposal.products[i].attributes.totalPlafond !== undefined) {
        this.plafontArray.push(creditProposal.products[i].attributes.totalPlafond);
      } else {
        this.plafontArray = [];
      }
    }

    this.availableLimit = this.availabelLimitArray.reduce((a, b) => Number(a) + Number(b));
    this.countOS = this.OSArray.reduce((a, b) => Number(a) + Number(b));
    this.totalPlafon = this.plafontArray.reduce((a, b) => Number(a) + Number(b));
  }

  public menuItems: MenuItemModel[] = [{ text: 'CALCULATOR' }, { text: 'DASHBOARD' }];

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
    if (this.selectedMenu === 'DASHBOARD') {
      this.getUpdatekey();
      this.created();
    }
  }

  ngOnInit(): void {
    this.selectedMenu = 'CALCULATOR';
    this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.paramsId = params['id'];
    });

    if (this.creditProposal.products.length > 1) {
      this.setValue(this.creditProposal);
    }

    console.log('Cobaa', this.creditProposal.lastModifiedDate);
  }

  getUpdatekey(): void {
    if (this.selectedMenu === 'DASHBOARD') {
      this.updateKey = 'dashboard';
    }
    console.log(this.updateKey);
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

  beforeSave(args: BeforeSaveEventArgs): void {
    // args.fileName = 'template_repayment_capability';
    // args.saveType = 'Xlsx';
    // args.needBlobData = true;
    console.log(args);
    // if want to save data to minio when event save
    // this.storeFile();
  }

  storeFile(): void {
    const metaData = {
      objectName: this.isMasterDataExist
        ? `${this.key}/${this.paramsId}/${this.updateKey}/template_propose_pricing`
        : `${this.key}/${this.updateKey}/template_propose_pricing`,
    };

    const formData = new FormData();
    formData.append('file', this.fileBeforeOpen);

    this.storageService.uploadMeta('hana', formData, metaData).subscribe(res => {
      console.log(res);
    });
  }

  created(): void {
    console.log(this.updateKey);
    if (this.paramsId) {
      this.storageService
        .getObjects(this.bucket, {
          key: this.isIdHasData ? `${this.key}/${this.paramsId}/${this.updateKey}` : `${this.key}/${this.updateKey}`,
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
      });
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
}
