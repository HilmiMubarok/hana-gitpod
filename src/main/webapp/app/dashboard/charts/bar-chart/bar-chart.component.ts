import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'jhi-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.style.css'],
})
export class BarChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'];
  public barChartType: ChartType;
  public barChartPlugins = [];
  public barChartData: ChartData<'bar'>;

  constructor() {}
  ngOnInit(): void {
    this.initBarChart();
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
      labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
      datasets: [
        {
          data: [65, 59, 80, 81, 56, 55, 40],
          label: 'Series A',
          backgroundColor: ['#ff638494'],
          hoverBackgroundColor: ['#ff638494'],
          hoverBorderColor: ['#ff638494'],
        },
        {
          data: [28, 48, 40, 19, 86, 27, 90],
          label: 'Series B',
          backgroundColor: ['#4aacee8c'],
          hoverBackgroundColor: ['#4aacee8c'],
          hoverBorderColor: ['#4aacee8c'],
        },
        {
          data: [65, 59, 80, 28, 48, 40, 40],
          label: 'Series C',
          backgroundColor: [' #ffd4aa96'],
          hoverBackgroundColor: [' #ffd4aa96'],
          hoverBorderColor: [' #ffd4aa96'],
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
