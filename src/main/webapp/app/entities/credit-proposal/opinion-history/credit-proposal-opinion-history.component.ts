import { Component, Input, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subject, forkJoin, from, map, switchMap, takeUntil, tap } from 'rxjs';

import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { PositionService } from 'app/entities/position/position.service';
import { INotes } from 'app/entities/notes/notes.model';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import { CreditProposalDialogOpinionHistoryComponent } from './dialog-opinion-history/credit-proposal-dialog-opinion-history.component';
import { MessageService } from 'primeng/api';
import moment from 'moment';

import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  EditorService,
  SelectionService,
  SfdtExportService,
} from '@syncfusion/ej2-angular-documenteditor';

import lodash from 'lodash';
import * as uuid from 'uuid';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { BusinessActivityService } from '../busines-activity/business-activity.service';

@Component({
  selector: 'jhi-credit-proposal-opinion-history',
  templateUrl: './credit-proposal-opinion-history.component.html',
  styleUrls: ['./opinion-history.css'],
  providers: [SelectionService, EditorService, SfdtExportService],
})
export class CreditProposalOpinionHistoryComponent implements OnInit, OnDestroy {
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  @Input() notifyChild: Subject<any>;

  @Output() uuidPath = new EventEmitter<string>();
  @Output() newItemEvent = new EventEmitter<string>();
  @Output() posLog = new EventEmitter<string>();

  @Output() opinionFileSfdt = new EventEmitter<any>();
  @Output() opinionFileWord = new EventEmitter<File>();

  @Output() conditionFileSfdt = new EventEmitter<File>();
  @Output() conditionFileWord = new EventEmitter<File>();

  @Output() isAllowSave = new EventEmitter<boolean>();

  @ViewChild('document_editor_container')
  private container: DocumentEditorContainerComponent;
  @ViewChild('document_editor_container_condition')
  private container_condition: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  private documentEditor: DocumentEditorComponent;

  public notes: INotes[];
  public notesMod: any[];
  public recomendasi: string;

  public customHeadersJWT: any;

  private _creditProposalItem: ICreditProposal;
  private BUCKET: string;
  private ngUnsubscribe = new Subject();
  private positionLogin: any;
  private uuid: any;

  private countValidate = 0;
  public cpApproval: boolean;

  constructor(
    protected datePipe: DatePipe,
    protected dialog: MatDialog,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected storageService: StorageService,
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService,
    protected messageService: MessageService,
    private baService: BusinessActivityService,
    protected reportUtils: ReportUtilService
  ) {
    this.uuid = uuid.v4();
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();

  private getWord() {
    this.storageService.getBucketName().subscribe(val => {
      this.BUCKET = val.body['bucket'];
    });
  }

  private filterPositionLogin() {
    this.positionService.findByLogin().subscribe(posisi => {
      this.positionLogin = posisi.body;
      for (let i = 0; i < this.positionLogin.length; i++) {
        // this.creditProposalItem.attributes['positionLogin'] = this.positionLogin[i].id;
        this.posLog.emit(this.positionLogin[i].id);
      }
      this.refresh();
    });
  }

  ngOnInit(): void {
    const token = this.getToken('XSRF-TOKEN');
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': token }];

    this.uuidPath.emit(this.uuid);

    this.notifyChild.subscribe(event => {
      const docEditorOpinion = this.container?.documentEditor as DocumentEditorComponent;
      const docEditorCondition = this.container_condition?.documentEditor as DocumentEditorComponent;

      /* const fileNameSfdt = this.uuid + '.sfdt';
      const fileNameWord = this.uuid + '.word'; */
      const fileNameOpinionSfdt = 'opini.sfdt';
      const fileNameOpinionWord = 'opini.word';
      const fileNameConditionSfdt = 'condition.sfdt';
      const fileNameConditionWord = 'condition.word';

      docEditorOpinion.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const testFile = new File([exportedDocument], fileNameOpinionSfdt);
        if (testFile) {
          this.opinionFileSfdt.emit(testFile);
        }
      });

      docEditorOpinion.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const testFile = new File([exportedDocument], fileNameOpinionWord);
        if (testFile) {
          this.opinionFileWord.emit(testFile);
        }
      });

