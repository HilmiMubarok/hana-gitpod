import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';

import { IOrganizationLegal } from '../organization-legal/organization-legal.model';
import { OrganizationLegalService } from '../organization-legal/organization-legal.service';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { Subject, forkJoin, from, map, switchMap, takeUntil, tap } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { PartyCifService } from '../party-cif/party-cif.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogBorrowerComponent } from './credit-proposal-dialog-borrower.component';
import { GeneralParameterService } from '../master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { BusinessActivityService } from './busines-activity/business-activity.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-credit-proposal-management-info',
  templateUrl: './credit-proposal-tab-management-info.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposaTabManagementInfoComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private ngUnsubscribe = new Subject();

  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;
  private BUCKET: string;

  @Input()
  creditProposalItem: ICreditProposal = new CreditProposal();
  public dataItem: ICreditProposal = new CreditProposal();
  private _Info: ICreditProposal[];
  public organizationLegal: IOrganizationLegal[];

  public data: any = [];
  public deeedNumber: any;
  public deedDate: any;

  public Managemet: string;
  public value: string;
  public valueSelect: any;
  public newMessage: string;
  public resourceUrl: string;
  public dataCoBorrower: any = [];
  public No: string;
  public indexNum: any;
  public customHeadersJWT: any;
  public businessGroupName: string;

  get item() {
    return this.creditProposalItem;
  }

  set item(item: ICreditProposal) {
    this.creditProposalItem = item;
  }

  @Input()
  get dataSource() {
    return this.organizationLegal;
  }

  set dataSource(param: IOrganizationLegal[]) {
    this.organizationLegal = param;
  }

  // atribut
  public dataAttrMgn = [];
  public Management: string;
  constructor(
    private creditProposalService: CreditProposalService,
    protected activatedRoute: ActivatedRoute,
    private baService: BusinessActivityService,
    public dialog: MatDialog,
    private organizationLegalService: OrganizationLegalService,
    protected actRoute: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private partyCifService: PartyCifService,
    private generalParameterService: GeneralParameterService,
    protected messageService: MessageService
  ) {
    this.dataItem;
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.BUCKET = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      (this.getKey = 'credit_proposal/remark/management-info/' + this.paramsIdGet + '/sfdt'),
        this.getBucket().then(res => {
          this.getContainer();
        });
    });

    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');

    this.dataCoBorrower = this.creditProposalItem.attributes['basicInformation'].coborowed;

    if (this.item.attributes['managementInfo'].DebtorPerformentCriteria.length === 0) {
      this.item.attributes['managementInfo'].DebtorPerformentCriteria = this.dataAttrMgn;
    } else {
      this.dataAttrMgn = this.item.attributes['managementInfo'].DebtorPerformentCriteria;
    }

    // this.getWord();

    this.matrixRemoveTag();
    this.getPartyCif();
    this.getPartyCifDate();
    this.lovDebtorPerformance();
    this.businessGroupName = this.item.debtorData.groupCompanyName;
  }

  public lovDebtorPerformance() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'DEBTOR_PERFORMANCE_AND_MANAGEMENT_INFORMATION',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataAttrMgn = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        console.log('datalog', this.dataAttrMgn);
        // for (let i = 0; i < this.dataAttrMgn.length; i++) {
        //   this.dataAttrMgn[i]['indexNum'] = i + 1;
        // }
        const dataGrid = [];
        for (let i = 0; i < this.dataAttrMgn.length; i++) {
          const num = i + 1;
          dataGrid[i] = { indexNum: num, Management: this.dataAttrMgn[i].value, value: 'No' };
          console.log('data tabel', dataGrid);
        }
        this.dataAttrMgn = dataGrid;
        if (this.dataItem.attributes['managementInfo'].DebtorPerformentCriteria.length === 0) {
          this.dataItem.attributes['managementInfo'].DebtorPerformentCriteria = this.dataAttrMgn;
        } else {
          for (let i = 0; i < this.dataItem.attributes['managementInfo'].DebtorPerformentCriteria.length; i++) {
            this.dataAttrMgn = this.dataItem.attributes['managementInfo'].DebtorPerformentCriteria;
            // this.remarks[i] = this.item.attributes['cpRacBack'].topGrid[i].remarks;
          }
        }
      });
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

  public getPartyCif() {
    this.partyCifService
      .queryFilterBy({
        idParty: this.creditProposalItem.cif.partyId,
        page: 0,
        size: 9999,
        sort: ['id,desc'],
      })
      .subscribe((res: any) => {
        this.loadDataByNumber(this.partyCifService.findPartyId(res.body[0]));
      });
  }

  public getPartyCifDate() {
    this.partyCifService
      .queryFilterBy({
        idParty: this.creditProposalItem.cif.partyId,
        page: 0,
        size: 9999,
        sort: ['id,desc'],
      })
      .subscribe((res: any) => {
        this.loadDataByDate(this.partyCifService.findPartyId(res.body[0]));
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataItem = changes.creditProposalItem.currentValue;
    if (this.dataItem !== undefined) {
      this.data.push(this.dataItem);
    }
  }

  initialize() {}

  getPerson(): void {
    this.creditProposalService.loadCacheAll().subscribe((res: ICreditProposal[]) => {
      this._Info = res || [];
      this.setData();
    });
  }

  public getOrganizationLegal(): void {
    this.organizationLegalService.loadCacheAll().subscribe((res: IOrganizationLegal[]) => {
      this.organizationLegal = res || [];

      this.setData();
    });
  }

  public loadDataByNumber(_idOrganization: string = null): void {
    this.organizationLegalService
      .queryFilterBy({
        idOrganization: _idOrganization,
        page: 0,
        sort: ['id,desc'],
      })
      .subscribe((res: any) => {
        this.deeedNumber = res.body[0].deedRecentChangeNumber;
      });
  }

  public loadDataByDate(_idOrganization: string = null): void {
    this.organizationLegalService
      .queryFilterBy({
        idOrganization: _idOrganization,
        page: 0,
        sort: ['id,desc'],
      })
      .subscribe((res: any) => {
        this.deedDate = res.body[0].deedRecentChangeDate;
      });
  }

  setData() {
    this._Info.map(item => {
      this.data = [
        ...this.data,
        {
          name: item.prospectPerson.name,
          personalIdNumber: item.prospectPerson.personalIdNumber,
          taxIdNumber: item.prospectPerson.taxIdNumber,
          customerNumber: item.customerNumber,
          dob: item.prospectPerson.dob,
          addresses: item.addresses.map(element => element.address.address1),
          managements: item.prospectOrganization,
          prospectOrganization: item.prospectOrganization.name ? item.prospectPerson.name : item.prospectOrganization.name,
        },
      ];
    });
  }

  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.BUCKET = res.body['bucket'];
        resolve();
      });
    });
  }

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
    const key = 'credit_proposal/remark/management-info';
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
          const fileName = 'credit-proposal-remark-' + '-' + paramsId + '-' + fileTypeWord + '.docs';
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
                const fileNames = 'credit-proposal-remark-' + '-' + paramsId + '-' + '-management-info-' + fileTypeSfdt + '.sfdt';
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

  private getContainer(): void {
    this.baService.isUpload$.next(false);
    this.baService.setLoading(true);
    const obj = {
      key: this.getKey,
    };
    console.log('obj', obj);

    this.storageService
      .getObjects(this.BUCKET, obj)
      // .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            // .pipe(takeUntil(this.ngUnsubscribe))
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              console.log('this.paramsIdGet', this.paramsIdGet);

              this.fileGet = new File([res.body], 'credit-proposal-remark-' + '-' + this.paramsIdGet + '-' + '-management-info-sfdt.sfdt');

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
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  public onSelect(value: string, dataMgn: any) {
    this.dataAttrMgn[dataMgn.indexNum - 1].value = value;
    this.item.attributes['managementInfo'].DebtorPerformentCriteria = this.dataAttrMgn;
    console.log('onSelect', value);
  }

  matrixRemoveTag() {
    this.newMessage = this.creditProposalItem.attributes['managementInfo'].message;
    this.newMessage = this.newMessage.replace(/<(.|\n)*?>/g, '');
  }

  // saveoption
  btnSave($event: any): void {
    this.dataItem.attributes['managementInfo'].DebtorPerformentCriteria = [
      ...this.dataItem.attributes['managementInfo'].DebtorPerformentCriteria,
      {
        Management: this.Managemet,
      },
    ];
  }

  public openDialog(element: any): void {
    const predicate = { width: '120vw', data: { item: element, cp: this.creditProposalItem } };

    const dialogRef = this.dialog.open(DialogBorrowerComponent, predicate);
    dialogRef.afterClosed().subscribe(() => {});
  }
}
