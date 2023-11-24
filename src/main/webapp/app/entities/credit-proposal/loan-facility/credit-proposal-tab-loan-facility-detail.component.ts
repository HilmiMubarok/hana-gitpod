import { Component, Input, Output, EventEmitter, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ApplicationProduct, ApplicationProductAttribute, IApplicationProduct } from '../../application-product/application-product.model';
import { ICreditProposal } from '../credit-proposal.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail',
  templateUrl: './credit-proposal-tab-loan-facility-detail.component.html',
  styleUrls: ['./grid/loan.scss', './credit-proposal-tab-loan-facility-detail.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalTabLoanFacilityDetailComponent implements OnChanges, OnInit {
  public _creditProposal: ICreditProposal;
  public rateAmountTypeList = ['Rate Percentage', 'Amount IDR', 'Amount USD'];
  public dataFilter = [];

  @Input() isViewLoan: Boolean = false;
  @Input() takeOutCompare: Boolean = false;

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  @ViewChild('document_editor_container_view_false')
  public container_view_false: DocumentEditorContainerComponent;

  @ViewChild('document_editor_container_loan_analys')
  public container_loan_analys: DocumentEditorContainerComponent;

  @ViewChild('document_editor_container_view_false_loan_analys')
  public container_view_false_loan_analys: DocumentEditorContainerComponent;

  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private ngUnsubscribe = new Subject();
  private BUCKET: string;
  private paramsIdGet: string;
  private fileGet: File;
  public resourceUrl: string;

  @Input() saveWord: any;

  @Input() parentSource: String = '';

  @Input() parentSourceSub: String = '';

  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public applicationProduct: IApplicationProduct;
  public totalInitialLimit?: number;
  public totalChanges?: number;
  public totalAvailableLimit?: number;
  public totalOS?: number;
  public totalCreditLimit?: number;
  public init = 0;
  public init2 = 0;
  public change = 0;
  public os = 0;
  public credit = 0;
  public available = 0;
  public totallimt = 0;
  public totalos = 0;
  public totalchange = 0;
  public totalcredit = 0;
  public totalavilable = 0;
  public change2 = 0;
  public newMessage: string;
  public ccy: string;

  public customHeadersJWT: any;

  @Output() outCreditProposal = new EventEmitter<ICreditProposal>();

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;
    this.outCreditProposal.emit(this._creditProposal);
  }

  constructor(
    protected actRoute: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private applicationConfigService: ApplicationConfigService
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();
  }

  onDocumentChange() {
    if (this.parentSource === '') {
      this.container_view_false.restrictEditing = true;
    } else if (this.parentSource === 'loan-analys' || this.parentSource === 'credit-agreement') {
      this.container_view_false_loan_analys.restrictEditing = true;
    }
  }

  remarkDisable() {
    if (this.parentSource === 'dar-revision-checker') {
      this.container_view_false.restrictEditing = true;
    }
  }

  ngOnInit(): void {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
    if (this.parentSourceSub === 'from-click-menu') {
      if (this.router.url.split('/')[1] === 'cp-status-approval') {
        this.parentSource = 'loan-analys';
      }
    }
    this.getWord();

    this.removeTagRemaks();
    // this.setCurrency();
  }

  public remarkStatus() {
    const queryParam = new URLSearchParams(this.router.url.split('?')[1]);
    const subroutes = queryParam.get('subroute');
    if (this.parentSource === 'credit-agreement' || this.parentSource === 'darRevision' || this.parentSource === 'dar-revision-checker') {
      if (subroutes === 'loan-facility') {
        return true;
      }
      return false;
    }
    return false;
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
    if (this.saveWord === true) {
      this.triggeredSave();
    }
    if (changes['creditProposal']) {
      this.fungsiSuminit('IDR');
      this.fungsiSuminit('USD');
      this.fungsiSuminit('both');
      this.fungsiSumchange('IDR');
      this.fungsiSumchange('USD');
      this.fungsiSumchange('both');
      this.fungsiSumOS('IDR');
      this.fungsiSumOS('USD');
      this.fungsiSumOS('both');
      this.fungsiSumcredit('IDR');
      this.fungsiSumcredit('USD');
      this.fungsiSumcredit('both');
      this.fungsiSumavailable();
      this.fungsiSuminitCalculation(changes.creditProposal.currentValue);
      this.fungsiSumchangeCalculation(changes.creditProposal.currentValue);
      this.fungsiSumOSCalculation(changes.creditProposal.currentValue);
      this.fungsiSumcreditCalculation(changes.creditProposal.currentValue);
    }
  }

  public fungsiSuminitCalculation(creditProposal: ICreditProposal) {
    let result: number;
    let dolar: number;
    let hasil: number;
    result = 0;
    dolar = 0;

    const dataFilter = creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.initialLimit !== undefined) {
            result = result + Number(filterIdr[i].attributes.initialLimit);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.initialLimit !== undefined) {
            dolar = dolar + Number(filterUsd[i].attributes.initialLimit) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }

    this.creditProposal.attributes['calculationExposure'].initialLimitDebtor = result + dolar;
  }

  public fungsiSumchangeCalculation(creditProposal: ICreditProposal) {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.changes !== undefined) {
            result = result + Number(filterIdr[i].attributes.changes);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.changes !== undefined) {
            dolar = dolar + Number(filterUsd[i].attributes.changes) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }

    this.creditProposal.attributes['calculationExposure'].totalChangeDebtor = result + dolar;
  }

  public fungsiSumOSCalculation(creditProposal: ICreditProposal) {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.outstanding !== undefined) {
            result = result + Number(filterIdr[i].attributes.outstanding);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.outstanding !== undefined) {
            dolar = dolar + Number(filterUsd[i].attributes.outstanding) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }

    this.creditProposal.attributes['calculationExposure'].subTotalDebtor = result + dolar;
  }

  public fungsiSumcreditCalculation(creditProposal: ICreditProposal) {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.totalPlafond !== undefined) {
            result = result + Number(filterIdr[i].attributes.totalPlafond);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.totalPlafond !== undefined) {
            dolar = dolar + Number(filterUsd[i].attributes.totalPlafond) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }
    this.creditProposal.attributes['calculationExposure'].totalPLafondDebtor = result + dolar;
  }

  // WORD
  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();
    });
  }

  private getContainer(): void {
    let paramsId = '';
    this.actRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/loan-facility/' + paramsId + '/sfdt',
    };

    this.storageService
      .getObjects(this.BUCKET, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-loan-facility-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                let docEditor: any;

                if (
                  this.parentSource === '' ||
                  this.parentSource === 'credit-proposal' ||
                  this.parentSource === 'darRevision' ||
                  this.parentSource === 'dar-revision-checker'
                ) {
                  docEditor = this.container_view_false?.documentEditor as DocumentEditorComponent;
                } else if (this.parentSource === 'loan-analys') {
                  docEditor = this.container_view_false_loan_analys?.documentEditor as DocumentEditorComponent;
                }

                const contents: string = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
            });
        }
      });
  }

  onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    // this.container_view_false.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    // this.container_view_false_loan_analys.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container_view_false.serviceUrl = '/services/los/api/wordeditor/';
    this.container_view_false_loan_analys.serviceUrl = '/services/los/api/wordeditor/';
  }

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  public triggeredSave(): void {
    // if (this.parentSource === '' || this.parentSource === 'loan-analys') {
    let paramsId = '';
    this.actRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/loan-facility';

    const timeStamp = Math.floor(Date.now() / 1000);

    let docEditor: any;

    if (this.parentSource === '' || this.parentSource === 'credit-proposal' || this.parentSource === 'darRevision') {
      docEditor = this.container_view_false?.documentEditor as DocumentEditorComponent;
    } else if (this.parentSource === 'loan-analys') {
      docEditor = this.container_view_false_loan_analys?.documentEditor as DocumentEditorComponent;
    }

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'credit-proposal-remark-' + paramsId + '-loan-facility-' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'credit-proposal-remark-' + paramsId + '-loan-facility-' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
    });
    // }
  }

  public tools: object = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
  };

  fungsiSuminit(value: string) {
    let result: number;
    let dolar: number;
    let hasil: number;
    let filterUsd = [];
    let filterIdr = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (value === 'USD' || value === 'both') {
        filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      }

      if (value === 'IDR' || value === 'both') {
        filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
      }

      if (value === 'IDR' || value === 'both') {
        if (filterIdr.length > 0) {
          for (let i = 0; i < filterIdr.length; i++) {
            if (filterIdr[i].initialLimit !== null) {
              result = result + Number(filterIdr[i].initialLimit);
            }
          }
        }
      }

      if (value === 'USD') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].initialLimit !== undefined) {
              dolar = dolar + Number(filterUsd[i].initialLimit);
            }
          }
        }
      }

      if (value === 'both') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].initialLimit !== undefined) {
              dolar = dolar + Number(filterUsd[i].initialLimit) * Number(filterUsd[i].kurs);
            }
          }
        }
      }
    }
    if (value === 'both') {
      this.creditProposal.attributes['facilityDetail'].totalInitialLimit = result + dolar;
    }
    if (value === 'USD') {
      this.creditProposal.attributes['facilityDetail'].totalInitialLimitUsd = result + dolar;
    }
    if (value === 'IDR') {
      this.creditProposal.attributes['facilityDetail'].totalInitialLimitIdr = result + dolar;
    }
    return result + dolar;
  }

  fungsiSumchange(value: string) {
    let result: number;
    let dolar: number;
    let filterUsd = [];
    let filterIdr = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (value === 'USD' || value === 'both') {
        filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      }

      if (value === 'IDR' || value === 'both') {
        filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
      }

      if (value === 'IDR' || value === 'both') {
        if (filterIdr.length > 0) {
          for (let i = 0; i < filterIdr.length; i++) {
            if (filterIdr[i].changes !== null) {
              result = result + Number(filterIdr[i].changes);
            }
          }
        }
      }

      if (value === 'USD') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].changes !== null) {
              dolar = dolar + Number(filterUsd[i].changes);
            }
          }
        }
      }

      if (value === 'both') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].changes !== null) {
              dolar = dolar + Number(filterUsd[i].changes) * Number(filterUsd[i].kurs);
            }
          }
        }
      }
    }
    if (value === 'both') {
      this.creditProposal.attributes['facilityDetail'].totalChanges = result + dolar;
    }
    if (value === 'USD') {
      this.creditProposal.attributes['facilityDetail'].totalChangesUsd = result + dolar;
    }
    if (value === 'IDR') {
      this.creditProposal.attributes['facilityDetail'].totalChangesIdr = result + dolar;
    }
    return result + dolar;
  }

  public fungsiSumOS(value: string) {
    let result: number;
    let dolar: number;
    let filterIdr = [];
    let filterUsd = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (value === 'USD' || value === 'both') {
        filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      }

      if (value === 'IDR' || value === 'both') {
        filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
      }

      if (value === 'IDR' || value === 'both') {
        if (filterIdr.length > 0) {
          for (let i = 0; i < filterIdr.length; i++) {
            if (filterIdr[i].outstanding !== null) {
              result = result + Number(filterIdr[i].outstanding);
            }
          }
        }
      }

      if (value === 'USD') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].outstanding !== null) {
              dolar = dolar + Number(filterUsd[i].outstanding);
            }
          }
        }
      }

      if (value === 'both') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].outstanding !== null) {
              dolar = dolar + Number(filterUsd[i].outstanding) * Number(filterUsd[i].kurs);
            }
          }
        }
      }
    }
    if (value === 'both') {
      this.creditProposal.attributes['facilityDetail'].totalOs = result + dolar;
    }
    if (value === 'USD') {
      this.creditProposal.attributes['facilityDetail'].totalOsUsd = result + dolar;
    }
    if (value === 'IDR') {
      this.creditProposal.attributes['facilityDetail'].totalOsIdr = result + dolar;
    }
    return result + dolar;
  }

  fungsiSumavailable() {
    let result: number;
    result = 0;

    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].availableLimit !== null) {
          result = result + Number(this._creditProposal.products[i].availableLimit);
        }
      }
    }
    return result;
  }

  fungsiSumcredit(value: string) {
    let result: number;
    let dolar: number;
    let filterIdr = [];
    let filterUsd = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (value === 'USD' || value === 'both') {
        filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      }

      if (value === 'IDR' || value === 'both') {
        filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
      }

      if (value === 'IDR' || value === 'both') {
        if (filterIdr.length > 0) {
          for (let i = 0; i < filterIdr.length; i++) {
            if (filterIdr[i].totalPlafond !== undefined) {
              result = result + Number(filterIdr[i].totalPlafond);
            }
          }
        }
      }

      if (value === 'USD') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].totalPlafond !== undefined) {
              dolar = dolar + Number(filterUsd[i].totalPlafond);
            }
          }
        }
      }

      if (value === 'both') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].totalPlafond !== undefined) {
              dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
            }
          }
        }
      }
    }
    if (value === 'both') {
      this.creditProposal.attributes['facilityDetail'].totalPlafond = result + dolar;
    }
    if (value === 'USD') {
      this.creditProposal.attributes['facilityDetail'].totalPlafondUsd = result + dolar;
    }
    if (value === 'IDR') {
      this.creditProposal.attributes['facilityDetail'].totalPlafondIdr = result + dolar;
    }
    return result + dolar;
  }

  // matrix reove tag
  removeTagRemaks() {
    this.newMessage = this.creditProposal.attributes['collateralChecklist'].remarks;
    this.newMessage = this.newMessage.replace(/<(.|\n)*?>/g, '');
  }

  // setCurrency
  setCurrency() {
    this.ccy = this.creditProposal.products[0].currencyId;
  }
}
