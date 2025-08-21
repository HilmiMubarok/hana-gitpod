/* eslint-disable */
import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DpdlDataService } from './dpdl-data.service';
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

Chart.register(...registerables);

interface YearlyReportResponse {
  year: string;
  region: string | null;
  summaryMonthly: {
    month: string;
    count: number;
  }[];
  countDPDLData: number;
}

interface ChartBorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

interface ReportData {
  month: string;
  count: number;
}

@Component({
  selector: 'jhi-dpdl-data',
  templateUrl: './dpdl-data.component.html',
  styleUrls: ['./dpdl-data.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMATS },
  ],
})
export class DpdlDataComponent extends AbstractExcelMISReport implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  private readonly colorPalette = '#3C957C';
  private originalData: number[] = [];
  private readonly defaultBorderRadius: ChartBorderRadius = {
    topLeft: 10,
    topRight: 10,
    bottomLeft: 0,
    bottomRight: 0,
  };
  chartData: { labels: string[]; datasets: ChartDataset[] };
  reportData: ReportData[] = [];
  chart: Chart | undefined;
  yearlyData: any;
  selectedCredit: string = 'All';
  selectedYear;
  yearFormControl = new FormControl(moment());
  data: any;
  @ViewChild('creditChart') creditChart!: ElementRef;

  constructor(public misReportService: MisReportService, private dpdlDataService: DpdlDataService) {
    super(misReportService);
    this.selectedYear = new Date().getFullYear().toString();
  }

  ngOnInit(): void {
    this.dpdlDataService.getYearlyReport(this.selectedYear, this.selectedCredit).subscribe((res: YearlyReportResponse[]) => {
      if (res && res.length > 0) {
        this.yearlyData = res[0].summaryMonthly;
        this.data = res[0].countDPDLData;
        this.reportData = this._processReportData(res[0].summaryMonthly);
      }
      this.prepareChartData();
      this.initializeChart();
    });
  }

  ngOnChanges(): void {
    this.prepareChartData();
    this.initializeChart();
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  onYearSelected(normalizedYear: Moment, dp: any) {
    const ctrlValue = this.yearFormControl.value;
    ctrlValue.year(normalizedYear.year());
    this.yearFormControl.setValue(ctrlValue);
    dp.close();
    this.selectedYear = this.yearFormControl.value.year().toString();
    this.dpdlDataService.getYearlyReport(this.selectedYear, this.selectedCredit).subscribe((res: YearlyReportResponse[]) => {
      if (res && res.length > 0 && res[0].summaryMonthly) {
        this.yearlyData = res[0].summaryMonthly;
        this.data = res[0].countDPDLData;
      }
      this.prepareChartData();
      this.initializeChart();
    });
  }

  onCreditSelected(event: any): void {
    const region = event.value !== 'All' ? event.value : undefined;
    this.dpdlDataService.getYearlyReport(this.selectedYear, region).subscribe((res: YearlyReportResponse[]) => {
      if (res && res.length > 0) {
        this.yearlyData = res[0].summaryMonthly;
        this.data = res[0].countDPDLData;
      }
      this.prepareChartData();
      this.initializeChart();
    });
  }

  private prepareChartData() {
    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember'],
      datasets: [
        {
          label: '',
          data: [
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'January')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'February')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'March')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'April')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'May')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'June')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'July')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'August')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'September')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'October')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'November')?.count || 0,
            this.yearlyData.find(dataDpdl => dataDpdl.month === 'Desember')?.count || 0,
          ],
          backgroundColor: [this.colorPalette, this.colorPalette, this.colorPalette, this.colorPalette, this.colorPalette],
          hoverBackgroundColor: [
            this.darkenHexColor(this.colorPalette, 15),
            this.darkenHexColor(this.colorPalette, 15),
            this.darkenHexColor(this.colorPalette, 15),
            this.darkenHexColor(this.colorPalette, 15),
            this.darkenHexColor(this.colorPalette, 15),
          ],
          borderRadius: this.defaultBorderRadius,
          borderSkipped: false,
        },
      ],
    };
  }

  private initializeChart() {
    if (!this.creditChart) {
      return;
    }
    const ctx = this.creditChart.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }

    this.originalData = [this.yearlyData.count];

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.selectedYear,
            font: {
              size: 16,
            },
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (context: any) => {
                return context[0].label;
              },
              label: (context: any) => {
                const value = context.raw || 0;
                return `Value: ${value}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: false,
            ticks: {
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            stacked: false,
            grid: {
              color: '#E0E0E0',
            },
            ticks: {
              precision: 0,
              stepSize: 1,
              font: {
                size: 11,
              },
            },
          },
        },
      },
    });
  }

  private darkenHexColor(hex: string, percent = 15): string {
    const amt = Math.round(2.55 * percent);
    return '#' + hex.replace(/^#/, '').replace(/../g, color => ('0' + Math.max(0, parseInt(color, 16) - amt).toString(16)).slice(-2));
  }

  generate(): void {
    this.processGenerate(this.reportData);
  }

  private _processReportData(reportData: ReportData[]): ReportData[] {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const count = {
      count: 0,
    };

    const filledData = months.map(month => {
      const existing = reportData.find(d => d.month === month);
      return existing ?? { month, ...count };
    });

    return filledData;
  }

  get columns() {
    return [
      { header: 'Month', key: 'month' },
      { header: 'Count', key: 'count' },
    ];
  }

  protected processGenerate(data: ReportData[]): void {
    this.setUpColumns(this.columns);

    if (!data || data.length === 0) {
      this.applyStyles();
      const date = moment(new Date()).format('YYYY-MM-DD');
      this.downloadFile('DPDL_Data_' + date);
      return;
    }

    this.addReportHeader();

    this.processData(data);

    this._applyStyles();
    this._setAutoWidthForAllColumns();
    this.downloadFile('DPDL_Data_' + moment(new Date()).format('YYYY-MM-DD'));
    this._resetData();
  }

  private addReportHeader(): void {
    let credit;
    if (this.selectedCredit === 'All') {
      credit = 'Credit Legal Department (HO + OR)';
    } else if (this.selectedCredit === 'R1') {
      credit = 'Credit Legal Head Office (HO)';
    } else if (this.selectedCredit === 'R2') {
      credit = 'Credit Legal Out Region (OR)';
    }
    this.worksheet.getCell('A1').value = 'DPDL Data';
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
    this.worksheet.getCell('F2').value = this.selectedYear;
    this.worksheet.getCell('F2').alignment = { horizontal: 'left' };
    this.worksheet.getCell('F2').font = { bold: true };
    this.worksheet.getCell('F2').border = { top: {}, left: {}, bottom: {}, right: {} };
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

    let rowIndex = 5;
    data.forEach(report => {
      const row = {
        month: report.month,
        count: report.count,
      };
      this.worksheet.addRow(row);
      rowIndex++;
    });

    const totalRow = {
      month: 'TOTAL E.O.Y',
      count: this.data,
    };

    const excelTotalRow = this.worksheet.addRow(totalRow);

    excelTotalRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
    });
  }
}
