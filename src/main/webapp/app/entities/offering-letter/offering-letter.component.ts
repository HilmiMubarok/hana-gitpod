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
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { CashOfferingLetterService } from './cash-offering-letter.service';
import { CashCreditProposalService } from '../credit-proposal/cash-credit-proposal.service';
import { TemplateService } from 'app/layouts/template/template.service';
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
  public clickedChip: any;
  public statusCodesData: Object[] = [];
  public iconTimeline: any;
  public activeRoute: string;
  public isShow: boolean;
  public title: string;
  public value: string;
  public statusSearch = false;
  public positionIdLocStor: string;

  constructor(
    private offeringLetterService: OfferingLetterService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    private positionService: PositionService,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected applicationConfigService: ApplicationConfigService,
    public creditProposalService: CreditProposalService,
    private cashOfferingLetterService: CashOfferingLetterService,
    private cashCreditProposalService: CashCreditProposalService,
    private templateService: TemplateService
  ) {
    super(_snackBar, offeringLetterService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      statusId: '',
      statusDescription: '',
    };
    this.iconTimeline = faTimeline;
    this.activeRoute = this.router.url.replace(/\//g, '');
  }

  private loadStatusChip(): void {
    this.offeringLetterService.getStatus(this.activeRoute).subscribe(res => {
      this.statusCodesData = res.body;
      // if only has one status, then hide the status chip
      res.body.length === 0 ? (this.isShow = false) : (this.isShow = true);
    });
  }

  ngOnInit(): void {
    this.positionIdLocStor = this.getLocStor('POS');
    this.loadStatusChip();
    this.loadAll();
  }

  public queryListOfViewStatusFilterBy(appMenu: string) {
    this.cashCreditProposalService
      .queryListOfViewStatusFilterBy({
        page: 0,
        size: 9999,
        sort: ['id', 'asc'],
        appMenuId: appMenu,
      })
      .subscribe((res: any) => {
        this.statusCodesData = res.body;
      });
  }

  public closeSearch() {
    this.statusSearch = false;
    this.currentSearch = '';
    this.page = 0;

    this.itemsPerPage = 10;
    this.loadAll();
  }
  public doSearch(): void {
    this.statusSearch = true;
    const predicate: object = {
      page: this.page,
      query: this.currentSearch,
      size: this.itemsPerPage,
      sort: this.sortData(),
      idPosition: this.positionIdLocStor,
    };

    if (this.activeRoute === 'distribution') {
      predicate['target'] = 'offering-letter-distribution';
    } else if (this.activeRoute === 'finalize') {
      predicate['target'] = 'offering-letter-finalize';
    } else if (this.activeRoute === 'review') {
      predicate['target'] = 'offering-letter-review';
    } else if (this.activeRoute === 'confirmation') {
      predicate['target'] = 'offering-letter-confirmation';
    }

    this.cashCreditProposalService
      .searchCP(predicate)
      .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
    return;
  }

  public chipClick(option: any): void {
    this.page = 0;
    if (this.clickedChip.statusId === option.statusId) {
      this.clickedChip = {
        statusId: '',
        statusDescription: '',
      };
    } else {
      this.clickedChip = option;
    }
    this.loadAll();
  }

  protected postLoadDataLazy(): void {
    if (this.currentSearch === '' || this.currentSearch === undefined || this.currentSearch === null) {
      this.loadAll();
    } else {
      this.doSearch();
    }
  }

  private getLocStor(cookieName: string) {
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

  private loadAll(): void {
    this.loading = true;

    if (!this.positionIdLocStor) {
      this.templateService.changePosInt('Empty');
      this.router.navigate(['']);
    } else {
      if (this.activeRoute === 'distribution') {
        this.queryListOfViewStatusFilterBy('DISTRIBUTION_OFFERING_LETTER');
        if (this.clickedChip['statusId'] !== '') {
          this.cashOfferingLetterService
            .distribution({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashOfferingLetterService
            .distribution({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'finalize') {
        this.queryListOfViewStatusFilterBy('FINALIZE_OFFERING_LETTER');
        if (this.clickedChip['statusId'] !== '') {
          this.cashOfferingLetterService
            .finalize({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashOfferingLetterService
            .finalize({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'review') {
        this.queryListOfViewStatusFilterBy('OFFERING_LETTER_REVIEW');
        if (this.clickedChip['statusId'] !== '') {
          this.cashOfferingLetterService
            .review({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashOfferingLetterService
            .review({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      } else if (this.activeRoute === 'confirmation') {
        this.queryListOfViewStatusFilterBy('OFFERING_LETTER_CONFIRMATION');
        if (this.clickedChip['statusId'] !== '') {
          this.cashOfferingLetterService
            .confirmation({
              page: this.page,
              idStatus: this.clickedChip['statusId'],
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        } else {
          this.cashOfferingLetterService
            .confirmation({
              page: this.page,
              idPosition: this.getLocStor('POS'),
              size: this.itemsPerPage,
              sort: this.sortData(),
            })
            .pipe(map((res: HttpResponse<ICreditProposal[]>) => this.preLoad(res)))
            .subscribe({
              next: (res: HttpResponse<ICreditProposal[]>) => this.initDataForMatTable(res, res.headers),
              error: (res: HttpErrorResponse) => this.onError(res.message),
            });
        }
      }
    }
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

        // data[i]['rmName'] = data[i].rm ? data[i].rm.partyName : '';
        // data[i]['rmName'] = data[i].rm ? data[i].rm.employeeFirstName + data[i].rm.employeeLastName : '';
        data[i]['rmName'] = data[i].ownerPosition
          ? data[i].ownerPosition.employeeFirstName + ' ' + data[i].ownerPosition.employeeLastName
          : '';

        if (data[i].ownerPosition) {
          this.findPositionByIdParty(data[i].ownerPosition.partyId).then(res => {
            data[i]['rmBranch'] = res;
          });
        }

        // data[i].prospectPerson.maritalStatus.toLowerCase().toString();

        for (let k = 0; k < data[i].addresses.length; k++) {
          if (data[i].addresses[k].purposeTypeId === 'PRIMARY_LOCATION') {
            data[i]['addressF'] = data[i].addresses[k].address.address1;
          }
        }

        const statusDist = 'Distribution';
        const statusComplete = 'Complete';
        const statusConfirm = 'Confirmation';
        const statusAssigned = 'Assigned';
        const statusFinal = 'Finalize';
        for (let h = 0; h < data[i].statusDescription.length; h++) {
          if (data[i].statusDescription === 'Ol Distribution') {
            data[i].statusDescription = data[i].statusDescription.replace(/Ol Distribution/gi, statusDist);
          }
          if (data[i].statusDescription === 'Ol Confirmation') {
            data[i].statusDescription = data[i].statusDescription.replace(/Ol Confirmation/gi, statusConfirm);
          }
          if (data[i].statusDescription === 'Ol Complete') {
            data[i].statusDescription = data[i].statusDescription.replace(/Ol Complete/gi, statusComplete);
          }
          if (data[i].statusDescription === 'Ol Assigned') {
            data[i].statusDescription = data[i].statusDescription.replace(/Ol Assigned/gi, statusAssigned);
          }
          if (data[i].statusDescription === 'Ol Finalize') {
            data[i].statusDescription = data[i].statusDescription.replace(/Ol Finalize/gi, statusFinal);
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
        rs.title = data[i].statusDescription;
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
      dialogRef.afterClosed().subscribe(res2 => {});
    });
  }

  getText(value: any) {
    if (value === 'distribution') {
      this.title = 'Offering Letter Distribution';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'finalize') {
      this.title = 'Offering Letter Finalize';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'review') {
      this.title = 'Offering Letter Review';
      sessionStorage.setItem('appName', this.title);
    }
    if (value === 'confirmation') {
      this.title = 'Offering Letter Confirmation';
      sessionStorage.setItem('appName', this.title);
    }
  }
}
