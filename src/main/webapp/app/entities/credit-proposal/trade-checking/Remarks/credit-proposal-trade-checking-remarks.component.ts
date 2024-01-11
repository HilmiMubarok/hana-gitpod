import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { HttpClient } from '@angular/common/http';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { BusinessActivityService } from '../../busines-activity/business-activity.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-credit-proposal-trade-checking-remarks',
  templateUrl: './credit-proposal-trade-checking-remarks.component.html',
  styleUrls: ['../trade-checking.scss'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class RemarskComponent implements OnInit, OnDestroy {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  private _creditProposal: ICreditProposal;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  constructor(
    protected creditProposalService: CreditProposalService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private baService: BusinessActivityService,
    protected messageService: MessageService
  ) {}

  private BUCKET: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;
  public resourceUrl: string;

  public customHeadersJWT: any;

  private getContainer(): void {
    this.baService.isUpload$.next(false);
    this.baService.setLoading(true);

    // let paramsId = '';
    // this.activatedRoute.params.subscribe(params => {
    //   paramsId = params['id'];
    // });

    const obj = {
      key: this.getKey,
    };

    // const obj = {
    //   key: 'credit_proposal/remark/trade-checking/' + paramsId + '/sfdt',
    // };
    this.storageService
      .getObjects(this.BUCKET, obj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-trade-checking-sfdt.sfdt');
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

  onCreate(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
      // console.log('ini paste');
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    this.baService.setLoading(true);
    const key = 'credit_proposal/remark/trade-checking';
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
          const fileName = 'credit-proposal-remark-' + paramsId + '-trade-checking-' + fileTypeWord + '.docs';
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
            .uploadMeta(this.BUCKET, formData, metaData)
            .pipe(
              switchMap(() => {
                const fileTypeSfdt = 'sfdt';
                const fileNames = 'credit-proposal-remark-' + paramsId + '-trade-checking-' + fileTypeSfdt + '.sfdt';
                const metaDatas = {
                  objectName: `${key}/${paramsId}/${fileTypeSfdt}/${fileNames}`,
                };
                const formDatas = new FormData();
                formDatas.append('file', new File([sfdt], fileNames));

                return this.storageService.uploadMeta(this.BUCKET, formDatas, metaDatas);
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

  // public triggeredSave(): void {
  //   let paramsId = '';
  //   this.activatedRoute.params.subscribe(params => {
  //     paramsId = params['id'];
  //   });
  //   const key = 'credit_proposal/remark/trade-checking';

  //   const timeStamp = Math.floor(Date.now() / 1000);

  //   const docEditor = this.container?.documentEditor as DocumentEditorComponent;

  //   docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
  //     const fileType = 'word';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-trade-checking-' + fileType + '.docs';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
  //   });

  //   docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
  //     const fileType = 'sfdt';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-trade-checking-' + fileType + '.sfdt';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.BUCKET, formData, metaData).subscribe();
  //   });
  // }

  ngOnInit() {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.BUCKET = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      (this.getKey = 'credit_proposal/remark/trade-checking/' + this.paramsIdGet + '/sfdt'),
        this.getBucket().then(res => {
          this.getContainer();
        });
    });

    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
    // this.getWord();
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

  // public getWord() {
  //   this.storageService.getBucketName().subscribe(val => {
  //     this.BUCKET = val.body['bucket'];
  //     this.getContainer();
  //   });
  // }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.BUCKET = res.body['bucket'];
        resolve();
      });
    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.saveWord === true) {
  //     this.triggeredSave();
  //   }
  // }

  onDocumentChange() {
    this.container.restrictEditing = true;

    // this.getTradeObj();
  }
  // getTradeObj() {
  //   this.BUCKET = this.BUCKET;
  //   this.activatedRoute.params.subscribe(params => {
  //     this.paramsIdGet = params['id'];
  //     this.getKey = 'credit_proposal/remark/trade-checking/' + this.paramsIdGet + '/sfdt';
  //     this.getContainer();
  //   });
  // }
  // public ststusId:Boolean
  // public x(){
  //   if(this.creditProposal.statusId==='DRAFT'){
  //     this.ststusId = true
  //   }
  // }

  // public tools: object = {
  //   items: [
  //     'FontName',
  //     'FontSize',
  //     'Bold',
  //     'Italic',
  //     'Underline',
  //     'StrikeThrough',
  //     'FontColor',
  //     'BackgroundColor',
  //     'OrderedList',
  //     'UnorderedList',
  //     'Outdent',
  //     'Indent',
  //     'SuperScript',
  //     'SubScript',
  //     'CreateLink',
  //   ],
  // };
}
