import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { StorageService } from 'app/entities/storage/storage.service';
import { formatBytes } from 'app/shared/helper/utils';
import moment from 'moment';
import lodash from 'lodash';

@Component({
  selector: 'jhi-collateral-appraisal-process',
  templateUrl: './collateral-appraisal-process.component.html',
  styleUrls: ['./collateral-appraisal-process.scss']
})
export class CollateralAppraisalProcessComponent implements OnChanges {
  @ViewChild('uploader')
  public uploader: ElementRef;

  @Input()
  public appraisalId: number;

  public categoryFilter: string;
  isLoading = false; // Flag variable
  file: File = null; // Variable to store file
  sizeFile: string;
  storageBucket: any;
  bucket: string;
  bucketIndex = 0;
  isDropup = true;
  public items: ItemModel[] = [{ text: 'Cut' }, { text: 'Copy' }, { text: 'Paste' }];
  public files: Object[] = [];

  constructor(private storageService: StorageService) {
    this.categoryFilter = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appraisalId']) {
      this.getBucketName().then(val => {
        this.getFilesByKey(`/appraisals/${this.appraisalId}/jaminan`);
      });
    }
  }

  public filterFilesByCategory(): void {
    this.setViewAllFiles(this.files);
    if (this.categoryFilter !== '') {
      const selectedCategory: string = this.categoryFilter;
      this.files.forEach(function (e) {
        const cat: string = e['tags']['category'];
        if (cat !== selectedCategory) {
          e['display'] = false;
        }
      });
    }
  }

  public deleteFile(key: string): void {
    this.storageService.delete(this.bucket, key).subscribe(res => {
      this.getFilesByKey(`/appraisals/${this.appraisalId}/jaminan`);
    });
  }

  private setViewAllFiles(data: Object[]): void {
    if (data.length > 0) {
      data.forEach(function (e) {
        e['display'] = true;
      });
    }
  }

  public getFilesByKey(_key: string): void {
    const obj: Object = { key: _key };
    this.storageService.getObjects(this.bucket, obj).subscribe(res => {
      this.files = res.body;
      this.setViewAllFiles(this.files);
    });
  }

  public getBucketName(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  // On file Select
  public uploadFile($event: { target: HTMLInputElement }): void {
    const currentDate = moment().format('YYYYMMDDHHMMSSMS');
    this.isLoading = true; // outputs the first file
    this.file = $event.target.files[0];
    this.sizeFile = formatBytes(this.file.size);

    const metaData = {
      objectName: `appraisals/${this.appraisalId}/jaminan/${currentDate}.${this.file.name.split('.')[1]}`,
      category: this.categoryFilter,
    };
    const formData = new FormData();
    formData.append('file', this.file);

    this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(res => {
      this.isLoading = false;
      this.file = null;
      this.uploader.nativeElement.value = '';
      this.getFilesByKey(`/appraisals/${this.appraisalId}/jaminan`);
    });
  }
}
