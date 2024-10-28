import { Component, OnInit } from '@angular/core';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'jhi-mis-cpslareviewer-report',
  templateUrl: './mis-cpslareviewer-report.component.html',
  styleUrls: ['../credit-proposal/mis-report-credit-proposal.css', '../mis-report.css'],
  styles: [
    `
      .select-all {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        line-height: 48px;
        height: 48px;
        padding: 0 16px;
        text-align: left;
        text-decoration: none;
        max-width: 100%;
        position: relative;
        liststyletype: none;
        outline: none;
        display: flex;
        flex-direction: row;
        max-width: 100%;
        box-sizing: border-box;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
      }

      .select-all:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }
    `,
  ],
})
export class MisCpslaReviewerReportComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  public startDate: any;
  public endDate: any;
  public allSelected = false;
  public MISReportSLA: FormGroup;

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);

    this.MISReportSLA = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      status: new FormControl(''),
    });

    this.MISReportSLA.get('startDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportSLA.get('startDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportSLA.get('endDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportSLA.get('endDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  get columns(): any[] {
    return [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Date of Assignment', key: 'no', width: 5 },
    ];
  }

  ngOnInit(): void {
    this.getStatusLOV('MIS_SLA_REVIEWER').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  public toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MISReportSLA.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.MISReportSLA.get('status')?.setValue('');
    }
  }

  public generateMISReportSLA() {
    this.misReportService.setLoading(true);

    const params = {
      startDate: this.MISReportSLA.get('startDate')?.value,
      endDate: this.MISReportSLA.get('endDate')?.value,
      status: this._convertStatusToString(this.MISReportSLA.get('status')?.value),
      type: 'STATELOG',
    };

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_SLA_Reviewer'),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
        this.misReportService.setLoading(false);
      },
      complete: () => this.misReportService.setLoading(false),
    });
  }

  private _processGenerate(data, fileName) {
    console.log('Data: ', data);

    this.setUpColumns(this.columns);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this.applyStyles('#ffffe49c');
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(data);

    this._applyStyles();
    this.downloadFile(fileName);
  }

  protected processData(data: any[]): void {
    data.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    worksheet.addRow({
      no: index + 1 || '',
    });
  }

  private _applyStyles(): void {
    super.applyStyles('#ffffe49c');
    const columnsToBeWraped = ['no'];

    columnsToBeWraped.forEach(column => {
      this.worksheet.getColumn(column).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });
  }
}
