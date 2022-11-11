import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { CreditProposal, ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { OfferingLetterService } from './offering-letter.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import lodash from 'lodash';

import { PositionService } from 'app/entities/position/position.service';

import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { IApplicationStateLog } from '../application-state-log/application-state-log.model';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { TimelineDialogComponent } from 'app/layouts/miscellaneous/timeline-dialog.component';
import { ITimeline, Timeline } from 'app/layouts/miscellaneous/timeline.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Component({
  selector: 'jhi-offering-letter',
  templateUrl: './offering-letter.component.html',
  styleUrls: ['./offering-letter.css'],
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
export class OfferingLetterComponent extends AbstractEntityMaterialComponent<ICreditProposal> implements OnInit {
  public displayedColumns: string[] = [
    'no',
    'proposalNumber',
    'applicationTypeDescription-proposalType',
    'cif',
    'customerName',
    'customerType',
    'createdDate',
    'status',
    'action',
  ];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: Object;
  public statusCodesData: Object[] = [];
  // public statusCodesDataRes: Object[] = [];
  // public statusCodesDataLineUp: string[] = [
  //   'CP_APPROVE_TO_LA',
  //   'CP_ASSIGNMENT',
  //   'CP_RETURN_TO_CR',
  //   'CP_CHECKER',
  //   'CP_CANCEL',
  //   'CP_REJECT',
  //   'CP_COMPLETE',
  // ];
  public iconTimeline: any;
  public activeRoute: string;
  public isShow: boolean;
  public title: string;

  constructor(
    private offeringLetterService: OfferingLetterService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    private positionService: PositionService,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected applicationConfigService: ApplicationConfigService
  ) {
    super(_snackBar, offeringLetterService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      id: '',
      label: '',
    };
    this.iconTimeline = faTimeline;
    this.activeRoute = this.router.url.replace(/\//g, '');
  }

  // private loadStatusChip(): void {
  //   this.offeringLetterService.getStatus(this.activeRoute).subscribe(res => {
  //     for (let i = 0; i < res.body.length; i++) {
  //       this.statusCodesDataRes.push(res.body[i]);
  //       if (this.statusCodesDataRes.length > 1) {
  //         this.statusCodesData.push(this.statusCodesDataRes[i]);
  //       }
  //       console.log('INI STATUS CODE RES', this.statusCodesDataRes);
  //     }
  //   });

  //   console.log('INI CHIP', this.statusCodesData);
  // }

  private loadStatusChip(): void {
    this.offeringLetterService.getStatus(this.activeRoute).subscribe(res => {
      for (let i = 0; i < res.body.length; i++) {
        this.statusCodesData.push(res.body[i]);
        this.isShow = true;
        if (i <= 1) {
          this.isShow = false;
        }
      }
      // this.sortStatusCodesData();
    });
    console.log('INI STATUS', this.statusCodesData);
  }

  ngOnInit(): void {
    this.loadStatusChip();
    this.loadAll();
  }
  public doSearch(): void {
    if (this.currentSearch && this.currentSearch !== '') {
      this.router.navigate([this.activeRoute], { queryParams: { search: this.currentSearch } });
      this.loadAll();
    } else {
      this.router.navigate([this.activeRoute]);
    }
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

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  private convertStatusActivateRoute(activeRoute: string): string {
    let activeRouteHelper = activeRoute;
    if (activeRoute === 'distribution') {
      activeRouteHelper = 'distribution';
    } else if (activeRoute === 'finalize') {
      activeRouteHelper = 'finalize';
    } else if (activeRoute === 'review') {
      activeRouteHelper = 'review';
    } else if (activeRoute === 'confirmation') {
      activeRouteHelper = 'confirmation';
    }

    return activeRouteHelper;
  }

  private convertStatus(status: string) {
    let _status: string;
    _status = '';
    if (status === 'DRAFT') {
      _status = status;
    } else {
      _status = 'CP_' + status.replace(/ /g, '_');
    }
    return _status;
  }

  private loadAll(): void {
    this.loading = true;
    const dynamicURL: string = this.applicationConfigService.getEndpointFor(
      MICROSERVICENAME.LOS + '/api/offering-letter/' + this.convertStatusActivateRoute(this.activeRoute)
    );
    console.log('Ini dynamicURL', dynamicURL);

    if (this.clickedChip['id'] !== '') {
      this.offeringLetterService
        .queryFilterBy({
          page: this.page,
          idStatus: this.convertStatus(this.clickedChip['id']),
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
      this.offeringLetterService
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

    this.offeringLetterService
      // .query({
      .queryDynamicURL(
        {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sortData(),
        },
        dynamicURL
      )
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }
  initDataForMatTable(data: any, headers: HttpHeaders) {
    let customItem = [];
    customItem = this.addIdx(data.body);
    customItem = this.addCustomItem(customItem);
    this.items = new MatTableDataSource(customItem);
    if (!this.items) {
      this.items.paginator = this.paginator;
    }
    this.items.sort = this.sort;
    this.paginatorLength = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSize = this.paginator.pageSize;
    this.loading = false;
  }

  private addCustomItem(data: ICreditProposal[]) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].products.length; j++) {
          if (data[i].id === data[i].products[j].applicationId) {
            data[i]['maturityDate'] = !lodash.has(data[i].products[j].attributes, 'maturityDate')
              ? data[i].products[j].attributes.maturityDate
              : '';
          }
        }
        data[i]['proposalType'] = !lodash.has(data[i].attributes, 'proposalType') ? data[i].attributes.proposalType : '';

        data[i]['rmName'] = data[i].rm ? data[i].rm.partyName : '';
        if (data[i].rm) {
          this.findPositionByIdParty(data[i].rm.partyId).then(res => {
            data[i]['rmBranch'] = res;
          });
        }

        for (let k = 0; k < data[i].addresses.length; k++) {
          if (data[i].addresses[k].purposeTypeId === 'PRIMARY_LOCATION') {
            data[i]['addressF'] = data[i].addresses[k].address.address1;
          }
        }
        const statusDesk = 'Distribution';
        for (let h = 0; h < data[i].statusDescription.length; h++) {
          if (data[i].statusDescription === 'Ol Distribution') {
            data[i].statusDescription = data[i].statusDescription.replace(/Ol Distribution/gi, statusDesk);
            console.log('distribusi', data[i].statusDescription);
          }
        }
      }
    }
    return data;
  }

  private findPositionByIdParty(partyId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.positionService.queryFilterBy({ idParty: partyId, size: 1, page: 0 }).subscribe(res => {
        if (res.body.length > 0) {
          resolve(res.body[0].internalName);
        } else {
          resolve(null);
        }
      });
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

  getText(value: any) {
    if (value === 'distribution') {
      this.title = 'Offering Letter Distribution';
    }
    if (value === 'finalize') {
      this.title = 'Offering Letter Finalize';
    }
    if (value === 'review') {
      this.title = 'Offering Letter Review';
    }
    if (value === 'confirmation') {
      this.title = 'Offering Letter Confirmation';
    }
  }
}
