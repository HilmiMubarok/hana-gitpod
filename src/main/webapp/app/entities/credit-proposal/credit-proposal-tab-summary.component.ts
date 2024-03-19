import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { formatBytes } from 'app/shared/helper/utils';
import { takeUntil, Subject, from, forkJoin, tap, map, switchMap } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { saveAs as importedSaveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { CreditProposalService } from './credit-proposal.service';
import { IDebtorData } from '../debtor-data/debtor-data.model';
import lodash from 'lodash';
import { CPFacilityTable, ICPFacilityTable } from './exposure/total-exposure/cp-facility-table-model';
import { Router } from '@angular/router';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { AccountService } from 'app/core/auth/account.service';
import { DOCUMENT_TYPE_GENERATE_DOCUMENT } from 'app/shared/constants/base.constants';
import { MatTableDataSource } from '@angular/material/table';
import { BusinessActivityService } from './busines-activity/business-activity.service';
@Component({
  selector: 'jhi-credit-proposal-tab-summary',
  templateUrl: './credit-proposal-tab-summary.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css', './credit-proposal-tab-summary.style.scss'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalTabSummaryComponent implements OnInit, OnChanges, OnDestroy {
  public displayColumns: string[] = ['no', 'fileName', 'date', 'createBy', 'docType', 'sizeFile', 'action'];
  public currencyMaster: number;
  private ngUnsubscribe = new Subject();
  public state: string;
  public dialogVisible: false;
  public data: any = new MatTableDataSource<object[]>();
  public myBusinessGroupCPFacility: ICPFacilityTable[];
  public dataSource = [];
  public parsedAttr;

  public _item?: ICreditProposal = new CreditProposal();
  public paramId: string;

  private resourceUrl: string;
  private BUCKET: string;
  private KEY = 'credit_proposal/remark/summary';
  private KEYG = 'credit_proposal/summary';

  public fileTypeSelected: string;
  public fileTypeList: string[] = ['Word', 'Pdf'];

  public viewButton: string;
  public isDataExist = false;

  public customHeadersJWT: any;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  @Input() source = '';

  @Input() saveWord: any;
  approvalStatus: string;
  public notCreatedBy: boolean;
  currentAccount: any;
  @Output() outputDataDar = new EventEmitter();
  @Input()
  get sourceComponent() {
    return this.viewButton;
  }
  set sourceComponent(item: any) {
    this.viewButton = item;
  }
  @Input() fileDar: any;
  @Input() fileCompliance: any;
  @Input() fileSPPK: any;
  @Input() fileLadist: any;
  @Input() fileDocPKFinal: any;
  @Input() fileDpdlFinal: any;

  constructor(
    public dialog: MatDialog,
    protected reportUtils: ReportUtilService,
    private storageService: StorageService,
    private creditProposalService: CreditProposalService,
    protected applicationConfigService: ApplicationConfigService,
    private actRoute: ActivatedRoute,
    protected messageService: MessageService,
    private http: HttpClient,
    public partyCifService: PartyCifService,
    private router: Router,
    public accountService: AccountService,
    private baService: BusinessActivityService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Loan Analys Generate Dar And SPPK
    if (changes.fileDar) {
      this.data = this.fileDar;
    }
    // Loan Analys Generate Compliance
    if (changes.fileCompliance) {
      this.data = this.fileCompliance;
    }
    // CP generate La Distribution
    if (changes.fileLadist) {
      this.data = this.fileLadist;
    }
    // Offering Latter Generate SPPK
    if (changes.fileSPPK) {
      this.data = this.fileSPPK;
    }
    if (changes.fileDpdlFinal) {
      this.fileDpdlFinal = changes.fileDpdlFinal.currentValue;
    }
    if (changes.fileDocPKFinal) {
      this.fileDocPKFinal = changes.fileDocPKFinal.currentValue;
    }
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.creditRatingCondition();
    this.conditionApprovalUser();
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
    this.getBucketNameSummary();
    this.triggeredSave();
    const setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res1 => {
      this.currencyMaster = res1.body[0]?.factor;
      this.partyCifService.getBusinessGroup(this.item.customerNumber).subscribe(res => {
        const param = res.body;
        if (param.length > 0) {
          let no = 0;
          for (let i = 0; i < param.length; i++) {
            const item: IDebtorData = param[i];
            if (lodash.has(item.attributes, 'cpFacility')) {
              const source = JSON.parse(item.attributes['cpFacility']);

              if (source) {
                for (let y = 0; y < source.length; y++) {
                  const parsed = new CPFacilityTable();
                  const parsedAny = parsed;
                  no = no + 1;
                  parsed.no = no;
                  parsed.GroupName = param[i].customerName;
                  parsed.LoanAccount = source[y].LNB_BASE_AGR_REF_NO;
                  parsed.FacilityType = source[y].FACILITY_TYPE;
                  parsed.InitialLimit = Number(source[y].FILN10_CONTRACT_AMT ? source[y].FILN10_CONTRACT_AMT : 0);
                  parsed.Changes = 0;
                  parsed.OS = source[y].LNB_BASE_LON_JAN;
                  parsed.TotalPlafond = parsed.InitialLimit + parsed.Changes;
                  parsed.Provision = source[y].FILN22_FEE_AMT;
                  parsed.AdminFee = source[y].FILN22_FEE_AMT;
                  parsed.FirstDisbursementDate = source[y].FXFIG_TRX_DT;
                  parsed.Tenor = source[y].FXFIG_TRX_DT;

                  parsed.CCY = source[y].LNB_BASE_LON_CCY;
                  parsed.MaturityDate = source[y].FILN10_TOT_EXP_IL;

                  this.myBusinessGroupCPFacility = lodash.concat(this.myBusinessGroupCPFacility, parsed);
                  this.item.attributes['calculationExposure'].initialLimitGroub = this.fungsiSuminitGroub();
                  this.item.attributes['calculationExposure'].totalChangeGroub = this.fungsiSumchangeGroub();
                  this.item.attributes['calculationExposure'].subTotalLimitGroubOs = this.fungsiSumOSGroub();
                  this.item.attributes['calculationExposure'].totalPLafondGroub = this.fungsiSumcreditGroub();

                  const removeundefined = lodash.remove(this.myBusinessGroupCPFacility, function (n) {
                    return n === undefined;
                  });
                }
              }
            }
          }
        }
      });

      if (this.router.url.split('=').indexOf('summary') > -1) {
        this.parsedAttr = parsePreviousAtrribute(this.item);
        if (this.parsedAttr.previousHistory) {
          this.dataSource = this.parsedAttr.previousHistory.products;
        } else {
          this.dataSource = this.item.products;
        }
      } else {
        this.dataSource = this.item.products;
      }

      this.item.attributes['calculationExposure'].initialLimitDebtor = this.fungsiSuminit();
      this.item.attributes['calculationExposure'].totalChangeDebtor = this.fungsiSumchange();
      this.item.attributes['calculationExposure'].subTotalDebtor = this.fungsiSumOS();
      this.item.attributes['calculationExposure'].totalPLafondDebtor = this.fungsiSumcredit();
    });
  }

  public creditRatingCondition() {
    if (this.item.attributes['purposePricing'].industryCode === '') {
      this.item.attributes['purposePricing'].industryCode = this.item.creditRatings[0].attributes['industryCode'];
    }
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

  fungsiSuminitGroub() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');

    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].InitialLimit !== undefined) {
          result = result + Number(filterIdr[i].InitialLimit);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].InitialLimit !== undefined) {
          dolar = Number(filterUsd[i].InitialLimit) * Number(this.currencyMaster) + dolar;
        }
      }
    }
    return result + dolar;
  }

  fungsiSumchangeGroub() {
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].Changes !== undefined) {
          result = result + Number(filterIdr[i].Changes);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].Changes !== undefined) {
          dolar = Number(filterUsd[i].Changes) * Number(this.currencyMaster) + dolar;
        }
      }
    }
    return result + dolar;
  }

  public fungsiSumOSGroub() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].OS !== undefined) {
          result = result + Number(filterIdr[i].OS);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].OS !== undefined) {
          dolar = Number(filterUsd[i].OS) * Number(this.currencyMaster) + dolar;
        }
      }
    }

    return result + dolar;
  }

  fungsiSumcreditGroub() {
    let result = 0;
    let dolar = 0;

    const filterUsd = this.myBusinessGroupCPFacility.filter(obj => obj.CCY === 'USD');
    const filterIdr = this.myBusinessGroupCPFacility.filter(obj => obj.CCY !== 'USD');
    if (filterIdr.length > 0) {
      for (let i = 0; i < filterIdr.length; i++) {
        if (filterIdr[i].TotalPlafond !== undefined) {
          result = result + Number(filterIdr[i].TotalPlafond);
        }
      }
    }
    if (filterUsd.length > 0) {
      for (let i = 0; i < filterUsd.length; i++) {
        if (filterUsd[i].TotalPlafond !== undefined) {
          dolar = Number(filterUsd[i].TotalPlafond) * Number(this.currencyMaster) + dolar;
        }
      }
    }

    return result + dolar;
  }

  fungsiSuminit() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.dataSource.filter(obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false);

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
    return result + dolar;
  }

  public fungsiSumOS() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.dataSource.filter(obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false);

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
    return result + dolar;
  }

  fungsiSumcredit() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.dataSource.filter(obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false);

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
    return result + dolar;
  }

  fungsiSumchange() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.dataSource.filter(obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false);

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

    return result + dolar;
  }

  public getBucketNameSummary() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();

      this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
        this.paramId = params['id'];
      });

      if (this.paramId) {
        this.KEYG += `/${this.paramId}/`;
      } else {
        console.warn('Param id not found');
      }

      this.onRefresh();
    });
  }

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  attributes: any;

  private getContainer(): void {
    let paramsId = '';
    this.actRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    this.baService.isUpload$.next(false);
    this.baService.setLoading(true);

    const obj = {
      key: 'credit_proposal/remark/summary/' + paramsId + '/' + 'sfdt',
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
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-summary-sfdt.sfdt');
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

  onCreate(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
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
  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  // public triggeredSave(): void {
  //   let paramsId = '';
  //   this.actRoute.params.subscribe(params => {
  //     paramsId = params['id'];
  //   });
  //   const key = 'credit_proposal/remark/summary';

  //   const timeStamp = Math.floor(Date.now() / 1000);

  //   const docEditor = this.container?.documentEditor as DocumentEditorComponent;

  //   docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
  //     const fileType = 'word';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-summary-' + fileType + '.docs';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
  //   });

  //   docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
  //     const fileType = 'sfdt';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-summary-' + fileType + '.sfdt';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
  //   });
  // }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.actRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    this.baService.setLoading(true);
    const key = 'credit_proposal/remark/summary';
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
          const fileName = 'credit-proposal-remark-' + paramsId + '-summary-' + fileTypeWord + '.docs';
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
            .uploadMeta(this.BUCKET, formData, metaData)
            .pipe(
              switchMap(() => {
                const fileTypeSfdt = 'sfdt';
                const fileNames = 'credit-proposal-remark-' + paramsId + '-summary-' + fileTypeSfdt + '.sfdt';
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

  public generate(data: any): void {
    if (this.fileTypeSelected) {
      this.print(this.fileTypeSelected);
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Save First Before Generating, Please!',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'File Type Not Selected',
      });
    }
  }

  private print(fileType: string) {
    if (fileType === 'Word') {
      this.generateFile(fileType, '/services/report/api/report/credit-proposal_v2/word/' + this._item.id);
    } else if (fileType === 'Pdf') {
      this.generateFile(fileType, '/services/report/api/report/credit-proposal_v2/pdf-word/' + this._item.id);
    }
  }

  private generateFile(fileType: string, api: string, req?: any) {
    const options = this.createReportRequestOption(req);
    this.http.get(api, { params: options, responseType: 'text', observe: 'response' }).subscribe(response => {
      const fileName = fileType === 'Word' ? response.body.slice(-34) : response.body.slice(-33);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File ' + fileName + ' Generated Successfully',
      });
      this.onRefresh();
    });
  }

  private createReportRequestOption = (req?: any): HttpParams => {
    let options: HttpParams = new HttpParams();
    if (req) {
      Object.keys(req).forEach(key => {
        if (key !== 'sort') {
          options = options.set(key, req[key]);
        }
      });
      if (req.sort) {
        req.sort.forEach((val: string) => {
          options = options.append('sort', val);
        });
      }
    }
    return options;
  };

  private onRefresh(): void {
    const obj = {
      key: this.KEYG,
    };
    this.storageService
      .getObjects(this.BUCKET, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        const temp: any[] = response?.body;
        let i = 1;
        const data: any[] = [];
        temp.forEach((item: IObj) => {
          data.push({
            indexNum: i,
            key: item.key,
            appovallevel: item.name,
            fileName: item.name,
            metaData: item.metaData,
            sizeFile: formatBytes(item.size),
            tags: item.tags,
            url: item.url,
          });
          i++;
        });
        this.data = data;
      });
  }

  public onEdit(data: IObj): void {
    if (data.fileName.slice(-3) === 'ocx') {
      this.storageService
        .fileBlob(data.url)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          const file = new Blob([res.body], { type: res?.body?.type });
          importedSaveAs(file, data.fileName);
        });
    } else {
      this.storageService
        .fileBlob(data.url)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          const blob = window.URL.createObjectURL(new Blob([res.body], { type: 'application/pdf' }));
          window.open(blob);
          // window.open(blob);

          /* const reader = new FileReader();
          reader.readAsDataURL(res.body!);
          reader.onloadend = e => {
            this.viewBlob('Report', reader.result);
          }; */
        });
    }
  }

  private getFile(id: number): void {
    const predicate: Object = {
      key: `/credit_proposal/summary/${id}`,
    };
    this.storageService.getObjects(this.BUCKET, predicate).subscribe(res => {
      if (res.body.length > 0) {
        const data = Object.assign({}, res.body[0]);
        // this.onEdit(data);
      } else {
        this.isDataExist = false;
      }
    });
  }

  // Delete Confirmation
  public onDelete(data): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Document',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(respond => {
      if (respond) {
        this.storageService.deleteFile(this.BUCKET, data.key).subscribe(res => {
          this.outputDataDar.emit(data);
          this.getFile(this._item.id);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File ' + data.fileName + ' Delete Successfully' });
          this.onRefresh();
        });
      }
    });
  }

  // public onDelete(data: IObj) {
  //   this.storageService.deleteFile(this.BUCKET, data.key).subscribe(res => {
  //     this.getFile(this._item.id);
  //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File ' + data.fileName + ' Delete Successfully' });

  //     this.onRefresh();
  //   });
  // }

  private viewBlob(title: string, data: any) {
    const win = window.open();
    /* win!.document.write(
      '<html><head><title>' +
        title +
        '</title></head><body> <iframe src="https://docs.google.com/gview?url=' +
        data +
        '&embedded=true" frameborder="0" title="xxxxx" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
    ); */
    win!.document.write(
      '<html><head><title>' +
        title +
        '</title></head><body> <iframe src="' +
        data +
        '" frameborder="0" title="xxxxx" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
    );
  }

  blobToBase64(blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  }

  // showhide component using menu
  public distribution: any;
  public approvalShow() {
    const dataCommponent = sessionStorage.getItem('appName');
    if (dataCommponent !== 'Loan Analysis') {
      this.distribution = 'none';
    }
  }

  public approvalUser: boolean;
  public approvalUserNote: boolean;

  public conditionApprovalUser(): void {
    if (this.item.statusId === 'CP_ASSIGNMENT' || this.item.statusId === 'CP_APPROVE_TO_LA') {
      this.approvalUserNote = false;
      this.approvalUser = true;
    } else {
      if (
        this.item.approvalLc === 'LC3_SME' ||
        this.item.approvalLc === 'LC3_COMM' ||
        this.item.approvalLc === 'LC3_ENTRP' ||
        this.item.approvalLc === 'LC3_CORP' ||
        this.item.approvalLc === 'LC3_GLOB' ||
        this.item.approvalLc === 'LC4_SME' ||
        this.item.approvalLc === 'LC4_COMM' ||
        this.item.approvalLc === 'LC4_ENTRP' ||
        this.item.approvalLc === 'LC4_CORP' ||
        this.item.approvalLc === 'LC4_GLOB'
      ) {
        this.approvalUserNote = true;
        this.approvalUser = false;
      } else {
        this.approvalUserNote = false;
        this.approvalUser = true;
      }
    }
  }

  public memoBandingStats() {
    if (this.item.darAppealSeqNo) {
      if (this.item.darAppealSeqNo > 0) {
        return true;
      }
    }
    return false;
  }

  public generateDocumentPk() {
    const parentPath = this.router.url.split('/')[1];
    if (
      parentPath.match(/finalize-pk/g) ||
      parentPath.match(/review-pk/g) ||
      parentPath.match(/finalize-dpdl/g) ||
      parentPath.match(/finalize-dppk/g) ||
      parentPath.match(/review-dpdl/g) ||
      parentPath.match(/review-dppk/g) ||
      parentPath.match(/loan-ops-distribution/g) ||
      parentPath.match(/loan-ops-checking/g) ||
      parentPath.match(/loan-ops-reviw/g)
    ) {
      return true;
    }
    return false;
  }
  public hiddenButton(element) {
    if (
      (element.tags.createBy === this.currentAccount.login && element.tags.documentType === DOCUMENT_TYPE_GENERATE_DOCUMENT.DAR) ||
      (element.tags.documentType === DOCUMENT_TYPE_GENERATE_DOCUMENT.SPPK && element.tags.createBy === this.currentAccount.login)
    ) {
      return false;
    }
    if (element.tags.createBy === this.currentAccount.login && element.tags.documentType === DOCUMENT_TYPE_GENERATE_DOCUMENT.CP) {
      return false;
    }
    return true;
  }
}

interface IObj {
  key?: string;
  metaData?: any;
  fileName?: string;
  name?: string;
  size?: number;
  tags?: any;
  url?: string;
}
