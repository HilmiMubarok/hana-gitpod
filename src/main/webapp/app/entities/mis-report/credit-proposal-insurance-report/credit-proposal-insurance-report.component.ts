import { Component, OnInit } from '@angular/core';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MisReportService } from '../mis-report.service';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import { InternalService } from 'app/entities/internal/internal.service';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { map } from 'rxjs';
@Component({
  selector: 'jhi-credit-proposal-insurance-report',
  templateUrl: './credit-proposal-insurance-report.component.html',
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

      :host ::ng-deep .ng-invalid:not(form) {
        border: none !important;
      }
    `,
  ],
})
export class CreditProposalInsuranceReportComponent extends AbstractExcelMISReport implements OnInit {
  public lovBusinessUnit = [];
  public lovUsername = [];
  public startDate: any;
  public endDate: any;
  public allSelected = false;
  public MISReportCPInsuranceReport: FormGroup;
  private readonly parentIds = ['10000'];
  constructor(public misReportService: MisReportService, public messageService: MessageService, public internalService: InternalService) {
    super(misReportService);
    this.MISReportCPInsuranceReport = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      businessUnit: new FormControl(''),
      username: new FormControl(null),
    });

    this.MISReportCPInsuranceReport.get('startDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCPInsuranceReport.get('startDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.MISReportCPInsuranceReport.get('endDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.MISReportCPInsuranceReport.get('endDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  dateRangeHasValue(): boolean {
    return this.MISReportCPInsuranceReport.get('startDate')?.value && this.MISReportCPInsuranceReport.get('endDate')?.value;
  }

  clearDateRange(): void {
    this.MISReportCPInsuranceReport.get('startDate')?.reset();
    this.MISReportCPInsuranceReport.get('endDate')?.reset();
  }

  get columns(): any[] {
    return [
      { header: 'No', key: 'no', width: 5 },
      { header: 'CIF Number', key: 'cifNumber', width: 15 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Collateral No', key: 'collateralNo', width: 20 },
      { header: 'Branch Code', key: 'branchCode', width: 10 },
      { header: 'Branch Name', key: 'branchName', width: 25 },
      { header: 'Business Unit', key: 'businessUnit', width: 25 },
      { header: 'Open Date', key: 'openDate', width: 15 },
      { header: 'Expiry Date', key: 'expiryDate1', width: 15 },
      { header: 'Approval Number', key: 'approvalNumber', width: 20 },
      { header: 'Name', key: 'productName', width: 20 },
      { header: 'Plafond', key: 'plafond', width: 15 },
      { header: 'Outstanding (IDR)', key: 'outstanding', width: 20 },
      { header: 'Collateral Type', key: 'collateralType', width: 15 },
      { header: 'Collateral Detail', key: 'collateralDetail', width: 20 },
      { header: 'Collateral Code', key: 'collateralCode', width: 20 },
      { header: 'Certificate Number', key: 'certificateNumber', width: 20 },
      { header: 'Location', key: 'location', width: 45 },
      { header: 'Collateral Owner', key: 'collateralOwner', width: 20 },
      { header: 'Insurance Number', key: 'insuranceNumber', width: 20 },
      { header: 'Insurance Code', key: 'insuranceCode', width: 15 },
      { header: 'Insurance Name', key: 'insuranceName', width: 20 },
      { header: 'Policy Number', key: 'policyNumber', width: 20 },
      { header: 'Expiry Date', key: 'expiryDate', width: 15 },
      { header: 'Insurance Currency', key: 'insuranceCurrency', width: 20 },
      { header: 'Insurance Amount', key: 'insuranceAmount', width: 20 },
      { header: 'Broker Name', key: 'brokerName', width: 25 },
      { header: 'Company Name', key: 'companyName', width: 25 },
      { header: 'Status Banker Clause', key: 'statusBankerClause', width: 25 },
      { header: 'Policy Document', key: 'policyDocument', width: 20 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 },
      { header: 'Time', key: 'time', width: 15 },
      { header: 'Operator Name', key: 'operatorName', width: 20 },
      { header: 'Remark', key: 'remark', width: 30 },
    ];
  }

  ngOnInit(): void {
    this.getUsernameLOV('INSURANCE_ADMIN').subscribe({
      next: res => (this.lovUsername = res),
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to get List Username' });
      },
    });

    this.internalService
      .queryFilterBy({
        idInternalType: APPLICATION_TYPE.BUSINESS_UNIT,
        size: 9999,
        page: 0,
      })
      .pipe(
        map(response => response.body),
        map(internals =>
          internals
            .filter(internal => this.parentIds.includes(String(internal.parentId)))
            .map(internal => ({ id: internal.id, name: internal.facilityName, parentId: internal.parentId }))
        )
      )
      .subscribe({
        next: data => (this.lovBusinessUnit = data),
        error: err => {
          console.error('Error Occurred when loading data:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
        },
      });
  }

  public toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      this.MISReportCPInsuranceReport.get('businessUnit')?.setValue([...this.lovBusinessUnit.map(status => status.id)]);
    } else {
      this.MISReportCPInsuranceReport.get('businessUnit')?.setValue('');
    }
  }

  private getFormValidationMessage(): string | null {
    const startDate = this.MISReportCPInsuranceReport.get('startDate');
    const endDate = this.MISReportCPInsuranceReport.get('endDate');

    const isDateRangeInvalid = startDate?.invalid || endDate?.invalid;

    if (isDateRangeInvalid) {
      return 'Please Select Date Range';
    }

    return null;
  }

  public generateMISReportCPInsuranceReport(): void {
    if (this.MISReportCPInsuranceReport.invalid) {
      const errorMessage = this.getFormValidationMessage();
      if (errorMessage) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        return;
      }
    }

    this.misReportService.setLoading(true);

    const params = {
      startDate: this.MISReportCPInsuranceReport.get('startDate')?.value,
      endDate: this.MISReportCPInsuranceReport.get('endDate')?.value,
      userLogin: this.MISReportCPInsuranceReport.get('username')?.value,
      type: 'INSURANCE',
      businessKey: 'INSURANCE_AGREEMENT',
    };

    this.misReportService.getMISReportCPCredam(params).subscribe({
      next: res => this._processGenerate(res.body, 'MIS_Insurance_Report'),
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
    this.setUpColumns(this.columns);

    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this.applyStyles('ff007f7f');
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(this._filterCPBeforeGenerate(data));

    this._applyStyles();
    this.downloadFile(fileName);
    this._resetData();
  }

  protected processData(data: any[]): void {
    data.forEach(proposal => {
      this._addData(this.worksheet, proposal);
    });
  }

  private _filterCPBeforeGenerate(data) {
    const businessUnit = this.MISReportCPInsuranceReport.get('businessUnit')?.value;
    let filteredData = data;
    if (businessUnit && businessUnit.length > 0) {
      filteredData = data.filter(cp => businessUnit.includes(String(cp.segmentIdRM)));
    } else {
      filteredData = data;
    }

    return filteredData
      .map(item => {
        const filteredCollateral = item.collateral
          .map(collateralItem => {
            const filteredInsurance = collateralItem.collateralInsurance.filter(
              insurance =>
                insurance.expDate >= this.MISReportCPInsuranceReport.get('startDate')?.value &&
                insurance.expDate <= this.MISReportCPInsuranceReport.get('endDate')?.value
            );
            if (filteredInsurance.length > 0) {
              return {
                ...collateralItem,
                collateralInsurance: filteredInsurance,
              };
            }
            return null;
          })
          .filter(Boolean);

        return {
          ...item,
          collateral: filteredCollateral,
        };
      })
      .filter(item => item.collateral.length > 0);
  }

  private _addData(worksheet: ExcelJS.Worksheet, proposal: any): void {
    const baseData = {
      no: worksheet.rowCount,
      cifNumber: proposal.cif || '',
      name: proposal.debtorName || '',
      collateralNo: proposal.collateral.map(collateral => collateral.dclColNo).join(',\n') || '',
      branchCode: proposal.bookingBranchId || '',
      branchName: proposal.bookingBranchName || '',
      businessUnit: proposal.segmentParentRM || '',
      openDate:
        proposal.product
          .map(product => (product.firstDisbursementDate !== 'null' ? this._formatDateSLA(product.firstDisbursementDate) : ''))
          .join(',\n') || '',
      expiryDate1:
        proposal.product
          .map(product => {
            const maturityDate = product.mainProduct?.[0]?.maturityDate;
            return maturityDate && maturityDate !== 'null' ? this._formatDateSLA(maturityDate) : '';
          })
          .join(',\n') || '',

      approvalNumber: proposal.product.map(product => product.approvalNumber).join(',\n') || '',
      productName: proposal.product.map(product => product.productName).join(',\n') || '',
      plafond: proposal.subTotalPlafondEqToIDR || '',
      outstanding: proposal.totalOsEqToIDR || '',
    };

    if (!proposal.collateral || proposal.collateral.length === 0) {
      worksheet.addRow(baseData);
    }

    const debtorName = proposal.debtorName || '';

    const filteredCollateral = proposal.collateral.filter(
      collateral =>
        ['Real Estate', 'Machine', 'Vehicle', 'Personal Property', 'Personal Property Machine'].includes(collateral.collateralType) &&
        collateral.collateralTypeInsurance === 'true' &&
        collateral.partyName === debtorName
    );

    // Process each collateral
    filteredCollateral.forEach(collateral => {
      const collateralData = {
        ...baseData,
        no: worksheet.rowCount,
        collateralType: collateral.collateralType || '',
        collateralDetail: collateral.collateralCode || '',
        collateralCode: collateral.collateralProposePricing || '',
        certificateNumber: collateral.certificateAppraisal
          ? collateral.certificateAppraisal.map(certificate => certificate.certNumber).join(',\n')
          : '',
        location: collateral.collateralAddress || '',
        collateralOwner: collateral.collateralOwnerIDD || '',
      };

      if (!collateral.collateralInsurance || collateral.collateralInsurance.length === 0) {
        worksheet.addRow(collateralData);
      } else {
        // Process each insurance
        collateral.collateralInsurance.forEach(insurance => {
          const rowData = {
            ...collateralData,
            no: worksheet.rowCount,
            insuranceNumber: '',
            insuranceCode: insurance.insuranceTypeCode || '',
            insuranceName: insurance.insuranceTypeName || '',
            policyNumber: insurance.policyNo || '',
            expiryDate: insurance.expDate ? this._formatDateSLA(insurance.expDate) : '',
            insuranceCurrency: insurance.currency || '',
            insuranceAmount: insurance.insuranceAmount || '',
            brokerName: insurance.brokerCompany || '',
            companyName: insurance.corpName || '',
            statusBankerClause: insurance.statusBankerClause || '',
            policyDocument: insurance.policyDocument || '',
            paymentStatus: insurance.paymentStatus || '',
            time: this._getMakerOutDate(proposal.timeLineInsurance),
            operatorName: this._getOperatorName(proposal.timeLineInsurance),
            remark: insurance.remarks || '',
          };
          worksheet.addRow(rowData);
        });
      }
    });
  }

  private _getOperatorName(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    return timeLineInsurance
      .filter((item: any) => item.fromStatusDescription === 'Insurance Checking')
      .sort((a, b) => b.id - a.id)
      .map((item: any) => item.personName)[0];
  }

  private _getMakerOutDate(timeLineInsurance: any[]): string {
    if (!Array.isArray(timeLineInsurance)) {
      return '';
    }

    return timeLineInsurance
      .filter((item: any) => item.statusDescription === 'Insurance Review')
      .map((item: any) => this._formatDateSLA(item.fromDate))
      .filter(Boolean)
      .join(',\n');

    // return timeLineInsurance
    //     .filter((item: any) => item.fromStatusDescription === 'Insurance Checking')
    //     .sort((a, b) => b.id - a.id)
    //     .map((item: any) => this._formatDateSLA(item.fromDate))[0]
  }

  private _applyStyles(): void {
    super.applyStyles('ff007f7f');

    const columnsToBeWraped = [
      'cifNumber',
      'name',
      'collateralNo',
      'branchCode',
      'branchName',
      'businessUnit',
      'openDate',
      'expiryDate1',
      'approvalNumber',
      'productName',
      'plafond',
      'outstanding',
      'collateralType',
      'collateralDetail',
      'collateralCode',
      'certificateNumber',
      'location',
      'collateralOwner',
      'insuranceNumber',
      'insuranceCode',
      'insuranceName',
      'policyNumber',
      'expiryDate',
      'insuranceCurrency',
      'insuranceAmount',
      'brokerName',
      'companyName',
      'statusBankerClause',
      'policyDocument',
      'paymentStatus',
      'time',
      'operatorName',
      'remark',
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
}
