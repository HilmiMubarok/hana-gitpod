import { Component, Input, Output, EventEmitter, OnInit, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { ApplicationProduct, ApplicationProductAttribute, IApplicationProduct } from '../../application-product/application-product.model';
import { ICreditProposal } from '../credit-proposal.model';
import { Observable, Subject, forkJoin, from, map, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'app/entities/storage/storage.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
} from '@syncfusion/ej2-angular-documenteditor';
import { FormControl } from '@angular/forms';
import { IMasterFinancialInstitution } from 'app/entities/master-parameter/financial-institution/master-financial-institution.model';
import { MasterFinancialInstitutionService } from 'app/entities/master-parameter/financial-institution/master-financial-institution.service';
import { BusinessActivityService } from '../busines-activity/business-activity.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-loan-facility-detail-history',
  templateUrl: './loan-facility-detail-history.component.html',
  styleUrls: ['./grid/loan.scss', './credit-proposal-tab-loan-facility-detail.css'],
})
export class LoanFacilityDetailHistoryComponent implements OnInit, OnChanges, OnDestroy {
  public _creditProposal: ICreditProposal;
  public rateAmountTypeList = ['Rate Percentage', 'Amount IDR', 'Amount USD'];
  public dataFilter = [];
  public parsedAttribute;

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

  @Input() isViewMode: Boolean = false;

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  @Input() takeOutCompare: Boolean = false;
  public previousBank: any;

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
  public parentPath: any;

