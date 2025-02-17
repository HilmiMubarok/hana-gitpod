import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../abstract-excel-report';

@Component({
  selector: 'jhi-mis-sla-credit-insurance',
  templateUrl: './mis-sla-credit-insurance.component.html',
  styleUrls: ['./mis-sla-credit-insurance.css', '../mis-report.css'],
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
export class MisSLACreditInsuranceComponent extends AbstractExcelMISReport implements OnInit {
  public lovStatus = [];
  listOfValue = [];
  public lovUsername = [];
  public misCp: FormGroup;
  allSelected = false;
  public allSelectedUsername = false;

  changeOption(event) {
    console.log('test', event.value);
  }
  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    super(misReportService);

    this.misCp = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      status: new FormControl(''),
      username: new FormControl(''),
    });
    this.misCp.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misCp.get('date1').setValue(formattedDate, { emitEvent: false });
      }
    });
    this.misCp.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.misCp.get('date2').setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  public previousState(): void {
    window.history.back();
  }

  ngOnInit(): void {
    this.getStatusLOV('MIS_SLA_INSURANCE').subscribe({
      next: res => (this.lovStatus = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Statuses' });
      },
    });
    this.getUsernameLOV('INSURANCE_ADMIN').subscribe({
      next: res => (this.lovUsername = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get List Username' });
      },
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.misCp.get('status')?.setValue([...this.lovStatus.map(status => status.statusId)]);
    } else {
      this.misCp.get('status')?.setValue('');
    }
  }

  public toggleSelectUsernameAll(): void {
    this.allSelectedUsername = !this.allSelectedUsername;
    if (this.allSelectedUsername) {
      this.misCp.get('username')?.setValue([...this.lovUsername.map(username => username.userLogin)]);
    } else {
      this.misCp.get('username')?.setValue('');
    }
  }

  public searchResult = null;
  displayedColumns: string[] = ['proposalNumber', 'cif', 'debtorName', 'customerType', 'proposalDate'];

  convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  dateRangeHasValue(): boolean {
    return this.misCp.get('date1')?.value && this.misCp.get('date2')?.value;
  }

  clearDateRange(): void {
    this.misCp.get('date1')?.reset();
    this.misCp.get('date2')?.reset();
  }

  generateMISSLAInsurance() {
    this.misReportService.setLoading(true);
    const params = {
      startDate: this.misCp.get('date1')?.value,
      endDate: this.misCp.get('date2')?.value,
      status: this._convertStatusToString(this.misCp.get('status')?.value),
      userLogin: this.misCp.get('username')?.value ? this._convertStatusToString(this.misCp.get('username')?.value) : null,
      type: 'STATELOG',
    };

    this.misReportService.getMISReportCPCredam(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_SLA_CREDIT_INSURANCE'),
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
    // const worksheet = workbook.addWorksheet('Sheet 1');

    // this._setUpColumns(worksheet);
    this.setUpColumns(this.columns);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this.applyStyles('ff2c9a48');
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(data);

    this._applyStyles();
    this.downloadFile(fileName);
    this._resetData();
  }

  get columns(): any[] {
    return [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'PIC Credit Insurance', key: 'picCreditIns', width: 35 },
      { header: 'Debtor', key: 'debtor', width: 35 },
      { header: 'Transaksi Kredit', key: 'transaksiKredit', width: 15 },
      { header: 'DAR Issued Date', key: 'darIssuedDate', width: 25 },
      { header: 'DAR Issued Time', key: 'darIssuedTime', width: 25 },
      { header: 'Maker In Date', key: 'makerInDate', width: 25 },
      { header: 'Maker In Time', key: 'makerInTime', width: 20 },
      { header: 'Maker Out Date', key: 'makerOutDate', width: 20 },
      { header: 'Maker Out Time', key: 'makerOutTime', width: 20 },
      { header: 'Approval Out Name', key: 'approvalOutName', width: 25 },
      { header: 'Approval Out Date', key: 'approvalOutDate', width: 20 },
      { header: 'Approval Out Time', key: 'approvalOutTime', width: 20 },
      { header: 'TAT Days', key: 'tatDays', width: 10 },
      { header: 'TAT Time', key: 'tatTime', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Jaminan Tipe', key: 'jaminanTipe', width: 20 },
      { header: 'CCY', key: 'ccy', width: 10 },
      { header: 'MV Bangunan', key: 'mvBangunan', width: 20 },
      { header: 'Transaksi', key: 'transaksi', width: 15 },
      { header: 'Tipe', key: 'tipe', width: 20 },
      { header: 'Ccy', key: 'currency', width: 10 },
      { header: 'NP', key: 'np', width: 15 },
      { header: 'Jatuh Tempo', key: 'jatuhTempo', width: 15 },
      { header: 'Keterangan', key: 'keterangan', width: 50 },
      { header: 'Segmentasi', key: 'segment', width: 15 },
      { header: 'Branch', key: 'branch', width: 25 },
      { header: 'RM', key: 'rm', width: 25 },
    ];
  }

  protected processData(data: any[]): void {
    const statuses = ['OL Distribution'];
    const sortedCreditProposals = this.sortCreditProposalByEarliestDate(data, statuses);

    sortedCreditProposals.forEach((proposal, index) => {
      this._addProposalData(this.worksheet, proposal, index);
    });
  }

  private _getMakerInDateFiltered(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    return timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Checking')
      .map((item: any) => {
        const date = new Date(item.fromDate);
        if (isNaN(date.getTime())) {
          return '';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      })
      .filter(Boolean)
      .join(',\n');
  }

  private _getMakerInDateFilteredLast(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    const data = timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Checking')
      .map((item: any) => {
        const date = new Date(item.fromDate);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      })
      .filter(Boolean);

    return data.length ? data[data.length - 1] : '';
  }

  private _getMakerInDateFilteredFirst(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    const data = timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Checking')
      .map((item: any) => {
        const date = new Date(item.fromDate);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      })
      .filter(Boolean);

    return data.length ? data[0] : '';
  }

  private _getMakerInTimeFiltered(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    return timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Checking')
      .sort((a: any, b: any) => {
        const [hourA, minuteA] = a.fromTime.split(':').map(Number);
        const [hourB, minuteB] = b.fromTime.split(':').map(Number);

        return hourA !== hourB ? hourA - hourB : minuteA - minuteB;
      })
      .map((item: any) => {
        const [hour, minute] = item.fromTime.split(':');
        return `${hour}:${minute}`;
      })
      .join(',\n');
  }

  private _getMakerOutDateFiltered(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    return timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Review')
      .map((item: any) => {
        const date = new Date(item.fromDate);
        if (isNaN(date.getTime())) {
          return '';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      })
      .filter(Boolean)
      .join(',\n');
  }

  private _getMakerOutTimeFiltered(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    return timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Review')
      .sort((a: any, b: any) => {
        const [hourA, minuteA] = a.fromTime.split(':').map(Number);
        const [hourB, minuteB] = b.fromTime.split(':').map(Number);

        return hourA !== hourB ? hourA - hourB : minuteA - minuteB;
      })
      .map((item: any) => {
        const [hour, minute] = item.fromTime.split(':');
        return `${hour}:${minute}`;
      })
      .join(',\n');
  }

  private _getApprovalOutNameFiltered(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    return timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Complete')
      .map((item: any) => item.personName)
      .join(',\n');
  }

  private _getPICCreditInsNameFiltered(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    const data = timeLineInsurance
      .filter((item: any) => item.fromStatusDescription === 'Insurance Checking')
      .map((item: any) => item.personName);

    return data.length ? data[data.length - 1] : '';
  }

  private _getApprovalOutDateFiltered(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    return timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Complete')
      .map((item: any) => {
        const date = new Date(item.fromDate);
        if (isNaN(date.getTime())) {
          return '';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      })
      .filter(Boolean)
      .join(',\n');
  }

  private _getApprovalOutDateFilteredLast(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    const data = timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Complete')
      .map((item: any) => {
        const date = new Date(item.fromDate);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      })
      .filter(Boolean);

    return data.length ? data[data.length - 1] : '';
  }

  private _getApprovalOutTimeFiltered(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    return timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Complete')
      .map((item: any) => {
        const timeParts = item.fromTime?.split(':');
        if (!timeParts || timeParts.length < 2) {
          return '';
        }
        const hours = timeParts[0].padStart(2, '0');
        const minutes = timeParts[1].padStart(2, '0');
        return `${hours}:${minutes}`;
      })
      .filter(Boolean)
      .join(',\n');
  }

  private _getApprovalOutTimeFilteredLast(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    const data = timeLineInsurance.filter((item: any) => item.statusDescription === 'Insurance Complete').map((item: any) => item.fromTime);

    return data.length ? data[data.length - 1] : '';
  }

  private _getDarIssuedTimeFiltered(timeLineCreditProposal: any[]): string {
    if (!Array.isArray(timeLineCreditProposal)) {
      return '';
    }

    return timeLineCreditProposal
      .filter((item: any) => item.statusDescription === 'OL Distribution')
      .map((item: any) => {
        const time = item.fromTime;

        const timeParts = time.split(':');
        if (timeParts.length !== 3) {
          console.error(`Invalid time format: ${item.fromTime}`);
          return '';
        }

        const hours = timeParts[0].padStart(2, '0');
        const minutes = timeParts[1].padStart(2, '0');
        return `${hours}:${minutes}`;
      })
      .filter(Boolean)
      .join(',\n');
  }

  private _getDarIssuedTimeFilteredLast(timeLineCreditProposal: any[]): string {
    if (!Array.isArray(timeLineCreditProposal)) {
      return '';
    }

    const data = timeLineCreditProposal
      .filter((item: any) => item.statusDescription === 'OL Distribution')
      .map((item: any) => item.fromTime);

    return data.length ? data[data.length - 1] : '';
  }

  private _getDarIssuedDateFiltered(timeLineCreditProposal: any[]): string {
    if (!Array.isArray(timeLineCreditProposal)) {
      return '';
    }

    const filteredDates = timeLineCreditProposal.filter((item: any) => item.statusDescription === 'OL Distribution');

    filteredDates.sort((a: any, b: any) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

    const formattedDates = filteredDates
      .map((item: any) => {
        const date = new Date(item.fromDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      })
      .join(',\n');

    return formattedDates;
  }

  private _getDarIssuedDateFilteredLast(timeLineCreditProposal: any[]): string {
    if (!Array.isArray(timeLineCreditProposal)) {
      return '';
    }

    const data = timeLineCreditProposal
      .filter((item: any) => item.statusDescription === 'OL Distribution')
      .map((item: any) => {
        const date = new Date(item.fromDate);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      })
      .filter(Boolean);

    return data.length ? data[data.length - 1] : '';
  }

  private _getFilteredCollateralType(collateral: any[]): string {
    if (!Array.isArray(collateral)) {
      return '';
    }

    const allowedTypes = ['Real Estate', 'Personal Properties', 'Personal Property Vehicle', 'Personal Property Machine'];

    return collateral
      .filter(item => item.collateralTypeInsurance === 'true' && allowedTypes.includes(item.collateralType))
      .map(item => item.collateralCode)
      .join(',\n');
  }

  private _addProposalData(ws: ExcelJS.Worksheet, prop: any, idx: number): void {
    const startRow = ws.rowCount;

    let counter = startRow;

    const debtorName = prop.debtorName || '';

    prop.collateral
      ?.filter(col => col.partyName === debtorName)
      .forEach((col: any) => {
        col.collateralInsurance?.forEach((insurance: any, index: number) => {
          const firstMakerInDdate = this._getMakerInDateFilteredFirst(prop.timeLineInsurance);
          const latestApprovalOutDate = this._getApprovalOutDateFilteredLast(prop.timeLineInsurance);
          const latestApprovalOutTime = this._getApprovalOutTimeFilteredLast(prop.timeLineInsurance);
          const latestDarIssuedDate = this._getDarIssuedDateFilteredLast(prop.timeLineCreditProposal);
          const latestDarIssuedTime = this._getDarIssuedTimeFilteredLast(prop.timeLineCreditProposal);

          // Hitung TAT Days
          let tatDays = null;
          if (firstMakerInDdate && latestApprovalOutDate) {
            const makerDateParts = firstMakerInDdate.split('/');
            const approvalDateParts = latestApprovalOutDate.split('/');

            const makerDate = new Date(`${makerDateParts[2]}-${makerDateParts[1]}-${makerDateParts[0]}`);
            const approvalDate = new Date(`${approvalDateParts[2]}-${approvalDateParts[1]}-${approvalDateParts[0]}`);

            tatDays = Math.ceil(Math.abs(approvalDate.getTime() - makerDate.getTime()) / (1000 * 60 * 60 * 24));
          }

          // hitung tat time
          const formatDate = (date: string | undefined | null) => {
            if (!date || typeof date !== 'string' || !date.includes('/')) {
              return '';
            }

            const parts = date.split('/');
            if (parts.length < 3) {
              return '';
            }

            const [day, month, year] = parts;

            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          };

          const formatTime = (time: string) => time || '00:00:00';

          const latestApprovalOutDateISO = formatDate(latestApprovalOutDate);
          const latestApprovalOutTimeISO = formatTime(latestApprovalOutTime);
          const latestDarIssuedDateISO = formatDate(latestDarIssuedDate);
          const latestDarIssuedTimeISO = formatTime(latestDarIssuedTime);

          const fromDateTime = `${latestApprovalOutDateISO}T${latestApprovalOutTimeISO}`;
          const darIssuedDateTime = `${latestDarIssuedDateISO}T${latestDarIssuedTimeISO}`;

          const fromDateTimeObject = new Date(`${fromDateTime}+07:00`); // GMT+7
          const targetDate =
            tatDays === 0 ? new Date(`${darIssuedDateTime}+07:00`) : new Date(`${latestApprovalOutDateISO}T08:00:00+07:00`);

          let tatTime = '';
          if (!isNaN(fromDateTimeObject.getTime()) && !isNaN(targetDate.getTime())) {
            const differenceMs = fromDateTimeObject.getTime() - targetDate.getTime();
            const hours = Math.floor(differenceMs / (1000 * 60 * 60));
            const minutes = Math.floor(Math.abs((differenceMs % (1000 * 60 * 60)) / (1000 * 60)));
            tatTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          }

          const dataRow = {
            no: counter++,
            debtor: prop.debtorName || '',
            picCreditIns: this._getPICCreditInsNameFiltered(prop.timeLineInsurance),
            transaksiKredit: prop.product?.map((prod: any) => prod.pengajuan).join(',\n') || '',
            makerInDate: this._getMakerInDateFiltered(prop.timeLineInsurance),
            makerInTime: this._getMakerInTimeFiltered(prop.timeLineInsurance),
            makerOutDate: this._getMakerOutDateFiltered(prop.timeLineInsurance),
            makerOutTime: this._getMakerOutTimeFiltered(prop.timeLineInsurance),
            approvalOutName: this._getApprovalOutNameFiltered(prop.timeLineInsurance),
            approvalOutDate: this._getApprovalOutDateFiltered(prop.timeLineInsurance),
            approvalOutTime: this._getApprovalOutTimeFiltered(prop.timeLineInsurance),
            darIssuedTime: this._getDarIssuedTimeFiltered(prop.timeLineCreditProposal),
            darIssuedDate: this._getDarIssuedDateFiltered(prop.timeLineCreditProposal),
            status: prop.statusInsuranceDescription || '',
            jaminanTipe: this._getFilteredCollateralType(prop.collateral),
            ccy: col.collateralProperty?.marketValueOriginalCcy || '',
            mvBangunan: col.collateralProperty?.marketValueOriginal || '',
            transaksi: col.collateralStatus || '',
            tipe: insurance.insuranceTypeName || '',
            currency: insurance.currency || '',
            np: insurance.insuranceAmount || '',
            jatuhTempo: insurance.expDate
              ? (() => {
                  const date = new Date(insurance.expDate);
                  if (isNaN(date.getTime())) {
                    return '';
                  }
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  return `${day}-${month}-${year}`;
                })()
              : '',

            keterangan: insurance.remarks || '',
            segment: prop.regionalParentRM || '',
            branch: prop.bookingBranchName || '',
            rm: `${prop.rmFirstName || ''} ${prop.rmLastName || ''}`,
            tatDays,
            tatTime,
          };

          ws.addRow(dataRow);
        });
      });
  }

  private _mergeCells(worksheet: ExcelJS.Worksheet, startRow: number, rowCount: number, columns: string[]): void {
    columns.forEach(column => {
      worksheet.mergeCells(startRow, worksheet.getColumn(column).number, startRow + rowCount - 1, worksheet.getColumn(column).number);
    });
  }

  private _applyStyles(): void {
    super.applyStyles('ff2c9a48');
    const columnsToBeWraped = [
      'makerInDate',
      'makerInTime',
      'makerOutDate',
      'makerOutTime',
      'jaminanTipe',
      'keterangan',
      'transaksiKredit',
    ];
    this.columns.forEach(column => {
      const col = this.worksheet.getColumn(column.key);

      col.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };

      const columnValue = this.worksheet.getColumn(column.key);

      const newValue = columnValue.values.map(value => {
        if (value) {
          return this._clearEmptyEntries(value.toString());
        }
        return value;
      });

      columnValue.values = newValue;
    });
  }
}
