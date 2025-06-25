/* eslint-disable */
import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WeeklyReportService } from './weekly-report.service';
import { Chart, ChartDataset } from 'chart.js';
import { registerables } from 'chart.js';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { AbstractExcelMISReport } from '../../abstract-excel-report';
import { MisReportService } from '../../mis-report.service';
import { MatDatepicker } from '@angular/material/datepicker';

export const YEAR_MONTH_ONLY_FORMATS = {
  parse: { dateInput: 'YYYY/MM' },
  display: {
    dateInput: 'YYYY/MM',
    monthYearLabel: 'YYYY/MM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface WeeklyReportResponse {
  year: string;
  region: string | null;
  applicationType: string;
  jumlahPengajuan: number;
  plafondCurrency: {
    applicationId: string;
    currency: string;
    plafond: number;
  }[];
  totalIDR: number;
  totalUSD: number;
}

interface ReportData {
  jenisFasilitas: string;
  jumlahPengajuan: number;
  totalIDR: number;
  totalUSD: number;
}

@Component({
  selector: 'jhi-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MONTH_ONLY_FORMATS },
  ],
})
export class WeeklyReportComponent extends AbstractExcelMISReport implements OnInit {
  reportData: ReportData[] = [];
  weeklyData: any;
  selectedCredit: string = 'All';
  selectedYear;
  yearFormControl = new FormControl(moment());
  selectedMonth;
  dataSource: { jenisFasilitas: string; jumlahPengajuan: number; totalIDR: number; totalUSD: number }[];

  constructor(public misReportService: MisReportService, private weeklyReportService: WeeklyReportService) {
    super(misReportService);
    this.selectedYear = new Date().getFullYear().toString();
    this.selectedMonth = new Date().getMonth().toString();
  }
  displayedColumns: string[] = ['jenisFasilitas', 'jumlahPengajuan', 'totalIDR', 'totalUSD'];
  ngOnInit(): void {
    const today = moment(); // default to today
    const yearMonthKey = today.format('YYYY-MM'); // contoh: 2025-06
    const jenisFasilitasList = [
      'New',
      'Additional / Top Up',
      'Renewal',
      'Restructure',
      'Others',
      'Renewal + Additional',
      'Renewal + Decrease',
      'Decrease',
      'Renewal + Others',
      'Additional + Others',
      'Decrease + Others',
    ];
    this.weeklyReportService.getWeeklyUpdate(yearMonthKey, this.selectedCredit).subscribe((res: WeeklyReportResponse[]) => {
      if (res && res.length > 0) {
        this.weeklyData = res;
        this.reportData = this._processReportData(this.weeklyData);
        this.dataSource = jenisFasilitasList.map(jenis => {
          const match = this.weeklyData.find(item => item.applicationType === jenis);
          return {
            jenisFasilitas: jenis,
            jumlahPengajuan: match?.jumlahPengajuan || 0,
            totalIDR: match?.totalIDR || 0,
            totalUSD: match?.totalUSD || 0,
          };
        });
      }
    });
  }

  onYearSelected(normalizedYear: Moment) {
    const currentValue = this.yearFormControl.value || moment();
    currentValue.year(normalizedYear.year());
    this.yearFormControl.setValue(currentValue);
  }

  onMonthAndYearSelected(normalizedMonth: Moment, dp: any) {
    const ctrlValue = this.yearFormControl.value || moment();
    ctrlValue.month(normalizedMonth.month());

    this.yearFormControl.setValue(ctrlValue);
    dp.close();

    // Simpan bulan dan tahun yang dipilih (optional)
    this.selectedYear = ctrlValue.year().toString();
    this.selectedMonth = (ctrlValue.month() + 1).toString().padStart(2, '0'); // biar hasilnya 01–12

    const yearMonthKey = `${this.selectedYear}-${this.selectedMonth}`;
    const jenisFasilitasList = [
      'New',
      'Additional / Top Up',
      'Renewal',
      'Restructure',
      'Others',
      'Renewal + Additional',
      'Renewal + Decrease',
      'Decrease',
      'Renewal + Others',
      'Additional + Others',
      'Decrease + Others',
    ];
    // Panggil service berdasarkan bulan & tahun
    this.weeklyReportService.getWeeklyUpdate(yearMonthKey, this.selectedCredit).subscribe((res: WeeklyReportResponse[]) => {
      if (res && res.length > 0) {
        this.weeklyData = res;
        this.dataSource = jenisFasilitasList.map(jenis => {
          const match = this.weeklyData.find(item => item.applicationType === jenis);
          return {
            jenisFasilitas: jenis,
            jumlahPengajuan: match?.jumlahPengajuan || 0,
            totalIDR: match?.totalIDR || 0,
            totalUSD: match?.totalUSD || 0,
          };
        });
      }
    });
  }

