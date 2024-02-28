import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { formatBytes } from 'app/shared/helper/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { saveAs as importedSaveAs } from 'file-saver';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { GenerateReportService } from 'app/entities/generate-report-service/generate-report.service';

@Component({
  selector: 'jhi-generate-dpdl-draft-loan-operation',
  templateUrl: './generate-dpdl-draft-loan-operation.component.html',
  styleUrls: ['./generate-dpdl-draft.style.scss'],
})
export class GenerateDpdlDraftLoanOperationComponent implements OnInit, OnChanges {
  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  public isDataExist = false;
  public paramId: string;
  private ngUnsubscribe = new Subject();
  private BUCKET: string;
  private KEYG = 'dpdl';
  public _item?: ICreditProposal = new CreditProposal();
  // public fileTypeSelected: string;
  public fileTypeSelected = 'Pdf';
  // public fileTypeList: string[] = ['Word', 'Pdf'];
  public displayColumns: string[] = ['no', 'fileName', 'date', 'createBy', 'sizeFile', 'action'];
  public dataDraftDpdl: object[];
  public parentPath = this.router.url.split('/')[1];
  constructor(
    public dialog: MatDialog,
    protected messageService: MessageService,
    private http: HttpClient,
    private storageService: StorageService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private generateDpdlDraftService: GenerateReportService
  ) {}

  ngOnInit(): void {
    this.getBucketNameSummary();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }

    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
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
    this.generateFile('Pdf', '/services/report/api/report/dpdl/pdf-word/' + this._item.id);
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
        this.dataDraftDpdl = data;
        this.generateDpdlDraftService.setDataReportDraft(this.dataDraftDpdl);
      });
  }

  public getBucketNameSummary() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];

      this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
        this.paramId = params['id'];
      });

      if (this.paramId) {
        this.KEYG += `/${this.paramId}/document/draft_dpdl/`;
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
      key: `/dpdl/${id}/document/draft_dpdl`,
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

  // public conditionReviewDpdlDocument(): boolean {
  //   if (
  //     this.parentPath.match(/review-dpdl/g) ||
  //     this.parentPath.match(/finalize-dppk/g) ||
  //     this.parentPath.match(/loan-ops-distribution/g) ||
  //     this.parentPath.match(/loan-ops-checking/g) ||
  //     this.parentPath.match(/loan-ops-review/g) ||
  //     this.parentPath.match(/review-dppk/g)
  //   ) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  /**
   * This function checks the parent path for a specific pattern and returns true if it matches, otherwise returns false.
   *
   * @return {boolean} true if the parent path matches the pattern, otherwise false
   */
  public conditionButton(): boolean {
    if (this.parentPath.match(/finalize-dpdl/g)) {
      return true;
    } else {
      return false;
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
