import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { formatBytes } from 'app/shared/helper/utils';
import { takeUntil, Subject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { saveAs as importedSaveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { CreditProposalService } from './credit-proposal.service';

@Component({
  selector: 'jhi-credit-proposal-tab-summary',
  templateUrl: './credit-proposal-tab-summary.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalTabSummaryComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public state: string;
  public dialogVisible: false;
  public data: object[];

  public _item?: ICreditProposal = new CreditProposal();
  public paramId: string;

  private resourceUrl: string;
  private BUCKET: string;
  private KEY = 'credit_proposal/remark/summary';

  public fileTypeSelected: string;
  public fileTypeList: string[] = ['Word', 'Pdf'];

  public viewButton: string;
  public isDataExist = false;

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  @Input() saveWord: any;
  @Input()
  get sourceComponent() {
    return this.viewButton;
  }
  set sourceComponent(item: any) {
    this.viewButton = item;
  }

  constructor(
    public dialog: MatDialog,
    protected reportUtils: ReportUtilService,
    private storageService: StorageService,
    private creditProposalService: CreditProposalService,
    protected applicationConfigService: ApplicationConfigService,
    private actRoute: ActivatedRoute,
    protected messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');

    this.getBucketNameSummary();
    this.triggeredSave();
  }

  public getBucketNameSummary() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
      this.getContainer();
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


   onDocumentChange() {
    this.container.restrictEditing = true;
    // this.getWord();
    this.getContainer();
  }

  private getContainer(): void {
    let paramsId = '';
    this.actRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/summary/' + paramsId + '/' + 'sfdt',
    };
    this.storageService
      .getObjects(this.BUCKET, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        console.log('abednege', obj);

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
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.actRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/summary';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'credit-proposal-remark-' + paramsId + '-summary-' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'credit-proposal-remark-' + paramsId + '-summary-' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
    });
  }

  public generate(data: any): void {
    if (this.fileTypeSelected) {
      this.print(this.fileTypeSelected);
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
      key: this.KEY,
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
      console.log('data.filename @editOrView : ', data.fileName);
      this.storageService
        .fileBlob(data.url)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          const file = new Blob([res.body], { type: res?.body?.type });
          importedSaveAs(file, data.fileName);
        });
    } else {
      console.log('data.filename @editOrView0 : ', data.fileName);
      this.storageService
        .fileBlob(data.url)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          const reader = new FileReader();
          reader.readAsDataURL(res.body!);
          reader.onloadend = e => {
            this.viewBlob('Report', reader.result);
          };
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
        this.onEdit(data);
      } else {
        this.isDataExist = false;
      }
    });
  }

  public onDelete(data: IObj) {
    this.storageService.deleteFile(this.BUCKET, data.key).subscribe(res => {
      this.getFile(this._item.id);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File ' + data.fileName + ' Delete Successfully' });

      this.onRefresh();
    });
  }

  private viewBlob(title: string, data: any) {
    const win = window.open();
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
