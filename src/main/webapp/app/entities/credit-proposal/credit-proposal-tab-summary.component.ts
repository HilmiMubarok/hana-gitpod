import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { formatBytes } from 'app/shared/helper/utils';
import { takeUntil, Subject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { saveAs as importedSaveAs } from 'file-saver';

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

  onEdit(data: IObj): void {
    this.storageService
      .fileBlob(data.url)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const file = new Blob([res.body], { type: res?.body?.type });
        importedSaveAs(file, data.fileName);
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
  fileName?: string;
  name?: string;
  size?: number;
  tags?: any;
  url?: string;
}
