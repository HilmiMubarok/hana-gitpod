import { Component } from '@angular/core';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { AbstractExcelMISReport } from '../abstract-excel-report';

@Component({
  selector: 'jhi-mis-appraisal-bsu',
  templateUrl: './mis-appraisal-bsu.component.html',
  styleUrls: ['./mis-appraisal-bsu.css', '../mis-report.css'],
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
export class MisAppraisalBsuComponent extends AbstractExcelMISReport {
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
    super(misReportService);

    this.MISReportAppraisal = new FormGroup({
      date1: new FormControl('', [Validators.required]),
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
    this.misReportService.getStatuses('MIS_APPRAISAL_BSU').subscribe({
      next: res => (this.lovStatusAppraisal = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Status Appraisals' });
      },
    });
  }

  getOfficerSurveyors() {
    this.misReportService.getOfficerSurveyors().subscribe({
      next: res => {
        this.lovOfficerSurveyor = res.sort((a: any, b: any) => a.employeeFirstName?.localeCompare(b.employeeFirstName));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get Officer Surveyors',
        });
      },
    });
  }

  // getBoundaries() {
  //   this.misReportService.getGeoBoundaries().subscribe({
  //     next: res => (this.lovGeo = res),
  //     error: () => {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get Geo Boundaries' });
  //     },
  //   });
  // }

  getBoundaries() {
    this.misReportService.getGeoBoundaries().subscribe({
      next: res => {
        this.lovGeo = res.sort((a: any, b: any) => a.description.localeCompare(b.description));
      },
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

  protected processData(data: any[]): void {
    data.forEach((proposal, index) => {
      this._processGenerate;
    });
  }

  generateMISReportAppraisalBsu() {
    if (this.MISReportAppraisal.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in both Start Date and End Date.',
      });
      return;
    }

    if (!this.MISReportAppraisal.get('statusAppraisal')?.value || this.MISReportAppraisal.get('statusAppraisal')?.value.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Please select at least one status before generating the report',
      });
      return;
    }

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
      next: res => this._processGenerate(res.body, 'MIS_Appraisal_BSU'),
      error: error => {
        console.error('Error: ', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate document' });
        this._resetData();
        this.misReportService.setLoading(false);
      },
      complete: () => {
        this._resetData();
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
      { header: 'Segment', key: 'segment', width: 25 },
      { header: 'Branch', key: 'branch', width: 22 },
      { header: 'Marketing', key: 'marketing', width: 30 },
      { header: 'Customer Name', key: 'customerName', width: 30 },
      { header: 'ID', key: 'collateralId', width: 5 },
      { header: 'Collateral Type', key: 'collateralType', width: 20 },
      { header: 'Collateral', key: 'collateral', width: 15 },
      { header: 'Certificate Number', key: 'certificateNumber', width: 70 },
      { header: 'Property Usage', key: 'propertyUsage', width: 15 },
      { header: 'Marketability', key: 'marketAbility', width: 15 },
      { header: 'Land Area Based on Physical Conditions', key: 'landAreaBasedOnPhysicalConditions', width: 40 },
      { header: 'Building Area Based on Physical Condition', key: 'buildingAreaBasedOnPhysicalCondition', width: 40 },
      { header: 'Market Value (MV) Land on Physical Condition', key: 'marketValueLandPhysicalCondition', width: 40 },
      { header: 'Market Value (MV) Building on Physical Condition', key: 'marketValueBuildingPhysicalCondition', width: 45 },
      { header: 'Liquidation Value (LV) Land on Physical Condition', key: 'liquidationValueLandPhysicalCondition', width: 45 },
      { header: 'Liquidation Value (LV) Building on Physical Condition', key: 'liquidationValueBuildingPhysicalCondition', width: 50 },
      { header: 'Land Area Based on IMB', key: 'landAreaBasedOnIMB', width: 30 },
      { header: 'Building Area Based on IMB', key: 'buildingAreaBasedOnIMB', width: 30 },
      { header: 'Market Value (MV) Land on IMB', key: 'marketValueLandPhysicalConditionIMB', width: 30 },
      { header: 'Market Value (MV) Building on IMB', key: 'marketValueBuildingPhysicalConditionIMB', width: 40 },
      { header: 'Liquidation Value (LV) Land on IMB', key: 'liquidationValueLandPhysicalConditionIMB', width: 40 },
      { header: 'Liquidation Value (LV) Building on IMB', key: 'liquidationValueBuildingPhysicalConditionIMB', width: 40 },
      { header: 'Location', key: 'location', width: 30 },
      { header: 'Village', key: 'village', width: 30 },
      { header: 'District', key: 'district', width: 30 },
      { header: 'City', key: 'city', width: 30 },
      { header: 'Province', key: 'provinceName', width: 22 },
      { header: 'Appraisal Type', key: 'appraisalType', width: 14 },
      { header: 'Type of Application', key: 'typeOfApplication', width: 20 },
      { header: 'Plafond', key: 'plafond', width: 20 },
      { header: 'Credit Maturity Date', key: 'creditMaturityDate', width: 15 },
      { header: 'Appraiser', key: 'appraiser', width: 35 },
      { header: 'Market Value (MV)', key: 'nilaiMV', width: 20 },
      { header: 'Liquidation Value (LV)', key: 'nilaiLV', width: 20 },
      { header: 'KJPP', key: 'kjppName', width: 35 },
      { header: 'KJPP Market Value (MV)', key: 'totalMVKJPP', width: 25 },
      { header: 'KJPP Liquidation Value (LV)', key: 'totalLVKJPP', width: 25 },
      { header: 'Date of Application', key: 'tanggalPermohonan', width: 19 },
      { header: 'Visited Date', key: 'visitedDate', width: 15 },
      { header: 'Assessment Date', key: 'tanggalPenilaian', width: 15 },
      { header: 'Report Date', key: 'tanggalLaporan', width: 15 },
      { header: 'Reviewer', key: 'reviewer', width: 35 },
      { header: 'Negative List Collateral', key: 'negativeList', width: 35 },
      { header: 'Timeline', key: 'timeline', width: 65 },
      { header: 'Status', key: 'status', width: 25 },
    ];

    data.forEach((row, index) => {
      const visitedTimeline = row.timeLine
        ?.filter(timeline => timeline.statusDescription === 'Visited')
        .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

      const visitedDate = visitedTimeline?.[0]?.fromDate || '';

      const approvalTimeline = row.timeLine
        ?.filter(timeline => timeline.statusDescription === 'Approval Team Leader')
        .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

      const tanggalPenilaian = approvalTimeline?.[0]?.fromDate || '';

      const approvedTimeline = row.timeLine
        ?.filter(timeline => timeline.statusDescription === 'Approved')
        .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime());

      const tanggalLaporan = approvedTimeline?.[0]?.fromDate || '';

      worksheet.addRow({
        no: index + 1 || '',
        appraisalNumber: row.appraisalNumber || '',
        segment: row.segmentRMName || '',
        branch: row.branch || '',
        marketing: row.marketing || '',
        customerName: row.customerName || '',
        collateralId: row.collateral[0]?.id || '',
        collateralType: row.collateral[0]?.collateralType || '',
        collateral: row.collateral[0]?.collateral || '',
        certificateNumber: row.collateral[0]?.landCertificates?.map(cert => cert.certNumber).join('\n') || '',
        propertyUsage: row.collateral[0]?.propertyUsage || '',
        marketAbility:
          row.marketAbility === 'baik' ? 'Good' : row.marketAbility === 'cukup' ? 'Fair' : row.marketAbility === 'kurang' ? 'Minus' : '',
        landAreaBasedOnPhysicalConditions:
          row.collateral[0]?.propertyDetail[0]?.landInternal?.map(land => `${land.landSizePerCertificate || ''} m²`).join('\n') || '',
        buildingAreaBasedOnPhysicalCondition:
          row.collateral[0]?.propertyDetail[0]?.buildingInternal?.map(building => `${building.area || ''} m²`).join('\n') || '',
        marketValueLandPhysicalCondition:
          row.collateral[0]?.propertyDetail[0]?.landInternal?.map(mvPhysical => `${mvPhysical.propertyMarketValue || ''}`).join('\n') || '',
        marketValueBuildingPhysicalCondition:
          row.collateral[0]?.propertyDetail[0]?.buildingInternal
            ?.map(mvBuilding => `${mvBuilding.propertyMarketValue || ''} `)
            .join('\n') || '',
        liquidationValueLandPhysicalCondition:
          row.collateral[0]?.propertyDetail[0]?.landInternal?.map(lvPhysical => `${lvPhysical.liquidationValue || ''}`).join('\n') || '',
        liquidationValueBuildingPhysicalCondition:
          row.collateral[0]?.propertyDetail[0]?.buildingInternal?.map(lvBuilding => `${lvBuilding.liquidationValue || ''} `).join('\n') ||
          '',
        landAreaBasedOnIMB:
          row.collateral[0]?.propertyDetail[0]?.landInternal?.map(landIMB => `${landIMB.landSizePerCertificate || ''} m²`).join('\n') || '',
        buildingAreaBasedOnIMB:
          row.collateral[0]?.propertyDetail[0]?.buildingInternal?.map(buildingIMB => `${buildingIMB.area || ''} m²`).join('\n') || '',
        marketValueLandPhysicalConditionIMB:
          row.collateral[0]?.propertyDetail[0]?.landInternal
            ?.map(mvPhysicalIMB => `${mvPhysicalIMB.propertyMarketValueIMB || ''}`)
            .join('\n') || '',
        marketValueBuildingPhysicalConditionIMB:
          row.collateral[0]?.propertyDetail[0]?.buildingInternal
            ?.map(mvBuildingIMB => `${mvBuildingIMB.propertyMarketValueIMB || ''} `)
            .join('\n') || '',
        liquidationValueLandPhysicalConditionIMB:
          row.collateral[0]?.propertyDetail[0]?.landInternal?.map(lvPhysicalIMB => `${lvPhysicalIMB.totalLVIMB || ''}`).join('\n') || '',
        liquidationValueBuildingPhysicalConditionIMB:
          row.collateral[0]?.propertyDetail[0]?.buildingInternal?.map(lvBuildingIMB => `${lvBuildingIMB.totalLVIMB || ''} `).join('\n') ||
          '',
        location: row.collateral[0]?.location || '',
        village: row.collateral[0]?.villageName || '',
        district: row.collateral[0]?.districtName || '',
        city: row.collateral[0]?.city || '',
        provinceName: row.collateral[0]?.provinceName || '',
        appraisalType: row.appraisalType || '',
        plafond: row.plafond || '',
        creditMaturityDate: row.tglJatemKredit || '',
        appraiser: row.appraiser || '',
        nilaiMV: row.totalMVInternal || '',
        nilaiLV: row.totalLiquidationInternal || '',
        kjppName: row.kjppName || '',
        totalMVKJPP: row.totalMVKJPP || '',
        totalLVKJPP: row.totalLVKJPP || '',
        tanggalPermohonan: row.appraisalDate || '',
        visitedDate,
        tanggalPenilaian,
        tanggalLaporan,
        reviewer: row.reviewerBy || '',
        negativeList: row.scoreCard[0]?.criteria || '',
        timeline:
          row.timeLine
            ?.slice(1)
            ?.map(
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

    worksheet.getColumn('negativeList').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('liquidationValueBuildingPhysicalConditionIMB').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    worksheet.getColumn('liquidationValueLandPhysicalConditionIMB').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    worksheet.getColumn('liquidationValueBuildingPhysicalCondition').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    worksheet.getColumn('marketValueBuildingPhysicalConditionIMB').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    worksheet.getColumn('marketValueLandPhysicalConditionIMB').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    worksheet.getColumn('buildingAreaBasedOnIMB').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('landAreaBasedOnIMB').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('liquidationValueLandPhysicalCondition').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('marketValueBuildingPhysicalCondition').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('marketValueLandPhysicalCondition').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('landAreaBasedOnPhysicalConditions').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('buildingAreaBasedOnPhysicalCondition').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getColumn('timeline').alignment = { wrapText: true, vertical: 'middle' };
    worksheet.getColumn('location').alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

    const timelineColumnIndex = worksheet.columns.findIndex(column => column.header === 'Timeline') + 1;
    if (timelineColumnIndex > 0) {
      worksheet.getRow(1).getCell(timelineColumnIndex).alignment = { vertical: 'middle', horizontal: 'center' };
    }

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
