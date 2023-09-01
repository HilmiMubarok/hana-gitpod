import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccumulationTheme, IAccLoadedEventArgs, IAccPointRenderEventArgs, ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { ChartTheme } from '@syncfusion/ej2-angular-spreadsheet';
import DataLineChart from './pie-chart.model';
import DataPieChart from './pie-chart.model';

@Component({
  selector: 'jhi-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PieChartComponent implements OnInit {
  public dataSource1: Object[];
  public animation: Object;
  public border: Object;
  public pieTooltipSetting: Object;
  public palettes: string[];
  public dataLabel: Object;
  public enableBorderOnMouseMove: boolean;
  public enableSmartLabels: boolean;
  public pielegendSettings: Object;
  public layoutColor: any;
  public primaryXAxis: Object;
  public chartData: Object[];

  public chartArea: Object;

  private dataPieChart = DataPieChart;

  constructor() {}
  ngOnInit(): void {
    this.pieChartSettings();
  }

  public pieChartSettings(): void {
    this.dataSource1 = this.dataPieChart;

    this.animation = {
      enable: true,
    };

    this.border = { width: 3 };
    this.pieTooltipSetting = { enable: true, format: '<b>${point.x}</b><br/><b>${point.y}</b>', header: '' };
    this.palettes = [
      '#61EFCD',
      '#CA765A',
      '#2485FA',
      '#F57D7D',
      '#C152D2',
      '#8854D9',
      '#3D4EB8',
      '#00BCD7',
      '#4472c4',
      '#5b9bd5',
      '#6f6fe2',
      '#e269ae',
      '#9e480e',
    ];

    this.dataLabel = {
      visible: true,
      name: 'Product',
      position: 'Outside',
      font: {
        fontWeight: '600',
      },
      connectorStyle: {
        length: '20px',
        type: 'Curve',
      },
    };
    this.enableBorderOnMouseMove = true;
    this.enableSmartLabels = true;
    this.pielegendSettings = {
      visible: false,
    };
    this.chartArea = {
      border: { width: 0 },
    };
  }

  public accumulationload(args: IAccLoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.accumulation.theme = <AccumulationTheme>(
      (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast')
    );
  }
  public pointRender(args: IAccPointRenderEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    if (selectedTheme.indexOf('dark') > -1) {
      if (selectedTheme.indexOf('material') > -1) {
        args.border.color = '#303030';
        this.layoutColor = '#303030';
      } else if (selectedTheme.indexOf('bootstrap5') > -1) {
        args.border.color = '#212529';
        this.layoutColor = '#212529';
      } else if (selectedTheme.indexOf('bootstrap') > -1) {
        args.border.color = '#1A1A1A';
        this.layoutColor = '#1A1A1A';
      } else if (selectedTheme.indexOf('tailwind') > -1) {
        args.border.color = '#1F2937';
        this.layoutColor = '#1F2937';
      } else if (selectedTheme.indexOf('fluent') > -1) {
        args.border.color = '#252423';
        this.layoutColor = '#252423';
      } else if (selectedTheme.indexOf('fabric') > -1) {
        args.border.color = '#201f1f';
        this.layoutColor = '#201f1f';
      } else {
        args.border.color = '#222222';
        this.layoutColor = '#222222';
      }
    } else if (selectedTheme.indexOf('highcontrast') > -1) {
      args.border.color = '#000000';
      this.layoutColor = '#000000';
    } else {
      args.border.color = '#FFFFFF';
      this.layoutColor = '#FFFFFF';
    }

    if (selectedTheme.indexOf('highcontrast') > -1 || selectedTheme.indexOf('dark') > -1) {
      const element = document.querySelector('#header1') as HTMLElement;
      element.style.color = '#F3F2F1';
      const element1 = document.querySelector('#header2') as HTMLElement;
      element1.style.color = '#F3F2F1';
      const element2 = document.querySelector('#header3') as HTMLElement;
      element2.style.color = '#F3F2F1';
    }
    if (selectedTheme.indexOf('tailwind') > -1) {
      const element = document.querySelector('#layout_0_body') as HTMLElement;
      element.style.padding = '0';
      const element1 = document.querySelector('#layout_1_body') as HTMLElement;
      element1.style.padding = '0';
      const element2 = document.querySelector('#layout_2_body') as HTMLElement;
      element2.style.padding = '0';
    }
    const element = document.querySelector('#layout_0template') as HTMLElement;
    element.style.background = this.layoutColor;
    const elementBody = document.getElementById('column');
    elementBody.style.background = this.layoutColor;
    const element1 = document.querySelector('#layout_1template') as HTMLElement;
    element1.style.background = this.layoutColor;
    const element1Body = document.getElementById('pie');
    element1Body.style.background = this.layoutColor;
    const element2 = document.querySelector('#layout_2template') as HTMLElement;
    element2.style.background = this.layoutColor;
    const element2Body = document.getElementById('spline');
    element2Body.style.background = this.layoutColor;
  }
}
