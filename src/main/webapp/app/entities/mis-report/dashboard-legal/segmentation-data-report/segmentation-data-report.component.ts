/* eslint-disable */
import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Chart, ChartDataset } from 'chart.js';
import { SegmentationDataReportService } from './segmentation-data-report.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';
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

interface SegmentData {
  segmentName: string;
  countTotal: number;
}

@Component({
  selector: 'jhi-segmentation-data-report',
  templateUrl: './segmentation-data-report.component.html',
  styleUrls: ['./segmentation-data-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMATS },
  ],
})
export class SegmentationDataReportComponent extends AbstractExcelMISReport implements OnInit, OnChanges, AfterViewInit {
  selectedYear: string;
  selectedCredit: string = 'All';
  yearFormControl = new FormControl(moment());

  segmentData: SegmentData[] = [];
  segmentChartData: { labels: string[]; datasets: ChartDataset[] };
  rawSegmentReportData: any[] = [];

  @ViewChild('segmentChart') segmentChart!: ElementRef;
  segmentChartInstance: Chart | undefined;

  constructor(public misReportService: MisReportService, private segmentationDataReportService: SegmentationDataReportService) {
    super(misReportService);
  }

  ngOnInit(): void {
    this.selectedYear = new Date().getFullYear().toString();
    this.loadChartData(this.selectedYear, this.selectedCredit);
  }

  ngOnChanges(): void {
    this.prepareSegmentChartData();
    this.initializeSegmentChart();
  }

  ngAfterViewInit(): void {
    this.initializeSegmentChart();
  }

  onYearSelected(normalizedYear: Moment, dp: any): void {
    const ctrlValue = this.yearFormControl.value;
    ctrlValue.year(normalizedYear.year());
    this.yearFormControl.setValue(ctrlValue);
    dp.close();

    this.selectedYear = this.yearFormControl.value.year().toString();
    this.loadChartData(this.selectedYear, this.selectedCredit);
  }

  loadChartData(year: string, credit: string): void {
    this.segmentationDataReportService.getSegmentReport(year, credit).subscribe((res: any[]) => {
      this.rawSegmentReportData = res;

      const segments = res[0]?.segment || [];
      this.segmentData = segments.map((seg: any) => ({
        segmentName: seg.segmentName,
        countTotal: seg.countTotal,
      }));

      this.prepareSegmentChartData();
      this.initializeSegmentChart();
    });
  }

  private prepareSegmentChartData(): void {
    this.segmentChartData = {
      labels: this.segmentData.map(s => s.segmentName),
      datasets: [
        {
          label: 'Total',
          data: this.segmentData.map(s => s.countTotal),
          backgroundColor: '#3C957C',
          hoverBackgroundColor: this.segmentData.map(() => this.darkenHexColor('#3C957C', 15)),
          borderRadius: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
        },
      ],
    };
  }

  private initializeSegmentChart(): void {
    if (!this.segmentChart) return;

    const ctx = this.segmentChart.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.segmentChartInstance) {
      this.segmentChartInstance.destroy();
    }

