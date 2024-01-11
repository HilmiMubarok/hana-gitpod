import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ribbonClick } from '@syncfusion/ej2-angular-spreadsheet';
import { PositionService } from 'app/entities/position/position.service';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';

import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';

import { StorageService } from 'app/entities/storage/storage.service';
import { takeUntil, Subject, BehaviorSubject, map, tap, switchMap, combineLatest, from, Observable, forkJoin } from 'rxjs';
import { doc } from 'prettier';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { BusinessActivityService } from './business-activity.service';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ProjectAnalystRemarkComponent } from './project-analyst-remark.component';

@Component({
  selector: 'jhi-credit-proposal-busines-activity',
  templateUrl: './credit-proposal-tab-business-activity.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
  providers: [SelectionService, EditorService, SfdtExportService, ProjectAnalystRemarkComponent],
})
export class CreditProposalTabBusinessActivityComponent implements OnInit, OnDestroy {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  @ViewChild('document_editor_containers')
  public containers: DocumentEditorContainerComponent;

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

  constructor(
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private generalParameterService: GeneralParameterService,
    private baService: BusinessActivityService,
    protected messageService: MessageService
  ) {
    this.bucket = '';
  }

  private bucket: string;
  private _creditProposalItem: ICreditProposal;

  attributes: any;
  public _item: ICreditProposal;
  public _projectAnalysis: string;

  public creditProposaldata: ICreditProposal = new CreditProposal();
  public value: string;

  private ngUnsubscribe = new Subject();
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private paramsIdGet: string;
  private getKey: string;
  private getKeyPa: string;
  private fileGet: File;

  public parameter: string;

  public customHeadersJWT: any;

  public dataAttrPass = [];

  public isLoading: Boolean = false;

  public tes() {
    if (this.creditProposalItem.attributes['businessActivity'].BusinessAct.length === 0) {
      this.creditProposalItem.attributes['businessActivity'].BusinessAct = this.dataAttrPass;
    } else {
      this.dataAttrPass = this.creditProposalItem.attributes['businessActivity'].BusinessAct;
    }
  }

  public onSelect(value: string, data: any): void {
    this.dataAttrPass[data.No - 1].value = value;
    this.creditProposalItem.attributes['businessActivity'].BusinessAct = this.dataAttrPass;
  }

