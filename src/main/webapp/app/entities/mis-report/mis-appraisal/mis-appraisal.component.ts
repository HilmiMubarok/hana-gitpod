import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'jhi-mis-appraisal',
  templateUrl: './mis-appraisal.component.html',
  styleUrls: ['./mis-appraisal.css', '../mis-report.css'],
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
export class MisAppraisalComponent {
  public lovStatusAppraisal = [];
  public lovOfficerSurveyor = [];
  public lovAppraisalType: string[] = ['Internal', 'External'];
  public lovGeo = [];
  data = '';
  date1: any;
  date2: any;
  allSelectedGeo = false;
  allSelectedAppraisal = false;
  allSelectedOfficerSurveyor = false;
  allSelectedAppraisalType = false;
  MISReportAppraisal: FormGroup;

  constructor(public misReportService: MisReportService, public messageService: MessageService) {
    this.MISReportAppraisal = new FormGroup({
      date1: new FormControl(''),
      date2: new FormControl(''),
      geoBoundaries: new FormControl(null),
      statusAppraisal: new FormControl(''),
      officerSurveyor: new FormControl(null),
      appraisalType: new FormControl(null),
    });

    this.MISReportAppraisal.get('date1')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportAppraisal.get('date1')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportAppraisal.get('date2')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportAppraisal.get('date2')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportAppraisal.get('statusAppraisal')?.valueChanges.subscribe(statusAppraisal => {
      if (typeof statusAppraisal === 'object' && statusAppraisal.length === 0) {
        this.MISReportAppraisal.get('statusAppraisal')?.setValue('');
      }
    });

    this.MISReportAppraisal.get('geoBoundaries')?.valueChanges.subscribe(geoBoundaries => {
      if (typeof geoBoundaries === 'object' && geoBoundaries.length === 0) {
        this.MISReportAppraisal.get('geoBoundaries')?.setValue(null);
      }
    });

    this.MISReportAppraisal.get('officerSurveyor')?.valueChanges.subscribe(officerSurveyor => {
      if (typeof officerSurveyor === 'object' && officerSurveyor.length === 0) {
        this.MISReportAppraisal.get('officerSurveyor')?.setValue(null);
      }
    });

    this.MISReportAppraisal.get('appraisalType')?.valueChanges.subscribe(appraisalType => {
      if (typeof appraisalType === 'object' && appraisalType.length === 0) {
        this.MISReportAppraisal.get('appraisalType')?.setValue(null);
      }
    });

    this.getStatusesAppraisal();
    this.getBoundaries();
    this.getOfficerSurveyors();
  }

  getStatusesAppraisal() {
    this.misReportService.getStatuses('MIS_APPRAISAL').subscribe({
      next: res => (this.lovStatusAppraisal = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Status Appraisals' });
      },
    });
  }

  getOfficerSurveyors() {
    this.misReportService.getOfficerSurveyors().subscribe({
      next: res => (this.lovOfficerSurveyor = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Officer Surveyors' });
      },
    });
  }

  getBoundaries() {
    this.misReportService.getGeoBoundaries().subscribe({
      next: res => (this.lovGeo = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Geo Boundaries' });
      },
    });
  }

  toggleSelectAllAppraisal(): void {
    this.allSelectedAppraisal = !this.allSelectedAppraisal;
    if (this.allSelectedAppraisal) {
      this.MISReportAppraisal.get('statusAppraisal')?.setValue([
        ...this.lovStatusAppraisal.map(statusAppraisal => statusAppraisal.statusId),
      ]);
    } else {
      this.MISReportAppraisal.get('statusAppraisal')?.setValue('');
    }
  }

  toggleSelectAllOfficerSurveyor(): void {
    this.allSelectedOfficerSurveyor = !this.allSelectedOfficerSurveyor;
    if (this.allSelectedOfficerSurveyor) {
      this.MISReportAppraisal.get('officerSurveyor')?.setValue([...this.lovOfficerSurveyor.map(officerSurveyor => officerSurveyor.id)]);
    } else {
      this.MISReportAppraisal.get('officerSurveyor')?.setValue(null);
    }
  }

  toggleSelectAllGeo(): void {
    this.allSelectedGeo = !this.allSelectedGeo;
    if (this.allSelectedGeo) {
      this.MISReportAppraisal.get('geoBoundaries')?.setValue([...this.lovGeo.map(geoBoundaries => geoBoundaries.id)]);
    } else {
      this.MISReportAppraisal.get('geoBoundaries')?.setValue(null);
    }
  }

  toggleSelectAllAppraisalType(): void {
    this.allSelectedAppraisalType = !this.allSelectedAppraisalType;
    if (this.allSelectedAppraisalType) {
      this.MISReportAppraisal.get('appraisalType')?.setValue([...this.lovAppraisalType]);
    } else {
      this.MISReportAppraisal.get('appraisalType')?.setValue(null);
    }
  }

  public previousState(): void {
    window.history.back();
  }

  private _convertLov(lov: Array<string> | null | string): string {
    if (lov === null) {
      return null;
    }

    if (typeof lov === 'string') {
      return '';
    }

    if (lov.length === 0) {
      return '';
    }
    return lov.join(',');
  }

