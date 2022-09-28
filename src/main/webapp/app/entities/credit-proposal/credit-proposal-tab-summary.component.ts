import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { formatBytes } from 'app/shared/helper/utils';
import { takeUntil, Subject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { TabSummaryDialogViewComponent } from './tab-summary-dialog-view/tab-summary-dialog-view.component';

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

  private BUCKET = 'hana';
  private KEY = 'credit_proposal/summary';

  constructor(
    public dialog: MatDialog,
    protected reportUtils: ReportUtilService,
    private storageService: StorageService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.paramId = params['id'];
    });

    if (this.paramId) {
      this.KEY += `/${this.paramId}`;
    } else {
      console.warn('Param id not found');
    }

    this.onRefresh();
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
    this.state = 'idle';
    this.dialogVisible = false;
    this.print();
  }

  print() {
    this.reportUtils.viewFile('/services/report/api/report/credit-proposal/pdf', { id: this._item.id.toString });
  }

  onRefresh(): void {
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

  onEdit(urlFile: string):void{
    this.storageService
      .fileBlob(urlFile)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const file = new Blob([res.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      })
  }

  // public onEdit(data: IObj): void {
  //   const predicate = {
  //     width: '80vw',
  //     data: { url: data.url },
  //   };

  //   const dialogRef = this.dialog.open(TabSummaryDialogViewComponent, predicate);
  //   dialogRef.afterClosed().subscribe(result => {});
  // }

  onEdit2(urlFile: string): void {
    this.storageService
      .fileBlob(urlFile)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        console.log(res);
        // const file = new File([res.body], 'file.pdf');
        // this.spreadsheetObj.open({ file });
        // this.document = file;

        const file = new Blob([res.body], { type: 'application/pdf' });
        // const fileURL = URL.createObjectURL(file);
        // const viewer = (<any>document.getElementById('pdfViewer')).ej2_instances[0];
        // viewer.load(fileURL, null);
        let predicate;

        // eslint-disable-next-line @typescript-eslint/no-shadow
        this.blobToBase64(file).then(res => {
          if (res) {
            predicate = {
              width: '80vw',
              data: { file: res },
            };

            const dialogRef = this.dialog.open(TabSummaryDialogViewComponent, predicate);
            dialogRef.afterClosed().subscribe(result => {});
          }
        });

      });
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
  name?: string;
  size?: number;
  tags?: any;
  url?: string;
}
