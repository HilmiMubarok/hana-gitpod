import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { ChartTheme } from '@syncfusion/ej2-angular-spreadsheet';
import DataLineChart from './line-chart.model';

@Component({
  selector: 'jhi-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LineChartComponent implements OnInit {
  public dataSource1: Object[];
  public dataSource2: Object[];
  public dataSource3: Object[];
  public spLineAreaprimaryXAxis: Object;
  public spLineAreaprimaryYAxis: Object;
  public spLineLegendSettings: Object;
  public spLineAreatooltipSettings: Object;
  public spLineAreaBorder: Object;
  public spLineAreaBorder1: Object;
  public spLineAreaBorder2: Object;
  public chartArea: Object;
  public spLineAreaFill: string;
  public spLineAreaFill1: string;
  public spLineAreaFill2: string;

  private dataLineChart = DataLineChart;

  constructor() {}

  ngOnInit(): void {
    this.lineChartSettings();
  }

  public lineChartSettings(): void {
    this.dataSource1 = this.dataLineChart[0];
    this.dataSource2 = this.dataLineChart[1];
    this.dataSource3 = this.dataLineChart[2];

    // Initializing Primary X Axis
    this.spLineAreaprimaryXAxis = {
      valueType: 'Category',
      majorGridLines: { width: 0 },
      majorTickLines: { width: 0 },
      edgeLabelPlacement: 'Shift',
      lableStyle: { size: '11px' },
    };
    // Initializing Primary Y Axis
    this.spLineAreaprimaryYAxis = {
      labelFormat: '${value}',
      lineStyle: { width: 0 },
      maximum: 12000,
      minimum: 0,
      majorTickLines: { width: 0 },
      lableStyle: { size: '11px' },
      textStyle: { size: '13px' },
    };

    this.spLineLegendSettings = {
      enableHighlight: true,
    };
    this.spLineAreatooltipSettings = {
      enable: true,
      shared: true,
      enableMarker: false,
    };
    this.spLineAreaBorder = {
      width: 2.75,
      color: '#2981d7',
    };
    this.spLineAreaBorder1 = {
      width: 2.75,
      color: '#003c7c',
    };
    this.spLineAreaBorder2 = {
      width: 2.75,
      color: '#cfdced',
    };
    this.chartArea = {
      border: { width: 0 },
    };
    this.spLineAreaFill = '#2981d7';
    this.spLineAreaFill1 = '#003c7c';
    this.spLineAreaFill2 = '#cfdced';
  }

  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(
      (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast')
    );
    args.chart.series[0].fill = 'url(#' + 'line-chart)';
    args.chart.series[1].fill = 'url(#' + 'line-chart1)';
    args.chart.series[2].fill = 'url(#' + 'line-chart2)';
  }
}
