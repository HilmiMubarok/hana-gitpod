import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
} from '@syncfusion/ej2-angular-documenteditor';
import { Notes } from 'app/entities/notes/notes.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { forkJoin, from, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ReviewHistoryService } from '../finalize-credit-agreement/review-history/review-history.service';
@Component({
  selector: 'jhi-review-history-dialog',
  templateUrl: './revew-history-dialog.component.html',
  styleUrls: ['../credit-agreement.css'],
  styles: [
    `
      .container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        overflow-y: auto;
        height: 200%;
        background-color: rgba(128, 128, 128, 0.5);
        display: flex;
        z-index: 2;
        justify-content: center;
        align-items: center;
      }
      .mat-dialog-content {
        position: relative !important;
      }
      .spinner {
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
      }

      @-webkit-keyframes spin {
        0% {
          -webkit-transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ReviewHistoryDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<ReviewHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    public reviewHistoryService: ReviewHistoryService,
    private storageService: StorageService,
    private messageService: MessageService
  ) {
    this.reviewHistory = this.fb.group({
      approverName: [{ value: this.dialogData.approverName, disabled: true }],
      date: [{ value: this.dialogData.date, disabled: true }],
      position: [{ value: this.dialogData.position, disabled: true }],
    });
    this.bucket = this.dialogData.bucket;
  }

  reviewHistory: FormGroup;

  ngOnInit(): void {
    console.log('init', this.bucket);

    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': this.getToken() }];
  }
  customHeadersJWT: any;

  private destroy$: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
    }
  }

  public bucket: string;
  public path = 'pk/review_history';

  getToken(): string {
    return this.reviewHistoryService.getLocStor('XSRF-TOKEN');
  }

  public onCreate(): void {
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }

  onSubmit() {
    const notes = new Notes();

    notes.applicationId = this.dialogData.applicationId;
    notes.positionId = Number(this.dialogData.positionId);
    notes.type = this.dialogData.type;

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;
    const saveDocx$ = from(docEditor.saveAsBlob('Docx'));
    const saveSfdt$ = from(docEditor.saveAsBlob('Sfdt'));

    const modifiedApproverName = this.reviewHistory.value.approverName.replace(/ /g, '-').replace('&', '');

    forkJoin([saveDocx$, saveSfdt$])
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.reviewHistoryService.loading$.next(true)),
        map(([docx, sfdt]) => {
          this.reviewHistoryService.loading$.next(true);
          const fileTypeWord = 'word';

          const fileName = Date.now() + '-' + this.dialogData.username + '-' + modifiedApproverName + '.docs';

          const metaData = {
            objectName: `${this.path}/${this.dialogData.applicationId}/${fileTypeWord}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([docx], fileName));

          this.storageService
            .uploadMeta(this.dialogData.bucket, formData, metaData)
            .pipe(
              switchMap(() => {
                const fileTypeSfdt = 'sfdt';
                const fileNames = Date.now() + '-' + this.dialogData.username + '-' + modifiedApproverName + '.sfdt';

                const metaDatas = {
                  objectName: `${this.path}/${this.dialogData.applicationId}/${fileTypeSfdt}/${fileNames}`,
                };
                const formDatas = new FormData();
                formDatas.append('file', new File([sfdt], fileNames));

                return this.storageService.uploadMeta(this.dialogData.bucket, formDatas, metaDatas);
              })
            )
            .subscribe({
              next(res) {
                console.log('Next Success uploading files', res);
                notes.path = fileName;
              },
              complete: () => {
                console.log('complete');
                this.reviewHistoryService.loading$.next(false);
                const data = {
                  notes,
                  review: this.reviewHistory.value,
                };
                this.dialogRef.close(data);
              },
              error: err => {
                console.log('error', err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Something went wrong while uploading the document. Please try again.',
                });
                this.reviewHistoryService.loading$.next(false);
              },
            });
        })
      )
      .subscribe();
  }
}