    this.segmentChartInstance = new Chart(ctx, {
      type: 'bar',
      data: this.segmentChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.selectedYear,
            font: { size: 16 },
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context: any) => `Total: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            ticks: { font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#E0E0E0' },
            ticks: {
              precision: 0,
              stepSize: 1,
              font: { size: 11 },
            },
          },
        },
      },
    });
  }

  private darkenHexColor(hex: string, percent: number): string {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;

    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  generate(): void {
    this.processGenerate(this.rawSegmentReportData);
  }

  onCreditSelected(event: any): void {
    const selected = event.value;
    this.selectedCredit = selected;
    const region = selected !== 'All' ? selected : 'All';
    this.loadChartData(this.selectedYear, region);
  }

  get columns() {
    return [
      { header: 'Month / Task', key: 'month' },
      { header: 'SMALL MEDIUM ENTERPRISE', key: 'smallMediumEnterprise' },
      { header: 'CORPORATE BANKING', key: 'corporateBanking' },
      { header: 'COMMERCIAL BANKING', key: 'commercialBanking' },
      { header: 'ENTERPRISE BANKING', key: 'enterpriseBanking' },
      { header: 'GLOBAL BUSINESS', key: 'globalBusiness' },
      { header: 'TOTAL E.O.M', key: 'totalEOM' },
    ];
  }

  protected addReportHeader(): void {
    const titleRow = this.worksheet.getRow(1);
    titleRow.getCell(1).value = 'SEGMENTATION DATA REPORT';
    titleRow.getCell(1).font = { bold: true };
    titleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

    const subtitleRow = this.worksheet.getRow(2);

    let creditLabel = '';
    if (this.selectedCredit === 'All') {
      creditLabel = 'Credit Legal Department (HO + OR)';
    } else if (this.selectedCredit === 'R1') {
      creditLabel = 'Credit Legal Head Office (HO)';
    } else if (this.selectedCredit === 'R2') {
      creditLabel = 'Credit Legal Out Region (OR)';
    } else {
      creditLabel = 'Credit Legal Department';
    }

    subtitleRow.getCell(1).value = creditLabel;
    subtitleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    subtitleRow.getCell(1).font = { bold: true };

    const yearRow = this.worksheet.getRow(3);
    yearRow.getCell(7).value = this.selectedYear;
    yearRow.getCell(7).font = { bold: true };
    yearRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' };

    subtitleRow.commit();
    yearRow.commit();

    this.worksheet.getColumn(7).width = 20;
    yearRow.height = 20;
  }

  private _applyStyles(): void {
    this.columns.forEach(column => {
      const columnValue = this.worksheet.getColumn(column.key);
      columnValue.values = columnValue.values.map(value => {
        if (value) return this._clearEmptyEntries(value.toString());
        return value;
      });
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

  protected processGenerate(data: SegmentData[]): void {
    this.setUpColumns(this.columns);
    this.addReportHeader();

    if (!data || data.length === 0) {
      this.applyStyles();
      const date = moment(new Date()).format('YYYY-MM-DD');
      this.downloadFile('Yearly_Report_' + date);
      return;
    }

    this.processData(data);

    this._applyStyles();
    this._setAutoWidthForAllColumns();
    this.downloadFile('SEGMENTATION_Report_' + moment(new Date()).format('YYYY-MM-DD'));
    this._resetData();
  }

  protected processData(data: any[]): void {
    const monthOrder = [
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

    const segments = ['SMALL MEDIUM ENTERPRISE', 'CORPORATE BANKING', 'COMMERCIAL BANKING', 'ENTERPRISE BANKING', 'GLOBAL BUSINESS'];

    for (let col = 2; col <= 7; col++) {
      this.worksheet.getCell(1, col).value = '';
      this.worksheet.getCell(2, col).value = '';
    }

    const monthMap = new Map<string, { [key: string]: number }>();
    monthOrder.forEach(month => {
      const init: any = {};
      segments.forEach(seg => (init[seg] = 0));
      monthMap.set(month, init);
    });

    const segmentList = data[0]?.segment || [];
    for (const segment of segmentList) {
      const segName = segment.segmentName?.toUpperCase();
      const summaryList = segment.summaryDTOList || [];

      for (const summary of summaryList) {
        const month = summary.month;
        const count = summary.count || 0;
        if (monthMap.has(month) && segments.includes(segName)) {
          monthMap.get(month)![segName] += count;
        }
      }
    }

    this.worksheet.getRow(4).values = ['', ...segments, 'TOTAL E.O.M'];
    const headerRow = this.worksheet.getRow(4);

    headerRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };

      if (colNumber === segments.length + 2) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC000' },
        };
      }
    });

    let rowIndex = 5;
    const totalPerSegment: { [key: string]: number } = {};
    segments.forEach(seg => (totalPerSegment[seg] = 0));

    monthOrder.forEach(month => {
      const rowData = monthMap.get(month)!;
      const totalEOM = segments.reduce((sum, seg) => sum + (rowData[seg] || 0), 0);
      const rowValues = [month, ...segments.map(seg => rowData[seg]), totalEOM];
      this.worksheet.insertRow(rowIndex++, rowValues);
      segments.forEach(seg => {
        totalPerSegment[seg] += rowData[seg];
      });
    });

    const totalAll = Object.values(totalPerSegment).reduce((sum, val) => sum + val, 0);
    const totalRowValues = ['TOTAL E.O.Y', ...segments.map(seg => totalPerSegment[seg]), totalAll];
    const totalRow = this.worksheet.insertRow(rowIndex, totalRowValues);
    totalRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const startRow = 5;
    const endRow = rowIndex;

    const totalEOMCol = segments.length + 2;
    for (let r = startRow; r <= endRow; r++) {
      const cell = this.worksheet.getRow(r).getCell(totalEOMCol);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' },
      };
    }
  }
}
