import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MisReportService } from '../mis-report.service';
import { MessageService } from 'primeng/api';
import moment from 'moment';
import { AbstractExcelMISReport } from '../abstract-excel-report';
import * as ExcelJS from 'exceljs';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { InternalService } from 'app/entities/internal/internal.service';
import { APPLICATION_TYPE } from 'app/shared/constants/base.constants';
import { map, tap, switchMap } from 'rxjs';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { IGeneralParameter } from 'app/entities/master-parameter/general-parameter/general-parameter.model';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';

@Component({
  selector: 'jhi-mis-summary-approval-regional-lc',
  templateUrl: './mis-summary-approval-regional-lc.component.html',
  styleUrls: ['../disabled-style.scss'],
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

      .skeleton-loading {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background-color: #fff;
        border-radius: 4px;
        padding: 16px;
        width: 90%;
        height: 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
      }

      .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
      .mat-button-toggle-group-appearance-standard {
        border: none !important;
      }

      .mat-button-toggle {
        margin: 0 3px;
        border-radius: 5px !important;
        font-weight: 400;
      }

      .mat-button-toggle-appearance-standard {
        background: #e5e5e5;
      }

      .mat-button-toggle-group-appearance-standard .mat-button-toggle + .mat-button-toggle {
        border: none;
      }

      .mat-button-toggle-checked {
        color: rgb(255 255 255 / 87%);
        background: #48a5a0;
      }

      @keyframes skeleton-loading {
        0% {
          background-color: #e2e2e2;
        }
        50% {
          background-color: #f2f2f2;
        }
        100% {
          background-color: #e2e2e2;
        }
      }
    `,
  ],
})
export class MisSummaryApprovalRegionalLCComponent extends AbstractExcelMISReport implements OnInit {
  public menu = 'regional';
  public lovAmount = ['Changes', 'Plafond'];
  public lovCondition = ['Approved', 'Reject', 'Cancel'];
  public lovRegional = [];
  public lovApprovalLC = [];
  public form: FormGroup;
  public allSelectedCondition = false;
  public allSelectedRegional = false;
  public allselectedapprovalLC = false;
  private readonly parentIds = ['7101', '7102', '7201', '7301', '7401', '7402', '7501', '7502', '7503', '7504'];
  private readonly approvalLCId = ['SME', 'BTB', 'COMMERCIAL', 'CORPORATE', 'GLOBALBS'];
  @ViewChild('formContainer', { static: true }) formContainer: ElementRef;
  proposType: IGeneralParameter[];
  private LOS_REL = 'LOS_REL';
  constructor(
    public misReportService: MisReportService,
    public messageService: MessageService,
    public internalService: InternalService,
    public generalParameterService: GeneralParameterService,
    public relationTypeService: RelationTypeService
  ) {
    super(misReportService);
    this._initializeForm();
    this._handleFormChanges();
  }

  onMenuChanged(): void {
    this._resetForms();
  }

  private _resetForms(): void {
    if (this.form) {
      this.form.reset();
      this.allSelectedRegional = false;
      this.allselectedapprovalLC = false;
      this.allSelectedCondition = false;
    }
  }
  ngOnInit(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'PROPOSAL_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.proposType = res.body;
      });
    this.loadFilteredInternal();
    this.form.get('proposalStatus')?.valueChanges.subscribe(() => {
      this.loadRelationType();
    });
  }
  private loadRelationType(): void {
    this.relationTypeService
      .queryFilterBy({
        idParent: this.LOS_REL,
        page: 0,
        size: 9999,
      })
      .pipe(
        map(response => response.body),
        map(relationTypes =>
          relationTypes
            .filter(relationType => {
              const proposalType = this.form.get('proposalStatus')?.value;
              const isBackToBack = proposalType === 'Total Exposure Back to Back';
              const internalId = String(relationType.parentId);
              if (isBackToBack) {
                return internalId === 'BTB';
              } else {
                return this.approvalLCId.includes(internalId) && internalId !== 'BTB';
              }
            })
            .map(relationType => ({ id: relationType.id, name: relationType.description, parentID: relationType.parentId }))
        )
      )
      .subscribe({
        next: relationTypes => (this.lovApprovalLC = relationTypes),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to get regionalRM Data',
          }),
      });
  }
  private loadFilteredInternal(): void {
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
            .filter(internal => {
              const isInParent = this.parentIds.includes(String(internal.id));
              return isInParent;
            })
            .map(internal => ({ id: internal.id, name: internal.facilityName }))
        )
      )
      .subscribe({
        next: internals => (this.lovRegional = internals),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to get regionalRM Data',
          }),
      });
  }

  public toggleSelectRegionalAll(): void {
    this.allSelectedRegional = !this.allSelectedRegional;
    if (this.allSelectedRegional) {
      this.form.get('regional')?.setValue([...this.lovRegional.map(internal => internal.id)]);
    } else {
      this.form.get('regional')?.setValue(null);
    }
  }

  public toggleSelectAllApprovalLC(): void {
    this.allselectedapprovalLC = !this.allselectedapprovalLC;
    if (this.allselectedapprovalLC) {
      this.form.get('approvalLC')?.setValue([...this.lovApprovalLC.map(internal => internal.id)]);
    } else {
      this.form.get('approvalLC')?.setValue(null);
    }
  }
  public dateRangeHasValue(): void {
    return this.form.get('startDate')?.value && this.form.get('endDate')?.value;
  }
  public toggleSelectAllCondition(): void {
    this.allSelectedCondition = !this.allSelectedCondition;
    if (this.allSelectedCondition) {
      this.form.get('condition')?.setValue([...this.lovCondition.map(lovJenisPengikatan => lovJenisPengikatan)]);
    } else {
      this.form.get('condition')?.setValue(null);
    }
  }

  public clearDateRange(): void {
    this.form.get('startDate')?.reset();
    this.form.get('endDate')?.reset();
  }

  private _initializeForm() {
    this.form = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      amount: new FormControl(''),
      condition: new FormControl(''),
      regional: new FormControl(''),
      approvalLC: new FormControl(''),
      proposalStatus: new FormControl(''),
    });
  }

  private _handleFormChanges(): void {
    this.form.get('startDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.form.get('startDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.form.get('endDate')?.valueChanges.subscribe(date => {
      if (moment.isMoment(date)) {
        const formattedDate = date.format('YYYY-MM-DD');
        this.form.get('endDate')?.setValue(formattedDate, { emitEvent: false });
      }
    });
  }

  public generateMISSummaryApproval(): void {
    if (this.menu === 'regional' || this.menu === 'approvalLC') {
      if (!this.form.get('startDate')?.value || !this.form.get('endDate')?.value) {
        this.messageService.add({
          severity: 'error',
          summary: 'Warning',
          detail: 'Please, Select Date Range.',
        });
        return;
      }
    }
    this.misReportService.setLoading(true);
    let params;
    if (this.menu === 'regional') {
      params = {
        startDate: this.form.get('startDate')?.value,
        endDate: this.form.get('endDate')?.value,
        regional: this._convertStatusToString(this.form.get('regional')?.value || null),
        proposalType: this.form.get('proposalStatus')?.value || null,
        amountType: this._convertStatusToString(this.form.get('amount')?.value || null),
      };
    } else {
      params = {
        startDate: this.form.get('startDate')?.value,
        endDate: this.form.get('endDate')?.value,
        lc: this._convertStatusToString(this.form.get('approvalLC')?.value || null),
        proposalType: this.form.get('proposalStatus')?.value,
        amountType: this.form.get('amount')?.value,
      };
    }
    if (this.menu === 'regional') {
      this.misReportService.getMisSummaryApprovalRegional(params).subscribe({
        next: res => this._processGenerate(res.body, 'MIS_Summary_Approval_Regional_Report'),
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
    } else {
      this.misReportService.getMisSummaryApprovalLC(params).subscribe({
        next: res => this._processGenerate(res.body, 'MIS_Summary_Approval_LC_Report'),
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
  }

  private _processGenerate(data, fileName) {
    this.setUpColumns(this.columns);
    // if data is empty, generate an empty file
    if (!data || data.length === 0) {
      this.applyStyles();
      this.downloadFile(fileName);
      return;
    }

    // Add data to worksheet
    this.processData(data);

    this._applyStyles();
    this._setAutoWidthForAllColumns();
    this._setAutoHeightForAllRows();
    this.downloadFile(fileName);
    this._resetData();
  }

  private _applyStyles(): void {
    super.applyStyles();
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
  protected processData(data: any[]): void {
    const worksheet = this.worksheet;
    const conditions = this._buildConditionStructure();
    const proposalType = this.form.get('proposalType')?.value;
    const approvalLC = this._convertStatusToString(this.form.get('approvalLC')?.value);
    const segment = this._convertStatusToString(this.form.get('regional')?.value || '');
    let sources: any[] = [];
    let sourcesLc: any[] = [];
    if (this.menu === 'regional') {
      sources = data[0]?.segment.filter(seg => segment.includes(String(seg.segmentId)));
    } else {
      sourcesLc = data[0]?.lcType.filter(apprlc => approvalLC.includes(String(apprlc.lcId)));
    }

    worksheet.mergeCells('A1:A3');
    worksheet.getCell('A1').value = 'Conditions';

    let col = 2; // Kolom B karena kolom A dipakai untuk "Conditions"

    sources.forEach(src => {
      const segmentName = src.segmentName;
      const lcList = src.lcType[0] || [];
      const relatedLcItems = this.lovApprovalLC.filter(item => item.parentID === lcList.lcParentId);
      const totalCols = relatedLcItems.length * 3;
      // Row 1: Segment name
      worksheet.mergeCells(1, col, 1, col + totalCols + 2);
      worksheet.getCell(1, col).value = segmentName;
      worksheet.getCell(1, col).alignment = { vertical: 'middle', horizontal: 'center' };

      // Row 2: LC item description
      relatedLcItems.forEach(item => {
        worksheet.mergeCells(2, col, 2, col + 2);
        worksheet.getCell(2, col).value = item.name;
        worksheet.getCell(2, col).alignment = { vertical: 'middle', horizontal: 'center' };

        // Row 3: NOA, Amount IDR, Amount USD
        worksheet.getCell(3, col).value = 'NOA';
        worksheet.getCell(3, col + 1).value = 'Amount (IDR)';
        worksheet.getCell(3, col + 2).value = 'Amount (USD)';

        [col, col + 1, col + 2].forEach(c => {
          worksheet.getCell(3, c).alignment = { vertical: 'middle', horizontal: 'center' };
        });

        col += 3;
      });
      worksheet.mergeCells(2, col, 2, col + 2);
      worksheet.getCell(2, col).value = 'TOTAL';
      worksheet.getCell(2, col).alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.getCell(3, col).value = 'NOA';
      worksheet.getCell(3, col + 1).value = 'Amount (IDR)';
      worksheet.getCell(3, col + 2).value = 'Amount (USD)';

      [worksheet.getCell(3, col), worksheet.getCell(3, col + 1), worksheet.getCell(3, col + 2)].forEach(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Styling
    [1, 2, 3].forEach(r => {
      worksheet.getRow(r).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      worksheet.getRow(r).font = { bold: true };
    });

    // ISI DATA
    conditions.forEach((cond, i) => {
      const row = i + 4;
      worksheet.getCell(`A${row}`).value = cond;
      let colIndex = 2;

      sources.forEach(src => {
        const lcList = src.lcType[0].listLC || [];

        const relatedLcItems = lcList.filter(lc => this.lovApprovalLC.find(item => item.id === lc.lcId));

        // Inisialisasi total
        let totalNOA = 0;
        let totalAmountIDR = 0;
        let totalAmountUSD = 0;

        relatedLcItems.forEach(item => {
          let result = { noa: '', amountIDR: '', amountUSD: '' };
          result = this._getConditionFromItem(item, cond);
          worksheet.getCell(row, colIndex).value = result.noa || '';
          worksheet.getCell(row, colIndex + 1).value = result.amountIDR || '';
          worksheet.getCell(row, colIndex + 2).value = result.amountUSD || '';

          totalNOA += parseInt(result.noa || '0', 10);
          totalAmountIDR += parseInt(result.amountIDR || '0', 10);
          totalAmountUSD += parseInt(result.amountUSD || '0', 10);

          colIndex += 3;
        });

        worksheet.getCell(row, colIndex).value = totalNOA;
        worksheet.getCell(row, colIndex + 1).value = totalAmountIDR;
        worksheet.getCell(row, colIndex + 2).value = totalAmountUSD;

        colIndex += 3;
      });
    });

    // ===== HEADER (ROW 1–3) =====
    sourcesLc.forEach(src => {
      const segmentName = src.lcName;
      const lcType = src.segment || [];

      // Filter LC yang termasuk segmentId pada parentIds
      const validLCs = lcType.filter(lc => this.parentIds.includes(lc.segmentId));
      const sortedSegments = validLCs.sort((a, b) => Number(a.segmentId) - Number(b.segmentId));

      const totalValidCols = sortedSegments.length * 3;

      // Row 1: Nama Segment
      worksheet.mergeCells(1, col, 1, col + totalValidCols + 2);
      worksheet.getCell(1, col).value = segmentName;
      worksheet.getCell(1, col).alignment = { vertical: 'middle', horizontal: 'center' };

      // Row 2 & 3: Nama LC + Subheader
      sortedSegments.forEach(lc => {
        worksheet.mergeCells(2, col, 2, col + 2);
        worksheet.getCell(2, col).value = lc.segmentName;
        worksheet.getCell(2, col).alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.getCell(3, col).value = 'NOA';
        worksheet.getCell(3, col + 1).value = 'Amount (IDR)';
        worksheet.getCell(3, col + 2).value = 'Amount (USD)';

        [col, col + 1, col + 2].forEach(c => {
          worksheet.getCell(3, c).alignment = { vertical: 'middle', horizontal: 'center' };
        });

        col += 3;
      });

      // TOTAL per segment
      worksheet.mergeCells(2, col, 2, col + 2);
      worksheet.getCell(2, col).value = 'TOTAL';
      worksheet.getCell(2, col).alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.getCell(3, col).value = 'NOA';
      worksheet.getCell(3, col + 1).value = 'Amount (IDR)';
      worksheet.getCell(3, col + 2).value = 'Amount (USD)';

      [col, col + 1, col + 2].forEach(c => {
        worksheet.getCell(3, c).alignment = { vertical: 'middle', horizontal: 'center' };
      });

      col += 3;
    });

    // ===== STYLING HEADER =====
    [1, 2, 3].forEach(r => {
      worksheet.getRow(r).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      worksheet.getRow(r).font = { bold: true };
    });

    // ===== ISI DATA =====
    conditions.forEach((cond, i) => {
      const row = i + 4;
      worksheet.getCell(`A${row}`).value = cond;
      let colIndex = 2;

      sourcesLc.forEach(src => {
        const lcType = src.segment || [];

        // Filter LC yang termasuk segmentId pada parentIds
        const validLCs = lcType.filter(lc => this.parentIds.includes(lc.segmentId));
        const sortedSegments = validLCs.sort((a, b) => Number(a.segmentId) - Number(b.segmentId));
        let totalNOA = 0;
        let totalAmountIDR = 0;
        let totalAmountUSD = 0;

        sortedSegments.forEach(lc => {
          const result = this._getConditionFromItem(lc, cond); // Ambil data langsung dari lc

          worksheet.getCell(row, colIndex).value = result.noa || '';
          worksheet.getCell(row, colIndex + 1).value = result.amountIDR || '';
          worksheet.getCell(row, colIndex + 2).value = result.amountUSD || '';

          totalNOA += parseInt(result.noa || '0', 10);
          totalAmountIDR += parseInt(result.amountIDR || '0', 10);
          totalAmountUSD += parseInt(result.amountUSD || '0', 10);

          colIndex += 3;
        });

        worksheet.getCell(row, colIndex).value = totalNOA;
        worksheet.getCell(row, colIndex + 1).value = totalAmountIDR;
        worksheet.getCell(row, colIndex + 2).value = totalAmountUSD;

        colIndex += 3;
      });
    });
  }

  private _getConditionFromItem(
    lc: any,
    condition: string
  ): {
    noa: string;
    amountIDR: string;
    amountUSD: string;
  } {
    let noa = 0;
    let amountIDR = 0;
    let amountUSD = 0;

    let totalNOA = 0;
    let approvedNOA = 0;
    let rejectNOA = 0;
    let cancelNOA = 0;
    const amountType = this.form.get('amount')?.value;
    const conditionTypes = lc.conditionType || [];
    console.log(amountType, 'amountType');
    for (const cond of conditionTypes) {
      const condName = (cond.conditionName || '').trim();
      const noaVal = parseInt(cond.noa || '0', 10);

      if (['Approved', 'Reject', 'Cancel'].includes(condName)) {
        totalNOA += noaVal;
        if (condName === 'Approved') {
          approvedNOA += noaVal;
        }
        if (condName === 'Reject') {
          rejectNOA += noaVal;
        }
        if (condName === 'Cancel') {
          cancelNOA += noaVal;
        }
      }

      const isCancelByBranch = condition === 'Cancel by Branch' && condName === 'Cancel';
      const isDirectMatch = condition === condName;

      if (isCancelByBranch || isDirectMatch) {
        noa += noaVal;
      }

      if (condition === 'Total') {
        noa += noaVal;
      }

      if (cond.product?.length) {
        for (const prod of cond.product) {
          const fullCond = `${condName} - ${prod.kategoriProduct}`;
          const isProductMatch = condition === fullCond;

          // Untuk kondisi seperti "Approved - Renewal", dll
          if (isProductMatch) {
            noa += parseInt(prod.noa || '0', 10);

            for (const amount of prod.summaryAmount || []) {
              if (amount.amountType === amountType) {
                for (const curr of amount.currencyAmount || []) {
                  if (curr.currency === 'IDR') {
                    amountIDR += parseInt(curr.amount || '0', 10);
                  } else if (curr.currency === 'USD') {
                    amountUSD += parseInt(curr.amount || '0', 10);
                  }
                }
              }
            }
          }
        }

        // Untuk kondisi seperti "Approved", "Reject", "Cancel" (tanpa kategoriProduct)
        const isSummaryOfCondition = condition === condName && ['Approved', 'Reject', 'Cancel'].includes(condName);
        if (isSummaryOfCondition) {
          for (const prod of cond.product) {
            for (const amount of prod.summaryAmount || []) {
              if (amount.amountType === amountType) {
                for (const curr of amount.currencyAmount || []) {
                  if (curr.currency === 'IDR') {
                    amountIDR += parseInt(curr.amount || '0', 10);
                  } else if (curr.currency === 'USD') {
                    amountUSD += parseInt(curr.amount || '0', 10);
                  }
                }
              }
            }
          }
        }
        if (condition === 'Total') {
          if (['Approved', 'Reject', 'Cancel'].includes(condName)) {
            for (const prod of cond.product) {
              for (const amount of prod.summaryAmount || []) {
                if (amount.amountType === amountType) {
                  for (const curr of amount.currencyAmount || []) {
                    if (curr.currency === 'IDR') {
                      amountIDR += parseInt(curr.amount || '0', 10);
                    } else if (curr.currency === 'USD') {
                      amountUSD += parseInt(curr.amount || '0', 10);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Handle % Total
    let noaResult: string;
    if (condition === '% Total Approve') {
      noaResult = totalNOA > 0 ? ((approvedNOA / totalNOA) * 100).toFixed(2) + '%' : '0%';
    } else if (condition === '% Total Reject') {
      noaResult = totalNOA > 0 ? ((rejectNOA / totalNOA) * 100).toFixed(2) + '%' : '0%';
    } else if (condition === '% Total Cancel') {
      noaResult = totalNOA > 0 ? ((cancelNOA / totalNOA) * 100).toFixed(2) + '%' : '0%';
    } else {
      noaResult = noa.toFixed(2).replace(/\.00$/, '');
    }

    return {
      noa: noaResult || '0',
      amountIDR: amountIDR.toString() || '0',
      amountUSD: amountUSD.toString() || '0',
    };
  }

  private _buildConditionStructure(): string[] {
    return [
      'Approved',
      'Approved - New (NTB)',
      'Approved - Additional (Existing)',
      'Approved - Renewal',
      'Approved - Restructure',
      'Approved - Decrease',
      'Approved - Other',
      'Reject',
      'Reject - New (NTB)',
      'Reject - Additional (Existing)',
      'Reject - Renewal',
      'Reject - Restructure',
      'Reject - Decrease',
      'Reject - Other',
      'Cancel by Branch',
      'Total',
      '% Total Approve',
      '% Total Reject',
      '% Total Cancel',
    ];
  }

  get columns() {
    return [{ header: 'Condition', key: 'condition' }];
  }
}
