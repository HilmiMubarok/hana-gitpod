import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { StorageService } from '../storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { formatBytes } from 'app/shared/helper/utils';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { saveAs as importedSaveAs } from 'file-saver';
import { UpdateCoverageSummary } from './update-coverage-function';
import lodash from 'lodash';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';

@Component({
  selector: 'jhi-credit-proposal-summary-generate-memo-banding',
  templateUrl: './credit-proposal-summary-generate-memo-banding.component.html',
  styleUrls: ['./credit-proposal-summary-generate-memo-banding.component.scss'],
})
export class CreditProposalSummaryGenerateMemoBandingComponent implements OnInit {
  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  @Input()
  get collateralProperties() {
    return this._collateralProperty;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperty = item;
  }

  private _collateralProperty: ICollateralProperty[];

  public isDataExist = false;
  public paramId: string;
  private ngUnsubscribe = new Subject();
  private BUCKET: string;
  private KEYG = 'credit_proposal/memo_banding';
  public _item?: ICreditProposal = new CreditProposal();
  public fileTypeSelected: string;
  public data: object[];
  public fileTypeList: string[] = ['Word', 'Pdf'];
  public displayColumns: string[] = ['no', 'fileName', 'date', 'createBy', 'sizeFile', 'action'];
  constructor(
    public dialog: MatDialog,
    protected messageService: MessageService,
    private http: HttpClient,
    private storageService: StorageService,
    private actRoute: ActivatedRoute,
    private updateCoverage: UpdateCoverageSummary
  ) {}

  ngOnInit(): void {
    this.getBucketNameSummary();
  }

  public generate(data: any): void {
    const creditProposalStartState = lodash.cloneDeep(this.item);
    this.updateCoverage.updateCoverage(this.item, creditProposalStartState, this.collateralProperties).then(() => {
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
    });
  }

  private print(fileType: string) {
    if (fileType === 'Word') {
      this.generateFile(fileType, '/services/report/api/report/memo_banding/word/' + this._item.id);
    } else if (fileType === 'Pdf') {
      this.generateFile(fileType, '/services/report/api/report/memo_banding/pdf-word/' + this._item.id);
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

  public getBucketNameSummary() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];

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
          this.getFile(this._item.id);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File ' + data.fileName + ' Delete Successfully' });

          this.onRefresh();
        });
      }
    });
  }

  private getFile(id: number): void {
    const predicate: Object = {
      key: `/credit_proposal/memo_banding/${id}`,
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