  btnSave($event: any): void {
    this.creditProposalItem.attributes['businessActivity'].BusinessAct = [
      ...this.creditProposalItem.attributes['businessActivity'].BusinessAct,
      {
        parameter: this.parameter,
      },
    ];
  }

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
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/business-activity/' + this.paramsIdGet + '/sfdt';
      this.getKeyPa = 'credit_proposal/remark/project-analysis/' + this.paramsIdGet + '/sfdt';
      this.getBucket().then(res => {
        this.getContainer();
      });
    });
    this.lovProjectIndicator();
    this.tes();
    // this.creditProposalItem.attributes['businessActivity'].BusinessAct = [];
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

  public lovProjectIndicator() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'PROJECT_FINANCING_INDICATOR',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataAttrPass = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        const dataGrid = [];
        for (let i = 0; i < this.dataAttrPass.length; i++) {
          // this.dataAttrPass[i]['indexNum'] = i + 1;
          const num = i + 1;
          dataGrid[i] = { No: num, Parameter: this.dataAttrPass[i].value, value: '' };
        }
        this.dataAttrPass = dataGrid;
        if (this.creditProposalItem.attributes['businessActivity'].BusinessAct.length === 0) {
          this.creditProposalItem.attributes['businessActivity'].BusinessAct = this.dataAttrPass;
        } else {
          for (let i = 0; i < this.creditProposalItem.attributes['businessActivity'].BusinessAct.length; i++) {
            this.dataAttrPass = this.creditProposalItem.attributes['businessActivity'].BusinessAct;
          }
        }
      });
  }

  public onDocumentChange() {
    this.container.restrictEditing = true;
  }

  public onDocumentChangePa() {
    this.containers.restrictEditing = true;
  }

  public getOpiniObj() {
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/business-activity/' + this.creditProposalItem.id + '/sfdt';
      this.getContainer();
    });
  }

  public getOpiniObjPa() {
    this.activatedRoute.params.subscribe(params => {
      this.paramsIdGet = params['id'];
      this.getKey = 'credit_proposal/remark/project-analysis/' + this.paramsIdGet + '/sfdt';
      this.getContainers();
    });
  }

  percentDone;

  percentSfdt;
  percentDocx;
  public getPercentage(event: HttpEvent<any>): number {
    console.log('event', event);

    if (event.type === HttpEventType.UploadProgress) {
      if (event && event.total) {
        return event.total ? Math.round((100 * event.loaded) / event.total) : 0;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  private getContainer(): void {
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

  private getContainers(): void {
    this.baService.setLoading(true);
    const obj = {
      key: this.getKeyPa,
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

  onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    // this.containers.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    // this.container.serviceUrl = 'https://services.syncfusion.com/angular/production/api/documenteditor/';
    // this.containers.serviceUrl = 'https://services.syncfusion.com/angular/production/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
    // this.containers.serviceUrl = '/services/los/api/wordeditor/';

    // Detect size of file loaded
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
    }
  }

  @ViewChild('project', {
    static: false,
  })
  project: ProjectAnalystRemarkComponent;

  // NEW

  // NEW

  // public triggeredSaveAll(): void {
  //   this.baService.isUpload$.next(true);
  //   this.baService.setLoading(true);
  //   let paramsId = '';
  //   this.activatedRoute.params.subscribe(params => {
  //     paramsId = params['id'];
  //   });
  //   const key = 'credit_proposal/remark/business-activity';
  //   const keyPa = 'credit_proposal/remark/project-analysis';

  //   const timeStamp = Math.floor(Date.now() / 1000);

  //   const docEditor = this.container?.documentEditor as DocumentEditorComponent;
  //   const docEditors = this.containers?.documentEditor as DocumentEditorComponent;

  //   if (docEditor !== undefined) {
  //     // NEW

  //     const saveAsBlobAndUpload = (type: string, fileType: string) =>
  //       from(docEditor.saveAsBlob(type as any)).pipe(
  //         switchMap((exportedDocument: Blob) => {
  //           const fileName = `credit-proposal-remark-${paramsId}-business-activity-${fileType}.${type}`;
  //           const metaData = {
  //             objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //           };
  //           const formData = new FormData();
  //           formData.append('file', new File([exportedDocument], fileName));

  //           return this.storageService.uploadMetaWithProgress(this.bucket, formData, metaData).pipe(
  //             takeUntil(this.destroy$),
  //             map(event => ({
  //               progress: this.getPercentage(event),
  //               response: event,
  //             }))
  //           );
  //         })
  //       );

  //     const docxObservable = saveAsBlobAndUpload('Docx', 'word');
  //     const sfdtObservable = saveAsBlobAndUpload('Sfdt', 'sfdt');

  //     docxObservable;
  // .pipe(
  //   switchMap((docxProgress: { progress: number; response: any }) =>
  //     sfdtObservable.pipe(map((sfdtProgress: { progress: number; response: any }) => ({ docxProgress, sfdtProgress })))
  //   )
  // )
  // .subscribe(({ docxProgress, sfdtProgress }) => {
  //   // count average progress
  //   const combinedProgress = (docxProgress.progress + sfdtProgress.progress) / 2;

  //   this.baService.setProgresss(combinedProgress);
  //   if (combinedProgress === 100) {
  //     this.baService.setLoading(false);
  //   }
  //   console.log('Combined Progress switch map:', { docxProgress, sfdtProgress, combinedProgress });
  // });

  // combineLatest([docxObservable, sfdtObservable]).subscribe(([docxProgress, sfdtProgress]) => {
  //   // count average progress
  //   const combinedProgress = (docxProgress.progress + sfdtProgress.progress) / 2;

  //   this.baService.setProgresss(combinedProgress);
  //   if (combinedProgress === 100) {
  //     this.baService.setLoading(false);
  //   }
  //   console.log('Combined Progress:', { docxProgress, sfdtProgress, combinedProgress });
  // });

  // NEW

  // docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
  //   const fileType = 'word';
  //   const fileName = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileType + '.docs';
  //   const metaData = {
  //     objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //   };
  //   const formData = new FormData();
  //   formData.append('file', new File([exportedDocument], fileName));

  //   this.storageService
  //     .uploadMetaWithProgress(this.bucket, formData, metaData)
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       map(event => {
  //         if (event.type === HttpEventType.UploadProgress) {
  //           if (event && event.total) {
  //             // this.percentDone = Math.round((100 * event.loaded) / event.total);
  //             const percentDone = Math.round((100 * event.loaded) / event.total);
  //             this.baService.setProgress(percentDone, 'Docx');
  //           }
  //         }

  //         return {
  //           progress: this.getPercentage(event, 'Docx'),
  //           response: event,
  //         };
  //       })
  //     )
  //     .subscribe(res => {
  //       res.progress === 100 && this.baService.setLoading(false);
  //     });
  // });

  // docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
  //   const fileType = 'sfdt';
  //   const fileName = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileType + '.sfdt';
  //   const metaData = {
  //     objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //   };
  //   const formData = new FormData();
  //   formData.append('file', new File([exportedDocument], fileName));

  //   this.storageService
  //     .uploadMetaWithProgress(this.bucket, formData, metaData)
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       map(event => {
  //         if (event.type === HttpEventType.UploadProgress) {
  //           if (event && event.total) {
  //             // this.percentDone = Math.round((100 * event.loaded) / event.total);
  //             const percentDone = Math.round((100 * event.loaded) / event.total);
  //             this.baService.setProgress(percentDone, 'sfdt');
  //           }
  //         }

  //         return {
  //           progress: this.getPercentage(event, 'sfdt'),
  //           response: event,
  //         };
  //       })
  //     )
  //     .subscribe(res => {
  //       res.progress === 100 && this.baService.setLoading(false);
  //     });
  // });
  //   }

  //   if (docEditors !== undefined) {
  //     docEditors.saveAsBlob('Docx').then((exportedDocument: Blob) => {
  //       const fileType = 'word';
  //       const fileName = 'credit-proposal-remark-' + paramsId + '-project-analysis-' + fileType + '.docs';
  //       const metaData = {
  //         objectName: `${keyPa}/${paramsId}/${fileType}/${fileName}`,
  //       };
  //       const formData = new FormData();
  //       formData.append('file', new File([exportedDocument], fileName));

  //       this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
  //     });

  //     docEditors.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
  //       const fileType = 'sfdt';
  //       const fileName = 'credit-proposal-remark-' + paramsId + '-project-analysis-' + fileType + '.sfdt';
  //       const metaData = {
  //         objectName: `${keyPa}/${paramsId}/${fileType}/${fileName}`,
  //       };
  //       const formData = new FormData();
  //       formData.append('file', new File([exportedDocument], fileName));

  //       this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
  //     });
  //   }
  // }

  obsWord$: Observable<any>;
  obsDocx$: Observable<any>;

  docxSize: number;
  // public triggeredSaveAll(): void {
  //   let paramsId = '';
  //   this.activatedRoute.params.subscribe(params => {
  //     paramsId = params['id'];
  //   });
  //   const key = 'credit_proposal/remark/business-activity';

  //   const timeStamp = Math.floor(Date.now() / 1000);

  //   const docEditor = this.container?.documentEditor as DocumentEditorComponent;

  //   if (docEditor !== undefined) {
  //     docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
  //       const fileType = 'word';
  //       const fileName = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileType + '.docs';
  //       const metaData = {
  //         objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //       };
  //       const formData = new FormData();
  //       formData.append('file', new File([exportedDocument], fileName));

  //       // detect file size
  //       this.docxSize = exportedDocument.size;

  //       // if larger than 50mb, cancel upload
  //       if (this.docxSize > 2000000) {
  //         alert('File size is too large, please reduce the size');
  //         this.baService.setLoading(false);
  //         throw new Error('File size is too large, please reduce the size');
  //       }

  //       this.obsDocx$ = this.storageService.uploadMetaWithProgress(this.bucket, formData, metaData);
  //     });

  //     docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
  //       const fileType = 'sfdt';
  //       const fileName = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileType + '.sfdt';
  //       const metaData = {
  //         objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
  //       };
  //       const formData = new FormData();
  //       formData.append('file', new File([exportedDocument], fileName));

  //       this.obsWord$ = this.storageService.uploadMetaWithProgress(this.bucket, formData, metaData);
  //     });

  //     combineLatest([this.obsDocx$, this.obsWord$]).subscribe(([docxProgress, sfdtProgress]) => {
  //       // get all file size
  //       const docxFileSize = docxProgress.total;

  //       // if both larger more than 50mb, cancel upload
  //       if (docxFileSize > 2000000) {
  //         alert('File size is too large, please reduce the size');
  //         this.baService.setLoading(false);
  //         return;
  //       }

  //       // count average progress

  //       this.baService.setLoading(true);
  //       // count average progress from (docxProgress.loaded, docxProgress.total) and (sfdtProgress.loaded, sfdtProgress.total)

  //       const docxP = Math.round((100 * docxProgress.loaded) / docxProgress.total);
  //       const sfdtP = Math.round((100 * sfdtProgress.loaded) / sfdtProgress.total);

  //       let combinedProgress = (docxP + sfdtP) / 2;

  //       if (docxProgress.type === HttpEventType.Response && sfdtProgress.type === HttpEventType.Response) {
  //         combinedProgress = 100;
  //         this.baService.setLoading(false);
  //       }

  //       // if (combinedProgress === 100 && docxProgress.type === HttpEventType.Response && sfdtProgress.type === HttpEventType.Response) {
  //       //   this.baService.setLoading(false);
  //       // }

  //       console.log('Combined Progress:', { docxProgress, sfdtProgress, combinedProgress });
  //     });
  //   }
  // }

  public triggeredSaveAll(): void {
    if (this.selectedMenu === 'PROJECT ANALYSIS') {
      this.project.triggeredSave();
    } else {
      let paramsId = '';
      this.activatedRoute.params.subscribe(params => {
        paramsId = params['id'];
      });

      this.baService.setLoading(true);
      const key = 'credit_proposal/remark/business-activity';
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
            const fileName = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileTypeWord + '.docs';
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
                  const fileNames = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileTypeSfdt + '.sfdt';
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
  }

  public triggeredSave(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/business-activity';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;
    if (docEditor !== undefined) {
      docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const fileType = 'word';
        const fileName = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileType + '.docs';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileType = 'sfdt';
        const fileName = 'credit-proposal-remark-' + paramsId + '-business-activity-' + fileType + '.sfdt';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });
    }
  }

  public triggeredSavePa(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });
    const key = 'credit_proposal/remark/project-analysis';

    const timeStamp = Math.floor(Date.now() / 1000);

    const docEditor = this.containers?.documentEditor as DocumentEditorComponent;
    if (docEditor !== undefined) {
      docEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const fileType = 'word';
        const fileName = 'credit-proposal-remark-' + paramsId + '-project-analysis-' + fileType + '.docs';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });

      docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileType = 'sfdt';
        const fileName = 'credit-proposal-remark-' + paramsId + '-project-analysis-' + fileType + '.sfdt';
        const metaData = {
          objectName: `${key}/${paramsId}/${fileType}/${fileName}`,
        };
        const formData = new FormData();
        formData.append('file', new File([exportedDocument], fileName));

        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe();
      });
    }
  }
  public selectedMenu: string;

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
    if (this.selectedMenu === 'PROJECT ANALYSIS') {
      this.getContainers();
    }
  }

  public menuItems: MenuItemModel[] = [{ text: 'BUSINESS ACTIVITY' }, { text: 'PROJECT ANALYSIS' }];

  public tools: object = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
  };
}
