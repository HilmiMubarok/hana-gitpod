/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BeforeOpenEventArgs, BeforeSaveEventArgs, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject } from 'rxjs';
import { retry, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'jhi-repayment-spreadsheet',
  templateUrl: './repayment-spreadsheet.component.html',
})
export class RepaymentSpreadsheetComponent implements OnInit, OnDestroy, OnChanges {
  @Input() jhifilter: 'Total Exposure > IDR 15 Bn' | 'Total Exposure < IDR 15 Bn' | 'Total Exposure Back to Back' | '' =
    'Total Exposure > IDR 15 Bn';
  private ngUnsubscribe = new Subject();
  @ViewChild('spreadsheet') public spreadsheetObj: SpreadsheetComponent;

  private bucket = 'hana';
  private key: string = 'credit_proposal/repayment_capability';
  private updateKey: string = '';
  private paramsId: string;
  private isIdHasData: boolean = true;
  private isMasterDataExist: boolean = false;

  private fileBeforeOpen: File = null;

  constructor(private storageService: StorageService, private actRoute: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    console.log('filter', this.jhifilter);

    if (changes?.jhifilter?.currentValue !== changes?.jhifilter?.previousValue) {
      this.getUpdatekey();
      this.created();
    }
  }

  getUpdatekey(): void {
    if (this.jhifilter === '' || this.jhifilter === 'Total Exposure > IDR 15 Bn') {
      this.updateKey = 'above';
    } else if (this.jhifilter === 'Total Exposure < IDR 15 Bn') {
      this.updateKey = 'below';
    }
    console.log(this.updateKey);
  }

  ngOnInit(): void {
    this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.paramsId = params['id'];
    });
    this.getUpdatekey();
    this.created();
  }

  beforeOpen(args: BeforeOpenEventArgs): void {
    console.log(args);
    if (args && args.file) {
      const temp = args.file as File;
      if (temp.type !== '') {
        this.fileBeforeOpen = args.file as File;
        // if want to save data to minio when event open data
        this.storeFile();
      } else {
        console.warn('Spreadsheet Load from server');
      }
    }
  }

  storeFile(): void {
    const metaData = {
      objectName: this.isMasterDataExist
        ? `${this.key}/${this.paramsId}/${this.updateKey}/template_repayment_capability`
        : `${this.key}/${this.updateKey}`,
    };

    const formData = new FormData();
    formData.append('file', this.fileBeforeOpen);

    this.storageService.uploadMeta('hana', formData, metaData).subscribe(res => {
      console.log(res);
    });
  }

  beforeSave(args: BeforeSaveEventArgs): void {
    // args.fileName = 'template_repayment_capability';
    // args.saveType = 'Xlsx';
    // args.needBlobData = true;
    console.log(args);
    // if want to save data to minio when event save
    // this.storeFile();
  }

  created(): void {
    console.log(this.updateKey);
    if (this.paramsId) {
      this.storageService
        .getObjects(this.bucket, {
          key: this.isIdHasData ? `${this.key}/${this.paramsId}/${this.updateKey}` : `${this.key}/${this.updateKey}`,
        })
        .pipe(retry(2), takeUntil(this.ngUnsubscribe))
        .subscribe((res: any) => {
          if (res.body.length === 1) {
            this.getFile(res.body[0]?.url);
            this.isIdHasData = true;
          } else if (res.body.length > 1) {
            this.isIdHasData = true;
            const result: any = this.findByID(res.body, `${this.paramsId}`);
            this.getFile(result.url);
          } else {
            if (this.isIdHasData === false && res.body.length === 0) {
              console.warn('Master data empty, please insert master data');
              this.isMasterDataExist = false;
              this.spreadsheetObj.open({});
              this.spreadsheetObj.clear({});
              return;
            } else {
              this.isIdHasData = false;
              this.created();
              this.isMasterDataExist = true;
            }
          }
        });
    }
  }
  getFile(urlFile: string): void {
    this.storageService
      .fileBlob(urlFile)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        const file = new File([res.body], 'template_repayment_capability.xlsx');
        this.spreadsheetObj.open({ file });
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  findByID(arr: any[], id: string): object {
    console.log('ini arr');
    const result = arr.map(a => a.key.split('/').some(w => w === id)).indexOf(true) === -1 ? false : true;
    let obj: object;
    if (result === false) {
      obj = arr.find(o => o.key === 'credit_proposal/repayment_capability/template_repayment_capability');
    }
    return obj;
  }
}
