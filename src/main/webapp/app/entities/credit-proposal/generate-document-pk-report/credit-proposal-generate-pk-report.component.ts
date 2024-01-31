import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { formatBytes } from 'app/shared/helper/utils';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { saveAs as importedSaveAs } from 'file-saver';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { StorageService } from 'app/entities/storage/storage.service';

@Component({
  selector: 'jhi-credit-proposal-generate-pk-report',
  templateUrl: './credit-proposal-generate-pk-report.component.html',
  styleUrls: ['./credit-proposal-generate-pk-report.component.scss'],
})
export class CreditProposalGeneratePkReportComponent implements OnInit, OnChanges {
  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  @Input() fileDpdlFinal: any;
  @Input() fileDocPKFinal: any;

  public isDataExist = false;
  public paramId: string;
  private ngUnsubscribe = new Subject();
  private BUCKET: string;
  private KEYG = 'generate-final';
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
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getBucketNameSummary();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Loan Analys Generate Dar And SPPK
    if (changes.fileDpdlFinal) {
      this.data = this.fileDpdlFinal;
    }
    if (changes.fileDocPKFinal) {
      this.data = this.fileDocPKFinal;
    }
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
        this.KEYG += `/${this.paramId}/document/`;
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
      key: this.KEYG,
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
