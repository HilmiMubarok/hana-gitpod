import { MisReportService } from '../../mis-report.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment, { Moment } from 'moment';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MessageService } from 'primeng/api';
import _ from 'lodash';
import { StatusCreditReportService } from './status-credit-report.service';

interface DataSourceStatusCredit {
  month: string;
  new: number;
  renewal: number;
  additional: number;
  decrease: number;
  restructur: number;
  bindingHT: number;
  addendum: number;
  perpanjanganHak: number;
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
  selector: 'jhi-status-credit-report',
  templateUrl: './status-credit-report.component.html',
  styleUrls: ['./status-credit-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMATS },
  ],
})
export class StatusCreditComponent extends AbstractExcelMISReport implements OnInit {
  constructor(
    private misReportService: MisReportService,
    private messageService: MessageService,
    private statusCreditService: StatusCreditReportService
  ) {
    super(misReportService);
    this.selectedYear = new Date().getFullYear().toString();
  }

  selectedCredit = 'All';

  selectedYear;
  dataSource: DataSourceStatusCredit[] = [];
  yearFormControl = new FormControl(moment());

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const regionParam = this.selectedCredit === 'All' ? undefined : this.selectedCredit;

    this.statusCreditService.getStatusCredit(this.selectedYear, regionParam).subscribe({
      next: res => {
        const summary = res[0]; // ambil data tahun & region
        const monthsData = summary.months || [];

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
          const monthData = monthsData.find(m => m.month.toUpperCase() === month);

          const categories = monthData?.categories || {};

          data.push({
            month: month.charAt(0) + month.slice(1).toLowerCase(), // Capitalize
            new: categories['New'] || 0,
            renewal: categories['Renewal'] || 0,
            additional: categories['Additional / Top Up'] || 0,
            decrease: categories['Decrease'] || 0,
            restructur: categories['Restructur'] || 0,
            bindingHT: categories['BINDING HT'] || 0,
            addendum: categories['ADDENDUM'] || 0,
            perpanjanganHak: categories['PERPANJANGAN HAK'] || 0,
            totalEOM: monthData?.totalEOM || 0,
          });
        });

        this.dataSource = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get Status Credit Data',
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

  get columns(): string[] {
    return ['month', 'new', 'renewal', 'additional', 'decrease', 'restructur', 'bindingHT', 'addendum', 'perpanjanganHak', 'totalEOM'];
  }

  protected processData(data: DataSourceStatusCredit[]): void {
    const selectedYear = this.selectedYear || new Date().getFullYear();

    const titleRow = this.worksheet.getRow(1);
    titleRow.getCell(1).value = 'STATUS CREDIT REPORT';
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
    const columns = [
      'MONTH',
      'NEW',
      'RENEWAL',
      'ADDITIONAL / TOP UP',
      'DECREASE',
      'RESTRUCTUR',
      'BINDING HT',
      'ADDENDUM',
      'PERPANJANGAN HAK',
      'TOTAL E.O.M',
    ];
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

    const total = {
      new: 0,
      renewal: 0,
      additional: 0,
      decrease: 0,
      restructur: 0,
      bindingHT: 0,
      addendum: 0,
      perpanjanganHak: 0,
      totalEOM: 0,
    };

    data.forEach((item: any) => {
      const {
        month,
        new: n = 0,
        renewal = 0,
        additional = 0,
        decrease = 0,
        restructur = 0,
        bindingHT = 0,
        addendum = 0,
        perpanjanganHak = 0,
        totalEOM: monthlyTotal = 0,
      } = item;

      if (month.toLowerCase().includes('total')) {
        return;
      }

      const row = this.worksheet.getRow(rowIndex);
      row.values = [month, n, renewal, additional, decrease, restructur, bindingHT, addendum, perpanjanganHak, monthlyTotal];

      total.new += n;
      total.renewal += renewal;
      total.additional += additional;
      total.decrease += decrease;
      total.restructur += restructur;
      total.bindingHT += bindingHT;
      total.addendum += addendum;
      total.perpanjanganHak += perpanjanganHak;
      total.totalEOM += monthlyTotal;

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
    totalRow.values = [
      'TOTAL E.O.Y',
      total.new,
      total.renewal,
      total.additional,
      total.decrease,
      total.restructur,
      total.bindingHT,
      total.addendum,
      total.perpanjanganHak,
      total.totalEOM,
    ];

    totalRow.eachCell(cell => {
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
    });
  }

  protected processGenerate(data: DataSourceStatusCredit[]): void {
    this.setUpColumns(this.columns);

    if (!data || data.length === 0) {
      this.applyStyles();
      const date = moment(new Date()).format('YYYY-MM-DD');
      this.downloadFile('Status_Credit_Report_' + date);
      return;
    }

    this.addReportHeader();
    this.processData(data);
    this._setAutoWidthForAllColumns();
    this.downloadFile('Status_Credit_Report_' + moment(new Date()).format('YYYY-MM-DD'));
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
