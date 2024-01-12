import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Double } from '@syncfusion/ej2-angular-charts';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { PositionService } from '../../position/position.service';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import { ICustomer, TabCustomerProfitability } from './tab-customert-profitability.model';
import { CurrencyMaskConfig } from 'ngx-currency';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { StorageService } from 'app/entities/storage/storage.service';
import { takeUntil, Subject, from, forkJoin, tap, map, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessActivityService } from '../busines-activity/business-activity.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-credit-proposal-tab-customer-profitability',
  templateUrl: './credit-proposal-tab-customer-profitability.component.html',
  styleUrls: ['./credit-proposal-tab-customer-profitability.scss'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalTabCustomerProfitabilityComponent implements OnInit, OnChanges, OnDestroy {
  private _item: ICreditProposal;

  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  attributes: any;
  // public _item: ICreditProposal;
  dataAttr: Object[];
  dataSave: any[];
  constructor(
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private storageService: StorageService, // protected parseLinks: ParseLinks, // protected accoutService: AccountService, // protected activateRoute: ActivatedRoute, // protected dataUtils: BaseDataUtils, // protected router: Router, // protected eventManager: EventManager, // protected messageService: MessageService, // protected confirmationService: ConfirmationService
    private baService: BusinessActivityService,
    protected messageService: MessageService
  ) {
    this.bucket = '';
  }

  public creditProposaldata: ICreditProposal = new CreditProposal();

  public loan = 0;
  public loanProvision = 0;
  public totalLoanProvision: number;
  public casa = 0;
  public insurancePremium = 0;
  public totalDepositInsurancePremium: number;
  public other = 0;
  public provision = 0;
  public avarage = 0;
  public profit: number;
  public roa: number;
  public value: string;
  public parameter: string;
  // public remarks: string;
  public remarks1?: any = [];

  public customHeadersJWT: any;

  public dataAttrPass = [
    {
      No: 1,
      Parameter: 'Bank Acivity',
      value: 'No',
      remarks1: '',
    },
    {
      No: 2,
      Parameter: 'Time Deposit',
      value: 'No',
      remarks1: '',
    },
    {
      No: 3,
      Parameter: 'Casa',
      value: 'No',
      remarks1: '',
    },
    {
      No: 4,
      Parameter: 'Trade Finance',
      value: 'No',
      remarks1: '',
    },
    {
      No: 5,
      Parameter: 'payroll',
      value: 'No',
      remarks1: '',
    },
    {
      No: 6,
      Parameter: 'forex',
      value: 'No',
      remarks1: '',
    },
    {
      No: 7,
      Parameter: 'Personal Loan',
      value: 'No',
      remarks1: '',
    },
  ];

  public onSelect(value: string, data: any): void {
    this.dataAttrPass[data.No - 1].value = value;
    this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability = this.dataAttrPass;
  }

  public dialogVisible: boolean;
  public width?: string;
  public height?: string;
  public animationSettings?: Object;
  public closeOnEscape?: boolean;
  Dialog: any;

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  onselectValue() {}

  onKeyUpEvent() {
    for (let h = 0; h < this.dataAttrPass.length; h++) {
      this.dataAttrPass[h].remarks1 = this.remarks1[h];
    }

    this.item.attributes['tabCustomer'].remarks1 = this.dataAttrPass;
  }
  @Input() saveWordMinio: any;
  @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  public totalLoan() {
    let result: number;
    result = 0;
    result = Number(this.item.attributes['tabCustomer'].loan) + Number(this.item.attributes['tabCustomer'].loanProvision);
    this.item.attributes['tabCustomer'].totalLoanProvision = result;
    return result;
  }

  public totalLoanDeposit() {
    let result: number;
    result = 0;
    result = Number(this.item.attributes['tabCustomer'].casa) + Number(this.item.attributes['tabCustomer'].insurancePremium);
    this.item.attributes['tabCustomer'].totalDepositInsurancePremium = result;
    return result;
  }

  public totalProfit() {
    let result: number;
    result = 0;
    result =
      Number(this.item.attributes['tabCustomer']['loan']) +
      Number(this.item.attributes['tabCustomer']['casa']) +
      Number(this.item.attributes['tabCustomer']['loanProvision']) +
      Number(this.item.attributes['tabCustomer']['insurancePremium']);
    this.item.attributes['tabCustomer'].profit = result;
    return result;
  }

  public totalRoa() {
    let result: number;
    result = 0;
    result = (Number(this.item.attributes['tabCustomer'].profit) / Number(this.item.attributes['tabCustomer'].avarage)) * 100;
    this.item.attributes['tabCustomer'].roa = result.toFixed(2);
    return result.toFixed(2);
  }

  public btnSave($event: any): void {
    this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability = [
      ...this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability,

      {
        loan: this.loan,
        loanProvision: this.loanProvision,
        totalLoanProvision: this.totalLoanProvision,
        casa: this.casa,
        insurancePremium: this.insurancePremium,
        totalDepositInsurancePremium: this.totalDepositInsurancePremium,
        other: this.other,
        provision: this.provision,
        avarage: this.avarage,
        profit: this.profit,
        Parameter: this.parameter,
        // remarks: this.remarks,
        remak: this.remarks1,
      },
    ];
  }

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  ngOnInit(): void {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/customer-prafitability/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });

    this.item.attributes['tabCustomer'].totalLoanProvision = this.totalLoan();
    this.item.attributes['tabCustomer'].totalDepositInsurancePremium = this.totalLoanDeposit();
    this.item.attributes['tabCustomer'].profit = this.totalProfit();
    this.item.attributes['tabCustomer'].roa = this.totalRoa();

    if (this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability.length === 0) {
      this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability = this.dataAttrPass;
    } else {
      for (let i = 0; i < this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability.length; i++) {
        this.dataAttrPass = this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability;
        this.remarks1[i] = this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability[i].remarks1;
      }
    }
    // if (this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability.length !== 0) {
    //   for (let i = 0; i < this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability.length; i++) {
    //     this.dataAttrPass = this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability;
    //     this.remarks1[i] = this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability[i].remarks1;
    //   }
    // }
    // this.getContainer();
    this.width = '50%';
    this.height = '80%';
  }

  private getToken(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.saveWordMinio) {
      this.triggeredSave();
    }
  }
  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      args.isHandled = true;
      console.log('ini paste');
    }
  }

  onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }

  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  // public triggeredSave(): void {
  //   let paramsId = '';
  //   this.activatedRoute.params.subscribe(params => {
  //     paramsId = params['id'];
  //   });
  //   const key = 'credit_proposal/remark/customer-prafitability';

  //   const timeStamp = Math.floor(Date.now() / 1000);

  //   const docEditor = this.container?.documentEditor as DocumentEditorComponent;

  //   docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
  //     const fileType = 'word';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-customer-prafitability' + fileType + '.docs';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
  //   });

  //   docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
  //     const fileType = 'sfdt';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-customer-prafitability' + fileType + '.sfdt';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
  //   });
  // }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    this.baService.setLoading(true);
    const key = 'credit_proposal/remark/customer-prafitability';
    const docEditor = this.container?.documentEditor as DocumentEditorComponent;
    const saveDocx$ = from(docEditor.saveAsBlob('Docx'));
    const saveSfdt$ = from(docEditor.saveAsBlob('Sfdt'));

    forkJoin([saveDocx$, saveSfdt$])
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.baService.setLoading(true)),
        map(([docx, sfdt]) => {
          this.baService.setLoading(true);
          const fileTypeWord = 'word';
          const fileName = 'credit-proposal-remark-' + paramsId + '-customer-prafitability' + fileTypeWord + '.docs';
          const metaData = {
            objectName: `${key}/${paramsId}/${fileTypeWord}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([docx], fileName));

          // Validate file size must be larger than 20mb
          if (docx.size > 50000000) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'File size must be less than 50mb',
            });
            this.baService.setLoading(false);
            return;
          }

          this.storageService
            .uploadMeta(this.bucket, formData, metaData)
            .pipe(
              switchMap(() => {
                const fileTypeSfdt = 'sfdt';
                const fileNames = 'credit-proposal-remark-' + paramsId + '-customer-prafitability' + fileTypeSfdt + '.sfdt';
                const metaDatas = {
                  objectName: `${key}/${paramsId}/${fileTypeSfdt}/${fileNames}`,
                };
                const formDatas = new FormData();
                formDatas.append('file', new File([sfdt], fileNames));

                return this.storageService.uploadMeta(this.bucket, formDatas, metaDatas);
              })
            )
            .subscribe({
              next(res) {
                console.log('Next Success uploading files', res);
              },
              complete: () => {
                console.log('complete');
                this.baService.setLoading(false);
              },
              error: err => {
                console.log('error', err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Something went wrong while uploading the document. Please try again.',
                });
                this.baService.setLoading(false);
              },
            });
        })
      )
      .subscribe();
  }

  private getContainer(): void {
    // let paramsId = '';
    // this.activatedRoute.params.subscribe(params => {
    //   paramsId = params['id'];
    // });
    // const obj = {
    //   key: 'credit_proposal/remark/customer-prafitability/' + paramsId + '/sfdt',
    // };
    this.baService.isUpload$.next(false);
    this.baService.setLoading(true);

    const obj = {
      key: this.getKey,
    };

    this.storageService
      .getObjects(this.bucket, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        console.log('test', obj);
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-customer-prafitability-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                const contents: string = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
              this.baService.setLoading(false);
            });
        } else {
          this.baService.setLoading(false);
        }
      });
  }
  // public klik() {
  //   this.triggeredSave();
  // }
}
