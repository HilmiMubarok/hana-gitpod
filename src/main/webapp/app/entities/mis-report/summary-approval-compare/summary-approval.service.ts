import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { map } from 'rxjs';
import { FormGroup } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { BehaviorSubject } from 'rxjs';
import { TableData } from './summary-approval-compare.helper';

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

    const payload = {
      startDate,
      endDate,
      proposalType,
      ...(menuType === 'Regional' && { segmentId: segment !== '' ? segment : null }),
      ...(menuType === 'Approval LC' && { lc: lc !== '' ? lc : null }),
      amountType,
      condition,
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

  // NEW SERVICE

  // Helper function to format numbers with thousand separators (dots)
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

  // Method to create table in existing worksheet (new version with single object)
  createTableInWorksheet(worksheet: ExcelJS.Worksheet, tableData: TableData, startFromRow = 1): void {
    const { title: mainTitle, groups, reportData } = tableData;

    // Calculate total columns: 1 for Conditions + (groups * 3) + 3 for Total
    const totalColumns = 1 + groups.length * 3 + 3;

    // Conditions header (spans all 3 rows: startFromRow to startFromRow+2)
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

    // Row startFromRow: LC Group Header (spanning from column 2 to end)
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

    // Row startFromRow+1: Group Headers (Group 1, Group 2, Group 3, Total)
    let currentCol = 2; // Start from column 2 (after Conditions column)

    // Group headers
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

    // Total header
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

    // Row startFromRow+2: Sub Headers (NOA, Amount (IDR), Amount (USD))
    currentCol = 2; // Start after Conditions column
    const subHeaders = ['NOA', 'Amount (IDR)', 'Amount (USD)'];

    for (let i = 0; i < groups.length + 1; i++) {
      // +1 for Total
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

    // Define condition rows structure - first add parent rows, then sub-items
    const conditionRows = [
      // Approved parent row
      {
        parent: 'Approved',
        label: '',
        key: 'approved_parent',
        isParent: true,
        isSubItem: false,
      },
      {
        parent: 'Approved',
        label: '- New',
        key: 'approved_new',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Approved',
        label: '- Additional',
        key: 'approved_additional',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Approved',
        label: '- Renewal',
        key: 'approved_renewal',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Approved',
        label: '- Restructure',
        key: 'approved_restructure',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Approved',
        label: '- Decrease',
        key: 'approved_decrease',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Approved',
        label: '- Other',
        key: 'approved_other',
        isParent: false,
        isSubItem: true,
      },
      // Reject parent row
      {
        parent: 'Reject',
        label: '',
        key: 'reject_parent',
        isParent: true,
        isSubItem: false,
      },
      {
        parent: 'Reject',
        label: '- New',
        key: 'reject_new',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Reject',
        label: '- Additional',
        key: 'reject_additional',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Reject',
        label: '- Renewal',
        key: 'reject_renewal',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Reject',
        label: '- Restructure',
        key: 'reject_restructure',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Reject',
        label: '- Decrease',
        key: 'reject_decrease',
        isParent: false,
        isSubItem: true,
      },
      {
        parent: 'Reject',
        label: '- Other',
        key: 'reject_other',
        isParent: false,
        isSubItem: true,
      },
      // Standalone items
      {
        parent: 'Cancel',
        label: '',
        key: 'cancel',
        isParent: true,
        isSubItem: false,
      },
      {
        parent: 'Total',
        label: '',
        key: 'total',
        isParent: true,
        isSubItem: false,
      },
      {
        parent: '% Total Approved',
        label: '',
        key: 'percent_approved',
        isParent: true,
        isSubItem: false,
      },
      {
        parent: '% Total Reject',
        label: '',
        key: 'percent_reject',
        isParent: true,
        isSubItem: false,
      },
      {
        parent: '% Total Cancel',
        label: '',
        key: 'percent_cancel',
        isParent: true,
        isSubItem: false,
      },
    ];

    // Map groups to data keys
    const groupKeys = groups.map((group: string) =>
      group
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '')
    );

    // Add data rows
    let currentRow = startFromRow + 3;
    conditionRows.forEach(condition => {
      let displayText = '';
      if (condition.isParent) {
        // For parent rows, show the parent name
        displayText = condition.parent;
      } else {
        // For sub-items, show the label (e.g., "- New")
        displayText = condition.label;
      }
      const rowData = [displayText];
      // Check if this is a percentage row
      const isPercentageRow = ['percent_approved', 'percent_reject', 'percent_cancel'].includes(condition.key);

      // Add data for each group
      groupKeys.forEach((groupKey: string) => {
        // For parent rows of Approved/Reject, calculate sum of sub-categories
        if (condition.key === 'approved_parent') {
          // Sum all approved sub-categories
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
            const data = reportData[key]?.[groupKey] || {};
            totalNOA += data.noa || 0;
            totalIDR += data.idr || 0;
            totalUSD += data.usd || 0;
          });

          rowData.push(totalNOA.toString(), this.formatNumber(totalIDR), this.formatNumber(totalUSD));
        } else if (condition.key === 'reject_parent') {
          // Sum all reject sub-categories
          const rejectKeys = ['reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other'];
          let totalNOA = 0,
            totalIDR = 0,
            totalUSD = 0;

          rejectKeys.forEach(key => {
            const data = reportData[key]?.[groupKey] || {};
            totalNOA += data.noa || 0;
            totalIDR += data.idr || 0;
            totalUSD += data.usd || 0;
          });

          rowData.push(totalNOA.toString(), this.formatNumber(totalIDR), this.formatNumber(totalUSD));
        } else if (isPercentageRow) {
          // For percentage rows, only show NOA column, leave IDR and USD empty
          const data = reportData[condition.key]?.[groupKey] || {};
          rowData.push(data.noa || '', '', '');
        } else {
          const data = reportData[condition.key]?.[groupKey] || {};
          rowData.push(data.noa || '', data.idr ? this.formatNumber(data.idr) : '', data.usd ? this.formatNumber(data.usd) : '');
        }
      });

      // Add total data
      if (condition.key === 'approved_parent') {
        // Sum all approved sub-categories totals
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
          const data = reportData[key]?.total || {};
          totalNOA += data.noa || 0;
          totalIDR += data.idr || 0;
          totalUSD += data.usd || 0;
        });

        rowData.push(totalNOA.toString(), this.formatNumber(totalIDR), this.formatNumber(totalUSD));
      } else if (condition.key === 'reject_parent') {
        // Sum all reject sub-categories totals
        const rejectKeys = ['reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other'];
        let totalNOA = 0,
          totalIDR = 0,
          totalUSD = 0;

        rejectKeys.forEach(key => {
          const data = reportData[key]?.total || {};
          totalNOA += data.noa || 0;
          totalIDR += data.idr || 0;
          totalUSD += data.usd || 0;
        });

        rowData.push(totalNOA.toString(), this.formatNumber(totalIDR), this.formatNumber(totalUSD));
      } else if (isPercentageRow) {
        // For percentage rows, only show NOA column in total, leave IDR and USD empty
        const totalData = reportData[condition.key]?.total || {};
        rowData.push(totalData.noa || '', '', '');
      } else {
        const totalData = reportData[condition.key]?.total || {};
        rowData.push(
          totalData.noa || '',
          totalData.idr ? this.formatNumber(totalData.idr) : '',
          totalData.usd ? this.formatNumber(totalData.usd) : ''
        );
      }

      const row = worksheet.addRow(rowData);

      // Check if this is a Total or Percentage row for special styling
      const isTotalOrPercentageRow = ['total', 'percent_approved', 'percent_reject', 'percent_cancel'].includes(condition.key);

      // Check if this is specifically a percentage row (not total)
      const isPercentageRowOnly = ['percent_approved', 'percent_reject', 'percent_cancel'].includes(condition.key);

      // Style the condition cell
      const conditionCell = row.getCell(1);
      if (condition.isParent) {
        conditionCell.font = { bold: true };
      }

      // Apply background color based on row type
      if (isTotalOrPercentageRow) {
        // Special blue background for Total and Percentage rows
        conditionCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF8DB5E0' }, // Blue background
        };

        // Apply background to all cells in this row
        for (let colIndex = 2; colIndex <= totalColumns; colIndex++) {
          const cell = row.getCell(colIndex);

          // For percentage rows, check if this is an IDR or USD column
          if (isPercentageRowOnly) {
            // Calculate position: every 3 columns represent NOA, IDR, USD
            // Column positions: 2,3,4 = Group1(NOA,IDR,USD), 5,6,7 = Group2(NOA,IDR,USD), etc.
            const columnPosition = (colIndex - 2) % 3; // 0=NOA, 1=IDR, 2=USD

            if (columnPosition === 1 || columnPosition === 2) {
              // IDR and USD columns get black background
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF000000' }, // Black background
              };
            } else {
              // NOA columns get blue background
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF8DB5E0' }, // Blue background
              };
            }
          } else {
            // Total row gets all blue background
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF8DB5E0' }, // Blue background
            };
          }
        }
      } else {
        // Default orange background for other rows
        conditionCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2BE9B' }, // Orange background
        };
      }

      currentRow++;
    });

    // Apply borders and styling
    this.applyBordersAndStyling(worksheet, totalColumns, currentRow - 1, startFromRow);

    // Set column widths
    worksheet.getColumn(1).width = 20; // Conditions column
    for (let i = 2; i <= totalColumns; i++) {
      worksheet.getColumn(i).width = 15;
    }
  }

  // Helper method to download workbook
  async downloadWorkbook(workbook: ExcelJS.Workbook, fileName: string): Promise<void> {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${fileName}.xlsx`);
  }

  private applyBordersAndStyling(worksheet: ExcelJS.Worksheet, totalColumns: number, lastRow: number, startFromRow = 1): void {
    // Apply borders to all cells in the table
    for (let row = startFromRow; row <= lastRow; row++) {
      for (let col = 1; col <= totalColumns; col++) {
        const cell = worksheet.getCell(row, col);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // Center align data cells (except conditions column)
        if (col > 1 && row > startFromRow + 2) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
      }
    }
  }
}
