import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { ILoanApplication } from '../loan-application/loan-application.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoanApplicationService } from '../loan-application/loan-application.service';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CreditProposalService } from './credit-proposal.service';
import { STATUS } from 'app/shared/constants/status.constants';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { MatDialog } from '@angular/material/dialog';
import { IApplicationStateLog } from '../application-state-log/application-state-log.model';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';

@Component({
  selector: 'jhi-credit-proposal-loan-application',
  templateUrl: './credit-proposal-loan-application.component.html',
  styleUrls: ['./credit-proposal-list.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreditProposalLoanApplicationComponent extends AbstractEntityMaterialComponent<ILoanApplication> implements OnInit {
  public clickedChip: Object;
  public iconTimeline: any;
  public statusCodesData: Object[] = [];
  public statusCodesDataRes: Object[] = [];
  public displayedColumns: string[] = ['no', 'proposalNumber', 'cif', 'customerName', 'customerType', 'createdDate', 'status', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  constructor(
    protected _snackBar: MatSnackBar,
    protected loanApplicationService: LoanApplicationService,
    protected creditProposalService: CreditProposalService,
    protected router: Router,
    public dialog: MatDialog,
    protected applicationStateLogService: ApplicationStateLogService
  ) {
    super(_snackBar, loanApplicationService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      id: '',
      label: '',
    };
    this.iconTimeline = faTimeline;
  }

  ngOnInit(): void {
    this.loadAll();
    this.loadStatusChip();
  }

  public chipClick(option: object): void {
    this.page = 0;
    if (this.clickedChip === option) {
      this.clickedChip = {
        id: '',
        label: '',
      };
    } else {
      this.clickedChip = option;
    }
    this.loadAll();
  }

  public showTimeLine(element: ILoanApplication): void {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('CREDITPROPOSAL', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: { content: this.convertToTimelineModel(res.body) },
      });
      dialogRef.afterClosed().subscribe(res2 => {});
    });
  }

  private convertToTimelineModel(data: IApplicationStateLog[]) {
    const result: ITimeline[] = [];
    if (data.length > 0) {
      let rs: ITimeline;
      for (let i = 0; i < data.length; i++) {
        rs = new Timeline();
        rs.title = data[i].statusDescription;
        rs.date = data[i].createdDate;
        rs.text = data[i].note;
        rs.createdBy = data[i].userName;

        result.push(rs);
      }
    }
    return result;
  }

  private convertStatus(status: string): string {
    let _status: string;
    _status = '';
    _status = status.replace(/CP_/g, '');
    return _status;
  }

  private loadStatusChip(): void {
    this.creditProposalService.getStatus('credit-proposal-status').subscribe(res => {
      for (let i = 0; i < res.body.length; i++) {
        this.statusCodesData.push(res.body[i]);

        // special condition : rename label
        if (res.body[i].id === 'CP_RETURN_TO_RM') {
          this.statusCodesData[i]['label'] = 'Return To Credit Proposal (BU)';
        }
      }
    });
  }

  public doSearch(): void {
    if (this.currentSearch && this.currentSearch !== '') {
      this.router.navigate(['/credit-proposal-status/v2'], { queryParams: { search: this.currentSearch } });
      this.loadAll();
    } else {
      this.router.navigate(['/credit-proposal-status/v2']);
    }
  }

  private loadAll(): void {
    if (this.clickedChip['id'] !== '') {
      this.loanApplicationService
        .queryFilterBy({
          page: this.page,
          idStatus: this.convertStatus(this.clickedChip['id']),
          size: this.itemsPerPage,
          sort: ['id,desc'],
        })
        .subscribe(res => {
          this.initDataForMatTable(res, res.headers);
        });
      return;
    }

    if (this.currentSearch && this.currentSearch !== '') {
      this.loanApplicationService
        .search({
          page: this.page,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .subscribe(res => {
          this.initDataForMatTable(res, res.headers);
        });
      return;
    }

    this.loanApplicationService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe(res => {
        this.initDataForMatTable(res, res.headers);
      });
  }

  public previousState(): void {
    window.history.back();
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.statusCodesData, event.previousIndex, event.currentIndex);
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }
}
