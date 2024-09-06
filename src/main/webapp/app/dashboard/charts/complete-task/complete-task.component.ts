import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IDueDate } from './complete-task.model';

@Component({
  selector: 'jhi-complete-task',
  templateUrl: './complete-task.component.html',
  styleUrls: ['./complete-task.style.css'],
})
export class CompleteTaskComponent implements OnInit, OnChanges {
  public _dataSource: IDueDate[];
  public _interval: string;
  public noOverdue: number[] = [];
  public overdueLessThan: number[] = [];
  public overdueBetween: number[] = [];
  public moreThan: number[] = [];
  public labelList: string[] = [];
  public _dataset: any[] = [];
  public _startDateThruDates: any;

  @Input()
  get dataSource() {
    return this._dataSource;
  }

  set dataSource(param: any[]) {
    this._dataSource = param;
  }

  @Input()
  get interval() {
    return this._interval;
  }

  set interval(param: string) {
    this._interval = param;
  }

  @Input()
  get startDateThruDates() {
    return this._startDateThruDates;
  }

  set startDateThruDates(param: any) {
    this._startDateThruDates = param;
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'];
  public barChartType: ChartType;
  public barChartPlugins = [];
  public barChartData: ChartData<'bar'>;

  constructor() {}
  ngOnInit(): void {
    this.prepData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.noOverdue = [];
      this.overdueLessThan = [];
      this.overdueBetween = [];
      this.moreThan = [];

      this._dataset = [];
      this.prepData();
    }
  }

  public prepData(): void {
    if (this.dataSource.length > 0) {
      this.dataSource.forEach(obj => {
        this._dataset.push({
          data: [obj.total],
          label: obj.statusDescription,
        });
      });
      this.assignLable();
      this.initBarChart();
    }
  }

  public assignLable(): void {
    switch (this.interval) {
      case 'WEEKLY':
        this.weeklyLable();
        break;
      case 'MONTHLY':
        this.monthlyLable();
        break;
      default:
        this.dailyLable();
        break;
    }
  }

  public dailyLable(): void {
    const start: Date = new Date(this.startDateThruDates.startDate);
    const thru: Date = new Date(this.startDateThruDates.thruDate);

    this.labelList = [
      start.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
        ' - ' +
        thru.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    ];
  }

  public weeklyLable(): void {
    const start: Date = new Date(this.startDateThruDates.startDate);
    const thru: Date = new Date(this.startDateThruDates.thruDate);

    this.labelList = [
      start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) +
        ' - ' +
        thru.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    ];
  }

  public monthlyLable(): void {
    const start: Date = new Date(this.startDateThruDates.startDate);
    const thru: Date = new Date(this.startDateThruDates.thruDate);

    this.labelList = [start.toLocaleDateString('en-US', { month: 'long' }) + ' - ' + thru.toLocaleDateString('en-US', { month: 'long' })];
  }

  public initBarChart(): void {
    this.barChartType = 'bar';
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,

      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {
          min: 0,
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
      interaction: {
        mode: 'point',
      },
    };

    this.barChartData = {
      labels: this.labelList,
      datasets: this._dataset,
    };
    this.chart?.update();
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    // console.log(event, active);
  }
}