  onCreditSelected(event: any): void {
    const region = event.value !== 'All' ? event.value : undefined;
    const yearMonthKey = `${this.selectedYear}-${this.selectedMonth}`;
    const jenisFasilitasList = [
      'New',
      'Additional / Top Up',
      'Renewal',
      'Restructure',
      'Others',
      'Renewal + Additional',
      'Renewal + Decrease',
      'Decrease',
      'Renewal + Others',
      'Additional + Others',
      'Decrease + Others',
    ];
    this.weeklyReportService.getWeeklyUpdate(yearMonthKey, region).subscribe((res: WeeklyReportResponse[]) => {
      if (res && res.length > 0) {
        this.weeklyData = res;
        this.dataSource = jenisFasilitasList.map(jenis => {
          const match = this.weeklyData.find(item => item.applicationType === jenis);
          return {
            jenisFasilitas: jenis,
            jumlahPengajuan: match?.jumlahPengajuan || 0,
            totalIDR: match?.totalIDR || 0,
            totalUSD: match?.totalUSD || 0,
          };
        });
      }
    });
  }

  generate(): void {
    this.processGenerate(this.dataSource);
  }

  private _processReportData(reportData: any): any {
    const jenisFasilitasList = [
      'New',
      'Additional / Top Up',
      'Renewal',
      'Restructure',
      'Others',
      'Renewal + Additional',
      'Renewal + Decrease',
      'Decrease',
      'Renewal + Others',
      'Additional + Others',
      'Decrease + Others',
    ];

    const defaultStatus = {
      jumlahPengajuan: 0,
      totalIDR: 0,
      totalUSD: 0,
    };

    const filledData = jenisFasilitasList.map(jenisFasilitasList => {
      const existing = reportData.find(d => d.jenisFasilitasList === jenisFasilitasList);
      return existing ?? { jenisFasilitasList, ...defaultStatus };
    });

    return filledData;
  }

  get columns() {
    return [
      { header: 'Jenis Fasilitas', key: 'jenisFasilitas' },
      { header: 'Jumlah Pengajuan', key: 'jumlahPengajuan' },
      { header: 'Total IDR', key: 'totalIDR' },
      { header: 'Total USD', key: 'totalUSD' },
    ];
  }

  protected processGenerate(data): void {
    this.setUpColumns(this.columns);

    if (!data || data.length === 0) {
      this.applyStyles();
      const date = moment(new Date()).format('YYYY-MM-DD');
      this.downloadFile('Weekly_Report_' + date);
      return;
    }

    this.addReportHeader();

    this.processData(data);

    this._applyStyles();
    this._setAutoWidthForAllColumns();
    this.downloadFile('Weekly_Report_' + moment(new Date()).format('YYYY-MM-DD'));
    this._resetData();
  }

  private addReportHeader(): void {
    let credit;
    const yearMonthKey = `${this.selectedYear}-${this.selectedMonth}`;
    if (this.selectedCredit === 'All') {
      credit = 'Credit Legal Department (HO + OR)';
    } else if (this.selectedCredit === 'R1') {
      credit = 'Credit Legal Head Office (HO)';
    } else if (this.selectedCredit === 'R2') {
      credit = 'Credit Legal Out Region (OR)';
    }
    this.worksheet.getCell('A1').value = 'Weekly Report';
    this.worksheet.getCell('B1').value = '';
    this.worksheet.getCell('C1').value = '';
    this.worksheet.getCell('D1').value = '';
    this.worksheet.getCell('E1').value = '';
    this.worksheet.getCell('F1').value = '';
    this.worksheet.getCell('A1').alignment = { horizontal: 'left' };
    this.worksheet.getCell('A1').font = { bold: true };
    this.worksheet.getCell('A1').border = { top: {}, left: {}, bottom: {}, right: {} };
    this.worksheet.getCell('A2').value = credit;
    this.worksheet.getCell('A2').alignment = { horizontal: 'left' };
    this.worksheet.getCell('A2').font = { bold: true };
    this.worksheet.getCell('A2').border = { top: {}, left: {}, bottom: {}, right: {} };
    this.worksheet.getCell('D2').value = yearMonthKey;
    this.worksheet.getCell('D2').alignment = { horizontal: 'left' };
    this.worksheet.getCell('D2').font = { bold: true };
    this.worksheet.getCell('D2').border = { top: {}, left: {}, bottom: {}, right: {} };
  }

  private _applyStyles(): void {
    this.columns.forEach(column => {
      const columnValue = this.worksheet.getColumn(column.key);
      const newValue = columnValue.values.map(value => {
        if (value) {
          return this._clearEmptyEntries(value.toString());
        }
        return value;
      });
      columnValue.values = newValue;
    });

    this.worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 4) {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      }
    });
  }

  protected processData(data: ReportData[]): void {
    this.worksheet.getRow(4).values = this.columns.map(col => col.header);

    const headerRow = this.worksheet.getRow(4);
    headerRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    console.log('data', data);
    let rowIndex = 5;
    data.forEach(report => {
      const row = {
        jenisFasilitas: report.jenisFasilitas,
        jumlahPengajuan: report.jumlahPengajuan,
        totalIDR: report.totalIDR,
        totalUSD: report.totalUSD,
      };
      this.worksheet.addRow(row);
      rowIndex++;
    });
  }
}
