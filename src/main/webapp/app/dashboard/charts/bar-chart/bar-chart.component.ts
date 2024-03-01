import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IDueDate } from 'app/dashboard/dashboard.model';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'jhi-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.style.css'],
})
export class BarChartComponent implements OnInit, OnChanges {
  public _dataSource: IDueDate[];
  public noOverdue: number[] = [];
  public overdueLessThan: number[] = [];
  public overdueBetween: number[] = [];
  public moreThan: number[] = [];

  @Input()
  get dataSource() {
    return this._dataSource;
  }

  set dataSource(param: IDueDate[]) {
    this._dataSource = param;
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
      this.initBarChart();
    }
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
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
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
