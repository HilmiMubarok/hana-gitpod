import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';

import { StorageService } from 'app/entities/storage/storage.service';
import { takeUntil, Subject, from, forkJoin, tap, map, switchMap } from 'rxjs';
import { BusinessActivityService } from '../../busines-activity/business-activity.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-financial-statement-remarks',
  templateUrl: './financial-statement-remarks.component.html',
  styleUrls: ['./financial-statement-remarks.component.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalFinancialStatementRemarksComponent implements OnInit, OnChanges, OnDestroy {
  public _creditProposalItem: ICreditProposal;
  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;

  public customHeadersJWT: any;

  @Input() saveWordMinio: any;
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(data: ICreditProposal) {
    this._creditProposalItem = data;
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected creditProposalService: CreditProposalService,
    protected router: Router,
    private storageService: StorageService,
    private baService: BusinessActivityService,
    protected messageService: MessageService
  ) {
    this.bucket = '';
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  ngOnInit() {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/financial-statement/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.saveWordMinio?.currentValue) {
      this.triggeredSave();
    }
  }

  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      args.isHandled = true;
    }
  }

  onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }

  // public triggeredSave(): void {
  //   let paramsId = '';
  //   this.activatedRoute.params.subscribe(params => {
  //     paramsId = params['id'];
  //   });
  //   const key = 'credit_proposal/remark/financial-statement';

  //   const timeStamp = Math.floor(Date.now() / 1000);

  //   const docEditor = this.container?.documentEditor as DocumentEditorComponent;

  //   docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
  //     const fileType = 'word';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-financial-statement' + fileType + '.docs';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
  //   });

  //   docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
  //     const fileType = 'sfdt';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-financial-statement' + fileType + '.sfdt';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
  //   });
  // }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    this.baService.setLoading(true);
    const key = 'credit_proposal/remark/financial-statement';
    const docEditor = this.container?.documentEditor as DocumentEditorComponent;
    const saveDocx$ = from(docEditor.saveAsBlob('Docx'));
    const saveSfdt$ = from(docEditor.saveAsBlob('Sfdt'));

    forkJoin([saveDocx$, saveSfdt$])
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.baService.setLoading(true)),
        map(([docx, sfdt]) => {
          this.baService.setLoading(true);
          const fileTypeWord = 'word';
          const fileName = 'credit-proposal-remark-' + paramsId + '-financial-statement' + fileTypeWord + '.docs';
          const metaData = {
            objectName: `${key}/${paramsId}/${fileTypeWord}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([docx], fileName));

          // Validate file size must be larger than 20mb
          if (docx.size > 50000000) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'File size must be less than 50mb',
            });
            this.baService.setLoading(false);
            return;
          }

          this.storageService
            .uploadMeta(this.bucket, formData, metaData)
            .pipe(
              switchMap(() => {
                const fileTypeSfdt = 'sfdt';
                const fileNames = 'credit-proposal-remark-' + paramsId + '-financial-statement' + fileTypeSfdt + '.sfdt';
                const metaDatas = {
                  objectName: `${key}/${paramsId}/${fileTypeSfdt}/${fileNames}`,
                };
                const formDatas = new FormData();
                formDatas.append('file', new File([sfdt], fileNames));

                return this.storageService.uploadMeta(this.bucket, formDatas, metaDatas);
              })
            )
            .subscribe({
              next(res) {
                console.log('Next Success uploading files', res);
              },
              complete: () => {
                console.log('complete');
                this.baService.setLoading(false);
              },
              error: err => {
                console.log('error', err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Something went wrong while uploading the document. Please try again.',
                });
                this.baService.setLoading(false);
              },
            });
        })
      )
      .subscribe();
  }

  private getContainer(): void {
    this.baService.isUpload$.next(false);
    this.baService.setLoading(true);

    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const obj = {
      key: 'credit_proposal/remark/financial-statement/' + paramsId + '/sfdt',
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
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-financial-statement-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                const contents: string = e.target.result;
                docEditor.open(contents);
              };
              fileReader.readAsText(this.fileGet);
              this.baService.setLoading(false);
            });
        } else {
          this.baService.setLoading(false);
        }
      });
  }
}