  @Output() outCreditProposal = new EventEmitter<ICreditProposal>();

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;
    this.outCreditProposal.emit(this._creditProposal);
  }

  constructor(
    protected actRoute: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private applicationConfigService: ApplicationConfigService,
    private masterFinancialInstitutionService: MasterFinancialInstitutionService,
    private baService: BusinessActivityService,
    protected messageService: MessageService
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();
    this.parentPath = this.router.url.split('/')[1];
    this.loadFinancialInstitution();
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  onDocumentChange() {
    if (this.isViewMode === true) {
      if (this.parentSource === '') {
        this.container_view_false.restrictEditing = true;
      } else if (this.parentSource === 'loan-analys') {
        this.container_view_false_loan_analys.restrictEditing = true;
      }
    } else if (this.isViewMode === false) {
      if (this.parentSource === '') {
        this.container.restrictEditing = true;
      } else if (this.parentSource === 'loan-analys') {
        this.container_loan_analys.restrictEditing = true;
      }
    }
  }

  ngOnInit(): void {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
    if (this.router.url.split('/')[1] === 'cp-status-approval') {
      this.parentSource = 'loan-analys';
    }
    this.getWord();
    this.parsedAttribute = parsePreviousAtrribute(this.creditProposal);
    this.previousBank = this.parsedAttribute.previousHistory?.facilityDetail.previousBank;
    this.removeTagRemaks();
    this.setCurrency();
    this.dataProduct = this.dynamicCP()?.products;
  }
  dataProduct: IApplicationProduct[];

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.saveWord === true) {
      this.triggeredSave();
    }
  }

  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();
    });
  }

  // private getContainer(): void {
  //   let paramsId = '';
  //   this.actRoute.params.subscribe(params => {
  //     paramsId = params['id'];
  //   });
  //   const obj = {
  //     key: 'credit_proposal/remark/loan-facility/' + paramsId + '/sfdt',
  //   };

  //   this.storageService
  //     .getObjects(this.BUCKET, obj)
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(response => {
  //       if (response.body.length > 0) {
  //         this.storageService
  //           .fileBlob(response.body[response.body.length - 1]['url'])
  //           .pipe(takeUntil(this.ngUnsubscribe))
  //           .subscribe(res => {
  //             this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-loan-facility-sfdt.sfdt');
  //             const fileReader: FileReader = new FileReader();
  //             fileReader.onload = (e: any) => {
  //               let docEditor: any;

  //               if (this.isViewMode === true) {
  //                 if (this.parentSource === '') {
  //                   docEditor = this.container_view_false?.documentEditor as DocumentEditorComponent;
  //                 } else if (this.parentSource === 'loan-analys') {
  //                   docEditor = this.container_view_false_loan_analys?.documentEditor as DocumentEditorComponent;
  //                 }
  //               } else if (this.isViewMode === false) {
  //                 if (this.parentSource === '') {
  //                   docEditor = this.container?.documentEditor as DocumentEditorComponent;
  //                 } else if (this.parentSource === 'loan-analys') {
  //                   docEditor = this.container_loan_analys?.documentEditor as DocumentEditorComponent;
  //                 }
  //               }

  //               const contents: string = e.target.result;
  //               docEditor.open(contents);
  //             };
  //             fileReader.readAsText(this.fileGet);
  //           });
  //       }
  //     });
  // }

  private getContainer(): void {
    this.baService.isUpload$.next(false);
    this.baService.setLoading(true);

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

                if (this.isViewMode === true) {
                  if (this.parentSource === '') {
                    docEditor = this.container_view_false?.documentEditor as DocumentEditorComponent;
                  } else if (this.parentSource === 'loan-analys') {
                    docEditor = this.container_view_false_loan_analys?.documentEditor as DocumentEditorComponent;
                  }
                } else if (this.isViewMode === false) {
                  if (this.parentSource === '') {
                    docEditor = this.container?.documentEditor as DocumentEditorComponent;
                  } else if (this.parentSource === 'loan-analys') {
                    docEditor = this.container_loan_analys?.documentEditor as DocumentEditorComponent;
                  }
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
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
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

  // public triggeredSave(): void {
  //   if (this.parentSource !== '' && this.parentSource !== 'loan-analys') {
  //     let paramsId = '';
  //     this.actRoute.params.subscribe(params => {
  //       paramsId = params['id'];
  //     });
  //     const key = 'credit_proposal/remark/loan-facility';

  //     const timeStamp = Math.floor(Date.now() / 1000);

  //     let docEditor: any;

  //     if (this.isViewMode === true) {
  //       if (this.parentSource === '') {
  //         docEditor = this.container_view_false?.documentEditor as DocumentEditorComponent;
  //       } else if (this.parentSource === 'loan-analys') {
  //         docEditor = this.container_view_false_loan_analys?.documentEditor as DocumentEditorComponent;
  //       }
  //     } else if (this.isViewMode === false) {
  //       if (this.parentSource === '') {
  //         docEditor = this.container?.documentEditor as DocumentEditorComponent;
  //       } else if (this.parentSource === 'loan-analys') {
  //         docEditor = this.container_loan_analys?.documentEditor as DocumentEditorComponent;
  //       }
  //     }

  //     docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
  //       const fileType = 'word';
  //       const fileName = 'credit-proposal-remark-' + paramsId + '-loan-facility-' + fileType + '.docs';
  //       const metaData = {
  //         objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //       };
  //       const formData = new FormData();
  //       formData.append('file', new File([exportedDocument], fileName));

  //       this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
  //     });

  //     docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
  //       const fileType = 'sfdt';
  //       const fileName = 'credit-proposal-remark-' + paramsId + '-loan-facility-' + fileType + '.sfdt';
  //       const metaData = {
  //         objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //       };
  //       const formData = new FormData();
  //       formData.append('file', new File([exportedDocument], fileName));

  //       this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
  //     });
  //   }
  // }

  public triggeredSave(): void {
    if (this.parentSource !== '' && this.parentSource !== 'loan-analys') {
      let paramsId = '';
      this.actRoute.params.subscribe(params => {
        paramsId = params['id'];
      });

      this.baService.setLoading(true);
      const key = 'credit_proposal/remark/loan-facility';
      const docEditors = this.container?.documentEditor as DocumentEditorComponent;
      const saveDocx$ = from(docEditors.saveAsBlob('Docx'));
      const saveSfdt$ = from(docEditors.saveAsBlob('Sfdt'));

      let docEditor: any;

      if (this.isViewMode === true) {
        if (this.parentSource === '') {
          docEditor = this.container_view_false?.documentEditor as DocumentEditorComponent;
        } else if (this.parentSource === 'loan-analys') {
          docEditor = this.container_view_false_loan_analys?.documentEditor as DocumentEditorComponent;
        }
      } else if (this.isViewMode === false) {
        if (this.parentSource === '') {
          docEditor = this.container?.documentEditor as DocumentEditorComponent;
        } else if (this.parentSource === 'loan-analys') {
          docEditor = this.container_loan_analys?.documentEditor as DocumentEditorComponent;
        }
      }

      forkJoin([saveDocx$, saveSfdt$])
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

  dynamicCP() {
    this.parsedAttribute = parsePreviousAtrribute(this.creditProposal);
    if (this.isOnCompareData && !this.isCompareDar) {
      if (!this.parsedAttribute?.previousReturn?.facilityDetail) {
        const obj = {
          facilityDetail: {
            custodianFee: 0,
          },
        };
        this.parsedAttribute.previousReturn = { ...this.parsedAttribute.previousReturn, ...obj };
      }
      return this.parsedAttribute.previousReturn;
    } else if (this.isOnCompareData && this.isCompareDar) {
      // return dataDar
      return this.creditProposal;
    } else {
      if (this.parsedAttribute.previousOfferingLetter) {
        return this.parsedAttribute.previousOfferingLetter;
      } else {
        return this.parsedAttribute.previousHistory;
      }
    }
  }

  fungsiSuminit(value: string) {
    let result: number;
    let dolar: number;
    let hasil: number;
    let filterUsd = [];
    let filterIdr = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.dataProduct.filter(obj => obj.subLimit === false);

    if (dataFilter?.length > 0) {
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

    // if (value === 'both') {
    //   this.creditProposal.attributes['facilityDetail'].totalInitialLimit = result + dolar;
    // }
    // if (value === 'USD') {
    //   this.creditProposal.attributes['facilityDetail'].totalInitialLimitUsd = result + dolar;
    // }
    // if (value === 'IDR') {
    //   this.creditProposal.attributes['facilityDetail'].totalInitialLimitIdr = result + dolar;
    // }
    return result + dolar;
  }

  fungsiSumchange(value: string) {
    let result: number;
    let dolar: number;
    let filterUsd = [];
    let filterIdr = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.dataProduct.filter(obj => obj.subLimit === false);

    if (dataFilter?.length > 0) {
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
    // if (value === 'both') {
    //   this.creditProposal.attributes['facilityDetail'].totalChanges = result + dolar;
    // }
    // if (value === 'USD') {
    //   this.creditProposal.attributes['facilityDetail'].totalChangesUsd = result + dolar;
    // }
    // if (value === 'IDR') {
    //   this.creditProposal.attributes['facilityDetail'].totalChangesIdr = result + dolar;
    // }
    return result + dolar;
  }

  public fungsiSumOS(value: string) {
    let result: number;
    let dolar: number;
    let filterIdr = [];
    let filterUsd = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.dataProduct.filter(obj => obj.subLimit === false);

    if (dataFilter?.length > 0) {
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
    // if (value === 'both') {
    //   this.creditProposal.attributes['facilityDetail'].totalOs = result + dolar;
    // }
    // if (value === 'USD') {
    //   this.creditProposal.attributes['facilityDetail'].totalOsUsd = result + dolar;
    // }
    // if (value === 'IDR') {
    //   this.creditProposal.attributes['facilityDetail'].totalOsIdr = result + dolar;
    // }
    return result + dolar;
  }

  fungsiSumavailable() {
    let result: number;
    result = 0;

    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.availableLimit !== undefined) {
          result = result + Number(this._creditProposal.products[i].attributes.availableLimit);
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

    const dataFilter = this.dataProduct.filter(obj => obj.subLimit === false);

    if (dataFilter?.length > 0) {
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
    // if (value === 'both') {
    //   this.creditProposal.attributes['facilityDetail'].totalPlafond = result + dolar;
    // }
    // if (value === 'USD') {
    //   this.creditProposal.attributes['facilityDetail'].totalPlafondUsd = result + dolar;
    // }
    // if (value === 'IDR') {
    //   this.creditProposal.attributes['facilityDetail'].totalPlafondIdr = result + dolar;
    // }
    return result + dolar;
  }

  // matrix reove tag
  removeTagRemaks() {
    this.newMessage = this.creditProposal.attributes['collateralChecklist'].remarks;
    this.newMessage = this.newMessage.replace(/<(.|\n)*?>/g, '');
  }

  // setCurrency
  setCurrency() {
    this.ccy =
      this.parsedAttribute?.previousReturn && this.isOnCompareData && !this.isCompareDar
        ? this.parsedAttribute?.previousReturn?.products[0].currencyId
        : this.parsedAttribute.previousHistory.products[0].currencyId;
  }

  // kebutuhan untuk auto complete previous bank
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

  public myControlMVOri = new FormControl();
  public dataMasterFinancialInstitution: IMasterFinancialInstitution[];
  public filteredOptionsMVOri: Observable<IMasterFinancialInstitution[]>;
  public MVOriCcy: IMasterFinancialInstitution;

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
