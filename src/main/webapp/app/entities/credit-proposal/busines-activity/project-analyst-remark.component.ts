import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';
import { ICreditProposal } from '../credit-proposal.model';
import { Subject, forkJoin, from, map, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessActivityService } from './business-activity.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { MenuEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-credit-proposal-project-analyst-remark',
  templateUrl: './project-analyst-remark.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class ProjectAnalystRemarkComponent implements OnInit, OnDestroy, OnChanges {
  private _creditProposalItem: ICreditProposal;

  public customHeadersJWT: any;

  public _item: ICreditProposal;
  public _projectAnalysis: string;

  private bucket: string;
  private ngUnsubscribe = new Subject();
  private paramsIdGet: string;
  private getKey: string;
  private fileGet: File;
  constructor(
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private baService: BusinessActivityService,
    protected messageService: MessageService
  ) {
    this.bucket = '';
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() saveWordMinio: any;
  // @Input()
  // get creditProposalItem() {
  //   return this._creditProposalItem;
  // }

  // set creditProposalItem(data: ICreditProposal) {
  //   this._creditProposalItem = data;
  // }

  @Input()
  get creditProposalItem() {
    return this._item;
  }
  set creditProposalItem(item: ICreditProposal) {
    this._item = item;

    this._item.attributes['businessActivity'].visitDate = this._item.attributes['businessActivity'].visitDate.split('T')[0];
  }

  @Input()
  get projectAnalysis() {
    return this._projectAnalysis;
  }
  set projectAnalysis(item: any) {
    this.selectedMenu = 'BUSINESS ACTIVITY';
  }

  @ViewChild('document_editor_containers')
  public containers: DocumentEditorContainerComponent;
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

    this.selectedMenu = 'BUSINESS ACTIVITY';
    this.bucket = ' ';
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/project-analysis/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainers();
      });
    });
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
    if (this.saveWordMinio) {
      this.triggeredSave();
    }
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
    this.containers.serviceUrl = '/services/los/api/wordeditor/';
  }

  // public triggeredSave(): void {
  //   let paramsId = '';
  //   this.activatedRoute.params.subscribe(params => {
  //     paramsId = params['id'];
  //   });
  //   const key = 'credit_proposal/remark/guarantor';

  //   const timeStamp = Math.floor(Date.now() / 1000);

  //   const docEditor = this.container?.documentEditor as DocumentEditorComponent;

  //   docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
  //     const fileType = 'word';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-guarantor' + fileType + '.docs';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
  //   });

  //   docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
  //     const fileType = 'sfdt';
  //     const fileName = 'credit-proposal-remark-' + paramsId + '-guarantor' + fileType + '.sfdt';
  //     const metaData = {
  //       objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //     };
  //     const formData = new FormData();
  //     formData.append('file', new File([exportedDocument], fileName));

  //     this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
  //   });
  // }

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
    const key = 'credit_proposal/remark/project-analysis';
    const docEditor = this.containers?.documentEditor as DocumentEditorComponent;
    const saveDocx$ = from(docEditor.saveAsBlob('Docx'));
    const saveSfdt$ = from(docEditor.saveAsBlob('Sfdt'));

    forkJoin([saveDocx$, saveSfdt$])
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.baService.setLoading(true)),
        map(([docx, sfdt]) => {
          this.baService.setLoading(true);
          const fileTypeWord = 'word';
          const fileName = 'credit-proposal-remark-' + paramsId + '-project-analysis-' + fileTypeWord + '.docs';
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
              detail: 'File size must be less than 20mb',
            });
            this.baService.setLoading(false);
            return;
          }

          this.storageService
            .uploadMeta(this.bucket, formData, metaData)
            .pipe(
              switchMap(() => {
                const fileTypeSfdt = 'sfdt';
                const fileNames = 'credit-proposal-remark-' + paramsId + '-project-analysis-' + fileTypeSfdt + '.sfdt';
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

  // private getContainer(): void {
  //   let paramsId = '';
  //   this.activatedRoute.params.subscribe(params => {
  //     paramsId = params['id'];
  //   });
  //   const obj = {
  //     key: 'credit_proposal/remark/guarantor/' + paramsId + '/sfdt',
  //   };
  //   this.storageService
  //     .getObjects(this.bucket, obj)
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe(response => {
  //       if (response.body.length > 0) {
  //         this.storageService
  //           .fileBlob(response.body[response.body.length - 1]['url'])
  //           .pipe(takeUntil(this.ngUnsubscribe))
  //           .subscribe(res => {
  //             this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-guarantor-sfdt.sfdt');
  //             const fileReader: FileReader = new FileReader();
  //             fileReader.onload = (e: any) => {
  //               const docEditor = this.container?.documentEditor as DocumentEditorComponent;
  //               const contents: string = e.target.result;
  //               docEditor.open(contents);
  //             };
  //             fileReader.readAsText(this.fileGet);
  //           });
  //       }
  //     });
  // }

  private getContainers(): void {
    this.baService.isUpload$.next(false);
    this.baService.setLoading(true);
    const obj = {
      key: this.getKey,
    };
    this.storageService
      .getObjects(this.bucket, obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response.body.length > 0) {
          this.storageService
            .fileBlob(response.body[response.body.length - 1]['url'])
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              this.fileGet = new File([res.body], 'credit-proposal-remark-' + this.paramsIdGet + '-project-analysis-sfdt.sfdt');
              const fileReader: FileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const docEditor = this.containers?.documentEditor as DocumentEditorComponent;
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
  public klik() {
    this.triggeredSave();
  }
  onDocumentChange() {
    this.containers.restrictEditing = true;
  }

  public selectedMenu: string;

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
    if (this.selectedMenu === 'PROJECT ANALYSIS') {
      this.getContainers();
    }
  }
}
