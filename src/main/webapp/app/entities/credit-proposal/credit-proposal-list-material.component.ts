import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { IApplicationStateLog } from '../application-state-log/application-state-log.model';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';

@Component({
  selector: 'jhi-credit-proposal-list-material',
  templateUrl: './credit-proposal-list-material.component.html',
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
export class CreditProposalListMaterialComponent extends AbstractEntityMaterialComponent<ICreditProposal> implements OnInit {
  public displayedColumns: string[] = ['no', 'proposalNumber', 'cif', 'customerName', 'customerType', 'createdDate', 'status', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: Object;
  public iconTimeline: any;
  public statusCodesData: Object[] = [];
  public statusCodesDataRes: Object[] = [];
  public statusCodesDataLineUp: string[] = [
    'CP_DRAFT',
    'CP_RETURN_TO_RM',
    'CP_APPROVAL_SME_HEAD',
    'CP_APPROVAL_BM',
    'CP_APPROVAL_SDH',
	'CP_APPROVAL_DH',
    'CP_CANCEL',
    'CP_REJECT'
  ];

  constructor(
    private creditProposalService: CreditProposalService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService
  ) {
    super(_snackBar, creditProposalService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
	  id: '',
	  label: ''
	};
    this.iconTimeline = faTimeline;
  }

  ngOnInit(): void {
	this.loadStatusChip();
    this.loadAll();
  }

  private sortStatusCodesData(): void {
	for(let i = 0; i < this.statusCodesDataLineUp.length; i++){
	  for(let j = 0; j < this.statusCodesDataRes.length; j++){
		if(this.statusCodesDataRes[j]['id'] === this.statusCodesDataLineUp[i]){
		  this.statusCodesData.push(this.statusCodesDataRes[j]);
		}
	  }
	}
  }

  private loadStatusChip(): void {
	this.creditProposalService.getStatus().subscribe(res => {
	  for(let i = 0; i < res.body.length; i++){
		this.statusCodesDataRes.push(res.body[i]);

		// special condition : rename label
		if(res.body[i].id === 'CP_RETURN_TO_RM'){
		  this.statusCodesDataRes[i]['label'] = 'Return To Credit Proposal (BU)';
		}
	  }
	  this.sortStatusCodesData();
	});
  }

  public doSearch(): void {
    if (this.currentSearch && this.currentSearch !== '') {
      this.router.navigate(['credit-proposal'], { queryParams: { search: this.currentSearch } });
      this.loadAll();
    } else {
      this.router.navigate(['credit-proposal']);
    }
  }

  public chipClick(option: Object): void {
    this.page = 0;
    if (this.clickedChip === option) {
      this.clickedChip = '';
    } else {
      this.clickedChip = option;
    }
    this.loadAll();
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;
    if (this.clickedChip['id'] !== '') {
      this.creditProposalService
        .queryFilterBy({
          page: this.page,
          idStatus: this.clickedChip['id'],
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    if (this.currentSearch && this.currentSearch !== '') {
      this.creditProposalService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<ICreditProposal[]>) => {
            this.initDataForMatTable(res, res.headers);
          },
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    this.creditProposalService
      // .query({
	  .queryNew({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.statusCodesData, event.previousIndex, event.currentIndex);
  }

  public previousState(): void {
    window.history.back();
  }

  private convertToTimelineModel(data: IApplicationStateLog[]) {
    const result: ITimeline[] = [];
    if (data.length > 0) {
      let rs: ITimeline;
      for (let i = 0; i < data.length; i++) {
        rs = new Timeline();
        rs.title = data[i].status;
        rs.date = data[i].createdDate;
        rs.text = data[i].note;
        rs.createdBy = data[i].userName;

        result.push(rs);
      }
    }
    return result;
  }

  public showTimeLine(element: ICreditProposal): void {
    this.applicationStateLogService.findByBusinessKeyAndRefKey('CREDITPROPOSAL', element.id).subscribe(res => {
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        width: '80vw',
        data: { content: this.convertToTimelineModel(res.body) },
      });
      dialogRef.afterClosed().subscribe(res2 => {
        console.log(res2);
      });
    });
  }
}