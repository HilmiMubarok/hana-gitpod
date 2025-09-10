import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { map } from 'rxjs';
import { FormGroup } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { processConditions, TableData } from './summary-approval-compare.helper';

@Injectable({
  providedIn: 'root',
})
export class SummaryApprovalService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  public getProposalType() {
    const params = new HttpParams()
      .set('idParameterType', 'PROPOSAL_TYPE')
      .set('page', '0')
      .set('size', '10')
      .set('sort', 'id')
      .set('sort', 'asc');
    return this.http.get(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/general-parameter/filterBy'), {
      params,
    });
  }

  public getSegment() {
    const params = new HttpParams().set('idInternalType', 'BUSINESS_UNIT').set('page', '0').set('size', '9999');
    return this.http
      .get(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/internals/filterBy'), {
        params,
      })
      .pipe(map((res: any) => res.filter((item: any) => item.id.charAt(0) === '7')));
  }

  public getLc() {
    const params = new HttpParams().set('idParent', 'LOS_REL').set('page', '0').set('size', '9999');
    return this.http
      .get(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/relation-types/filterBy'), {
        params,
      })
      .pipe(
        map((res: any) => {
          const defaultLc = res.filter((item: any) => ['SME', 'BTB', 'COMMERCIAL', 'CORPORATE', 'GLOBALBS'].includes(item.parentId));
          const nbtb = res.filter((item: any) => ['SME', 'COMMERCIAL', 'CORPORATE', 'GLOBALBS'].includes(item.parentId));
          const btb = res.filter((item: any) => ['BTB'].includes(item.parentId));
          return {
            form1: {
              defaultLc,
              nbtb,
              btb,
            },
            form2: {
              defaultLc,
              nbtb,
              btb,
            },
          };
        })
      );
  }

  public getAmountType() {
    return ['Changes', 'Plafond'];
  }

  public getCondition() {
    return ['Approved', 'Reject', 'Cancel'];
  }

  public getDebtorStatus() {
    return ['New', 'Additional', 'Renewal', 'Restructure', 'Decrease', 'Other'];
  }

  public validateForm(formData: FormGroup, formIndex: '1' | '2') {
    const startDate = formData.get('startDate')?.value;
    const endDate = formData.get('endDate')?.value;
    const proposalType = formData.get('proposalType')?.value;
    const amountType = formData.get('amountType')?.value;

    const errors = [];

    if (!startDate && !endDate && !proposalType && !amountType) {
      errors.push({ isValid: false, errorMessage: 'Please Select Data ' + formIndex });
    }

    if (!startDate || !endDate) {
      errors.push({ isValid: false, errorMessage: 'Please Select Date Range Data ' + formIndex });
    }

    if (!proposalType) {
      errors.push({ isValid: false, errorMessage: 'Please Select Proposal Type Data ' + formIndex });
    }

    if (!amountType) {
      errors.push({ isValid: false, errorMessage: 'Please Select Amount Type Data ' + formIndex });
    }

    return errors.length ? errors : [{ isValid: true, errorMessage: null }];
  }

  public generatePayloadFormat(formData: FormGroup, menuType: 'Regional' | 'Approval LC') {
    const startDate = formData.get('startDate')?.value;
    const endDate = formData.get('endDate')?.value;
    const proposalType = formData.get('proposalType')?.value;
    const segment = this._convertStatusToString(formData.get('segment')?.value);
    const lc = this._convertStatusToString(formData.get('lc')?.value);
    const amountType = formData.get('amountType')?.value;
    const condition = this._convertStatusToString(formData.get('condition')?.value);
    const debtorStatus = this._convertStatusToString(formData.get('debtorStatus')?.value);

    const payload = {
      startDate,
      endDate,
      proposalType,
      ...(menuType === 'Regional' && { segmentId: segment !== '' ? segment : null }),
      ...(menuType === 'Approval LC' && { lc: lc !== '' ? lc : null }),
      amountType,
      condition,
      debtorStatus,
    };

    return payload;
  }

  private _convertStatusToString(status: Array<string>): string {
    if (status === null) {
      return null;
    }
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  public getEndpoint(menuType: 'Regional' | 'Approval LC') {
    if (menuType === 'Regional') {
      return this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/mis/report/summary-approval-sme');
    } else {
      return this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/mis/report/summary-approval-lc');
    }
  }

  public generate(payload: any, endpoint: string) {
    return this.http.post(endpoint, payload);
  }

  private formatNumber(value: number | string): string {
    if (!value || value === 0 || value === '0') {
      return '0';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      return '0';
    }

    return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  createTableInWorksheet(worksheet: ExcelJS.Worksheet, tableData: TableData, startFromRow = 1, conditions: string, debtorStatus: string): void {
    const { title: mainTitle, groups, reportData } = tableData;

    const conditionsArray = conditions.split(',');
    const debtorStatusArray = debtorStatus.split(',');

    const conditionsDebtorStatusArray = conditionsArray.map((condition: string) => {
      const conditionLower = condition.toLocaleLowerCase();

      if (conditionLower === 'cancel') {
        return [conditionLower];
      } else {
        return debtorStatusArray.map((status: string) => `${conditionLower}_${status.toLocaleLowerCase()}`);
      }
    });

    const flattenConditionsDebtorStatusArray = conditionsDebtorStatusArray.flat();

    const filteredReportData = Object.keys(reportData)
      .filter(key => flattenConditionsDebtorStatusArray.includes(key))
      .reduce((obj, key) => {
        obj[key] = reportData[key];
        return obj;
      }, {});

    const totalColumns = 1 + groups.length * 3 + 3;

    worksheet.mergeCells(startFromRow, 1, startFromRow + 2, 1);
    const conditionsCell = worksheet.getCell(startFromRow, 1);
    conditionsCell.value = 'Conditions';
    conditionsCell.alignment = { horizontal: 'center', vertical: 'middle' };
    conditionsCell.font = { bold: true };
    conditionsCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC0C0C0' },
    };

    worksheet.mergeCells(startFromRow, 2, startFromRow, totalColumns);
    const lcGroupCell = worksheet.getCell(startFromRow, 2);
    lcGroupCell.value = mainTitle;
    lcGroupCell.alignment = { horizontal: 'center', vertical: 'middle' };
    lcGroupCell.font = { bold: true, size: 14 };
    lcGroupCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC0C0C0' },
    };
    worksheet.getRow(startFromRow).height = 25;

    let currentCol = 2;
    groups.forEach((group: string) => {
      worksheet.mergeCells(startFromRow + 1, currentCol, startFromRow + 1, currentCol + 2);
      const groupCell = worksheet.getCell(startFromRow + 1, currentCol);
      groupCell.value = group;
      groupCell.alignment = { horizontal: 'center', vertical: 'middle' };
      groupCell.font = { bold: true };
      groupCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC0C0C0' },
      };
      currentCol += 3;
    });

    worksheet.mergeCells(startFromRow + 1, currentCol, startFromRow + 1, currentCol + 2);
    const totalHeaderCell = worksheet.getCell(startFromRow + 1, currentCol);
    totalHeaderCell.value = 'Total';
    totalHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
    totalHeaderCell.font = { bold: true };
    totalHeaderCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC0C0C0' },
    };

    currentCol = 2;
    const subHeaders = ['NOA', 'Amount (IDR)', 'Amount (USD)'];

    for (let i = 0; i < groups.length + 1; i++) {
      subHeaders.forEach(header => {
        const cell = worksheet.getCell(startFromRow + 2, currentCol);
        cell.value = header;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC0C0C0' },
        };
        currentCol++;
      });
    }

    const conditionRows = processConditions(conditions, debtorStatus);

    const groupKeys = groups.map((group: string) =>
      group
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '')
    );

    let currentRow = startFromRow + 3;
    conditionRows.forEach(condition => {
      let displayText = '';
      if (condition.isParent) {
        displayText = condition.parent;
      } else {
        displayText = condition.label;
      }
      const rowData = [displayText];
      const isPercentageRow = ['percent_approved', 'percent_reject', 'percent_cancel'].includes(condition.key);

      groupKeys.forEach((groupKey: string) => {
        if (condition.key === 'approved_parent') {
          const approvedKeys = [
            'approved_new',
            'approved_additional',
            'approved_renewal',
            'approved_restructure',
            'approved_decrease',
            'approved_other',
          ];
          let totalNOA = 0,
            totalIDR = 0,
            totalUSD = 0;

          approvedKeys.forEach(key => {
            const data = filteredReportData[key]?.[groupKey] || {};
            totalNOA += data.noa || 0;
            totalIDR += data.idr || 0;
            totalUSD += data.usd || 0;
          });

          rowData.push(totalNOA.toString(), this.formatNumber(totalIDR), this.formatNumber(totalUSD));
        } else if (condition.key === 'reject_parent') {
          const rejectKeys = ['reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other'];
          let totalNOA = 0,
            totalIDR = 0,
            totalUSD = 0;

          rejectKeys.forEach(key => {
            const data = filteredReportData[key]?.[groupKey] || {};
            totalNOA += data.noa || 0;
            totalIDR += data.idr || 0;
            totalUSD += data.usd || 0;
          });

          rowData.push(totalNOA.toString(), this.formatNumber(totalIDR), this.formatNumber(totalUSD));
        } else if (isPercentageRow) {
          const data = filteredReportData[condition.key]?.[groupKey] || {};
          rowData.push(data.noa || '', '', '');
        } else {
          const data = filteredReportData[condition.key]?.[groupKey] || {};
          rowData.push(data.noa || '', data.idr ? this.formatNumber(data.idr) : '', data.usd ? this.formatNumber(data.usd) : '');
        }
      });

      if (condition.key === 'approved_parent') {
        const approvedKeys = [
          'approved_new',
          'approved_additional',
          'approved_renewal',
          'approved_restructure',
          'approved_decrease',
          'approved_other',
        ];
        let totalNOA = 0,
          totalIDR = 0,
          totalUSD = 0;

        approvedKeys.forEach(key => {
          const data = filteredReportData[key]?.total || {};
          totalNOA += data.noa || 0;
          totalIDR += data.idr || 0;
          totalUSD += data.usd || 0;
        });

        rowData.push(totalNOA.toString(), this.formatNumber(totalIDR), this.formatNumber(totalUSD));
      } else if (condition.key === 'reject_parent') {
        const rejectKeys = ['reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other'];
        let totalNOA = 0,
          totalIDR = 0,
          totalUSD = 0;

        rejectKeys.forEach(key => {
          const data = filteredReportData[key]?.total || {};
          totalNOA += data.noa || 0;
          totalIDR += data.idr || 0;
          totalUSD += data.usd || 0;
        });

        rowData.push(totalNOA.toString(), this.formatNumber(totalIDR), this.formatNumber(totalUSD));
      } else if (isPercentageRow) {
        const totalData = filteredReportData[condition.key]?.total || {};
        rowData.push(totalData.noa || '', '', '');
      } else {
        const totalData = filteredReportData[condition.key]?.total || {};
        rowData.push(
          totalData.noa || '',
          totalData.idr ? this.formatNumber(totalData.idr) : '',
          totalData.usd ? this.formatNumber(totalData.usd) : ''
        );
      }

      const row = worksheet.addRow(rowData);

      const isTotalOrPercentageRow = ['total', 'percent_approved', 'percent_reject', 'percent_cancel'].includes(condition.key);
      const isPercentageRowOnly = ['percent_approved', 'percent_reject', 'percent_cancel'].includes(condition.key);

      const conditionCell = row.getCell(1);
      if (condition.isParent) {
        conditionCell.font = { bold: true };
      }

      if (isTotalOrPercentageRow) {
        conditionCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF8DB5E0' }, // Blue background
        };

        for (let colIndex = 2; colIndex <= totalColumns; colIndex++) {
          const cell = row.getCell(colIndex);

          if (isPercentageRowOnly) {
            const columnPosition = (colIndex - 2) % 3;

            if (columnPosition === 1 || columnPosition === 2) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF000000' }, // Black background
              };
            } else {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF8DB5E0' }, // Blue background
              };
            }
          } else {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF8DB5E0' }, // Blue background
            };
          }
        }
      } else {
        conditionCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2BE9B' }, // Orange background
        };
      }

      currentRow++;
    });

    this.applyBordersAndStyling(worksheet, totalColumns, currentRow - 1, startFromRow);

    worksheet.getColumn(1).width = 20;
    for (let i = 2; i <= totalColumns; i++) {
      worksheet.getColumn(i).width = 15;
    }
  }

  async downloadWorkbook(workbook: ExcelJS.Workbook, fileName: string): Promise<void> {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${fileName}.xlsx`);
  }

  private applyBordersAndStyling(worksheet: ExcelJS.Worksheet, totalColumns: number, lastRow: number, startFromRow = 1): void {
    for (let row = startFromRow; row <= lastRow; row++) {
      for (let col = 1; col <= totalColumns; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        if (col > 1 && row > startFromRow + 2) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
      }
    }
  }
}
