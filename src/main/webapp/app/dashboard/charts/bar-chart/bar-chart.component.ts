import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IDueDate, IInterval } from 'app/dashboard/dashboard.model';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'jhi-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.style.css'],
})
export class BarChartComponent implements OnInit, OnChanges {
  public _dataSource: IDueDate[];
  public _interval: string;
  public _startDate: Date;
  public noOverdue: number[] = [];
  public overdueLessThan: number[] = [];
  public overdueBetween: number[] = [];
  public moreThan: number[] = [];
  public labelList: string[] = [];

  @Input()
  get dataSource() {
    return this._dataSource;
  }

  set dataSource(param: IDueDate[]) {
    this._dataSource = param;
  }

  @Input()
  get startDate() {
    return this._startDate;
  }

  set startDate(param: Date) {
    this._startDate = param;
  }

  @Input()
  get interval() {
    return this._interval;
  }

  set interval(param: string) {
    this._interval = param;
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
      this.prepData();
    }
  }

  public prepData(): void {
    if (this.dataSource.length > 0) {
      this.dataSource.forEach(obj => {
        this.noOverdue.push(obj.noOverdue);
        this.overdueLessThan.push(obj.overDueLessThan);
        this.overdueBetween.push(obj.overDueBetween);
        this.moreThan.push(obj.moreThan);
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
    const currentDate = new Date(this.dataSource[0].showcase[0].fromDate).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    this.labelList = [currentDate];
  }

  public weeklyLable(): void {
    const weeks: any[] = [];
    this.dataSource[0].showcase.forEach(obj => {
      weeks.push(new Date(obj.fromDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));
    });

    this.labelList = [...weeks];

    // const currentDate = new Date(this.startDate);
    // const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // weeks.push(new Date(currentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));

    // while (currentDate < endOfMonth) {
    //   currentDate.setDate(currentDate.getDate() + 7);
    //   if (currentDate <= endOfMonth) {
    //     weeks.push(new Date(currentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));
    //     this.labelList = [...weeks];
    //     this.labelList.pop();
    //   }
    // }
  }

  public monthlyLable(): void {
    const month: any[] = [];
    this.dataSource[0].showcase.forEach(obj => {
      month.push(new Date(obj.fromDate).toLocaleDateString('en-US', { month: 'long' }));
    });

    this.labelList = [...month];

    // const month: any[] = [];
    // const currentDate = new Date(this.startDate);
    // const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // month.push(new Date(currentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));
    // while (currentDate < endOfMonth) {
    //   currentDate.setDate(currentDate.getDate());
    //   if (currentDate <= endOfMonth) {
    //     month.push(new Date(currentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }));
    //     this.labelList = [...month];
    //   }
    // }
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
          min: 10,
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
      datasets: [
        {
          data: this.noOverdue,
          label: 'No Overdue',
          backgroundColor: ['#ff638494'],
          hoverBackgroundColor: ['#ff638494'],
          hoverBorderColor: ['#ff638494'],
        },
        {
          data: this.overdueLessThan,
          label: 'Overdue Less Than',
          backgroundColor: ['#4aacee8c'],
          hoverBackgroundColor: ['#4aacee8c'],
          hoverBorderColor: ['#4aacee8c'],
        },
        {
          data: this.overdueBetween,
          label: 'Overdue Between',
          backgroundColor: [' #ffd4aa96'],
          hoverBackgroundColor: [' #ffd4aa96'],
          hoverBorderColor: [' #ffd4aa96'],
        },
        {
          data: this.moreThan,
          label: 'More Than',
          backgroundColor: [' #b0dcc9'],
          hoverBackgroundColor: [' #b0dcc9'],
          hoverBorderColor: [' #b0dcc9'],
        },
      ],
    };
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    // console.log(event, active);
  }
  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40,
    ];

    this.chart?.update();
  }
}
