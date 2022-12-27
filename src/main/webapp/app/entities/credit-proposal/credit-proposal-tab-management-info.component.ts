import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-credit-proposal-management-info',
  templateUrl: './credit-proposal-tab-management-info.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposaTabManagementInfoComponent implements OnChanges, OnInit {
  // @ViewChild('grid') public grid: GridComponent;
  // @ViewChild('findCifDialog')

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private ngUnsubscribe = new Subject();

  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;
  private BUCKET: string;

  // @Input() saveWord: any;
  @Input()
  creditProposalItem: ICreditProposal = new CreditProposal();
  public dataItem: ICreditProposal = new CreditProposal();
  private _Info: ICreditProposal[];
  private _organizationLegal: IOrganizationLegal[];

  public data: any = [];

  public Managemet: string;
  public value: string;
  public newMessage: string;
  public resourceUrl: string;

  // address: string;

  get item() {
    return this.creditProposalItem;
  }

  set item(item: ICreditProposal) {
    this.creditProposalItem = item;
  }

  // atribut
  public dataAttrMgn = [
    {
      No: 1,
      Management: 'Year in Business with the same idustry / in the same company > 5 years',
      value: 'No',
    },
    {
      No: 2,
      Management: 'No major change in key management position in the last 3 years',
      value: 'No',
    },
    {
      No: 3,
      Management: 'The Business is managed / handled by owner of family',
      value: 'No',
    },
    {
      No: 4,
      Management: 'The Business is managed /handled by owner or family',
      value: 'No',
    },
    {
      No: 5,
      Management: 'Delinquency / DPD in the last 12 months for debtor /spouse / shaeholder < 50% / management',
      value: 'No',
    },
    {
      No: 6,
      Management: 'Bounce cheque due any reason',
      value: 'No',
    },
    {
      No: 7,
      Management: 'Credit Card Ultilization of debtor / spouse / shareholder  < 50% / management',
      value: 'No',
    },
    {
      No: 8,
      Management: 'Ownership of Business premise is self-owned',
      value: 'No',
    },
    {
      No: 9,
      Management: 'Number of buyer > 5 (no concentration in one or tow buyer)',
      value: 'No',
    },
    {
      No: 10,
      Management: '80% of Sales reflected in Bank Statement',
      value: 'No',
    },
    {
      No: 11,
      Management: 'Distance  from Business location to booking unit < 30 km ',
      value: 'No',
    },
    {
      No: 12,
      Management: 'Checking result  from google is positive & no issue',
      value: 'No',
    },
    {
      No: 13,
      Management: 'Relationship among shareholder is family (not patner)',
      value: 'No',
    },
    {
      No: 14,
      Management: 'The collateral is occupied by debitor / family / Shareholder',
      value: 'No',
    },
  ];

  constructor(
    private creditProposalService: CreditProposalService,

    private organizationLegalService: OrganizationLegalService,
    // private actRoute: ActivatedRoute,
    // private storageService: StorageService
    protected actRoute: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {
    this.dataItem;
  }

  ngOnInit(): void {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');

    // this.bucket = BUCKET;
    // this.actRoute.params.subscribe(params => {
    //   this.paramsIdGet = params['id'];
    //   this.getKey = 'credit_proposal/remark/m-info/' + this.paramsIdGet + '/sfdt';
    //   this.getContainer();
    // });

    if (this.item.attributes['managementInfo'].DebtorPerformentCriteria.length !== 0) {
      for (let i = 0; i < this.item.attributes['managementInfo'].DebtorPerformentCriteria.length; i++) {
        this.dataAttrMgn = this.item.attributes['managementInfo'].DebtorPerformentCriteria;
      }
    }
    this.getWord();

    this.matrixRemoveTag();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.saveWord === true) {
    //   this.triggeredSave();
    // }

    this.dataItem = changes.creditProposalItem.currentValue;
    if (this.dataItem !== undefined) {
      this.data.push(this.dataItem);
    }
  }

  initialize() {}

  getPerson(): void {
    this.creditProposalService.loadCacheAll().subscribe((res: ICreditProposal[]) => {
      this._Info = res || [];
      // console.log('response data', res);
      this.setData();
    });
  }

  getOrganizationLegal(): void {
    this.organizationLegalService.loadCacheAll().subscribe((res: IOrganizationLegal[]) => {
      this._organizationLegal = res || [];

      this.setData();
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

          // deedEstablishDate: item.legal.deedEstablishDate,
        },
        // console.log('cek data', this.data)
      ];
    });
  }

  // WORD
  public getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();
    });
  }
  public triggeredSave(): void {
    let paramsId = '';
    this.actRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/management-info';
    //  key: 'credit_proposal/remark/management-info/' + paramsId + this.creditProposalItem.attributes.proposalType + '/' + '/sfdt',

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'credit-proposal-remark-' + '-' + this.paramsIdGet + '-' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'credit-proposal-remark-' + '-' + this.paramsIdGet + '-' + '-management-info-' + fileType + '.sfdt';
      // const fileName = 'credit-proposal-remark-' + paramsId + '-hana/credit_proposal/remark/management-info-' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
    });
  }

  private getContainer(): void {
    let paramsId = '';
    this.actRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/management-info/' + paramsId + '/sfdt',
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
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + '-' + this.paramsIdGet + '-' + '-management-info-sfdt.sfdt');

              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                const contents: string = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
            });
        }
      });
  }

  onCreate(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
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
      // console.log('ini paste');
    }
  }

  public onSelect(value: string, dataMgn: any) {
    this.dataAttrMgn[dataMgn.No - 1].value = value;
    this.item.attributes['managementInfo'].DebtorPerformentCriteria = this.dataAttrMgn;
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
}
