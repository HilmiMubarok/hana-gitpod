import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, Subject, forkJoin, from, map, startWith, switchMap, takeUntil, tap } from 'rxjs';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import {
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProduct,
} from 'app/entities/application-product/application-product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { BusinessActivityService } from 'app/entities/credit-proposal/busines-activity/business-activity.service';
import { MasterFinancialInstitutionService } from 'app/entities/master-parameter/financial-institution/master-financial-institution.service';
import { MessageService } from 'primeng/api';
import { StorageService } from 'app/entities/storage/storage.service';
import { FormControl } from '@angular/forms';
import { IMasterFinancialInstitution } from 'app/entities/master-parameter/financial-institution/master-financial-institution.model';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Component({
  selector: 'jhi-loan-operation-loan-facility-detail',
  templateUrl: './loan-operation-loan-facility-detail.html',
  styleUrls: [
    '../../credit-proposal/loan-facility/grid/loan.scss',
    '../../credit-proposal/loan-facility/credit-proposal-tab-loan-facility-detail.css',
  ],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class LoanOperationLoanFacilityDetailComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    protected actRoute: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private applicationConfigService: ApplicationConfigService,
    private masterFinancialInstitutionService: MasterFinancialInstitutionService,
    private baService: BusinessActivityService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();
    this.loadFinancialInstitution();
  }

  public _creditProposal: ICreditProposal;
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
  public rateAmountTypeList = ['Rate Percentage', 'Amount IDR', 'Amount USD'];
  public dataFilter = [];
  public resourceUrl: string;
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
  public myControlMVOri = new FormControl();
  public dataMasterFinancialInstitution: IMasterFinancialInstitution[];
  public filteredOptionsMVOri: Observable<IMasterFinancialInstitution[]>;
  public MVOriCcy: IMasterFinancialInstitution;

  private paramsIdGet: string;
  private fileGet: File;
  private BUCKET: string;
  private getKey: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private saveDocx$: Observable<Blob>;
  private saveSfdt$: Observable<Blob>;
  private docEditor: DocumentEditorComponent;

  @Input() isViewLoan: Boolean = false;
  @Input() takeOutCompare: Boolean = false;
  @Input() saveWord: any;
  @Input() parentSource: String = '';
  @Input() parentSourceSub: String = '';
  @Input() isViewMode: Boolean = false;
  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @Output() outCreditProposal = new EventEmitter<ICreditProposal>();

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

  ngOnInit(): void {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.BUCKET = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      (this.getKey = 'credit_proposal/remark/loan-facility/' + this.paramsIdGet + '/sfdt'),
        this.getBucket().then(res => {
          this.getContainer();
        });
    });

    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
    if (this.parentSourceSub === 'from-click-menu') {
      if (this.router.url.split('/')[1] === 'cp-status-approval') {
        this.parentSource = 'loan-analys';
      }
    }

    this.removeTagRemaks();
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

    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }

    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;
    this.outCreditProposal.emit(this._creditProposal);
  }

  onDocumentChange() {
    if (this.parentSource === '') {
      this.container_view_false.restrictEditing = true;
    } else if (this.parentSource === 'loan-analys' || this.parentSource === 'credit-agreement' || this.parentSource === 'darRevision') {
      this.container_view_false_loan_analys.restrictEditing = true;
    }
  }

  remarkDisable() {
    if (this.parentSource === 'dar-revision-checker' || this.parentSource === 'finalize-pk' || this.parentSource === 'credit-agreement') {
      this.container_view_false.restrictEditing = true;
    }
  }

  public remarkStatus() {
    const queryParam = new URLSearchParams(this.router.url.split('?')[1]);
    const subroutes = queryParam.get('subroute');
    if (
      this.parentSource === 'credit-agreement' ||
      this.parentSource === 'darRevision' ||
      this.parentSource === 'dar-revision-checker' ||
      this.parentSource === 'finalize-pk'
    ) {
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

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.BUCKET = res.body['bucket'];
        resolve();
      });
    });
  }

  private getContainer(): void {
    this.baService.isUpload$.next(false);
    this.baService.setLoading(true);
    let paramsId = '';
    this.actRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    const obj = {
      key: this.getKey,
    };

    this.storageService
      .getObjects(this.BUCKET, obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-loan-facility-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                let docEditor: any;

                if (
                  this.parentSource === '' ||
                  this.parentSource === 'credit-proposal' ||
                  this.parentSource === 'dar-revision-checker' ||
                  this.parentSource === 'finalize-pk' ||
                  this.parentSource === 'credit-agreement'
                ) {
                  docEditor = this.container_view_false?.documentEditor as DocumentEditorComponent;
                } else if (this.parentSource === 'loan-analys' || this.parentSource === 'darRevision') {
                  docEditor = this.container_view_false_loan_analys?.documentEditor as DocumentEditorComponent;
                }

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

  onCreate(): void {
    this.container_view_false.serviceUrl = '/services/los/api/wordeditor/';
    this.container_view_false_loan_analys.serviceUrl = '/services/los/api/wordeditor/';
  }

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;

    if (isCtrlKey && keyCode === '86') {
      args.isHandled = true;
    }
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    let docEditor: any;

    this.baService.setLoading(true);
    const key = 'credit_proposal/remark/loan-facility';

    if (this.parentSource === '' || this.parentSource === 'credit-proposal') {
      this.docEditor = this.container_view_false?.documentEditor as DocumentEditorComponent;
      this.saveDocx$ = from(this.docEditor.saveAsBlob('Docx'));
      this.saveSfdt$ = from(this.docEditor.saveAsBlob('Sfdt'));
    } else if (this.parentSource === 'loan-analys' || this.parentSource === 'darRevision') {
      this.docEditor = this.container_view_false_loan_analys?.documentEditor as DocumentEditorComponent;
      this.saveDocx$ = from(this.docEditor.saveAsBlob('Docx'));
      this.saveSfdt$ = from(this.docEditor.saveAsBlob('Sfdt'));
    }

    forkJoin([this.saveDocx$, this.saveSfdt$])
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.baService.setLoading(true)),
        map(([docx, sfdt]) => {
          this.baService.setLoading(true);
          const fileTypeWord = 'word';
          const fileName = 'credit-proposal-remark-' + paramsId + '-loan-facility-' + fileTypeWord + '.docs';
          const metaData = {
            objectName: `${key}/${paramsId}/${fileTypeWord}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([docx], fileName));

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
            .uploadMeta(this.BUCKET, formData, metaData)
            .pipe(
              switchMap(() => {
                const fileTypeSfdt = 'sfdt';
                const fileNames = 'credit-proposal-remark-' + paramsId + '-loan-facility-' + fileTypeSfdt + '.sfdt';
                const metaDatas = {
                  objectName: `${key}/${paramsId}/${fileTypeSfdt}/${fileNames}`,
                };
                const formDatas = new FormData();
                formDatas.append('file', new File([sfdt], fileNames));

                return this.storageService.uploadMeta(this.BUCKET, formDatas, metaDatas);
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

  removeTagRemaks() {
    this.newMessage = this.creditProposal.attributes['collateralChecklist'].remarks;
    this.newMessage = this.newMessage.replace(/<(.|\n)*?>/g, '');
  }

  setCurrency() {
    this.ccy = this.creditProposal.products[0].currencyId;
  }

  private loadFinancialInstitution(): void {
    this.masterFinancialInstitutionService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataMasterFinancialInstitution = res.body;
        this.filteredMVOri();
        this.MVOriCcy = this.dataMasterFinancialInstitution.find(
          obj => obj.code === this.creditProposal.attributes['facilityDetail'].previousBank
        );
      });
  }

  filteredMVOri() {
    this.filteredOptionsMVOri = this.myControlMVOri.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVOri(name as string) : this.dataMasterFinancialInstitution.slice();
      })
    );
  }

  displayFnMVOri(item: IMasterFinancialInstitution): string {
    return item && item.description ? item.description : '';
  }

  private _filterMVOri(description: string): IMasterFinancialInstitution[] {
    const filterValue = description.toLowerCase();
    return this.dataMasterFinancialInstitution.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  getDataBank() {
    this.creditProposal.attributes['facilityDetail'].previousBank = this.MVOriCcy.code;
  }

  getDataBankView() {
    if (this.MVOriCcy) {
      return this.MVOriCcy.description;
    }
    return this.creditProposal.attributes['facilityDetail'].previousBank;
  }
}
