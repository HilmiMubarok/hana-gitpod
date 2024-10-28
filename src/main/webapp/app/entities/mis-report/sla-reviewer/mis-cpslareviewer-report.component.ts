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
      { header: 'Proposal Number', key: 'proposalNumber', width: 30 },
      { header: 'Proposal Type', key: 'proposalType', width: 15 },
      { header: 'Regional', key: 'regionalParentRM', width: 10 },
      { header: 'Head Name', key: 'headName', width: 10 },
      { header: 'Branch', key: 'branchDebitur ', width: 15 },
      { header: 'Pengajuan', key: 'pengajuan', width: 15 },
      { header: 'Total Changes Amount (in IDR Mio)', key: 'totalChangesIDR', width: 15 },
      { header: 'Total Changes Amount (in USD Thousand)', key: 'totalChangesUSD', width: 15 },
      { header: 'Sub Total Plafond (in IDR Mio)', key: 'subTotalPlafondIDR', width: 10 },
      { header: 'Sub Total Plafond (in USD Thousand)', key: 'subTotalPlafondUSD', width: 10 },
      { header: 'Total Changes eq to IDR', key: 'totalChangesIDR', width: 10 },
      { header: 'Sub Total Plafond Eq to IDR', key: 'subTotalPlafondIDR', width: 10 },
      { header: 'Total Changes Amount (in IDR Mio)', key: 'totalChangesAmountIDR', width: 10 },
      { header: 'Total Changes Amount (in USD Thousand)', key: 'totalChangesAmountUSD', width: 10 },
      { header: 'Sub Total Plafond (in IDR Mio)', key: 'subTotalPlafondIDRMIO', width: 10 },
      { header: 'Sub Total Plafond (in USD Thousand)', key: 'subTotalPlafondUSDTHOUSAND', width: 10 },
      { header: 'Total Changes eq to IDR', key: 'totalChangesEqToIDR', width: 10 },
      { header: 'Sub Total Plafond Eq to IDR', key: 'subTotalPlafondEqToIDR', width: 10 },
      { header: 'Recommendation', key: 'recommendation', width: 10 },
      { header: 'Loan Comm Approval (Summary)', key: 'loanCommApproval', width: 10 },
      { header: 'Maturity Date', key: 'maturityDate', width: 10 },
      { header: 'Date of Approve to LA', key: 'dateOfApproveToLA', width: 10 },
      { header: 'Days to Maturity Date', key: 'daysToMaturityDate', width: 10 },
      { header: 'Date of Assignment', key: 'dateOfAssignment', width: 10 },
      { header: 'Proposal return to the branch', key: 'proposalReturnToBranch', width: 10 },
      { header: 'Proposal back to CRO', key: 'proposalBackToCRO', width: 10 },
      { header: 'Proposal check by Checker', key: 'proposalCheckByChecker', width: 10 },
      { header: 'Loan Approval/Loan Comm Date', key: 'loanApprovalLoanCommDate', width: 10 },
      { header: 'Generate DAR', key: 'generateDAR', width: 10 },
      { header: 'Finalized DAR', key: 'finalizedDAR', width: 10 },
      { header: 'SLA Length', key: 'slaLength', width: 10 },
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
