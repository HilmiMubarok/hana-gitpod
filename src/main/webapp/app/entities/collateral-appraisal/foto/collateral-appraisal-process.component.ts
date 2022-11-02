import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { StorageService } from 'app/entities/storage/storage.service';
import { formatBytes } from 'app/shared/helper/utils';
import { HttpResponse } from '@angular/common/http';
import { CollateralAppraisalService } from '../collateral-appraisal.service';
import moment from 'moment';
import lodash from 'lodash';

@Component({
  selector: 'jhi-collateral-appraisal-process',
  templateUrl: './collateral-appraisal-process.component.html',
  styleUrls: ['./collateral-appraisal-process.scss'],
})
export class CollateralAppraisalProcessComponent implements OnInit, OnChanges {
  @ViewChild('uploader')
  public uploader: ElementRef;

  @Input()
  public appraisalId: number;
  public uploadFiles: any[];
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
  public photoCategory = [];

  constructor(private storageService: StorageService, private collateralAppraisalService: CollateralAppraisalService) {
    this.categoryFilter = '';
    this.uploadFiles = [];
  }

  ngOnInit(): void {
    this.getPhotoCategory();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appraisalId']) {
      this.getBucketName().then(val => {
        this.getFilesByKey(`/appraisals/${this.appraisalId}/jaminan`);
      });
    }
  }

  private getPhotoCategory(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.collateralAppraisalService.customGet('photo-category').subscribe((res: HttpResponse<any>) => {
        this.photoCategory = res.body;

        resolve();
      });
    });
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
    this.storageService.deleteFile(this.bucket, key).subscribe(res => {
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
    this.storageService.getObjects(this.bucket, obj).subscribe((res: any) => {
      this.uploadFiles = res.body;
      this.categoryFilter = res.body[0].tags.category;
      this.setViewAllFiles(this.uploadFiles);
      this.collateralAppraisalService.totalDataFotoObjectJaminan = res.body;
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

  public onSelect(e: any) {
    this.uploadFiles.push(...e.addedFiles);

    for (let index = 0; index < this.uploadFiles.length; index++) {
      const currentDate = moment().format('YYYYMMDDHHMMSSMS');
      this.isLoading = true; // outputs the first file

      this.sizeFile = formatBytes(this.uploadFiles[index].size);

      const metaData = {
        category: this.categoryFilter,
        objectName: `appraisals/${this.appraisalId}/jaminan/${currentDate}` + this.uploadFiles[index].name,
      };
      const formData = new FormData();
      formData.append('file', this.uploadFiles[index]);

      this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(res => {
        this.isLoading = false;

        this.getFilesByKey(`/appraisals/${this.appraisalId}/jaminan`);
      });
    }
  }

  public onRemove(f: any) {
    this.isLoading = true; // outputs the first file

    this.storageService.deleteFile(this.bucket, f.key).subscribe(res => {
      this.isLoading = false;

      this.getFilesByKey(`/appraisals/${this.appraisalId}/jaminan`);
    });
  }
}