      docEditorCondition.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const testFile = new File([exportedDocument], fileNameConditionSfdt);
        if (testFile) {
          this.conditionFileSfdt.emit(testFile);
        }
      });

      docEditorCondition.saveAsBlob('Docx').then((exportedDocument: Blob) => {
        const testFile = new File([exportedDocument], fileNameConditionWord);
        if (testFile) {
          this.conditionFileWord.emit(testFile);
        }
      });
    });

    this.getWord();
    this.filterPositionLogin();
    this.checkLogin();
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

  public change(event: string) {
    this.newItemEvent.emit(event);
    this.recomendasi = event;
  }

  public openDialog(element: INotes = null): void {
    const predicate = {
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: '100%',
      width: '100%',
      data: {
        notes: element,
        creditProposalItem: this.creditProposalItem,
      },
    };
    const dialogRef = this.dialog.open(CreditProposalDialogOpinionHistoryComponent, predicate);
  }

  private saveValidate(): void {
    this.triggeredSave();
    this.triggeredSaveCondition();
  }

  /* private async checkSfdtFile(part: string): Promise<void> {
	if (part === 'opinion') {
      const docEditor = this.container?.documentEditor as DocumentEditorComponent;

      await docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileName = this.uuid + '.sfdt';
        const testFile = new File([exportedDocument], fileName);
        if (testFile) {
          const fileReader: FileReader = new FileReader();
          fileReader.onload = (e: any) => {
            const testSfdtFile = JSON.parse(fileReader.result as string);
            if (testSfdtFile.sections[0].blocks[0].inlines.length > 0) {
              ++this.countValidate;
            } else {
			  // toast opinion empty
			  console.log('toast opinion empty');
			}
          };
          fileReader.readAsText(testFile);
        }
      });
    } else if (part === 'condition') {
      const docEditor = this.container_condition?.documentEditor as DocumentEditorComponent;

      await docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
        const fileName = this.uuid + '.sfdt';
        const testFile = new File([exportedDocument], fileName);
        if (testFile) {
          const fileReader: FileReader = new FileReader();
          fileReader.onload = (e: any) => {
            const testSfdtFile = JSON.parse(fileReader.result as string);
            if (testSfdtFile.sections[0].blocks[0].inlines.length > 0) {
              ++this.countValidate;
            }
            if (this.countValidate === 3) {
              this.isAllowSave.emit(true);
              this.saveValidate();
            } else {
              this.isAllowSave.emit(false);
			  // toast condition empty
			  console.log('toast condition empty');
            }
          };
          fileReader.readAsText(testFile);
        }
      });
    }
  } */

  private checkSfdtFile(): void {
    const docEditor = this.container?.documentEditor as DocumentEditorComponent;

    docEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {
      // const fileName = this.uuid + '.sfdt';
      const fileName = 'opini.sfdt';
      const testFile = new File([exportedDocument], fileName);
      if (testFile) {
        const fileReader: FileReader = new FileReader();
        fileReader.onload = (e: any) => {
          const testSfdtFile = JSON.parse(fileReader.result as string);
          /* if (testSfdtFile.sections[0].blocks) {
			if (testSfdtFile.sections[0].blocks.length > 0) {
			  ++this.countValidate;
			} else {
			  // toast opinion empty
			  this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Opinion Empty! All data will be save except data at tab opinion' });
			}
		  } else {
			// toast opinion empty
			this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Opinion Empty! All data will be save except data at tab opinion' });
		  } */

          if (
            testSfdtFile.sections[0].blocks[0].inlines ||
            testSfdtFile.sections[0].blocks[0].columnCount ||
            testSfdtFile.sections[0].blocks[0].paragraphFormat ||
            testSfdtFile.sections[0].blocks[0].grid ||
            testSfdtFile.sections[0].blocks[0].rows ||
            testSfdtFile.sections[0].blocks[0].tableFormat
          ) {
            if (
              testSfdtFile.sections[0].blocks[0].paragraphFormat ||
              testSfdtFile.sections[0].blocks[0].grid ||
              testSfdtFile.sections[0].blocks[0].rows ||
              testSfdtFile.sections[0].blocks[0].tableFormat
            ) {
              ++this.countValidate;
            } else if (testSfdtFile.sections[0].blocks[0].columnCount) {
              if (testSfdtFile.sections[0].blocks[0].columnCount > 0) {
                ++this.countValidate;
              } else {
                // toast opinion empty
                this.messageService.add({
                  severity: 'info',
                  summary: 'Warning',
                  detail: 'Opinion Empty! All data will be save except data at tab opinion',
                });
              }
            } else if (testSfdtFile.sections[0].blocks[0].inlines) {
              let isEmpty = true;
              testSfdtFile.sections[0].blocks.forEach(block => {
                if (block.inlines) {
                  if (block.inlines.length > 0) {
                    isEmpty = false;
                  }
                }
              });

              if (isEmpty) {
                // toast opinion empty
                this.messageService.add({
                  severity: 'info',
                  summary: 'Warning',
                  detail: 'Opinion Empty! All data will be save except data at tab opinion',
                });
              } else {
                ++this.countValidate;
              }

              /* if (testSfdtFile.sections[0].blocks[0].inlines.length > 0) {
				++this.countValidate;
			  } else {
				// toast opinion empty
				this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Opinion Empty! All data will be save except data at tab opinion' });
			  } */
            }
          } else {
            // toast opinion empty
            this.messageService.add({
              severity: 'info',
              summary: 'Warning',
              detail: 'Opinion Empty! All data will be save except data at tab opinion',
            });
          }

          if (this.recomendasi) {
            ++this.countValidate;
            if (this.recomendasi === 'Recommend With Condition') {
              const docEditorCondition = this.container_condition?.documentEditor as DocumentEditorComponent;

              docEditorCondition.saveAsBlob('Sfdt').then((exportedDocumentCondition: Blob) => {
                // const fileNameCondition = this.uuid + '.sfdt';
                const fileNameCondition = 'condition.sfdt';
                const testFileCondition = new File([exportedDocumentCondition], fileNameCondition);
                if (testFileCondition) {
                  const fileReaderCondition: FileReader = new FileReader();
                  fileReaderCondition.onload = (eCondition: any) => {
                    const testSfdtFileCondition = JSON.parse(fileReaderCondition.result as string);
                    /* if (testSfdtFileCondition.sections[0].blocks) {
					  if (testSfdtFileCondition.sections[0].blocks.length > 0) {
						++this.countValidate;
					  } else {
						// toast condition empty
						this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Condition Empty! All data will be save except data at tab opinion' });
					  }
					} else {
					  // toast condition empty
					  this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Condition Empty! All data will be save except data at tab opinion' });
					} */

                    if (
                      testSfdtFileCondition.sections[0].blocks[0].inlines ||
                      testSfdtFileCondition.sections[0].blocks[0].columnCount ||
                      testSfdtFileCondition.sections[0].blocks[0].paragraphFormat ||
                      testSfdtFileCondition.sections[0].blocks[0].grid ||
                      testSfdtFileCondition.sections[0].blocks[0].rows ||
                      testSfdtFileCondition.sections[0].blocks[0].tableFormat
                    ) {
                      if (
                        testSfdtFileCondition.sections[0].blocks[0].paragraphFormat ||
                        testSfdtFileCondition.sections[0].blocks[0].grid ||
                        testSfdtFileCondition.sections[0].blocks[0].rows ||
                        testSfdtFileCondition.sections[0].blocks[0].tableFormat
                      ) {
                        ++this.countValidate;
                      } else if (testSfdtFileCondition.sections[0].blocks[0].columnCount) {
                        if (testSfdtFileCondition.sections[0].blocks[0].columnCount > 0) {
                          ++this.countValidate;
                        } else {
                          // toast condition empty
                          this.messageService.add({
                            severity: 'info',
                            summary: 'Warning',
                            detail: 'Condition Empty! All data will be save except data at tab opinion',
                          });
                        }
                      } else if (testSfdtFileCondition.sections[0].blocks[0].inlines) {
                        let isEmpty = true;
                        testSfdtFileCondition.sections[0].blocks.forEach(block => {
                          if (block.inlines) {
                            if (block.inlines.length > 0) {
                              isEmpty = false;
                            }
                          }
                        });

                        if (isEmpty) {
                          // toast condition empty
                          this.messageService.add({
                            severity: 'info',
                            summary: 'Warning',
                            detail: 'Condition Empty! All data will be save except data at tab opinion',
                          });
                        } else {
                          ++this.countValidate;
                        }

                        /* if (testSfdtFileCondition.sections[0].blocks[0].inlines.length > 0) {
						  ++this.countValidate;
						} else {
						  // toast condition empty
						  this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Condition Empty! All data will be save except data at tab opinion' });
						} */
                      }
                    }

                    if (this.countValidate === 3) {
                      this.isAllowSave.emit(true);
                      this.saveValidate();
                    } else {
                      this.isAllowSave.emit(false);
                    }
                  };
                  fileReaderCondition.readAsText(testFileCondition);
                }
              });
            } else {
              if (this.countValidate === 2) {
                this.isAllowSave.emit(true);
                this.saveValidate();
              } else {
                this.isAllowSave.emit(false);
              }
            }
          } else {
            this.isAllowSave.emit(false);
            // toast recomendation empty
            this.messageService.add({
              severity: 'info',
              summary: 'Warning',
              detail: 'Recommendation Empty! All data will be save except data at tab opinion',
            });
          }
        };
        fileReader.readAsText(testFile);
      }
    });
  }

  public triggeredSaveValidate(): void {
    this.countValidate = 0;

    this.checkSfdtFile();

    /* this.checkSfdtFile('opinion').then(() => {
	  if (this.recomendasi) {
		++this.countValidate;
		if (this.recomendasi === 'Recommend With Condition') {
		  this.checkSfdtFile('condition').then();
		} else {
		  if (this.countValidate === 2) {
			this.isAllowSave.emit(true);
			this.saveValidate();
		  } else {
			this.isAllowSave.emit(false);
		  }
		}
	  } else {
		this.isAllowSave.emit(false);
		// toast recomendation empty
		console.log('toast recomendation empty');
	  }
    }); */
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
    const key = 'credit_proposal/remark/opinion-history/opinion';
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
          const PathHelperDocs = this.uuid + '-opinion';
          const fileName = 'opini.docs';
          const metaData = {
            objectName: `${key}/${paramsId}/${PathHelperDocs}/${fileTypeWord.replace('&', '')}/${fileName}`,
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
                const PathHelperSfdt = this.uuid + '-opinion';
                const fileNames = 'opini.sfdt';
                const metaDatas = {
                  objectName: `${key}/${paramsId}/${PathHelperSfdt}/${fileTypeSfdt.replace('&', '')}/${fileNames}`,
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

  public onCreate(): void {
    // this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }

  public triggeredSaveCondition(): void {
    let paramsId = '';
    this.activatedRoute.params.subscribe(params => {
      paramsId = params['id'];
    });

    this.baService.setLoading(true);
    const key = 'credit_proposal/remark/opinion-history/condition';
    const docEditor = this.container_condition?.documentEditor as DocumentEditorComponent;
    const saveDocx$ = from(docEditor.saveAsBlob('Docx'));
    const saveSfdt$ = from(docEditor.saveAsBlob('Sfdt'));

    forkJoin([saveDocx$, saveSfdt$])
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.baService.setLoading(true)),
        map(([docx, sfdt]) => {
          this.baService.setLoading(true);
          const fileTypeWord = 'word';
          const PathHelperDocs = this.uuid + '-condition';
          const fileName = 'condition.docs';
          const metaData = {
            objectName: `${key}/${paramsId}/${PathHelperDocs}/${fileTypeWord.replace('&', '')}/${fileName}`,
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
                const PathHelperSfdt = this.uuid + '-condition';
                const fileNames = 'condition.sfdt';
                const metaDatas = {
                  objectName: `${key}/${paramsId}/${PathHelperSfdt}/${fileTypeSfdt.replace('&', '')}/${fileNames}`,
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

  public onKeyDownCondition(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  public onCreateCondition(): void {
    // this.container_condition.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
    this.container_condition.serviceUrl = '/services/los/api/wordeditor/';
  }

  public refresh() {
    this.creditProposalService.find(this.creditProposalItem.id).subscribe(res => {
      this.notes = res.body.notes;

      if (this.notes) {
        if (this.notes.length > 0) {
          this.notes.sort((a, b) => (a.id > b.id ? 1 : -1));
          this.notes = lodash.uniqBy(this.notes, 'positionId');
        }
      }

      if (this.notes) {
        if (this.notes.length > 0) {
          this.notes = this.notes.filter(note => note.type === 'credit_proposal');

          /* let index = 0;
		  for (const note of [...this.notes]) {
			if (note.type === 'loan_analysis' || note.type === 'loan_committee' || note.type === 'compliance' || note.type === '' || note.type === null) {
			  this.notes.splice(index, 1);
			} else {
			  ++index;
			}
		  } */
        }
      }

      this.notesMod = lodash.cloneDeep(this.notes);

      this.notesMod.forEach(note => {
        if (note['modifiedDate']) {
          note['modifiedDateCalc'] = moment(new Date(note['modifiedDate']))
            .utcOffset(moment(new Date(Date.now())).utcOffset())
            .format()
            .split('T')[0];
        } else {
          note['modifiedDateCalc'] = moment(new Date(note['createDate']))
            .utcOffset(moment(new Date(Date.now())).utcOffset())
            .format()
            .split('T')[0];
        }
      });
    });
  }

  public onDocumentChange() {
    this.container.restrictEditing = true;
  }

  public onDocumentChanges() {
    this.container_condition.restrictEditing = true;
  }

  public disabledData: boolean;
  public account: Account;
  public isRoleBM: any;
  public isRoleSMEHead: any;
  public isRoleSDH: any;
  public isRoleDH: any;
  public isRoleDeptHead: any;

  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
        if (this.account.authorities.length <= 2) {
          this.isRoleBM = this.account.authorities.includes('ROLE_BM');
          this.isRoleDH = this.account.authorities.includes('ROLE_DH');
          this.isRoleSDH = this.account.authorities.includes('ROLE_SDH');
          this.isRoleSMEHead = this.account.authorities.includes('ROLE_SME_HEAD');
          this.isRoleDeptHead = this.account.authorities.includes('ROLE_DEPT_HEAD');
        }
      }
    });
    this.disabledReccomendationByLogin();
  }

  public disabledReccomendationByLogin(): void {
    if (this.isRoleBM) {
      if (this.creditProposalItem.statusId === 'CP_APPROVAL_BM') {
        this.disabledData = false;
      } else {
        this.disabledData = true;
      }
    }
    if (this.isRoleDH) {
      if (this.creditProposalItem.statusId === 'CP_APPROVAL_DH') {
        this.disabledData = false;
      } else {
        this.disabledData = true;
      }
    }
    if (this.isRoleSDH) {
      if (this.creditProposalItem.statusId === 'CP_APPROVAL_SDH') {
        this.disabledData = false;
      } else {
        this.disabledData = true;
      }
    }
    if (this.isRoleSMEHead) {
      if (this.creditProposalItem.statusId === 'CP_APPROVAL_SME_HEAD') {
        this.disabledData = false;
      } else {
        this.disabledData = true;
      }
    }
    if (this.isRoleDeptHead) {
      if (this.creditProposalItem.statusId === 'CP_APPROVAL_DEPTHEAD') {
        this.disabledData = false;
      } else {
        this.disabledData = true;
      }
    }
  }

  // generate Document Opinion History
  public donwload() {
    const id = this.creditProposalItem.id;
    this.reportUtils.downloadFile3('/services/report/api/report/bussiness_unit_opinion/pdf-word-stream/' + id, '', 'Report_' + id);
  }
}
