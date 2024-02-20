import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
} from '@syncfusion/ej2-angular-documenteditor';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { filter, map, mergeMap, Subject, takeUntil } from 'rxjs';
import { ReviewHistoryService } from '../finalize-credit-agreement/review-history/review-history.service';
@Component({
  selector: 'jhi-review-history-dialog',
  template: `
    <h3 mat-dialog-title>Review History</h3>

    <div mat-dialog-content style="height: 100%">
      <div class="container" *ngIf="reviewHistoryService.loading$ | async">
        <div class="spinner"></div>
      </div>

      <form [formGroup]="reviewHistory">
        <div class="row">
          <div class="mb-2 col-md-6" style="margin-top: 20px">
            <mat-form-field class="w-100" appearance="outline">
              <mat-label>Approver Name</mat-label>
              <input matInput placeholder="Approver Name" formControlName="approverName" />
            </mat-form-field>
          </div>

          <div class="mb-2 col-md-6" style="margin-top: 20px">
            <mat-form-field class="w-100" appearance="outline">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" placeholder="Choose a date" formControlName="date" />
              <mat-datepicker-toggle matSuffix [for]="picker" disabled></mat-datepicker-toggle>
              <mat-datepicker #picker disabled></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="mb-2 col-md-12" style="margin-top: 20px">
            <mat-form-field class="w-100" appearance="outline">
              <mat-label>Position</mat-label>
              <input matInput placeholder="Position" formControlName="position" />
            </mat-form-field>
          </div>
        </div>
      </form>

      <h5>Opinion</h5>
      <ejs-documenteditorcontainer
        #document_editor_container
        [headers]="customHeadersJWT"
        [enableToolbar]="false"
        (keyDown)="onKeyDown($event)"
        [enableLocalPaste]="false"
        height="100vh"
        style="display: block"
        [enableEditor]="false"
        (documentChange)="onDocumentChange()"
        [spellcheck]="false"
        [enableSpellCheck]="false"
        (created)="onCreate()"
      ></ejs-documenteditorcontainer>
    </div>

    <mat-dialog-actions align="center">
      <button mat-raised-button class="confirm-button-no" mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
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
      approverName: [{ value: this.dialogData.reviewHistory.approverName, disabled: true }],
      date: [{ value: this.dialogData.reviewHistory.date, disabled: true }],
      position: [{ value: this.dialogData.reviewHistory.position, disabled: true }],
    });
    this.bucket = this.dialogData.bucket;
    this.applicationId = this.dialogData.applicationId;
  }

  reviewHistory: FormGroup;

  ngOnInit(): void {
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': this.getToken() }];

    this.getContainer();
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
    if (isCtrlKey && keyCode === '86') {
      args.isHandled = true;
    }
  }

  public bucket: string;
  public path = 'pk/review_history';
  public applicationId: string;

  onDocumentChange() {
    this.container.restrictEditing = true;
  }

  private getContainer(): void {
    this.reviewHistoryService.loading$.next(true);

    const filePath = `${this.path}/${this.applicationId}/${this.dialogData.reviewHistory.path}/sfdt`;

    this.storageService
      .getObjects(this.bucket, { key: filePath })
      .pipe(
        takeUntil(this.destroy$),
        filter(response => response.body.length > 0),
        map(response => response.body[response.body.length - 1]['url']),
        mergeMap(url => this.storageService.fileBlob(url))
      )
      .subscribe({
        next: res => {
          const fileName = this.getFileName(res.url, '/');
          const file = new File([res.body], fileName);
          const fileReader = new FileReader();

          fileReader.onload = (e: any) => {
            const docEditor = this.container?.documentEditor as DocumentEditorComponent;
            const contents: string = e.target.result;
            docEditor.open(contents);
            this.reviewHistoryService.loading$.next(false);
          };

          fileReader.readAsText(file);
        },
        error: error => {
          console.log(error);
          this.reviewHistoryService.loading$.next(false);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading document' });
        },
      });
  }

  getFileName(str: string, substring: string) {
    const lastIndex = str.lastIndexOf(substring);

    const after = str.slice(lastIndex + 1);

    const removeRemainingStringAfterSfdt = after.split('.sfdt')[0];

    return removeRemainingStringAfterSfdt;
  }

  getToken(): string {
    return this.reviewHistoryService.getLocStor('XSRF-TOKEN');
  }

  public onCreate(): void {
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }
}
