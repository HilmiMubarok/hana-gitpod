import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ReviewHistoryDialogComponent } from '../../review-history-dialog/review-history-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { IReviewHistory } from './review-history';
import { ReviewHistoryService } from './review-history.service';
import { concatMap, forkJoin, from, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { INotes } from 'app/entities/notes/notes.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { AccountService } from 'app/core/auth/account.service';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
} from '@syncfusion/ej2-angular-documenteditor';
import { MessageService } from 'primeng/api';
import * as uuid from 'uuid';
import { BusinessActivityService } from 'app/entities/credit-proposal/busines-activity/business-activity.service';
@Component({
  selector: 'jhi-review-history',
  styleUrls: ['../../credit-agreement.css'],
  template: `
    <mat-card class="mt-3">
      <mat-card-header>
        <mat-card-title>Review History</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="reviewHistoryData$ | async" class="w-100 mt-3" multiTemplateDataRows>
          <ng-container matColumnDef="no">
            <th mat-header-cell *matHeaderCellDef class="text-center">No</th>
            <td mat-cell *matCellDef="let element; let i = dataIndex" class="text-center">{{ i + 1 }}.</td>
          </ng-container>
          <ng-container matColumnDef="approverName">
            <th mat-header-cell *matHeaderCellDef class="text-center">Approver Name</th>
            <td mat-cell *matCellDef="let element" class="text-center">{{ element.approverName }}</td>
          </ng-container>
          <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef class="text-center">Position</th>
            <td mat-cell *matCellDef="let element" class="text-center">{{ element.position }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef class="text-center">Date</th>
            <td mat-cell *matCellDef="let element" class="text-center">{{ element.date | date: 'yyyy/dd/MM' }}</td>
          </ng-container>
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef class="text-center">Action</th>

            <td mat-cell *matCellDef="let element">
              <button mat-icon-button (click)="detailReviewHistory(element)">
                <mat-icon>remove_red_eye</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayReviewHistory.length">No records found.</td>
          </tr>
          <tr mat-header-row *matHeaderRowDef="displayReviewHistory"></tr>
          <tr mat-row *matRowDef="let element; columns: displayReviewHistory"></tr>
        </table>
        <mat-card *ngIf="loading" id="material-loading-bar">
          <mat-progress-spinner color="warn" mode="indeterminate"> </mat-progress-spinner>
        </mat-card>

        <div class="mt-3" *ngIf="reviewHistoryService.visibleRemarks | async">
          <ejs-documenteditorcontainer
            #document_editor_container
            [headers]="customHeadersJWT"
            (keyDown)="onKeyDown($event)"
            [enableLocalPaste]="false"
            height="100vh"
            style="display: block"
            [spellcheck]="false"
            [enableSpellCheck]="false"
            [enableAutoFocus]="false"
            (created)="onCreate()"
          ></ejs-documenteditorcontainer>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class ReviewHistoryComponent implements OnChanges, OnDestroy, OnInit {
  constructor(
    private dialog: MatDialog,
    public reviewHistoryService: ReviewHistoryService,
    private storageService: StorageService,
    private accountService: AccountService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private loader: BusinessActivityService
  ) {
    // this.reviewHistoryService.loading$.pipe(takeUntil(this.destroy$)).subscribe(res => (this.loading = res));

    // get route params id
    this.applicationId = this.activatedRoute.snapshot.params.id;
    // set position id base on logged in user
    this.positionId = this.reviewHistoryService.getLocStor('POS');
    // set position description base on logged in user
    this.positionDesc = this.reviewHistoryService.getLocStor('POSOD');

    this.accountService
      .identity()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.approverName = account.firstName + ' ' + account.lastName;
        this.username = account.login;
      });

    // Check if saveReviewHistory is triggered
    this.reviewHistoryService.saveReviewHistory.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.save();
      }
    });

    this.reviewHistoryService.notes.pipe(takeUntil(this.destroy$)).subscribe(notes => {
      this.notes = notes;
    });

    this.storageService
      .getBucketName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.bucket = res['body']['bucket'];
      });

    this.reviewHistoryService.currentNote.pipe(takeUntil(this.destroy$)).subscribe(note => {
      this.currentNote = note;

      if (this.currentNote) {
        this.openCurrentNote(this.currentNote);
      }
    });
  }

  public currentNote: INotes;
  public notes: INotes[] = [];
  public reviewHistoryData$: Observable<IReviewHistory[]> = this.reviewHistoryService.reviewHistory;
  private applicationId: number;
  private positionId: number;
  public username: string;
  private positionDesc: string;
  private approverName: string;
  public disabledAddButton: Boolean = false;
  private dateNow: string = moment(new Date()).format().substring(0, 19) + 'Z';
  public path = 'pk/review_history';

  public data: MatTableDataSource<IReviewHistory> = new MatTableDataSource<IReviewHistory>([]);

  private destroy$: Subject<boolean> = new Subject<boolean>();
  public _creditProposal: ICreditProposal;
  public loading: Boolean = false;
  public reviewHistoryData: INotes[] = [];
  public displayReviewHistory = ['no', 'approverName', 'position', 'date', 'action'];

  // Remarks
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;

  customHeadersJWT: any;

  public onCreate(): void {
    this.container.serviceUrl = '/services/los/api/wordeditor/';
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

  public bucket: string;
  getBucket(): Observable<any> {
    return this.storageService.getBucketName().pipe(
      takeUntil(this.destroy$),
      tap(res => {
        this.bucket = res['body']['bucket'];
      })
    );
  }

  openCurrentNote(note: INotes) {
    if (note.path) {
      const obj = {
        key: this.path + '/' + this.applicationId + '/' + note.path + '/sfdt',
      };

      this.getBucket()
        .pipe(
          concatMap(() => this.storageService.getObjects(this.bucket, obj)),
          takeUntil(this.destroy$)
        )
        .subscribe(response => {
          if (response.body.length > 0) {
            this.storageService
              .fileBlob(response.body[response.body.length - 1]['url'])
              .pipe(takeUntil(this.destroy$))
              .subscribe(res => {
                const file = new File([res.body], this.username + '-' + this.approverName + '.sfdt');
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (e: any) => {
                  const docEditor = this.container?.documentEditor as DocumentEditorComponent;

                  const contents: string = e.target.result;
                  docEditor.open(contents);
                };
                fileReader.readAsText(file);
              });
          }
        });
    }
  }

  setVisibleRemarks() {
    const disabledStatuses = ['PK_GENERATED', 'PK_FINALIZE'];
    const positionId = this.reviewHistoryService.getLocStor('POS');
    const currentNote = this.currentNote;
    const statusId = this.creditProposal.statusId;

    if (disabledStatuses.includes(statusId)) {
      this.reviewHistoryService.visibleRemarks$.next(false);
      return;
    }

    if (currentNote !== undefined) {
      if (Number(currentNote.positionId) !== Number(positionId)) {
        this.reviewHistoryService.visibleRemarks$.next(false);
        return;
      }
    } else {
      this.reviewHistoryService.visibleRemarks$.next(false);
      return;
    }

    this.reviewHistoryService.visibleRemarks$.next(true);
  }

  // End Remarks

  ngOnInit(): void {
    this.customHeadersJWT = [{ 'X-XSRF-TOKEN': this.reviewHistoryService.getLocStor('XSRF-TOKEN') }];
    this.getBucket();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.creditProposal = changes['creditProposal'].currentValue;
      this.reviewHistoryService.setReviewHistoryData(this.creditProposal.notes, Number(this.positionId));
      this.setVisibleRemarks();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  @Output() notesChange = new EventEmitter<INotes>();

  @Input()
  get creditProposal(): ICreditProposal {
    return this._creditProposal;
  }

  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  detailReviewHistory(element: IReviewHistory) {
    const dialogRef = this.dialog.open(ReviewHistoryDialogComponent, {
      data: {
        reviewHistory: element,
        bucket: this.bucket,
        applicationId: this.applicationId,
      },
      width: '90%',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        console.log('Dialog detail closed with result:', result);
      });
  }

  save() {
    this.loader.setLoading(true);
    const folder = this.currentNote !== undefined && this.currentNote.path !== null ? this.currentNote.path : uuid.v4();
    const notes: INotes = this.currentNote !== undefined ? { ...this.currentNote } : {};

    const modifiedApproverName = this.approverName.replace(/ /g, '-').replace('&', '');

    const fileName = this.username + '-' + modifiedApproverName + '.docs';

    notes.path =
      this.currentNote !== undefined && this.currentNote.path !== null
        ? this.currentNote.path
        : folder + '-' + this.username + '-' + modifiedApproverName;
    notes.statusId = 'ACTIVE';

    this.notesChange.emit(notes);

    const docEditor = this.container?.documentEditor as DocumentEditorComponent;
    const saveDocx$ = from(docEditor?.saveAsBlob('Docx'));
    const saveSfdt$ = from(docEditor?.saveAsBlob('Sfdt'));

    forkJoin([saveDocx$, saveSfdt$])
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.reviewHistoryService.loading$.next(true)),
        map(([docx, sfdt]) => {
          this.reviewHistoryService.loading$.next(true);
          const fileTypeWord = 'word';

          const metaData = {
            objectName: `${this.path}/${this.applicationId}/${notes.path}/${fileTypeWord}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([docx], fileName));

          this.storageService
            .uploadMeta(this.bucket, formData, metaData)
            .pipe(
              switchMap(() => {
                const fileTypeSfdt = 'sfdt';
                const fileNames = this.username + '-' + modifiedApproverName + '.sfdt';

                const metaDatas = {
                  objectName: `${this.path}/${this.applicationId}/${notes.path}/${fileTypeSfdt}/${fileNames}`,
                };
                const formDatas = new FormData();
                formDatas.append('file', new File([sfdt], fileNames));

                return this.storageService.uploadMeta(this.bucket, formDatas, metaDatas);
              })
            )
            .subscribe({
              next(res) {
                console.log('next', res);
              },
              complete: () => {
                console.log('complete', notes);
                this.openCurrentNote(this.currentNote);
                this.loader.setLoading(false);
                this.reviewHistoryService.saveReviewHistory$.next(false);
              },
              error: err => {
                console.log('error', err);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Something went wrong while uploading the document. Please try again.',
                });
                this.loader.setLoading(false);
                this.reviewHistoryService.saveReviewHistory$.next(false);
              },
            });
        })
      )
      .subscribe();
  }
}
