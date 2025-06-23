/* eslint-disable */
import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { YearlyReportService } from './yearly-report.service';
import { Chart, ChartDataset } from 'chart.js';
import { registerables } from 'chart.js';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';
import { FormControl } from '@angular/forms';

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

interface ChartYearlyData {
  totalCancel: number;
  totalDone: number;
  totalIncoming: number;
  totalOnProcess: number;
  totalPending: number;
}

interface YearlyReportResponse {
  year: string;
  region: string | null;
  summaryMonthly: {
    month: string;
    incoming: number;
    onProcess: number;
    pending: number;
    done: number;
    cancel: number;
  }[];
  countYearly: ChartYearlyData;
}

interface ChartBorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

@Component({
  selector: 'jhi-yearly-report',
  templateUrl: './yearly-report.component.html',
  styleUrls: ['./yearly-report.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_ONLY_FORMATS },
  ],
})
export class YearlyReportComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  private readonly colorPalette = ['#3C957C', '#3C957C', '#3C957C', '#3C957C', '#3C957C'];
  private originalData: number[] = [];
  private readonly defaultBorderRadius: ChartBorderRadius = {
    topLeft: 10,
    topRight: 10,
    bottomLeft: 0,
    bottomRight: 0,
  };
  chartData: { labels: string[]; datasets: ChartDataset[] };
  chart: Chart | undefined;
  yearlyData: ChartYearlyData = {
    totalCancel: 0,
    totalDone: 0,
    totalIncoming: 0,
    totalOnProcess: 0,
    totalPending: 0,
  };
  selectedCredit: string = 'All';
  selectedYear;
  yearFormControl = new FormControl(moment());

  @ViewChild('creditChart') creditChart!: ElementRef;

  constructor(private yearlyReportService: YearlyReportService) {
    this.selectedYear = new Date().getFullYear().toString();
  }

  ngOnInit(): void {
    this.yearlyReportService.getYearlyReport(this.selectedYear, this.selectedCredit).subscribe((res: YearlyReportResponse[]) => {
      if (res && res.length > 0 && res[0].countYearly) {
        this.yearlyData = res[0].countYearly;
      } else {
        this.yearlyData = {
          totalCancel: 0,
          totalDone: 0,
          totalIncoming: 0,
          totalOnProcess: 0,
          totalPending: 0,
        };
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
    this.yearlyReportService.getYearlyReport(this.selectedYear, this.selectedCredit).subscribe((res: YearlyReportResponse[]) => {
      if (res && res.length > 0 && res[0].countYearly) {
        this.yearlyData = res[0].countYearly;
      } else {
        this.yearlyData = {
          totalCancel: 0,
          totalDone: 0,
          totalIncoming: 0,
          totalOnProcess: 0,
          totalPending: 0,
        };
      }
      this.prepareChartData();
      this.initializeChart();
    });
  }

  onCreditSelected(event: any): void {
    console.log('Credit selected:', event.value);
    const region = event.value !== 'All' ? event.value : undefined;
    this.yearlyReportService.getYearlyReport(this.selectedYear, region).subscribe((res: YearlyReportResponse[]) => {
      if (res && res.length > 0 && res[0].countYearly) {
        this.yearlyData = res[0].countYearly;
      } else {
        this.yearlyData = {
          totalCancel: 0,
          totalDone: 0,
          totalIncoming: 0,
          totalOnProcess: 0,
          totalPending: 0,
        };
      }
      this.prepareChartData();
      this.initializeChart();
    });
  }

  generate(): void {
    console.log('Generate', {
      selectedCredit: this.selectedCredit,
      selectedYear: this.selectedYear,
    });
  }

  private prepareChartData() {
    this.chartData = {
      labels: ['Incoming', 'Done', 'On Process', 'Pending', 'Cancel'],
      datasets: [
        {
          label: '',
          data: [
            this.yearlyData.totalIncoming,
            this.yearlyData.totalDone,
            this.yearlyData.totalOnProcess,
            this.yearlyData.totalPending,
            this.yearlyData.totalCancel,
          ],
          backgroundColor: [this.colorPalette[0], this.colorPalette[1], this.colorPalette[2], this.colorPalette[3], this.colorPalette[4]],
          hoverBackgroundColor: [
            this.darkenHexColor(this.colorPalette[0], 15),
            this.darkenHexColor(this.colorPalette[1], 15),
            this.darkenHexColor(this.colorPalette[2], 15),
            this.darkenHexColor(this.colorPalette[3], 15),
            this.darkenHexColor(this.colorPalette[4], 15),
          ],
          borderRadius: this.defaultBorderRadius,
          borderSkipped: false,
        },
      ],
    };

    console.log('Yearly Data', this.yearlyData);
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

    this.originalData = [
      this.yearlyData.totalIncoming,
      this.yearlyData.totalDone,
      this.yearlyData.totalOnProcess,
      this.yearlyData.totalPending,
      this.yearlyData.totalCancel,
    ];

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
}
