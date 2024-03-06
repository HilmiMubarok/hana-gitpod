import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IProgress } from './line-chart.model';

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
  public _interval: string;

  public initData: any[] = [];
  public data: number[] = [];
  public labels: string[] = [];
  public description: string[] = [];
  public labelFormat: any;

  public _dataSource: IProgress[];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input()
  get dataSource() {
    return this._dataSource;
  }

  set dataSource(param: IProgress[]) {
    this._dataSource = param;
  }

  @Input()
  get interval() {
    return this._interval;
  }

  set interval(param: string) {
    this._interval = param;
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      if (this.dataSource.length > 0) {
        this.fitDataToModel();
      }
    }
  }

  ngOnInit(): void {
    this.fitDataToModel();
  }

  public fitDataToModel(): void {
    this.assingLabel();
    if (this.dataSource) {
      const _initData = [];
      const _labels = [];
      console.log('this.dataSource', this.dataSource);
      this.dataSource.forEach(obj => {
        _initData.push({
          data: [obj.total],
          label: obj.description,
          backgroundColor: '#003c7c96',
          borderColor: '#003c7c',
          pointBackgroundColor: '#003c7c96',
          pointBorderColor: '#003c7c96',
        });
        _labels.push(new Date(obj.fromDate).toLocaleDateString('en-US', this.labelFormat));
      });
      this.initData = [..._initData];
      this.labels = [..._labels];
      console.log('hasil dari init data loop', this.initData);
      console.log('labels loop', this.labels);
    }
    this.initLineChart();
  }

  public assingLabel(): void {
    switch (this.interval) {
      case 'WEEKLY':
        this.labelFormat = { month: 'long', day: 'numeric' };
        break;

      case 'MONTHLY':
        this.labelFormat = { month: 'long' };
        break;

      default:
        this.labelFormat = {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        };
        break;
    }
  }

  public initLineChart(): void {
    this.lineChartData = {
      datasets: this.initData,
      labels: this.labels,
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

    this.chart?.update();
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
