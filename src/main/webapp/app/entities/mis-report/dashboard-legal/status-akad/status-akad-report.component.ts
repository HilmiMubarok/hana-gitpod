import { MisReportService } from '../../mis-report.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment, { Moment } from 'moment';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MessageService } from 'primeng/api';
import _ from 'lodash';
import { StatusAkadReportService } from './status-akad-report.service';

interface DataSourceStatusAkad {
  month: string;
  done: number;
  cancel: number;
  pending: number;
  totalEOM: number;
}

export const YEAR_ONLY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'jhi-status-akad-report',
  templateUrl: './status-akad-report.component.html',
  styleUrls: ['./status-akad-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMATS },
  ],
})
export class StatusAkadComponent extends AbstractExcelMISReport implements OnInit {
  constructor(
    private misReportService: MisReportService,
    private messageService: MessageService,
    private statusAkadService: StatusAkadReportService
  ) {
    super(misReportService);
    this.selectedYear = new Date().getFullYear().toString();
  }

  selectedCredit = 'All';

  selectedYear;
  dataSource: DataSourceStatusAkad[] = [];
  yearFormControl = new FormControl(moment());

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const regionParam = this.selectedCredit === 'All' ? undefined : this.selectedCredit;

    this.statusAkadService.getStatusAkad(this.selectedYear, regionParam).subscribe({
      next: res => {
        const summary = res[0];

        const months = [
          'JANUARY',
          'FEBRUARY',
          'MARCH',
          'APRIL',
          'MAY',
          'JUNE',
          'JULY',
          'AUGUST',
          'SEPTEMBER',
          'OCTOBER',
          'NOVEMBER',
          'DECEMBER',
        ];

        const data: any[] = [];

        months.forEach(month => {
          const monthData = summary.summaryMonthData.find(m => m.month.toUpperCase() === month);
          const summaryDTO = monthData?.summaryDTO || { done: 0, cancel: 0, pending: 0, totalEOM: 0 };

          data.push({
            month: month.charAt(0) + month.slice(1).toLowerCase(),
            done: summaryDTO.done || 0,
            cancel: summaryDTO.cancel || 0,
            pending: summaryDTO.pending || 0,
            totalEOM: summaryDTO.totalEOM || 0,
          });
        });

        data.push({
          month: 'Total E.O.Y',
          done: summary.countYearly.totalDone || 0,
          cancel: summary.countYearly.totalCancel || 0,
          pending: summary.countYearly.totalPending || 0,
          totalEOM: summary.countYearly.total || 0,
        });

        this.dataSource = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get Status Akad Data',
        });
      },
    });
  }

  onYearSelected(normalizedYear: Moment, dp: any) {
    const ctrlValue = this.yearFormControl.value;
    ctrlValue.year(normalizedYear.year());
    this.yearFormControl.setValue(ctrlValue);
    dp.close();

    this.selectedYear = this.yearFormControl.value.year().toString();
    this.loadData();
  }

  onCreditSelected(): void {
    this.loadData();
  }

  generate(): void {
    this.processGenerate(this.dataSource);
  }

  get columns(): any[] {
    return ['month', 'done', 'cancel', 'pending', 'totalEOM'];
  }

  protected processData(data: any[]): void {
    const selectedYear = this.selectedYear || new Date().getFullYear();

    const titleRow = this.worksheet.getRow(1);
    titleRow.getCell(1).value = 'STATUS AKAD REPORT';
    titleRow.getCell(1).font = { bold: true, size: 14 };
    titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

    const subTitleRow = this.worksheet.getRow(2);
    let creditLabel = 'Credit Legal Department (HO + OR)';
    if (this.selectedCredit === 'R1') {
      creditLabel = 'Credit Legal Head Office (HO)';
    } else if (this.selectedCredit === 'R2') {
      creditLabel = 'Credit Legal Out Region (OR)';
    }
    subTitleRow.getCell(1).value = creditLabel;
    subTitleRow.getCell(1).font = { bold: true };
    subTitleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

    this.worksheet.getCell('E3').value = selectedYear;
    this.worksheet.getCell('E3').font = { bold: true };
    this.worksheet.getCell('E3').alignment = { vertical: 'middle', horizontal: 'center' };

    const headerRow = this.worksheet.getRow(4);
    const columns = ['MONTH', 'DONE', 'CANCEL', 'PENDING', 'TOTAL E.O.M'];
    headerRow.values = columns;
    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    let rowIndex = 5;
    let totalDone = 0;
    let totalCancel = 0;
    let totalPending = 0;
    let totalEOM = 0;

    data.forEach((item: any) => {
      const { month, done = 0, cancel = 0, pending = 0, totalEOM: monthlyTotal = 0 } = item;

      if (month.toLowerCase().includes('total')) {
        return;
      }

      const row = this.worksheet.getRow(rowIndex);
      row.getCell(1).value = month;
      row.getCell(2).value = done;
      row.getCell(3).value = cancel;
      row.getCell(4).value = pending;
      row.getCell(5).value = monthlyTotal;

      totalDone += done;
      totalCancel += cancel;
      totalPending += pending;
      totalEOM += monthlyTotal;

      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
      rowIndex++;
    });

    const totalRow = this.worksheet.getRow(rowIndex);
    totalRow.getCell(1).value = 'Total E.O.Y';
    totalRow.getCell(2).value = totalDone;
    totalRow.getCell(3).value = totalCancel;
    totalRow.getCell(4).value = totalPending;
    totalRow.getCell(5).value = totalEOM;

    for (let col = 1; col <= 5; col++) {
      const cell = totalRow.getCell(col);
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF4A85F' },
      };
    }

    totalRow.getCell(6).value = '';
  }

  protected processGenerate(data: DataSourceStatusAkad[]): void {
    this.setUpColumns(this.columns);

    if (!data || data.length === 0) {
      this.applyStyles();
      const date = moment(new Date()).format('YYYY-MM-DD');
      this.downloadFile('Status_Akad_Report_' + date);
      return;
    }

    this.addReportHeader();
    this.processData(data);
    this._setAutoWidthForAllColumns();
    this.downloadFile('Status_Akad_Report_' + moment(new Date()).format('YYYY-MM-DD'));
    this._resetData();
  }

  private addReportHeader(): void {
    let credit = 'Credit Legal Department (HO + OR)';
    if (this.selectedCredit === 'R1') {
      credit = 'Credit Legal Head Office (HO)';
    } else if (this.selectedCredit === 'R2') {
      credit = 'Credit Legal Out Region (OR)';
    }

    for (let i = 0; i < this.columns.length; i++) {
      this.worksheet.getCell(`${String.fromCharCode(65 + i)}1`).value = '';
    }

    this.worksheet.getCell('A2').value = credit;
    this.worksheet.getCell('A2').font = { bold: true };
    this.worksheet.getCell('A2').alignment = { horizontal: 'left' };
  }
}
