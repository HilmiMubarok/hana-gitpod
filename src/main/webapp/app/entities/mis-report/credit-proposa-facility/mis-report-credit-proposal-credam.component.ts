import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import * as ExcelJS from 'exceljs';

// @Component({
//   // selector: 'jhi-mis-report-credit-proposal-facility',
//   // templateUrl: './mis-report-credit-proposal-facility.component.html',
//   styleUrls: ['./mis-report.style.css'],
// })
// export class MisReportCreditProposalFacilityComponent extends AbstractExcelMISReport implements OnInit {
//   status: '';
//   date1: any;
//   date2: any;
//   public listOfValue = [];
//   allSelected = false;

//   MisReportCPFacility: FormGroup;

//   changeOption(event) {
//     console.log('data', event.value);
//   }

//   constructor(public misReportService: MisReportService, public messageService: MessageService) {
//     super(misReportService);

//     this.MisReportCPFacility = new FormGroup({
//       date1: new FormControl(''),
//       date2: new FormControl(''),
//       status: new FormControl(''),
//     });

//     this.MisReportCPFacility.get('date1')?.valueChanges.subscribe(date => {
//       if (moment.isMoment(date)) {
//         const formattedDate = date.format('YYYY-MM-DD');
//         this.MisReportCPFacility.get('date1').setValue(formattedDate, { emitEvent: false });
//       }
//     });
//     this.MisReportCPFacility.get('date2')?.valueChanges.subscribe(date => {
//       if (moment.isMoment(date)) {
//         const formattedDate = date.format('YYYY-MM-DD');
//         this.MisReportCPFacility.get('date2').setValue(formattedDate, { emitEvent: false });
//       }
//     });
//   }
//   ngOnInit() {
//     this.getSatus();
//   }
//   getSatus() {
//     this.misReportService.getStatuses('MIS_CREDIT_PROPOSAL_FACILITY').subscribe({
//       next: res => (this.listOfValue = res),
//       error: () => {
//         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
//       },
//     });
//   }

//   toggleSelectAll(): void {
//     this.allSelected = !this.allSelected;
//     if (this.allSelected) {
//       this.MisReportCPFacility.get('status')?.setValue([...this.listOfValue.map(status => status.statusId)]);
//     } else {
//       this.MisReportCPFacility.get('status')?.setValue('');
//     }
//   }
//   public previousState(): void {
//     window.history.back();
//   }

//   convertStatusToString(status: Array<string>): string {
//     // if length is 0, return empty string
//     if (status.length === 0) {
//       return '';
//     }

//     return status.join(',');
//   }

//   get columns(): any[] {
//     return [
//       { header: 'No.', key: '', width: 10 },
//       { header: 'Proposal Number', key: 'proposalNumber', width: 20 },
//       { Header: 'Dppk Number', key: 'dppkNumber', format: 'date' },
//       { header: 'PIC Credam', key: 'picCredam', width: 50 },
//       { header: 'Debtor', key: 'debtor', width: 50 },
//       { header: 'DPDL In Date', key: 'dpdlInDate', width: 50 },
//       { header: 'DPDL In Time', key: 'dpdlInTime', width: 50 },
//       { header: 'DPPK Out Date', key: 'dppkOutDate', width: 50 },
//       { header: 'DPPK Out Time', key: 'dppkOutTime', width: 50 },
//       { header: 'Checker Out Name', key: 'checkOutName', width: 50 },
//       { header: 'Checker Out Date', key: 'checkerOutDate', width: 50 },
//       { header: 'Checker Out Time', key: 'checkerOutTime', width: 50 },
//       { header: 'Approval Out Name', key: 'approvalOutName', width: 50 },
//       { header: 'Approval Out Date', key: 'approvalOutDate', width: 50 },
//       { header: 'Approval Out Time', key: 'approvalOutTime', width: 50 },
//       { header: 'TAT Days', key: 'tatDays', width: 50 },
//       { header: 'TAT Time', key: 'tatTime', width: 50 },
//       { header: 'Status', key: 'status', width: 50 },
//       { header: 'Transaksi', key: 'transaksi', width: 50 },
//       { header: 'Fasilitas', key: 'fasilitas', width: 50 },
//       { header: 'Ccy', key: 'ccy', width: 50 },
//       { header: 'Nominal', key: 'nominal', width: 50 },
//       { header: 'Tgl Effektif Fas', key: 'tglEfektifFas', width: 50 },
//       { header: 'Jenis Jaminan', key: 'jenisJaminan', width: 50 },
//       { header: 'Segmentasi', key: 'segmentasi', width: 50 },
//       { header: 'Branch', key: 'branch', width: 50 },
//       { header: 'RM', key: 'rm', width: 50 },
//       { header: 'KETERANGAN', key: 'keterangan', width: 50 },
//       { header: 'Deviasi', key: 'deviasi', width: 10 },
//       { header: 'TBO', key: 'tbo', width: 10 },
//     ];
//   }

