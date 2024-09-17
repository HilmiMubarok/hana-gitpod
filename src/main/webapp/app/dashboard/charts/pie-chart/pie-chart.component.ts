import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IGroupByStatus } from 'app/dashboard/dashboard.model';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'jhi-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.style.css'],
})
export class PieChartComponent implements OnInit, OnChanges {
  public _dataSource: IGroupByStatus[];
  public _loadingData: boolean;

  @Input()
  get dataSource() {
    return this._dataSource;
  }

  set dataSource(param: IGroupByStatus[]) {
    this._dataSource = param;
  }

  @Input()
  get loadingData() {
    return this._loadingData;
  }

  set loadingData(param: boolean) {
    this._loadingData = param;
  }
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Pie
  public pieChartOptions: ChartConfiguration['options'];
  public pieChartData: ChartData<'pie', number[], string | string[]>;
  public pieChartType: ChartType;
  public pieChartPlugins = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.fitDataToModel();
    }
  }

  ngOnInit(): void {
    this.fitDataToModel();
  }

  public fitDataToModel(): void {
    if (this.dataSource.length > 0) {
      const data = [];
      const labels = [];
      this.dataSource.forEach(obj => {
        data.push(obj.total);
        labels.push(obj.statusDescription);
      });
      this.initPieChart(data, labels);
    }
  }

  public initPieChart(data, labels): void {
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          fullSize: false,
          position: 'top',
        },
      },
    };
    this.pieChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#ff638494', '#4aacee8c', '#ffd4aa96'],
          hoverBackgroundColor: ['#ff638494', '#4aacee8c', '#ffd4aa96'],
          hoverBorderColor: ['#ff638494', '#4aacee8c', '#ffd4aa96'],
        },
      ],
    };
    this.pieChartType = 'pie';
    this.chart?.update();
  }

  // events
  public chartClicked({ event, active }: { event: ChartEvent; active: object[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent; active: object[] }): void {
    // console.log(event, active);
  }

  changeLabels(): void {
    const words = [
      'hen',
      'variable',
      'embryo',
      'instal',
      'pleasant',
      'physical',
      'bomber',
      'army',
      'add',
      'film',
      'conductor',
      'comfortable',
      'flourish',
      'establish',
      'circumstance',
      'chimney',
      'crack',
      'hall',
      'energy',
      'treat',
      'window',
      'shareholder',
      'division',
      'disk',
      'temptation',
      'chord',
      'left',
      'hospital',
      'beef',
      'patrol',
      'satisfied',
      'academy',
      'acceptance',
      'ivory',
      'aquarium',
      'building',
      'store',
      'replace',
      'language',
      'redeem',
      'honest',
      'intention',
      'silk',
      'opera',
      'sleep',
      'innocent',
      'ignore',
      'suite',
      'applaud',
      'funny',
    ];
    const randomWord = () => words[Math.trunc(Math.random() * words.length)];
    this.pieChartData.labels = new Array(3).map(_ => randomWord());

    this.chart?.update();
  }

  addSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.push(['Line 1', 'Line 2', 'Line 3']);
    }

    this.pieChartData.datasets[0].data.push(400);

    this.chart?.update();
  }

  removeSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.pop();
    }

    this.pieChartData.datasets[0].data.pop();

    this.chart?.update();
  }

  changeLegendPosition(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.position = this.pieChartOptions.plugins.legend.position === 'left' ? 'top' : 'left';
    }

    this.chart?.render();
  }

  toggleLegend(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.display = !this.pieChartOptions.plugins.legend.display;
    }

    this.chart?.render();
  }
}
