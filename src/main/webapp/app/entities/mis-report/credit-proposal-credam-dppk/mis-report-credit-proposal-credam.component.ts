import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'jhi-mis-report-credit-proposal-credam',
  templateUrl: './mis-report-credit-proposal-credam.component.html',
  styleUrls: ['./mis-report.style.css'],
})
export class MisReportCreditProposalCredamComponent extends AbstractExcelMISReport implements OnInit {
  status: '';
  date1: any;
  date2: any;
  public listOfValue = [];
  allSelected = false;

  MisReportCPCredam: FormGroup;

  changeOption(event) {
    console.log('data', event.value);
  }

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);

    this.MisReportCPCredam = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
      type: new FormControl(''),
    });

    this.MisReportCPCredam.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPCredam.get('date1').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.MisReportCPCredam.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MisReportCPCredam.get('date2').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.MisReportCPCredam.get('type')?.setValue('STATELOG');
  }
  ngOnInit() {
    this.getSatus();
  }
  getSatus() {
    this.misReportService.getStatuses('MIS_SLA_DPPK').subscribe({
      next: res => (this.listOfValue = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MisReportCPCredam.get('status')?.setValue([...this.listOfValue.map(status => status.statusId)]);
    } else {
      this.MisReportCPCredam.get('status')?.setValue('');
    }
  }
  public previousState(): void {
    window.history.back();
  }

  convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  get columns(): any[] {
    return [
      { header: 'No.', key: 'no', width: 10 },
      { header: 'Proposal Number', key: 'proposalNumber', width: 40 },
      { header: 'DPPK Number', key: 'dppkNumber', width: 40 },
      { header: 'PIC Credam', key: 'picCredam', width: 50 },
      { header: 'Debtor', key: 'debtor', width: 50 },
      { header: 'DPPK In Date', key: 'dppkInDate', width: 50 },
      { header: 'DPPK In Time', key: 'dppkInTime', width: 50 },
      { header: 'DPPK Out Date', key: 'dppkOutDate', width: 50 },
      { header: 'DPPK Out Time', key: 'dppkOutTime', width: 50 },
      { header: 'Checker Out Name', key: 'checkOutName', width: 50 },
      { header: 'Checker Out Date', key: 'checkerOutDate', width: 50 },
      { header: 'Checker Out Time', key: 'checkerOutTime', width: 50 },
      { header: 'Approval Out Name', key: 'approvalOutName', width: 50 },
      { header: 'Approval Out Date', key: 'approvalOutDate', width: 50 },
      { header: 'Approval Out Time', key: 'approvalOutTime', width: 50 },
      { header: 'TAT Days', key: 'tatDays', width: 50 },
      { header: 'TAT Time', key: 'tatTime', width: 50 },
      { header: 'Status', key: 'status', width: 50 },
      { header: 'Transaksi', key: 'transaksi', width: 50 },
      { header: 'Fasilitas', key: 'fasilitas', width: 50 },
      { header: 'Ccy', key: 'ccy', width: 50 },
      { header: 'Nominal', key: 'nominal', width: 50 },
      { header: 'Tgl Effektif Fas', key: 'tglEfektifFas', width: 50 },
      { header: 'Jenis Jaminan', key: 'jenisJaminan', width: 50 },
      { header: 'Segmentasi', key: 'segmentasi', width: 50 },
      { header: 'Branch', key: 'branch', width: 50 },
      { header: 'RM', key: 'rm', width: 50 },
      { header: 'KETERANGAN', key: 'keterangan', width: 50 },
      { header: 'Deviasi', key: 'deviasi', width: 10 },
      { header: 'TBO', key: 'tbo', width: 10 },
    ];
  }

  protected processData(data: any[]): void {
    const sortedProposals = data
      .map(proposal => ({
        ...proposal,
        dppkInDate:
          proposal.timeLineCreditProposal
            .filter(timeline => timeline.statusDescription === 'DPPK Finalize')
            .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime())
            .map(timeline => timeline.fromDate)[0] || null,
      }))
      .sort((a, b) => new Date(a.dppkInDate).getTime() - new Date(b.dppkInDate).getTime());
    sortedProposals.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }
  private _addProposalData(worksheet: ExcelJS.Worksheet, proposal, index): void {
    const timeLineData = proposal.timeLineCreditProposal.sort((a, b) => a.id - b.id);
    const startRow = worksheet.rowCount + 1;
    const latestReviewCheckerDate = timeLineData.filter(item => item.statusDescription === 'Review Checker 2');
    if (latestReviewCheckerDate.length > 0) {
      latestReviewCheckerDate.reduce((latest, current) => {
        const currentDate = new Date(current?.fromDate);
        const latestDate = new Date(latest?.fromDate);
        return currentDate > latestDate ? current : latest;
      });
    }
    const latestDPPKFinalizeDate = timeLineData.filter(item => item.statusDescription === 'DPPK Finalize');
    const reviewCheckerDate = latestReviewCheckerDate[0]?.fromDate;
    const latestDPPKFinalizeDates = latestDPPKFinalizeDate[latestDPPKFinalizeDate.length - 1].fromDate;
    function calculateDaysDifference(date1, date2) {
      if (!date1 || !date2) {
        return '';
      }
      const d1 = new Date(date1).getTime();
      const d2 = new Date(date2).getTime();
      const timeDifference = d1 - d2;
      return Math.abs(Math.round(timeDifference / (1000 * 60 * 60 * 24))); // Konversi ke hari
    }
    // Hitung Tatdays
    const tatDayss = calculateDaysDifference(reviewCheckerDate, latestDPPKFinalizeDates);
    const latestDPPKFinalizeTime = timeLineData.filter(item => item.statusDescription === 'DPPK Finalize');
    const firstEntryTime = latestDPPKFinalizeTime.length > 0 ? latestDPPKFinalizeTime[0].fromTime.slice(0, 5) : null;
    const latestReviewCheckerTime = timeLineData
      .filter(item => item.fromStatusDescription === 'Review Checker 2')
      .reduce(
        (latest, current) => {
          const latestTimeInMinutes = toMinutes(latest.fromTime);
          const currentTimeInMinutes = toMinutes(current.fromTime);
          return currentTimeInMinutes > latestTimeInMinutes ? current : latest;
        },
        { fromTime: '' }
      )
      .fromTime.slice(0, 5); // Ambil hanya jam dan menit

    // Fungsi untuk mengonversi waktu ke menit
    function toMinutes(time) {
      if (!time) {
        return 0;
      }
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }
    // Konversi "HH:mm" ke total menit
    function timeStringToMinutes(timeString) {
      if (!timeString) {
        return 0;
      }
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    }

    // Konversi total menit ke "HH:mm"
    function minutesToTime(minutes) {
      if (isNaN(minutes)) {
        return '00:00';
      }
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }
    // Hardcoded jam 08:00 untuk referensi
    const jam8Minutes = timeStringToMinutes('08:00');
    // Konversi waktu dari data
    const latestDPPKFinalizeTimeM = timeStringToMinutes(firstEntryTime);
    const latestReviewCheckerTimeM = timeStringToMinutes(latestReviewCheckerTime);
    // Hitung selisih waktu
    const tatTime =
      tatDayss === 0
        ? {
            timeDifference: latestReviewCheckerTimeM - latestDPPKFinalizeTimeM,
            formattedDifference: `${latestReviewCheckerTime} - ${firstEntryTime}`,
          }
        : {
            timeDifference: latestReviewCheckerTimeM - jam8Minutes,
            formattedDifference: `${latestReviewCheckerTime} - ${minutesToTime(jam8Minutes)}`,
          };
    // Gabungkan hasil akhir
    const formattedTatTime = `${minutesToTime(Math.abs(tatTime.timeDifference))}`;
    const latestDPPKFinalize = timeLineData.filter(item => item.fromStatusDescription === 'DPPK Finalize');
    if (latestDPPKFinalize.length > 0) {
      latestDPPKFinalize.reduce((latest, current) => {
        const currentDate = new Date(current?.fromDate);
        const latestDate = new Date(latest?.fromDate);
        return currentDate > latestDate ? current : latest;
      });
    }
    const tglEfekFasArr = [];

    for (let i = 0; i < proposal.product.length; i++) {
      const product = proposal.product[i];

      for (let z = 0; z < product.mainProduct.length; z++) {
        const mainProduct = product.mainProduct[z];

        switch (product.pengajuan) {
          case 'New':
            tglEfekFasArr.push(product.tenorFasilitas + ' ' + product.periodType);
            break;

          case 'Renewal':
            tglEfekFasArr.push(this._convertDate(product.maturityDate) + ' s/d ' + this._convertDate(mainProduct.proposeMaturityDate));
            break;

          case 'Renewal + Additional':
          case 'Renewal + Decrease':
            tglEfekFasArr.push(this._convertDate(mainProduct.startPeriodType));
            break;

          case 'Existing':
            tglEfekFasArr.push(this._convertDate(product.maturityDate));
            break;

          case 'Additional / Top Up':
            tglEfekFasArr.push(this._convertDate(mainProduct.proposeMaturityDate));
            break;

          default:
            tglEfekFasArr.push(mainProduct.endPeriodRemark);
            break;
        }
      }
    }

    worksheet.addRow({
      no: index + 1 || '',
      proposalNumber: proposal.proposalNumber || '',
      dppkNumber: proposal.dppkNumber || '',
      picCredam: latestDPPKFinalize[0].personName || '',
      debtor: proposal.debtorName || '',
      dppkInDate:
        timeLineData
          .filter(timeline => timeline.statusDescription === 'DPPK Finalize')
          .sort((a, b) => a.fromDate - b.fromDate)
          .map(timeline => this._convertDate(timeline.fromDate))
          .join(',\n') || '',
      dppkInTime:
        timeLineData
          .filter(timeline => timeline.statusDescription === 'DPPK Finalize')
          .map(timeline => this._convertTime(timeline.fromTime))
          .join(',\n') || '',
      dppkOutDate:
        timeLineData
          .filter(timeline => timeline.statusDescription === 'DPPK Review')
          .map(timeline => this._convertDate(timeline.fromDate))
          .join(',\n') || '',
      dppkOutTime:
        timeLineData
          .filter(timeline => timeline.statusDescription === 'DPPK Review')
          .map(timeline => this._convertTime(timeline.fromTime))
          .join(',\n') || '',

      checkOutName: proposal.dataAssignToDPPKReviewOneName || '',
      checkerOutDate:
        timeLineData
          .filter(timeline => timeline.statusDescription === 'Review Checker 1')
          .map(timeline => this._convertDate(timeline.fromDate))
          .join(',\n') || '',
      checkerOutTime:
        timeLineData
          .filter(timeline => timeline.statusDescription === 'Review Checker 1')
          .map(timeline => this._convertTime(timeline.fromTime))
          .join(',\n') || '',

      approvalOutName: proposal.dataAssignToDPPKReviewTwoName || '',

      approvalOutDate:
        timeLineData
          .filter(timeline => timeline.statusDescription === 'Review Checker 2')
          .map(timeline => this._convertDate(timeline.fromDate))
          .join(',\n') || '',

      approvalOutTime:
        timeLineData
          .filter(timeline => timeline.statusDescription === 'Review Checker 2')
          .map(timeline => this._convertTime(timeline.fromTime))
          .join(',\n') || '',

      tatDays: tatDayss?.toString() || '',
      tatTime: formattedTatTime || '',
      status: proposal.status || '',
      transaksi: proposal.product.map(product => product.pengajuan).join(',\n') || '',
      fasilitas: proposal.product.map(product => product.facility).join(',\n') || '',
      ccy: proposal.product.map(product => product.currency).join(',\n') || '',
      nominal: proposal.product.map(product => product.totalPlafond).join(',\n') || '',
      tglEfektifFas: tglEfekFasArr.join(',\n') || '',
      jenisJaminan: proposal.collateral.map(collateral => collateral.collateralCode).join(',\n') || '',
      segmentasi: proposal.regionalParentRM || '',
      branch: proposal.bookingBranchName || '',
      rm: proposal.rmFirstName + ' ' + proposal.rmLastName || '',
      deviasi: this._getDeviation(proposal) || '',
      tbo: proposal.statusDocumentTbo || '',
      keterangan:
        timeLineData
          .filter(timeline => timeline.statusDescription === 'DPPK Finalize')
          .map(timeline => timeline.note || '')
          .filter(note => note.trim() !== '')
          .join(',\n') || '',
    });
    const rowEnd = worksheet.rowCount;
    // Merge columns for the proposal details (first row only)
    if (rowEnd > startRow) {
      worksheet.mergeCells(`F${startRow}:F${rowEnd}`); // Merge 'customerStatus'
      worksheet.mergeCells(`G${startRow}:G${rowEnd}`); // Merge 'cif'
      worksheet.mergeCells(`AB${startRow}:AB${rowEnd}`); // Merge 'debtorName'
    }
  }

  public generateMISReportCP() {
    this.misReportService.setLoading(true);
    const params = {
      startDate: this.MisReportCPCredam.get('date1')?.value,
      endDate: this.MisReportCPCredam.get('date2')?.value,
      status: this.convertStatusToString(this.MisReportCPCredam.get('status')?.value),
      type: this.MisReportCPCredam.get('type')?.value,
    };

    this.misReportService.getMisReportCPCredam(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_SLA_DPPK'),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate MIS Report' });
        this._resetData();
        this.misReportService.setLoading(false);
      },
      complete: () => {
        this._resetData();
        this.misReportService.setLoading(false);
      },
    });
  }
  private _processGenerate(data, fileName) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    this.setUpColumns(this.columns);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this._applyStyles(worksheet);
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(data);
    this._applyStyles(worksheet);
    this.downloadFile(fileName);
    this._resetData();
  }
  private _applyStyles(worksheet: ExcelJS.Worksheet): void {
    super.applyStyles('fffefd32');
    const columnsToBeWraped = [
      'dppkInDate',
      'dppkInTime',
      'jenisJaminan',
      'keterangan',
      'transaksi',
      'fasilitas',
      'ccy',
      'nominal',
      'dppkOutDate',
      'dppkOutTime',
      'checkerOutDate',
      'checkerOutTime',
      'approvalOutDate',
      'approvalOutTime',
      'tglEfektifFas',
    ];
    columnsToBeWraped.forEach(column => {
      this.worksheet.getColumn(column).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };

      const columnValue = this.worksheet.getColumn(column);

      const newValue = columnValue.values.map(value => {
        if (value) {
          return this._clearEmptyEntries(value.toString());
        }
        return value;
      });

      columnValue.values = newValue;
    });
  }
  private _convertDate(date: string): string {
    if (!date) {
      return '';
    }
    return moment(date).format('DD-MM-YYYY');
  }
  private _convertTime(time: string): string {
    if (!time) {
      ('');
    }
    return time.slice(0, 5);
  }
}
