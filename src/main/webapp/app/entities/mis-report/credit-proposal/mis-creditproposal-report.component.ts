import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
@Component({
  selector: 'jhi-mis-creditproposal-report',
  templateUrl: './mis-creditproposal-report.component.html',
  styleUrls: ['./mis-report-credit-proposal.css', '../mis-report.css'],
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
export class MisCreditProposalReportComponent {
  public lovStatus = [];
  data = '';
  date1: any;
  date2: any;
  listOfValue = [];
  allSelected = false;
  MISReportCP: FormGroup;

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.MISReportCP = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
    });
    // Listen to changes on the date fields
    this.MISReportCP.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCP.get('date1')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportCP.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCP.get('date2')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this._getStatusLOV();
  }

  public generateMISReportCP() {
    this.misReportService.setLoading(true);

    const params = {
      startDate: this.MISReportCP.get('date1')?.value,
      endDate: this.MISReportCP.get('date2')?.value,
      status: this._convertStatusToString(this.MISReportCP.get('status')?.value),
    };

    this.misReportService.getMisReportCP(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal'),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
        this.misReportService.setLoading(false);
      },
    });
  }

  public toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MISReportCP.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.MISReportCP.get('status')?.setValue('');
    }
  }

  private _getStatusLOV() {
    this.misReportService.getStatuses('MIS_CREDIT_PROPOSALBSU').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  private _convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  private _getFacilityProposedDataSource(proposal) {
    // if proposal.previousHistory null
    if (proposal.previousHistory === null) {
      return '';
    }

    const products = proposal.previousHistory[0].product;

    // if products null
    if (products === null) {
      return '';
    }

    return products
      .map(product => {
        product.pengajuan;
      })
      .join(',\n');
  }

  private _gettotalPlafondProposed(proposal, currency: 'IDR' | 'USD') {
    // if proposal.previousHistory null
    if (proposal.previousHistory === null) {
      return '';
    }

    const facility = proposal.previousHistory[0].facility;

    // if products null
    if (facility === null) {
      return '';
    }

    return currency === 'IDR' ? facility.totalPlafondIDR : facility.totalPlafondUSD;
  }

  private _getTotalPlafond(proposal, currency: 'IDR' | 'USD', facilityType: 'Cash' | 'Installment') {
    // check if proposal.product is null
    if (proposal.product === null) {
      return '';
    }

    const products = proposal.product;
    const installmentFacilities = ['WCL', 'IL'];

    return products
      .filter(product => product.currency === currency) // Filter by currency
      .filter(product => {
        if (facilityType === 'Cash') {
          // For 'Cash', facility should NOT be 'WCL' or 'IL'
          return !installmentFacilities.includes(product.facility);
        } else if (facilityType === 'Installment') {
          // For 'Installment', facility should ONLY be 'WCL' or 'IL'
          return installmentFacilities.includes(product.facility);
        }
        return false; // In case an unsupported facilityType is passed
      })
      .reduce((sum, product) => sum + parseFloat(product.totalPlafond), 0)
      .toString();
  }

  private _getRate(proposal, type: 'Proposed' | 'DAR Final') {
    const products = type === 'Proposed' ? proposal.previousHistory?.product || null : proposal.product || null;

    if (!products) {
      return '';
    }

    return products.map(product => product.rateProposed).join(',\n');
  }

  private _getdebiturGroup(proposal) {
    // check if proposal.businessGroup is null
    if (proposal.businessGroup === null) {
      return '';
    }

    const customersGroup = proposal.businessGroup.customersGrup;

    // if customersGroup null
    if (customersGroup === null) {
      return '';
    }

    return customersGroup.map(customerGroup => customerGroup.customerName).join(',\n');
  }

  private _getDeviation(proposal): 'Yes' | 'No' | '' {
    // check if proposal.covenant is null
    if (proposal.covenant === null) {
      return '';
    }

    let covenant;

    if (proposal.proposalType === 'Total Exposure <= IDR 15 Bio') {
      covenant = proposal.covenant.below;

      // if covenant null
      if (covenant === null) {
        return '';
      }

      // find in covenant if there any covenant.status NOT EQUAL 'Applied', return 'No', else return 'Yes'
      return covenant.find(c => c.status !== 'Applied') ? 'No' : 'Yes';
    }

    if (proposal.proposalType === 'Total Exposure > IDR 15 Bio') {
      covenant = proposal.covenant.above;

      // if covenant null
      if (covenant === null) {
        return '';
      }

      // find in covenant if there any covenant.status NOT EQUAL 'Applied', return 'No', else return 'Yes'
      return covenant.find(c => c.status !== 'Applied') ? 'No' : 'Yes';
    }

    covenant = proposal.covenant.general.concat(proposal.covenant.deposit);

    // if covenant null
    if (covenant === null) {
      return '';
    }

    // find in covenant if there any covenant.status NOT EQUAL 'Applied', return 'No', else return 'Yes'
    return covenant.find(c => c.status !== 'Applied') ? 'No' : 'Yes';
  }

  private _getCollateralIdAndCode(proposal) {
    // check if proposal.collateral is null
    if (proposal.collateral === null) {
      return {
        id: '',
        collateralCode: '',
      };
    }

    const collaterals = proposal.collateral;

    // if collaterals null
    if (collaterals === null) {
      return {
        id: '',
        collateralCode: '',
      };
    }

    return {
      id: collaterals.map(collateral => collateral.id).join(',\n'),
      collateralCode: collaterals.map(collateral => collateral.collateralCode).join(',\n'),
    };
  }

  private _clearEmptyEntries(input) {
    return input
      .split(',')
      .map(item => item.trim()) // Remove any surrounding spaces
      .filter(item => item !== '') // Filter out empty entries
      .join(',\n'); // Join them back with commas
  }

  private _getStatus(
    proposal,
    key: 'fromStatusDescription' | 'statusDescription',
    position: 'first' | 'last',
    statusPredicates: string[]
  ): string | '' {
    // check if proposal.timeLineCreditProposal is null
    if (proposal.timeLineCreditProposal === null) {
      return '';
    }

    const timelines: any[] = proposal.timeLineCreditProposal;

    if (position === 'first') {
      // sort statuses by id ascending
      timelines.sort((a, b) => a.id - b.id);
    } else {
      // sort statuses by id descending
      timelines.sort((a, b) => b.id - a.id);
    }

    const status = timelines.find(t => statusPredicates.includes(t[key]));

    return status ? status.fromDate : '';
  }

  private _processGenerate(data, fileName) {
    console.log('Data: ', data);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    this._setUpColumns(worksheet);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this._applyStyles(worksheet);
      this._downloadFile(workbook, fileName);
      return;
    }

    // Add data to worksheet
    data.forEach((proposal, index) => {
      this._addProposalData(worksheet, proposal, index);
    });

    this._applyStyles(worksheet);
    this._downloadFile(workbook, fileName);
  }

  private _setUpColumns(worksheet: ExcelJS.Worksheet): void {
    worksheet.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Proposal Number', key: 'proposalNumber', width: 30 },
      { header: 'Proposal Date', key: 'proposalDate', width: 15 },
      { header: 'Segment', key: 'segment', width: 10 },
      { header: 'Proposal Type', key: 'proposalType', width: 30 },
      { header: 'Branchs', key: 'branchs', width: 30 },
      { header: 'Customer Status', key: 'customerStatus', width: 15 },
      { header: 'Program', key: 'program', width: 25 },
      { header: 'Klasifikasi UMKM', key: 'umkm', width: 20 },
      { header: 'Modal Usaha (IDR)', key: 'modalUsaha', width: 20 },
      { header: 'STO/Penjualan Tahunan', key: 'stoPenjualanTahunan', width: 21 },
      { header: 'Refferal', key: 'refferal', width: 20 },
      { header: 'RM', key: 'rm', width: 20 },
      { header: 'BM', key: 'bm', width: 30 },
      { header: 'SME Head', key: 'smeHead', width: 30 },
      { header: 'Regional', key: 'regional', width: 30 },
      { header: 'CIF', key: 'cif', width: 15 },
      { header: 'Debtor Name', key: 'debtorName', width: 30 },
      { header: 'Line of Business', key: 'lineOfBusiness', width: 45 },
      { header: 'Total Exposure Group', key: 'totalExposureGroup', width: 20 },
      { header: 'Deviation', key: 'deviation', width: 10 },
      { header: 'Credit Grading', key: 'creditGrading', width: 13 },
      { header: 'Loan Comm Approval', key: 'loanCommApproval', width: 19 },
      { header: 'Pengajuan', key: 'pengajuan', width: 20 },
      { header: 'Facility', key: 'facility', width: 20 },
      { header: 'Maturity Date', key: 'maturityDate', width: 20 },
      { header: 'Interest Rate (%)', key: 'interestRate', width: 20 },
      { header: 'Provision (%pa)', key: 'provisionPa', width: 20 },
      { header: 'Provision (IDR)', key: 'provisionIDR', width: 20 },
      { header: 'Provision (USD)', key: 'provisionUSD', width: 20 },
      { header: 'Total Admin Fee (%pa)', key: 'totalAdminFeePa', width: 20 },
      { header: 'Total Admin Fee (IDR)', key: 'totalAdminFeeIDR', width: 20 },
      { header: 'Total Admin Fee (USD)', key: 'totalAdminFeeUSD', width: 20 },
      { header: 'Initial Limit (IDR)', key: 'initialLimitIDR', width: 20 },
      { header: 'Initial Limit (USD)', key: 'initialLimitUSD', width: 20 },
      { header: 'Facility (Proposed)', key: 'facilityProposed', width: 15 },
      { header: 'Facility (DAR Final)', key: 'facilityDARFinal', width: 15 },
      { header: 'Total Plafond Proposed (IDR)', key: 'totalPlafondProposedIDR', width: 15 },
      { header: 'Total Plafond Proposed (USD)', key: 'totalPlafondProposedUSD', width: 15 },
      { header: 'Total Plafond DAR Final (IDR)', key: 'totalPlafondDARFinalIDR', width: 15 },
      { header: 'Total Plafond DAR Final (USD)', key: 'totalPlafondDARFinalUSD', width: 15 },
      { header: 'Plafond OD/DL IDR', key: 'plafondODDLIDR', width: 15 },
      { header: 'Plafond Installment IDR', key: 'plafondInstallmentIDR', width: 15 },
      { header: 'Plafond OD/DL USD', key: 'plafondODDLUSD', width: 15 },
      { header: 'Plafond Installment USD', key: 'plafondInstallmentUSD', width: 15 },
      { header: 'Rate Proposed', key: 'rateProposed', width: 15 },
      { header: 'Rate DAR Final', key: 'rateDARFinal', width: 15 },
      { header: 'Total Changes Eq To IDR', key: 'totalChangesEqToIDR', width: 22 },
      { header: 'Total Plafond Debtor only (IDR)', key: 'totalPlafondDebtorIDR', width: 20 },
      { header: 'Total Plafond Debtor only (USD)', key: 'totalPlafondDebtorUSD', width: 20 },
      { header: 'Sub Total Plafond Eq to IDR (Debtor)', key: 'subTotalPlafondEqToIDRDebtor', width: 20 },
      { header: 'Grand Total Plafond Eq to IDR (Include Group)', key: 'grandTotalPlafondEqToIDR', width: 20 },
      { header: 'ID', key: 'id', width: 20 },
      { header: 'Collateral (INCLUDE CROS COLL OTHER CIF)', key: 'collateralIncCrosOtherCIF', width: 20 },
      { header: 'Kabupaten / Kota', key: 'city', width: 20 },
      { header: 'Total MV Internal', key: 'totalMVInternal', width: 20 },
      { header: 'Total LV Internal', key: 'totalLVInternal', width: 20 },
      { header: 'Total MV KJPP', key: 'totalMVKJPP', width: 20 },
      { header: 'Total LV KJPP', key: 'totalLVKJPP', width: 20 },
      { header: 'Collateral Coverage MV', key: 'collateralCoverageMVInternal', width: 20 },
      { header: 'Collateral Coverage LV', key: 'collateralCoverageLVInternal', width: 20 },
      { header: 'Collateral Coverage MV KJPP (%)', key: 'collateralCoverageMVKJPP', width: 20 },
      { header: 'Collateral Coverage LV KJPP (%)', key: 'collateralCoverageLVKJPP', width: 20 },
      { header: 'Group Name', key: 'groupName', width: 20 },
      { header: 'DebiturGroup', key: 'debiturGroup', width: 20 },
      { header: 'Draft', key: 'draft', width: 20 },
      { header: 'Appraisal Date/Draft', key: 'appraisalDateDraft', width: 20 },
      { header: 'Approval Team Leader', key: 'approvalTeamLeader', width: 20 },
      { header: 'Approval BM', key: 'approvalBM', width: 20 },
      { header: 'Approval Ho', key: 'approvalHo', width: 20 },
      { header: 'Approval Div Head', key: 'approvalDivHead', width: 20 },
      { header: 'Approval to Analyst', key: 'approvalToAnalyst', width: 20 },
      { header: 'Assignment', key: 'assignment', width: 20 },
      { header: 'Checker', key: 'checker', width: 20 },
      { header: 'Loan Komite/Approval', key: 'loanKomiteApproval', width: 20 },
      { header: 'DAR Checker', key: 'darChecker', width: 20 },
      { header: 'DAR Rev Checker', key: 'darRevChecker', width: 20 },
      { header: 'Reviewer Name', key: 'reviewerName', width: 20 },
      { header: 'Status', key: 'status', width: 25 },
      { header: 'Summary of Reviewer/Recommendation', key: 'summaryOfReviewerRecommendation', width: 20 },
    ];
  }

  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    worksheet.addRow({
      no: index + 1 || '',
      proposalNumber: proposal.proposalNumber || '',
      proposalDate: proposal.proposalDate || '',
      segment: proposal.segment || '',
      proposalType: proposal.proposalType || '',
      branchs: proposal.bookingBranchName || '',
      customerStatus: proposal.customerStatus || '',
      program: proposal.program || '',
      umkm: proposal.umkm || '',
      modalUsaha: proposal.modalUsaha || '',
      stoPenjualanTahunan: proposal.penjualanTahunan || '',
      refferal: proposal.refferal || '',
      rm: (proposal.rmFirstName || '') + ' ' + (proposal.rmLastName || '') || '',
      bm: proposal.bm || '',
      smeHead: proposal.headName || '',
      regional: proposal.regionalParentRM || '',
      cif: proposal.cif || '',
      debtorName: proposal.debtorName || '',
      lineOfBusiness: proposal.lineOfBusiness || '',
      totalExposureGroup: proposal.totalExposureGroup || '',
      deviation: this._getDeviation(proposal),
      creditGrading: proposal.creditGrading || '',
      loanCommApproval: proposal.approvalLc ? proposal.approvalLc.split(' ')[0] || '' : '',
      pengajuan: proposal.product.map(product => product.pengajuan).join(',\n') || '',
      facility: proposal.product.map(product => product.facility).join(',\n') || '',
      maturityDate: proposal.product.map(product => product.maturityDate).join(',\n') || '',
      interestRate: proposal.product.map(product => product.currentRate).join(',\n') || '',
      provisionPa: proposal.product.map(product => (product.provisionFeeType === '%p.a' ? product.provisionFee : '')).join(',\n') || '',
      provisionIDR: proposal.product.map(product => (product.provisionFeeType === 'IDR' ? product.provisionFee : '')).join(',\n') || '',
      provisionUSD: proposal.product.map(product => (product.provisionFeeType === 'USD' ? product.provisionFee : '')).join(',\n') || '',
      totalAdminFeePa: proposal.product.map(product => (product.adminFeeType === '%p.a' ? product.adminFee : '')).join(',\n') || '',
      totalAdminFeeIDR: proposal.product.map(product => (product.adminFeeType === 'IDR' ? product.adminFee : '')).join(',\n') || '',
      totalAdminFeeUSD: proposal.product.map(product => (product.adminFeeType === 'USD' ? product.adminFee : '')).join(',\n') || '',
      initialLimitIDR: proposal.product.map(product => (product.currency === 'IDR' ? product.initialLimit : '')).join(',\n') || '',
      initialLimitUSD: proposal.product.map(product => (product.currency === 'USD' ? product.initialLimit : '')).join(',\n') || '',
      facilityProposed: this._getFacilityProposedDataSource(proposal),
      facilityDARFinal: proposal.product.map(product => product.pengajuan).join(',\n') || '',
      totalPlafondProposedIDR: this._gettotalPlafondProposed(proposal, 'IDR'),
      totalPlafondProposedUSD: this._gettotalPlafondProposed(proposal, 'USD'),
      totalPlafondDARFinalIDR: proposal.totalPlafondDebtorOnlyIDR || '',
      totalPlafondDARFinalUSD: proposal.totalPlafondDebtorOnlyUSD || '',
      plafondODDLIDR: this._getTotalPlafond(proposal, 'IDR', 'Cash'),
      plafondInstallmentIDR: this._getTotalPlafond(proposal, 'IDR', 'Installment'),
      plafondODDLUSD: this._getTotalPlafond(proposal, 'USD', 'Cash'),
      plafondInstallmentUSD: this._getTotalPlafond(proposal, 'USD', 'Installment'),
      rateProposed: this._getRate(proposal, 'Proposed'),
      rateDARFinal: this._getRate(proposal, 'DAR Final'),
      totalChangesEqToIDR: proposal.totalChangesEqToIDR || '',
      totalPlafondDebtorIDR: proposal.totalPlafondDebtorOnlyIDR || '',
      totalPlafondDebtorUSD: proposal.totalPlafondDebtorOnlyUSD || '',
      subTotalPlafondEqToIDRDebtor: proposal.subTotalPlafondEqToIDR || '',
      grandTotalPlafondEqToIDR: proposal.grandTotalPlafondEqToIDR || '',
      id: this._getCollateralIdAndCode(proposal).id,
      collateralIncCrosOtherCIF: this._getCollateralIdAndCode(proposal).collateralCode,
      city: proposal.city || '', // wait backend
      totalMVInternal: proposal.totalMVInternal || '',
      totalLVInternal: proposal.totalLVInternal || '',
      totalMVKJPP: proposal.totalMVKJPP || '',
      totalLVKJPP: proposal.totalLVKJPP || '',
      collateralCoverageMVInternal: proposal.collateralCoverageMVInternal || '',
      collateralCoverageLVInternal: proposal.collateralCoverageLVInternal || '',
      collateralCoverageMVKJPP: proposal.collateralCoverageMVKJPP || '',
      collateralCoverageLVKJPP: proposal.collateralCoverageLVKJPP || '',
      groupName: proposal.businessGroup ? proposal.businessGroup.groupCompanyName || '' : '',
      debiturGroup: this._getdebiturGroup(proposal),
      draft: this._getStatus(proposal, 'statusDescription', 'first', ['Draft']),
      appraisalDateDraft: '',
      approvalTeamLeader: '',
      approvalBM: this._getStatus(proposal, 'statusDescription', 'first', ['Approval BM']),
      approvalHo: this._getStatus(proposal, 'statusDescription', 'first', ['Approval SME Head']),
      approvalDivHead: this._getStatus(proposal, 'statusDescription', 'first', ['Approval Div Head']),
      approvalToAnalyst: this._getStatus(proposal, 'statusDescription', 'first', ['Approve To Loan Analysis']),
      assignment: this._getStatus(proposal, 'statusDescription', 'first', ['Assignment']),
      checker: this._getStatus(proposal, 'statusDescription', 'first', ['Checker']),
      loanKomiteApproval: this._getStatus(proposal, 'statusDescription', 'last', ['DAR Notif', 'DAR Checker']),
      darChecker: this._getStatus(proposal, 'fromStatusDescription', 'last', ['DAR Checker', 'DAR Notif']),
      darRevChecker: this._getStatus(proposal, 'fromStatusDescription', 'last', ['DAR Rev Checker']),
      reviewerName: proposal.dataAssignToCROName || '',
      status: proposal.status || '',
      summaryOfReviewerRecommendation: proposal.approvalStatus || '',
    });
  }

  private _applyStyles(worksheet: ExcelJS.Worksheet): void {
    worksheet.columns.forEach((column, index) => {
      worksheet.getCell(1, index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'fffefd32' },
      };
    });

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) {
        worksheet.getRow(rowNumber).font = { bold: true };
        worksheet.getRow(rowNumber).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      }

      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    const columnsToBeWraped = [
      'pengajuan',
      'lineOfBusiness',
      'totalPlafondDebtorIDR',
      'totalPlafondDebtorUSD',
      'subTotalPlafondEqToIDRDebtor',
      'grandTotalPlafondEqToIDR',
      'collateralCoverageMVInternal',
      'collateralCoverageLVInternal',
      'collateralCoverageMVKJPP',
      'collateralCoverageLVKJPP',
      'facility',
      'maturityDate',
      'interestRate',
      'provisionPa',
      'provisionIDR',
      'provisionUSD',
      'totalAdminFeePa',
      'totalAdminFeeIDR',
      'totalAdminFeeUSD',
      'initialLimitIDR',
      'initialLimitUSD',
      'facilityProposed',
      'facilityDARFinal',
      'id',
      'totalPlafondProposedIDR',
      'rateProposed',
      'rateDARFinal',
      'debiturGroup',
      'collateralIncCrosOtherCIF',
      'city',
    ];

    columnsToBeWraped.forEach(column => {
      worksheet.getColumn(column).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });
  }

  private _downloadFile(workbook: ExcelJS.Workbook, fileName: string): void {
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const date = new Date();
      const outputName = `${fileName}_${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;

      saveAs(blob, outputName);
      this.misReportService.setLoading(false);
    });
  }
}
