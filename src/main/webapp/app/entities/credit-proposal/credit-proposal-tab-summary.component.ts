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

@Component({
  selector: 'jhi-credit-proposal-tab-summary',
  templateUrl: './credit-proposal-tab-summary.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabSummaryComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public state: string;
  public dialogVisible: false;
  public data: object[];

  public _item?: ICreditProposal = new CreditProposal();
  public paramId: string;

  private resourceUrl: string;
  // private BUCKET = 'hana';
  private BUCKET: string;
  private KEY = 'credit_proposal/summary';

  public fileTypeSelected: string;
  public fileTypeList: string[] = ['Word', 'Pdf'];

  public viewButton: string;
  public isDataExist = false;

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
    protected applicationConfigService: ApplicationConfigService,
    private actRoute: ActivatedRoute,
    protected messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');

    this.getBucketNameSummary().then(res => {
      this.BUCKET = res['body']['bucket'];
      this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
        this.paramId = params['id'];
      });

      if (this.paramId) {
        this.KEY += `/${this.paramId}`;
      } else {
        console.warn('Param id not found');
      }

      this.onRefresh();
    });
  }

  private getBucketNameSummary(): Promise<Object> {
    return new Promise<Object>((resolve, reject) => {
      this.http.get<Object>(this.resourceUrl + '/bucket', { observe: 'response' }).subscribe(response => {
        resolve(response);
      });
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
      console.log('ini res', res);
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
