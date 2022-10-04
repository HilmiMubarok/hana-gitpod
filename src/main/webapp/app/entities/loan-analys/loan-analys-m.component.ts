import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import lodash from 'lodash';

import { PositionService } from 'app/entities/position/position.service';

@Component({
  selector: 'jhi-loan-analys-m',
  templateUrl: './loan-analys-m.component.html',
  styleUrls: ['./loan-analys-m.css'],
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
export class LoanAnalysMComponent extends AbstractEntityMaterialComponent<ICreditProposal> implements OnInit {
  // public displayedColumns: string[] = ['no', 'rmInfo', 'proposalNumber', 'applicationTypeDescription-proposalType', 'cif', 'customerName', 'customerType', 'createdDate', 'status', 'action'];
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
  public clickedChip: string;
  public statusCodesData: string[] = ['APPROVE TO LA', 'ASSIGNMENT', 'RETURN TO CR', 'CHECKER', 'CANCEL', 'REJECT', 'COMPLETE'];
  public statusDataCopy: string[] = ['Approve To Loan Analysis', 'Assignment', 'Checker', 'Cancel', 'Reject', 'Complete'];

  constructor(
    private creditProposalService: CreditProposalService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    private positionService: PositionService
  ) {
    super(_snackBar, creditProposalService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = '';
  }

  ngOnInit(): void {
    this.loadAll();
  }

  public doSearch(): void {
    if (this.currentSearch && this.currentSearch !== '') {
      this.router.navigate(['credit-proposal'], { queryParams: { search: this.currentSearch } });
      this.loadAll();
    } else {
      this.router.navigate(['credit-proposal']);
    }
  }

  public chipClick(option: string): void {
    this.page = 0;
    if (this.clickedChip === option) {
      this.clickedChip = '';
    } else {
      this.clickedChip = option;
    }
    this.loadAll();
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

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public resFunction(res: any) {
    const response = {
      body: [],
    };
    for (let i = 0; i < res.body.length; i++) {
      for (let j = 0; j < this.statusDataCopy.length; j++) {
        if (res.body[i].statusDescription === this.statusDataCopy[j]) {
          response.body.push(res.body[i]);
        }
      }
    }

    return response;
  }

  private loadAll(): void {
    this.loading = true;
    if (this.clickedChip !== '') {
      this.creditProposalService
        .queryFilterBy({
          page: this.page,
          idStatus: this.convertStatus(this.clickedChip),
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
            const response = this.resFunction(res);
            this.initDataForMatTable(response, res.headers);
          },
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    this.creditProposalService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: (res: HttpResponse<ICreditProposal[]>) => {
          const response = this.resFunction(res);

          this.initDataForMatTable(response, res.headers);
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

  public goToBulkBatchAssign(): void {
    this.router.navigate(['./loan-analys/batch-bulk-assign']);
  }

  public previousState(): void {
    window.history.back();
  }
}
