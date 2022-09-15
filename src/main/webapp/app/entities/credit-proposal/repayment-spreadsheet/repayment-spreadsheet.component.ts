/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BeforeOpenEventArgs, BeforeSaveEventArgs, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'jhi-repayment-spreadsheet',
  templateUrl: './repayment-spreadsheet.component.html',
})
export class RepaymentSpreadsheetComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild('spreadsheet') public spreadsheetObj: SpreadsheetComponent;

  private bucket = 'hana';
  private key: string = 'credit_proposal/repayment_capability';
  private paramsId: string;
  private isIdHasData: boolean = true;

  constructor(private storageService: StorageService, private actRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.paramsId = params['id'];
    });
    this.created();
  }

  beforeOpen(args: BeforeOpenEventArgs): void {
    if (args && args.file) {
      const documentRepayment: File = args.file as File;
      const metaData = {
        objectName: `credit_proposal/repayment_capability/${this.paramsId}/template_repayment_capability`,
      };
      // console.log(documentRepayment);
      // console.log(metaData);

      const formData = new FormData();
      formData.append('file', documentRepayment);

      this.storageService.uploadMeta('hana', formData, metaData).subscribe(res => {
        console.log(res);
      });
    }
  }

  beforeSave(args: BeforeSaveEventArgs): void {
    args.fileName = 'template_repayment_capability';
    args.saveType = 'Xlsx';
  }

  created(): void {
    if (this.paramsId) {
      this.storageService
        .getObjects(this.bucket, {
          key: this.isIdHasData ? `${this.key}/${this.paramsId}` : `${this.key}`,
        })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res: any) => {
          if (res.body.length > 0) {
            this.getFile(res.body[0]?.url);
            this.isIdHasData = true;
          } else {
            this.isIdHasData = false;
            this.created();
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
}