//   protected processData(data: any[]): void {
//     data.forEach((proposal, index) => {
//       this._addProposalData(this.worksheet, proposal, index);
//     });
//   }
//   private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
//     const timeLineData = proposal.timeLineCreditProposal ? proposal.timeLineCreditProposal.sort((a, b) => a.id - b.id) : [];
//     if (timeLineData.length >= 1) {
//       timeLineData.shift();
//     }
//     console.log(timeLineData);
//     // Sort products by productId in ascending order
//     const products = [...(proposal.product || [])].sort((a, b) => a.productId - b.productId);
//     const currentProduct = products[index] || {};
//     // Start index for merging rows related to the current proposal
//     const startRow = worksheet.rowCount + 1;
//     worksheet.addRow({
//       no: index + 1 || '',
//       proposalNumber: proposal.proposalNumber || '',
//       dppkNumber: '',
//       picCredam: '',
//       debtor: proposal.debtorName || '',
//       dpdlInDate:
//         timeLineData
//           .map(timeline => (timeline.statusDescription === 'DPDL Finalize' ? this._convertDate(timeline.fromDate) : '' || ''))
//           .join(',\n') || '',
//       dpdlInTime:
//         timeLineData
//           .map(timeline => (timeline.statusDescription === 'DPDL Finalize' ? this._convertTime(timeline.fromTime) : '' || ''))
//           .join(',\n') || '',
//       dppkOutDate: '',
//       dppkOutTime: '',
//       checkOutName: proposal.dataAssignToDPPKReviewOneName || '',
//       checkerOutDate: '',
//       checkerOutTime: '',
//       approvalOutName: proposal.dataAssignToDPPKReviewTwoName || '',
//       approvalOutDate: '',
//       approvalOutTime: '',
//       tatDays: '',
//       tatTime: '',
//       status: proposal.status || '',
//       fasilitas: currentProduct.facility || '',
//       ccy: currentProduct.currency || '',
//       nominal: currentProduct.totalPlafond || '',
//       tglEfektifFas: '',
//       jenisJaminan: proposal.collateral.map(collateral => collateral.collateralType).join('\n') || '',
//       segmentasi: proposal.regionalParentRM || '',
//       branch: proposal.bookingBranchName || '',
//       rm: proposal.rmFirstName + ' ' + proposal.rmLastName || '',
//       deviasi: this._getDeviation(proposal) || '',
//       tbo: '',
//       keterangan:
//         timeLineData
//           .map(timeline => timeline.note || '')
//           .join(',\n')
//           .replace(/\n/g, ',\n') || '',
//     });
//     const rowEnd = worksheet.rowCount;
//     // Merge columns for the proposal details (first row only)
//     if (rowEnd > startRow) {
//       worksheet.mergeCells(`F${startRow}:F${rowEnd}`); // Merge 'customerStatus'
//       worksheet.mergeCells(`G${startRow}:G${rowEnd}`); // Merge 'cif'
//       worksheet.mergeCells(`AB${startRow}:AB${rowEnd}`); // Merge 'debtorName'
//     }
//   }

//   public generateMISReportCP() {
//     this.misReportService.setLoading(true);

//     const params = {
//       startDate: this.MisReportCPFacility.get('date1')?.value,
//       endDate: this.MisReportCPFacility.get('date2')?.value,
//       status: this.convertStatusToString(this.MisReportCPFacility.get('status')?.value),
//     };

//     this.misReportService.getMisReportCP(params).subscribe({
//       next: res => this._processGenerate(res.body, 'MIS_Credit_Proposal'),
//       error: () => {
//         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
//         this._resetData();
//         this.misReportService.setLoading(false);
//       },
//       complete: () => {
//         this._resetData();
//         this.misReportService.setLoading(false);
//       },
//     });
//   }
//   private _processGenerate(data, fileName) {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sheet 1');
//     this.setUpColumns(this.columns);

//     // if data is empty, generate an empty file
//     if (!data || data.length === 0) {
//       this._applyStyles(worksheet);
//       this.downloadFile(fileName);
//       return;
//     }

//     // Add data to worksheet
//     this.processData(data);
//     this._applyStyles(worksheet);
//     this.downloadFile(fileName);
//     this._resetData();
//   }
//   private _applyStyles(worksheet: ExcelJS.Worksheet): void {
//     super.applyStyles('fffefd32');
//     const columnsToBeWraped = ['dpdlInDate', 'dpdlInTime'];
//     columnsToBeWraped.forEach(column => {
//       this.worksheet.getColumn(column).alignment = {
//         vertical: 'middle',
//         horizontal: 'center',
//         wrapText: true,
//       };

//       const columnValue = this.worksheet.getColumn(column);

//       const newValue = columnValue.values.map(value => {
//         if (value) {
//           return this._clearEmptyEntries(value.toString());
//         }
//         return value;
//       });

//       columnValue.values = newValue;
//     });
//   }
//   private _convertDate(date: string): string {
//     if (!date) {
//       return '';
//     }
//     return moment(date).format('DD-MM-YYYY');
//   }
//   private _convertTime(time: string): string {
//     if (!time) {
//       ('');
//     }
//     return time.slice(0, 5);
//   }
// }
