import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { formatBytes } from 'app/shared/helper/utils';
import { takeUntil, Subject } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { StorageService } from '../../storage/storage.service';

@Component({
  selector: 'jhi-button-generate-compliance',
  templateUrl: './loan-analys-generate-compliance.component.html',
})
export class LoanAnalysGenerateComplianceComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public state: string;
  public dialogVisible: false;
  public data: object[];

  public _item: ICreditProposal;
  public paramId: string;

  private resourceUrl: string;
  // private BUCKET = 'hana';
  private BUCKET: string;
  private KEY = 'loan-analys/summary';

  public fileTypeSelected = 'Word';

  public viewButton: string;

  @Input()
  get creditProposal() {
    return this._item;
  }
  set creditProposal(item: ICreditProposal) {
    this._item = item;
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
      this.generateFileCompliance(fileType, '/services/report/api/report/compliance/word/' + this.creditProposal.id);
    }
  }

  private generateFileCompliance(fileType: string, api: string, req?: any) {
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