  generateMISReportAppraisal() {
    this.misReportService.setLoading(true);
    const params = {
      startDate: this.MISReportAppraisal.get('date1')?.value,
      endDate: this.MISReportAppraisal.get('date2')?.value,
      status: this._convertLov(this.MISReportAppraisal.get('statusAppraisal')?.value),
      city: this._convertLov(this.MISReportAppraisal.get('geoBoundaries')?.value),
      officerSurveyor: this._convertLov(this.MISReportAppraisal.get('officerSurveyor')?.value),
      appraisalType: this._convertLov(this.MISReportAppraisal.get('appraisalType')?.value),
    };

    this.misReportService.getMISReportAppraisal(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Appraisal'),
      error: error => {
        console.error('Error: ', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate document' });
        this.misReportService.setLoading(false);
      },
    });
  }

  _processTimelinePersonName(personName: string) {
    // convert string into array by spliting it by space
    const personNameArray = personName.split(' ');

    // Check if the array has null value, if true, remove the null
    const filteredPersonNameArray = personNameArray.filter(name => name !== 'null');

    // Join the array into string
    return filteredPersonNameArray.join(' ');
  }

  private _processGenerate(data, outputName: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add header Columns
    worksheet.columns = [
      { header: 'No.', key: 'no', width: 5 },
      { header: 'Appraisal Number', key: 'appraisalNumber', width: 17 },
      { header: 'Appraisal Date', key: 'appraisalDate', width: 14 },
      { header: 'Branch', key: 'branch', width: 22 },
      { header: 'Marketing', key: 'marketing', width: 35 },
      { header: 'Customer Name', key: 'customerName', width: 35 },
      { header: 'ID', key: 'collateralId', width: 5 },
      { header: 'Collateral Type', key: 'collateralType', width: 25 },
      { header: 'Collateral', key: 'collateral', width: 22 },
      { header: 'Location', key: 'location', width: 50 },
      { header: 'Kelurahan', key: 'kelurahan', width: 22 },
      { header: 'Kecamatan', key: 'kecamatan', width: 22 },
      { header: 'Kabupaten / Kota', key: 'city', width: 22 },
      { header: 'Provinsi', key: 'provinceName', width: 22 },
      { header: 'Appraisal Type', key: 'appraisalType', width: 14 },
      { header: 'Jenis Permohonan', key: 'jenisPermohonan', width: 20 },
      { header: 'Plafond', key: 'plafond', width: 20 },
      { header: 'Tgl. Jatem Kredit', key: 'tglJatemKredit', width: 15 },
      { header: 'Appraiser', key: 'appraiser', width: 35 },
      { header: 'Nilai MV', key: 'nilaiMV', width: 20 },
      { header: 'Nilai LV', key: 'nilaiLV', width: 20 },
      { header: 'Nama KJPP', key: 'kjppName', width: 35 },
      { header: 'Nilai KJPP MV', key: 'totalMVKJPP', width: 20 },
      { header: 'Nilai KJPP LV', key: 'totalLVKJPP', width: 20 },
      { header: 'Reviewer', key: 'reviewer', width: 35 },
      { header: 'Timeline', key: 'timeline', width: 50 },
      { header: 'Status', key: 'status', width: 25 },
    ];

    // Add data to the sheet
    data.forEach((row, index) => {
      const timeLineData = row.timeLine ? row.timeLine.sort((a, b) => a.id - b.id) : [];
      worksheet.addRow({
        no: index + 1 || '',
        appraisalNumber: row.appraisalNumber || '',
        appraisalDate: row.appraisalDate || '',
        branch: row.branch || '',
        marketing: row.marketing || '',
        customerName: row.customerName || '',
        collateralId: row.collateral[0].id || '',
        collateralType: row.collateral[0].collateralType || '',
        collateral: row.collateral[0].collateral || '',
        location: row.collateral[0].location || '',
        kelurahan: row.collateral[0].villageName || '',
        kecamatan: row.collateral[0].districtName || '',
        city: row.collateral[0].city || '',
        provinceName: row.collateral[0].provinceName || '',
        appraisalType: row.appraisalType || '',
        jenisPermohonan: row.jenisPermohonan ? row.jenisPermohonan.map(jp => jp).join('\n') || '' : '',
        plafond: row.plafond || '',
        tglJatemKredit: row.tglJatemKredit || '',
        appraiser: row.appraiser || '',
        nilaiMV: row.totalMVInternal || '',
        nilaiLV: row.totalLiquidationInternal || '',
        namaKJPP: row.kjppName || '',
        nilaiKJPPMV: row.totalMVKJPP || '',
        nilaiKJPPLV: row.totalLVKJPP || '',
        reviewer: row.reviewerBy || '',
        timeline:
          timeLineData
            .map(
              timeline =>
                `${timeline.fromStatusDescription || ''} : ${timeline.fromDate || ''} : ${
                  this._processTimelinePersonName(timeline.personName) || ''
                }`
            )
            .join('\n') || '',
        status: row.status || '',
      });
    });

    worksheet.columns.forEach((column, index) => {
      worksheet.getCell(1, index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffa0c4e4' },
      };
      worksheet.getColumn(column.key as string | number).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // enable wrap text for timeline cell
    worksheet.getColumn('jenisPermohonan').alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('timeline').alignment = { wrapText: true };
    worksheet.getColumn('location').alignment = { wrapText: true };

    // Apply styles
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).height = 20;

    worksheet.eachRow({ includeEmpty: true }, row => {
      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Set the output name
    const date = new Date();
    const fileName = `${outputName}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;

    // Generate and save file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, fileName);
      this.misReportService.setLoading(false);
      this.misReportService.generateDocumentLabel.next('Generate Document');
    });
  }
}
