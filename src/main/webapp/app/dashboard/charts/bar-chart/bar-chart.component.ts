import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { ChartTheme } from '@syncfusion/ej2-angular-spreadsheet';
import DataBarChart from './bar-chart.model';

@Component({
  selector: 'jhi-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BarChartComponent implements OnInit {
  public dataSource1: Object[];
  public dataSource2: Object[];
  public dataSource3: Object[];
  public columnChartprimaryXAxis: Object;
  public columnChartprimaryYAxis: Object;
  public columnChartlegendSettings: Object;
  public columnChartmarker: Object;
  public series1Fill: string;
  public series2Fill: string;
  public series3Fill: string;
  public chartArea: Object;
  public palettes: string[];
  public border: Object;

  private dataBarChart = DataBarChart;

  constructor() {}
  ngOnInit(): void {
    this.barChartSettings();
  }

  public barChartSettings(): void {
    this.dataSource1 = this.dataBarChart[0];
    this.dataSource2 = this.dataBarChart[1];
    this.dataSource3 = this.dataBarChart[2];

    // Initializing Primary X Axis
    this.columnChartprimaryXAxis = {
      valueType: 'Category',
      majorGridLines: { width: 0 },
      lableStyle: { size: '11px' },
    };
    // Initializing Primary Y Axis
    this.columnChartprimaryYAxis = {
      labelFormat: '{value}%',
      lineStyle: { width: 0 },
      maximum: 100,
      minimum: 0,
      majorTickLines: { width: 0 },
      lableStyle: { size: '11px' },
      titleStyle: { size: '13px' },
    };

    this.columnChartlegendSettings = {
      padding: 5,
      shapeHeight: 8,
      shapeWidth: 8,
    };

    this.columnChartmarker = {
      dataLabel: {
        visible: false,
        position: 'Middle',
        name: 'TextMapping',
        font: {
          color: '#FFFFFF',
        },
      },
    };
    this.chartArea = {
      border: { width: 0 },
    };
    this.series1Fill = '#8854d9';
    this.series2Fill = '#00bcd7';
    this.series3Fill = '#93d9d9';
    this.border = { width: 20 };
  }

  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(
      (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast')
    );
    args.chart.series[0].fill = 'url(#' + 'bar-chart)';
    args.chart.series[1].fill = 'url(#' + 'bar-chart1)';
    args.chart.series[2].fill = 'url(#' + 'bar-chart2)';
  }
}
