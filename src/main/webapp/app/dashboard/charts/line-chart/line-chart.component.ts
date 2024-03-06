import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'jhi-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.style.css'],
})
export class LineChartComponent implements OnInit, OnChanges {
  private newLabel? = 'New label';
  public lineChartData: ChartConfiguration['data'];
  public lineChartOptions: ChartConfiguration['options'];
  public lineChartType: ChartType;

  public _baseLineChartData: any;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input()
  get baseLineChartData() {
    return this._baseLineChartData;
  }

  set baseLineChartData(param: any) {
    this._baseLineChartData = param;
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['baseLineChartData']) {
      if (this.baseLineChartData.length > 0) {
        this.fitDataToModel();
      }
    }
  }

  ngOnInit(): void {
    if (this.baseLineChartData) {
      this.initLineChart();
    }
  }

  public fitDataToModel(): void {
    const data = [];
    const labels = [];
    this.baseLineChartData.forEach(item => {
      data.push(item.data);
      labels.push(
        new Date(item.date).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
        })
      );
    });

    this.lineChartData = {
      datasets: [
        {
          data,
          label: 'Series A',
          backgroundColor: '#003c7c96',
          borderColor: '#003c7c',
          pointBackgroundColor: '#003c7c96',
          pointBorderColor: '#003c7c96',
        },
      ],
      labels,
    };

    this.chart?.update();
  }

  public initLineChart(): void {
    const data = [];
    const labels = [];
    this.baseLineChartData.forEach(item => {
      data.push(item.data);
      labels.push(
        new Date(item.date).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
        })
      );
    });

    this.lineChartData = {
      datasets: [
        {
          data,
          label: 'Series A',
          backgroundColor: '#003c7c96',
          borderColor: '#003c7c',
          pointBackgroundColor: '#003c7c96',
          pointBorderColor: '#003c7c96',
          // pointBorderWidth: 2,
          // pointRadius: 6,
          // pointHoverBackgroundColor: '#fff',
          // pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        },
        {
          data: [65, 59, 80, 78, 56, 55, 40],
          label: 'Series B',
          backgroundColor: '#2981d782',
          borderColor: '#2981d7',
          pointBackgroundColor: '#2981d782',
          pointBorderColor: '#2981d782',
          // pointBorderWidth: 2,
          // pointRadius: 6,
          // pointHoverBackgroundColor: '#fff',
          // pointHoverBorderColor: 'rgba(77,83,96,1)',
        },
        // {
        //   data: [40, 33, 86, 65, 90, 59, 80],
        //   label: 'Series C',
        //   yAxisID: 'y1',
        //   backgroundColor: '#93d9d982',
        //   borderColor: '#93d9d9',
        //   pointBackgroundColor: '#93d9d982',
        //   pointBorderColor: '#93d9d982',
        //   // pointBorderWidth: 2,
        //   // pointRadius: 6,
        //   // pointHoverBackgroundColor: '#fff',
        //   // pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        // },
      ],
      labels,
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          tension: 0.3,
          fill: true,
        },
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        y: {
          position: 'left',
        },
        y1: {
          position: 'right',
          grid: {
            // color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            // color: 'red',
          },
        },
      },

      plugins: {
        legend: { display: true },
      },
    };
    this.lineChartType = 'line';
  }
  private static generateNumber(i: number): number {
    return Math.floor(Math.random() * (i < 2 ? 100 : 1000) + 1);
  }

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.datasets.length; i++) {
      for (let j = 0; j < this.lineChartData.datasets[i].data.length; j++) {
        this.lineChartData.datasets[i].data[j] = LineChartComponent.generateNumber(i);
      }
    }
    this.chart?.update();
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    // console.log(event, active);
  }

  public hideOne(): void {
    const isHidden = this.chart?.isDatasetHidden(1);
    this.chart?.hideDataset(1, !isHidden);
  }

  public pushOne(): void {
    this.lineChartData.datasets.forEach((x, i) => {
      const num = LineChartComponent.generateNumber(i);
      x.data.push(num);
    });
    this.lineChartData?.labels?.push(`Label ${this.lineChartData.labels.length}`);

    this.chart?.update();
  }

  public changeColor(): void {
    this.lineChartData.datasets[2].borderColor = 'green';
    this.lineChartData.datasets[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;

    this.chart?.update();
  }

  public changeLabel(): void {
    const tmp = this.newLabel;
    this.newLabel = this.lineChartData.datasets[2].label;
    this.lineChartData.datasets[2].label = tmp;

    this.chart?.update();
  }
}
