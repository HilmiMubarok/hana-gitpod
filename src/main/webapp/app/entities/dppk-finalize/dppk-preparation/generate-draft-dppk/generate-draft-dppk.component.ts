import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { GenerateReportService } from 'app/entities/generate-report-service/generate-report.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { formatBytes } from 'app/shared/helper/utils';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { saveAs as importedSaveAs } from 'file-saver';

@Component({
  selector: 'jhi-generate-draft-dppk',
  templateUrl: './generate-draft-dppk.component.html',
  styleUrls: ['./generate-draft-dppk.component.scss'],
})
export class GenerateDraftDppkComponent implements OnInit {
  public _disable: boolean;

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  @Input()
  get disable() {
    return this._disable;
  }
  set disable(item: boolean) {
    this._disable = item;
  }

  public isDataExist = false;
  public paramId: string;
  private ngUnsubscribe = new Subject();
  private BUCKET: string;
  private KEYG = 'dppk';
  public _item?: ICreditProposal = new CreditProposal();
  // public fileTypeSelected: string;
  public fileTypeSelected = 'Word';
  public dataPkDraft: object[];
  public parentPath = this.router.url.split('/')[1];

  public displayColumns: string[] = ['no', 'fileName', 'date', 'createBy', 'sizeFile', 'action'];
  constructor(
    public dialog: MatDialog,
    protected messageService: MessageService,
    private http: HttpClient,
    private storageService: StorageService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private generatePkDraftService: GenerateReportService
  ) {}

  ngOnInit(): void {
    this.getBucketNameSummary();
  }

  public generate(): void {
    if (this.fileTypeSelected) {
      this.print();
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

  private print() {
    this.generateFile('Word', '/services/report/api/report/dppk/word/' + this.item.id);
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
        this.dataPkDraft = data;
        this.generatePkDraftService.setDataReportDraft(this.dataPkDraft);
        // this.dataPkDraftCount.emit(data.length);
      });
  }

  public getBucketNameSummary() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];

      if (this.item.id) {
        this.KEYG += `/${this.item.id}/document/draft/`;
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
      key: `dppk/${id}/document/draft/`,
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

  public conditionButtonGeneratePk(): boolean {
    const parentPath = this.router.url.split('/')[1];
    if (parentPath.match(/finalize-pk/g) && this.item.statusId === 'PK_FINALIZE') {
      return true;
    } else {
      return false;
    }
  }

  conditionReviewDppk() {
    if (this.parentPath === 'review-dppk' || this._disable) {
      return true;
    }
    return false;
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
