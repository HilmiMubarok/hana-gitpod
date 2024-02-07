import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ReviewHistoryDialogComponent } from '../../review-history-dialog/review-history-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IReviewHistory } from './review-history';
import { ReviewHistoryService } from './review-history.service';
import { Subject, takeUntil } from 'rxjs';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { AccountService } from 'app/core/auth/account.service';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'jhi-review-history',
  styleUrls: ['../../credit-agreement.css'],
  template: `
    <mat-card class="mt-3">
      <mat-card-header>
        <mat-card-title>Review History</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="data" class="w-100 mt-3" multiTemplateDataRows>
          <ng-container matColumnDef="no">
            <th mat-header-cell *matHeaderCellDef class="text-center">No</th>
            <td mat-cell *matCellDef="let element; let i = dataIndex" class="text-center">
              {{ i + 1 }}.

              <!-- {{ element.no }} -->
            </td>
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
            <td mat-cell *matCellDef="let element" class="text-center">{{ element.date }}</td>
          </ng-container>
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef class="text-center">Action</th>
            <td mat-cell *matCellDef="let element" class="text-center">{{ element.action }}</td>
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
        <!-- <mat-paginator showFirstLastButtons ngClass="transparant" [length]="5" [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons>
        </mat-paginator> -->

        <div class="e-card-action" align="center">
          <button (click)="addReviewHistory()" class="btn-lg text-uppercase button-styling text-center mt-2" mat-raised-button>Add</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class ReviewHistoryComponent implements OnChanges, OnDestroy, OnInit {
  constructor(
    private dialog: MatDialog,
    private reviewHistoryService: ReviewHistoryService,
    private storageService: StorageService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute
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
  }

  private applicationId: number;
  private positionId: number;
  public username: string;
  private positionDesc: string;
  private approverName: string;
  private dateNow: string = moment(new Date()).format().substring(0, 19) + 'Z';

  public data: MatTableDataSource<IReviewHistory> = new MatTableDataSource<IReviewHistory>([
    {
      approverName: 'Approve Name',
      position: 'Position',
      date: 'Date',
    },
    {
      approverName: 'Approve Name',
      position: 'Position',
      date: 'Date',
    },
    {
      approverName: 'Approve Name',
      position: 'Position',
      date: 'Date',
    },
    {
      approverName: 'Approve Name',
      position: 'Position',
      date: 'Date',
    },
    {
      approverName: 'Approve Name',
      position: 'Position',
      date: 'Date',
    },
    {
      approverName: 'Approve Name',
      position: 'Position',
      date: 'Date',
    },
  ]);

  private destroy$: Subject<boolean> = new Subject<boolean>();
  public _creditProposal: ICreditProposal;
  public loading: Boolean = false;
  public reviewHistoryData: INotes[] = [];
  public displayReviewHistory = ['no', 'approverName', 'position', 'date', 'action'];

  ngOnInit(): void {
    this.getBucket();
    console.log('init', {
      appId: this.applicationId,
      posId: this.positionId,
      posDesc: this.positionDesc,
      approverName: this.approverName,
      date: this.dateNow,
      type: 'review_history',
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.creditProposal = changes['creditProposal'].currentValue;
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

  public bucket: string;
  getBucket(): void {
    this.storageService
      .getBucketName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.bucket = res['body']['bucket'];
        console.log('bucket', { res, b: this.bucket });
      });
  }

  public addReviewHistory(): void {
    const dialogRef = this.dialog.open(ReviewHistoryDialogComponent, {
      data: {
        approverName: this.approverName,
        applicationId: this.applicationId,
        position: this.positionDesc,
        positionId: this.positionId,
        date: this.dateNow,
        bucket: this.bucket,
        username: this.username,
        type: 'review_history',
      },
      width: '90%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);

      if (result) {
        if (result.notes) {
          this.notesChange.emit(result.notes);
        }
      }
    });
  }
}
