import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ribbonClick } from '@syncfusion/ej2-angular-spreadsheet';
import { PositionService } from 'app/entities/position/position.service';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';

import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';

import { StorageService } from 'app/entities/storage/storage.service';
import { takeUntil, Subject } from 'rxjs';
import { doc } from 'prettier';

@Component({
  selector: 'jhi-credit-proposal-busines-activity',
  templateUrl: './credit-proposal-tab-business-activity.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalTabBusinessActivityComponent implements OnInit, OnChanges {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;
  public key1: string;

  @ViewChild('document_editor_containers')
  public containers: DocumentEditorContainerComponent;
  @ViewChild('document_editors')
  public documentEditors: DocumentEditorComponent;

  private _creditProposalItem: ICreditProposal;

  public dataAttrPass = [
    {
      No: 1,
      Parameter: 'There was no delay in previous projects undertaken',
      value: 'No',
    },
    {
      No: 2,
      Parameter: 'There was no cost over-run in previous project undertaken',
      value: 'No',
    },
    {
      No: 3,
      Parameter: 'Previous projects achieved 100% sales',
      value: 'No',
    },
    {
      No: 4,
      Parameter: 'There is standing instruction for payment form Bouwheer to Escrow Account in KEB Hana directly',
      value: 'No',
    },
    {
      No: 5,
      Parameter: 'There was no delay in obtaining relevant project approvals from the relevant approving authorities',
      value: 'No',
    },
    {
      No: 6,
      Parameter: 'Max financing 70% of activity progress that is explained in Contract',
      value: 'No',
    },
    {
      No: 7,
      Parameter: 'There was no disputes or legal action taken against contractors, sub-contractors or suppliers',
      value: 'No',
    },
  ];

  attributes: any;
  public _item: ICreditProposal;
  public _projectAnalysis: string;

  @Input()
  get creditProposalItem() {
    return this._item;
  }
  set creditProposalItem(item: ICreditProposal) {
    this._item = item;
  }

  public tes() {
    if (this.creditProposalItem.attributes['businessActivity'].BusinessAct.length !== 0) {
      for (let i = 0; i < this.creditProposalItem.attributes['businessActivity'].BusinessAct.length; i++) {
        this.dataAttrPass = this.creditProposalItem.attributes['businessActivity'].BusinessAct;
      }
    }
  }

  // @Input() public projectAnalysis: string;
  @Input()
  get projectAnalysis() {
    return this._projectAnalysis;
  }
  set projectAnalysis(item: any) {
    this.selectedMenu = 'BUSINESS ACTIVITY';
  }

  // @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  constructor(
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ) {
    this.bucket = '';
  }

  public creditProposaldata: ICreditProposal = new CreditProposal();
  public value: string;

  dataAttr: Object[];

  public datax: any[];

  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  public onSelect(value: string, data: any): void {
    this.dataAttrPass[data.No - 1].value = value;
    this.creditProposalItem.attributes['businessActivity'].BusinessAct = this.dataAttrPass;
  }

  public parameter: string;
  public notesPa?: string;

  btnSave($event: any): void {
    this.creditProposalItem.attributes['businessActivity'].BusinessAct = [
      ...this.creditProposalItem.attributes['businessActivity'].BusinessAct,
      {
        parameter: this.parameter,
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._item.attributes['businessActivity'].notesPa === undefined) {
      this._item.attributes['businessActivity'].notesPa = '';
    }
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  ngOnInit() {
    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/business-activity/' + this.paramsIdGet + '/sfdt';
      this.key1 = 'credit_proposal/remark/project-analysis/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });

    this.selectedMenu = 'BUSINESS ACTIVITY';
    this.tes();
  }
  onDocumentChange() {
    this.container.restrictEditing = true;

    this.getOpiniObj();
  }
  public getOpiniObj() {
    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/business-activity/' + this.creditProposalItem.id + '/sfdt';
      this.getContainer();
    });
  }

  private getContainer(): void {
    const obj = {
      key: this.getKey,
    };
    this.storageService
      .getObjects(this.bucket, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-business-activity-sfdt.sfdt');
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

    const obj1 = {
      key: this.key1,
    };

    this.storageService
      .getObjects(this.bucket, obj1)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-project-analysis-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.containers?.documentEditor as DocumentEditorComponent;
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

  onCreates(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    this.containers.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
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
      console.log('ini paste');
    }
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/business-activity';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;
    if (docEditor !== undefined) {
      docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const fileType = 'word';
        const fileName = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileType + '.docs';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileType = 'sfdt';
        const fileName = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileType + '.sfdt';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });
    }
  }

  public triggeredSavePa(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/project-analysis';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.containers?.documentEditor as DocumentEditorComponent;
    if (docEditor !== undefined) {
      docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const fileType = 'word';
        const fileName = 'credit-proposal-remark-' + paramsId + '-project-analysis-' + fileType + '.docs';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileType = 'sfdt';
        const fileName = 'credit-proposal-remark-' + paramsId + '-project-analysis-' + fileType + '.sfdt';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });
    }
  }
  public selectedMenu: string;

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public menuItems: MenuItemModel[] = [{ text: 'BUSINESS ACTIVITY' }, { text: 'PROJECT ANALYSIS' }];

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
}
