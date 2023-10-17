import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
} from '@syncfusion/ej2-angular-documenteditor';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'jhi-cp-memo-banding-remark',
  templateUrl: './cp-memo-banding-remark.component.html',
  styleUrls: ['../../loan-facility/credit-proposal-tab-loan-facility-detail.css', '../../loan-facility/grid/loan.scss'],
})
export class CPMemoBandingRemarkComponent implements OnInit, OnChanges {
  constructor(protected activatedRoute: ActivatedRoute, protected storageService: StorageService) {
    this.bucket = '';
  }

  @Input() saveWordMinio: any;

  @Input() isViewMode: Boolean = false;

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  customHeadersJWT;
  ngOnInit() {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'memo_banding_remarks/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.saveWordMinio) {
      this.triggeredSave();
    }
  }

  private getToken(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  onDocumentChange() {
    this.container.restrictEditing = this.isViewMode as boolean;
  }

  paramsIdGet;
  getKey;
  onCreate(): void {
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }

  bucket;
  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  private ngUnsubscribe = new Subject();
  private fileGet: File;

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'memo_banding_remarks';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
      const fileType = 'word';
      const fileName = 'memo-banding-remarks-' + paramsId + '-memo-' + fileType + '.docs';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
    });

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      const fileType = 'sfdt';
      const fileName = 'memo-banding-remarks-' + paramsId + '-memo-' + fileType + '.sfdt';
      const metaData = {
        objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
      };
      const formData = new FormData();
      formData.append('file', new File([exportedDocument], fileName));

      this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
    });
  }

  private getContainer(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'memo_banding_remarks/' + this.paramsIdGet + '/sfdt',
    };
    this.storageService
      .getObjects(this.bucket, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'memo-banding-remarks-' + this.paramsIdGet + '-memo-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                const contents: string = e.target.result;
                docEditor.open(contents);
                // this.remarksService.setLoadingGet(false);
              };
              fileReader.readAsText(this.fileGet);
            });
        }
      });
  }
}
