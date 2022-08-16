/* import { Component, ViewChild } from '@angular/core';
import { ItemModel, OpenCloseMenuEventArgs, DropDownButtonComponent } from '@syncfusion/ej2-angular-splitbuttons';

@Component({
  selector: 'jhi-collateral-appraisal-process',
  templateUrl: './collateral-appraisal-process.component.html',
  styleUrls: ['./collateral-appraisal-process.css'],
})
export class CollateralAppraisalProcessComponent {
  public BlodType: string[] = ['Objek Jaminan', '.........'];
  // commented when open -- Start
  @ViewChild('dropdownbutton')
  public dropdownbutton: DropDownButtonComponent;
  public data: ItemModel[] = [
    {
      text: 'Rincian',
    },
    {
      text: 'Hapus',
    },
  ];

  public onOpen(args: OpenCloseMenuEventArgs) {
    args.element.parentElement.style.top =
      this.dropdownbutton.element.getBoundingClientRect().top - args.element.parentElement.offsetHeight + 'px';
  }
  // commented when open -- End
}*/

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { StorageService } from 'app/entities/storage/storage.service';
import { formatBytes } from 'app/shared/helper/utils';
import moment from 'moment';

@Component({
  selector: 'jhi-collateral-appraisal-process',
  templateUrl: './collateral-appraisal-process.component.html',
  styleUrls: ['./collateral-appraisal-process.scss'],
})
export class CollateralAppraisalProcessComponent implements OnInit {
  categoryFilter: any;
  isLoading = false; // Flag variable
  file: File = null; // Variable to store file
  sizeFile: string;
  storageBucket: any;
  bucket = 'hana';
  bucketIndex = 0;
  isDropup = true;

  url = 'http://45.32.114.128:8190/storage/';
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.getBucket();
  }

  public items: ItemModel[] = [
    {
      text: 'Cut',
    },
    {
      text: 'Copy',
    },
    {
      text: 'Paste',
    },
  ];

  public getBucket(): void {
    this.storageService.getObjects(this.bucket, { key: 'collateral' }).subscribe((res: HttpResponse<any>) => {
      const responseBody = res?.body;
      if (responseBody.length > 0) {
        this.storageBucket = responseBody;
        this.bucketIndex = responseBody.length;
        console.log(this.bucketIndex);
      } else {
        console.log('tidak ada');
      }
    });
  }

  // On file Select
  public uploadFile($event: { target: HTMLInputElement }): void {
    const currentDate = moment().format('YYYYMMDDHHMMSSMS');
    this.isLoading = true; // outputs the first file
    this.file = $event.target.files[0];
    this.sizeFile = formatBytes(this.file.size);

    const metaData = {
      objectName: `collateral/${this.bucketIndex + 1}/collateral_${this.bucketIndex + 1}_${currentDate}.${this.file.name.split('.')[1]}`,
    };
    const formData = new FormData();
    formData.append('file', this.file);

    this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(res => {
      this.isLoading = false;
      this.file = null;
      this.getBucket();
      console.log(res);
    });
  }
}
