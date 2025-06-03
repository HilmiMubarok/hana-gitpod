import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { MisReportService } from '../../mis-report.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'jhi-check-valuation',
  templateUrl: './check-valuation.component.html',
  styleUrls: ['../mis-appraisal.css'],
  styles: [
    `
      .select-all {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        line-height: 48px;
        height: 48px;
        padding: 0 16px;
        text-align: left;
        text-decoration: none;
        max-width: 100%;
        position: relative;
        liststyletype: none;
        outline: none;
        display: flex;
        flex-direction: row;
        max-width: 100%;
        box-sizing: border-box;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
      }

      .select-all:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }
    `,
  ],
})
export class CheckValuationComponent {
  lovStatusAppraisal = [];
  allSelected: any;
  CheckValuation: FormGroup;
  searchResultPagination: any;
  public displayedColumns: string[] = [
    'no',
    'appraisalNumber',
    'cif',
    'debtorName',
    'customerType',
    'appraisalDate',
    'appraisalType',
    'collateralType',
    'status',
    'action',
  ];
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.CheckValuation = new FormGroup({
      status: new FormControl(''),
    });
    this.getStatusesAppraisal();
  }
  getStatusesAppraisal() {
    this.misReportService.getStatuses('MIS_APPRAISAL').subscribe({
      next: res => (this.lovStatusAppraisal = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Status Appraisals' });
      },
    });
  }
  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.CheckValuation.get('status')?.setValue([...this.lovStatusAppraisal.map(status => status.statusId)]);
    } else {
      this.CheckValuation.get('status')?.setValue('');
    }
  }
  public previousState(): void {
    window.history.back();
  }
  public searchResult = null;
  public loadingSearch = false;
  public doSearch(): void {
    this.loadingSearch = true;
    const predicate: object = {
      page: 0,
      statuses: this.CheckValuation.get('status')?.value.join(','),
      size: 9999,
    };

    this.misReportService.findMisReportByStatus(predicate).subscribe({
      next: res => {
        this.searchResult = res.body;
        this.searchResultPagination = new MatTableDataSource(this.searchResult);
        setTimeout(() => {
          this.searchResultPagination.paginator = this.paginator;
        });
        this.loadingSearch = false;
      },
      error: (res: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
        this.loadingSearch = false;
      },
    });
  }
  @ViewChild('paginator') paginator: MatPaginator;
  public selectedAppraisals: string[] = [];

  onCheckboxChange(event: any, appraisalNumber: string): void {
    if (event.checked) {
      this.selectedAppraisals.push(appraisalNumber);
    } else {
      this.selectedAppraisals = this.selectedAppraisals.filter(id => id !== appraisalNumber);
    }
  }
  doChangeValuation(): void {
    if (this.selectedAppraisals.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select at least one appraisal.',
      });
      return;
    }

    const joinedAppraisals = this.selectedAppraisals.join(',');
    const predicate: object = {
      appraisalNumber: joinedAppraisals,
    };
    this.misReportService.changeValuation(predicate).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Valuation changed, Please Generate Report again.`,
          life: 3000,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Failed to change valuation.',
        });
      },
    });
  }
}
