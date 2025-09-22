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
    // const amountType = formData.get('amountType')?.value;

    const errors = [];

    if (!startDate && !endDate && !proposalType) {
      errors.push({ isValid: false, errorMessage: 'Please Select Data ' + formIndex });
    }

    if (!startDate || !endDate) {
      errors.push({ isValid: false, errorMessage: 'Please Select Date Range Data ' + formIndex });
    }

    if (!proposalType) {
      errors.push({ isValid: false, errorMessage: 'Please Select Proposal Type Data ' + formIndex });
    }

    // if (!amountType) {
    //   errors.push({ isValid: false, errorMessage: 'Please Select Amount Type Data ' + formIndex });
    // }

    return errors.length ? errors : [{ isValid: true, errorMessage: null }];
  }

  public generatePayloadFormat(formData: FormGroup, menuType: 'Regional' | 'Approval LC') {
    const startDate = formData.get('startDate')?.value;
    const endDate = formData.get('endDate')?.value;
    const proposalType = formData.get('proposalType')?.value;
    const segment = this._convertStatusToString(formData.get('segment')?.value);
    const lc = this._convertStatusToString(formData.get('lc')?.value);
    
    // Get form values for amountType, condition, and debtorStatus
    const amountTypeValue = formData.get('amountType')?.value;
    const conditionValue = formData.get('condition')?.value;
    const debtorStatusValue = formData.get('debtorStatus')?.value;
    
    // Apply default selection logic: if empty or null, select all
    const amountType = this._convertStatusToStringWithDefault(amountTypeValue, ['Changes', 'Plafond']);
    const condition = this._convertStatusToStringWithDefault(conditionValue, ['Approved', 'Reject', 'Cancel']);
    const debtorStatus = this._convertStatusToStringWithDefault(debtorStatusValue, ['New', 'Additional', 'Renewal', 'Restructure', 'Decrease', 'Other']);

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

  private _convertStatusToStringWithDefault(status: Array<string>, defaultValues: Array<string>): string {
    if (status === null || status === undefined || status.length === 0) {
      return defaultValues.join(',');
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

  createTableInWorksheet(worksheet: ExcelJS.Worksheet, tableData: TableData, startFromRow = 1, conditions: string, debtorStatus: string, amountTypes: string): void {
    const { title: mainTitle, groups, reportData } = tableData;

    const conditionsArray = conditions.split(',');
    const debtorStatusArray = debtorStatus.split(',');
    const amountTypesArray = amountTypes.split(',');

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

    // Create filtered report data that includes calculated totals based on selected categories
    const allReportData = { ...reportData };
    
    // Recalculate total row based on filtered data only
    const totalRow = { ...reportData.total };
    
    // Reset totals to 0 for all amount types
    const resetTotals = () => {
      const totals: any = { noa: 0 };
      amountTypesArray.forEach(amountType => {
        const amountKey = amountType.toLowerCase();
        totals[`${amountKey}_idr`] = 0;
        totals[`${amountKey}_usd`] = 0;
      });
      return totals;
    };
    
    totalRow.total = resetTotals();
    groups.forEach((_: string, index: number) => {
      const segmentKey = `sme${index + 1}`;
      totalRow[segmentKey] = resetTotals();
    });
    
    // Sum only selected categories for total row
    flattenConditionsDebtorStatusArray.forEach(key => {
      if (reportData[key]) {
        // Add to grand total
        totalRow.total.noa += reportData[key].total.noa || 0;
        amountTypesArray.forEach(amountType => {
          const amountKey = amountType.toLowerCase();
          totalRow.total[`${amountKey}_idr`] += reportData[key].total[`${amountKey}_idr`] || 0;
          totalRow.total[`${amountKey}_usd`] += reportData[key].total[`${amountKey}_usd`] || 0;
        });
        
        // Add to segment totals
        groups.forEach((_: string, index: number) => {
          const segmentKey = `sme${index + 1}`;
          if (reportData[key][segmentKey]) {
            totalRow[segmentKey].noa += reportData[key][segmentKey].noa || 0;
            amountTypesArray.forEach(amountType => {
              const amountKey = amountType.toLowerCase();
              totalRow[segmentKey][`${amountKey}_idr`] += reportData[key][segmentKey][`${amountKey}_idr`] || 0;
              totalRow[segmentKey][`${amountKey}_usd`] += reportData[key][segmentKey][`${amountKey}_usd`] || 0;
            });
          }
        });
      }
    });
    
    // Update allReportData with recalculated totals
    allReportData.total = totalRow;
    
    // Merge filtered data
    Object.assign(allReportData, filteredReportData);
    
    // Calculate dynamic column count based on selected amount types
    const amountColumnsPerSegment = amountTypesArray.length * 2; // 2 columns per amount type (IDR, USD)
    const columnsPerSegment = 1 + amountColumnsPerSegment; // NOA + amount columns
    const totalColumns = 1 + groups.length * columnsPerSegment + columnsPerSegment;

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

    // Create segment headers
    let currentCol = 2;
    groups.forEach((group: string) => {
      worksheet.mergeCells(startFromRow + 1, currentCol, startFromRow + 1, currentCol + columnsPerSegment - 1);
      const segmentHeaderCell = worksheet.getCell(startFromRow + 1, currentCol);
      segmentHeaderCell.value = group;
      segmentHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
      segmentHeaderCell.font = { bold: true };
      segmentHeaderCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC0C0C0' },
      };

      // Create sub-headers for each segment
      worksheet.getCell(startFromRow + 2, currentCol).value = 'NOA';
      worksheet.getCell(startFromRow + 2, currentCol).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(startFromRow + 2, currentCol).font = { bold: true };
      worksheet.getCell(startFromRow + 2, currentCol).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC0C0C0' },
      };
      currentCol++;

      amountTypesArray.forEach(amountType => {
        worksheet.getCell(startFromRow + 2, currentCol).value = `Amount (IDR) ${amountType}`;
        worksheet.getCell(startFromRow + 2, currentCol).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(startFromRow + 2, currentCol).font = { bold: true };
        worksheet.getCell(startFromRow + 2, currentCol).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC0C0C0' },
        };
        
        worksheet.getCell(startFromRow + 2, currentCol + 1).value = `Amount (USD) ${amountType}`;
        worksheet.getCell(startFromRow + 2, currentCol + 1).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(startFromRow + 2, currentCol + 1).font = { bold: true };
        worksheet.getCell(startFromRow + 2, currentCol + 1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFC0C0C0' },
        };
        currentCol += 2;
      });
    });

    worksheet.mergeCells(startFromRow + 1, currentCol, startFromRow + 1, currentCol + columnsPerSegment - 1);
    const totalHeaderCell = worksheet.getCell(startFromRow + 1, currentCol);
    totalHeaderCell.value = 'Total';
    totalHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
    totalHeaderCell.font = { bold: true };
    totalHeaderCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC0C0C0' },
    };

    // Create sub-headers for Total column
    worksheet.getCell(startFromRow + 2, currentCol).value = 'NOA';
    worksheet.getCell(startFromRow + 2, currentCol).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(startFromRow + 2, currentCol).font = { bold: true };
    worksheet.getCell(startFromRow + 2, currentCol).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC0C0C0' },
    };
    currentCol++;

    amountTypesArray.forEach(amountType => {
      worksheet.getCell(startFromRow + 2, currentCol).value = `Amount (IDR) ${amountType}`;
      worksheet.getCell(startFromRow + 2, currentCol).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(startFromRow + 2, currentCol).font = { bold: true };
      worksheet.getCell(startFromRow + 2, currentCol).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC0C0C0' },
      };
      
      worksheet.getCell(startFromRow + 2, currentCol + 1).value = `Amount (USD) ${amountType}`;
      worksheet.getCell(startFromRow + 2, currentCol + 1).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(startFromRow + 2, currentCol + 1).font = { bold: true };
      worksheet.getCell(startFromRow + 2, currentCol + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC0C0C0' },
      };
      currentCol += 2;
    });

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
          let totalNOA = 0;
          const totalAmounts: { [key: string]: { idr: number; usd: number } } = {};
          
          // Initialize totals for each amount type
          amountTypesArray.forEach(amountType => {
            totalAmounts[amountType] = { idr: 0, usd: 0 };
          });

          approvedKeys.forEach(key => {
            // Only include data if this specific approved category is in the filtered data
            if (filteredReportData[key]) {
              const data = filteredReportData[key]?.[groupKey] || {};
              totalNOA += data.noa || 0;
              
              // Extract amounts from summaryTotal array for each amount type
              // Only process amounts if NOA > 0
              if ((data.noa || 0) > 0 && data.summaryTotal && Array.isArray(data.summaryTotal)) {
                data.summaryTotal.forEach(summary => {
                  amountTypesArray.forEach(amountType => {
                    if (summary.amountType === amountType && summary.currencyAmount) {
                      summary.currencyAmount.forEach(currency => {
                        if (currency.currency === 'IDR') {
                          totalAmounts[amountType].idr += parseFloat(currency.amount) || 0;
                        } else if (currency.currency === 'USD') {
                          totalAmounts[amountType].usd += parseFloat(currency.amount) || 0;
                        }
                      });
                    }
                  });
                });
              }
            }
          });

          rowData.push(totalNOA.toString());
          amountTypesArray.forEach(amountType => {
            rowData.push(
              this.formatNumber(totalAmounts[amountType].idr),
              this.formatNumber(totalAmounts[amountType].usd)
            );
          });
        } else if (condition.key === 'reject_parent') {
          const rejectKeys = ['reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other'];
          let totalNOA = 0;
          const totalAmounts: { [key: string]: { idr: number; usd: number } } = {};
          
          // Initialize totals for each amount type
          amountTypesArray.forEach(amountType => {
            totalAmounts[amountType] = { idr: 0, usd: 0 };
          });

          rejectKeys.forEach(key => {
            // Only include data if this specific reject category is in the filtered data
            if (filteredReportData[key]) {
              const data = filteredReportData[key]?.[groupKey] || {};
              totalNOA += data.noa || 0;
              
              // Extract amounts from summaryTotal array for each amount type
              // Only process amounts if NOA > 0
              if ((data.noa || 0) > 0 && data.summaryTotal && Array.isArray(data.summaryTotal)) {
                data.summaryTotal.forEach(summary => {
                  amountTypesArray.forEach(amountType => {
                    if (summary.amountType === amountType && summary.currencyAmount) {
                      summary.currencyAmount.forEach(currency => {
                        if (currency.currency === 'IDR') {
                          totalAmounts[amountType].idr += parseFloat(currency.amount) || 0;
                        } else if (currency.currency === 'USD') {
                          totalAmounts[amountType].usd += parseFloat(currency.amount) || 0;
                        }
                      });
                    }
                  });
                });
              }
            }
          });

          rowData.push(totalNOA.toString());
          amountTypesArray.forEach(amountType => {
            rowData.push(
              this.formatNumber(totalAmounts[amountType].idr),
              this.formatNumber(totalAmounts[amountType].usd)
            );
          });
        } else if (isPercentageRow) {
          // Calculate percentage based on category totals vs grand total
          let categoryKeys: string[] = [];
          if (condition.key === 'percent_approved') {
            categoryKeys = ['approved_new', 'approved_additional', 'approved_renewal', 'approved_restructure', 'approved_decrease', 'approved_other'];
          } else if (condition.key === 'percent_reject') {
            categoryKeys = ['reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other'];
          } else if (condition.key === 'percent_cancel') {
            categoryKeys = ['cancel'];
          }

          // Calculate category total NOA
          let categoryNOA = 0;
          categoryKeys.forEach(key => {
            if (filteredReportData[key]) {
              const data = filteredReportData[key]?.[groupKey] || {};
              categoryNOA += data.noa || 0;
            }
          });

          // Calculate grand total NOA
          const allKeys = [
            'approved_new', 'approved_additional', 'approved_renewal', 'approved_restructure', 'approved_decrease', 'approved_other',
            'reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other',
            'cancel'
          ];
          let grandTotalNOA = 0;
          allKeys.forEach(key => {
            if (filteredReportData[key]) {
              const data = filteredReportData[key]?.[groupKey] || {};
              grandTotalNOA += data.noa || 0;
            }
          });

          // Calculate percentage
          const percentage = grandTotalNOA > 0 ? ((categoryNOA / grandTotalNOA) * 100).toFixed(2) : '0.00';
          rowData.push(percentage + '%');
          
          // Add zeros for all amount types (percentages don't show amounts)
          amountTypesArray.forEach(() => {
            rowData.push('0', '0');
          });
        } else if (condition.key === 'total') {
          // For 'total' row, calculate by summing all categories
          const allKeys = [
            'approved_new', 'approved_additional', 'approved_renewal', 'approved_restructure', 'approved_decrease', 'approved_other',
            'reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other',
            'cancel'
          ];
          let totalNOA = 0;
          const totalAmounts: { [key: string]: { idr: number; usd: number } } = {};
          
          // Initialize totals for each amount type
          amountTypesArray.forEach(amountType => {
            totalAmounts[amountType] = { idr: 0, usd: 0 };
          });

          allKeys.forEach(key => {
            if (filteredReportData[key]) {
              const data = filteredReportData[key]?.[groupKey] || {};
              totalNOA += data.noa || 0;
              
              // Only process amounts if NOA > 0
              if ((data.noa || 0) > 0 && data.summaryTotal && Array.isArray(data.summaryTotal)) {
                data.summaryTotal.forEach(summary => {
                  amountTypesArray.forEach(amountType => {
                    if (summary.amountType === amountType && summary.currencyAmount) {
                      summary.currencyAmount.forEach(currency => {
                        if (currency.currency === 'IDR') {
                          totalAmounts[amountType].idr += parseFloat(currency.amount) || 0;
                        } else if (currency.currency === 'USD') {
                          totalAmounts[amountType].usd += parseFloat(currency.amount) || 0;
                        }
                      });
                    }
                  });
                });
              }
            }
          });

          rowData.push(totalNOA.toString());
          amountTypesArray.forEach(amountType => {
            rowData.push(
              this.formatNumber(totalAmounts[amountType].idr),
              this.formatNumber(totalAmounts[amountType].usd)
            );
          });
        } else {
          // For other individual categories, use filteredReportData
          const data = filteredReportData[condition.key]?.[groupKey] || {};
          rowData.push(data.noa || '0');
          
          // Extract amounts from summaryTotal array based on amountType and currency
          amountTypesArray.forEach((amountType) => {
            let idrAmount = 0;
            let usdAmount = 0;
            
            // Only process amounts if NOA > 0
            if ((data.noa || 0) > 0 && data.summaryTotal && Array.isArray(data.summaryTotal)) {
              data.summaryTotal.forEach(summary => {
                if (summary.amountType === amountType && summary.currencyAmount) {
                  summary.currencyAmount.forEach(currency => {
                    if (currency.currency === 'IDR') {
                      idrAmount = parseFloat(currency.amount) || 0;
                    } else if (currency.currency === 'USD') {
                      usdAmount = parseFloat(currency.amount) || 0;
                    }
                  });
                }
              });
            }
            
            rowData.push(
              idrAmount ? this.formatNumber(idrAmount) : '0',
              usdAmount ? this.formatNumber(usdAmount) : '0'
            );
          });
        }
      });

      // Handle Total column
      if (condition.key === 'approved_parent') {
        const approvedKeys = [
          'approved_new',
          'approved_additional',
          'approved_renewal',
          'approved_restructure',
          'approved_decrease',
          'approved_other',
        ];
        let totalNOA = 0;
        const totalAmounts: { [key: string]: { idr: number; usd: number } } = {};
        
        // Initialize totals for each amount type
        amountTypesArray.forEach(amountType => {
          totalAmounts[amountType] = { idr: 0, usd: 0 };
        });

        approvedKeys.forEach(key => {
          // Only include data if this specific approved category is in the filtered data
          if (filteredReportData[key]) {
            const data = filteredReportData[key]?.total || {};
            totalNOA += data.noa || 0;
            
            // Extract amounts from summaryTotal array for each amount type
            // Only process amounts if NOA > 0
            if ((data.noa || 0) > 0 && data.summaryTotal && Array.isArray(data.summaryTotal)) {
              data.summaryTotal.forEach(summary => {
                amountTypesArray.forEach(amountType => {
                  if (summary.amountType === amountType && summary.currencyAmount) {
                    summary.currencyAmount.forEach(currency => {
                      if (currency.currency === 'IDR') {
                        totalAmounts[amountType].idr += parseFloat(currency.amount) || 0;
                      } else if (currency.currency === 'USD') {
                        totalAmounts[amountType].usd += parseFloat(currency.amount) || 0;
                      }
                    });
                  }
                });
              });
            }
          }
        });

        rowData.push(totalNOA.toString());
        amountTypesArray.forEach(amountType => {
          rowData.push(
            this.formatNumber(totalAmounts[amountType].idr),
            this.formatNumber(totalAmounts[amountType].usd)
          );
        });
      } else if (condition.key === 'reject_parent') {
        const rejectKeys = ['reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other'];
        let totalNOA = 0;
        const totalAmounts: { [key: string]: { idr: number; usd: number } } = {};
        
        // Initialize totals for each amount type
        amountTypesArray.forEach(amountType => {
          totalAmounts[amountType] = { idr: 0, usd: 0 };
        });

        rejectKeys.forEach(key => {
          // Only include data if this specific reject category is in the filtered data
          if (filteredReportData[key]) {
            const data = filteredReportData[key]?.total || {};
            totalNOA += data.noa || 0;
            
            // Extract amounts from summaryTotal array for each amount type
            // Only process amounts if NOA > 0
            if ((data.noa || 0) > 0 && data.summaryTotal && Array.isArray(data.summaryTotal)) {
              data.summaryTotal.forEach(summary => {
                amountTypesArray.forEach(amountType => {
                  if (summary.amountType === amountType && summary.currencyAmount) {
                    summary.currencyAmount.forEach(currency => {
                      if (currency.currency === 'IDR') {
                        totalAmounts[amountType].idr += parseFloat(currency.amount) || 0;
                      } else if (currency.currency === 'USD') {
                        totalAmounts[amountType].usd += parseFloat(currency.amount) || 0;
                      }
                    });
                  }
                });
              });
            }
          }
        });

        rowData.push(totalNOA.toString());
        amountTypesArray.forEach(amountType => {
          rowData.push(
            this.formatNumber(totalAmounts[amountType].idr),
            this.formatNumber(totalAmounts[amountType].usd)
          );
        });
      } else if (isPercentageRow) {
        // Calculate percentage based on category totals vs grand total
        let categoryKeys: string[] = [];
        if (condition.key === 'percent_approved') {
          categoryKeys = ['approved_new', 'approved_additional', 'approved_renewal', 'approved_restructure', 'approved_decrease', 'approved_other'];
        } else if (condition.key === 'percent_reject') {
          categoryKeys = ['reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other'];
        } else if (condition.key === 'percent_cancel') {
          categoryKeys = ['cancel'];
        }

        // Calculate category total NOA
        let categoryNOA = 0;
        categoryKeys.forEach(key => {
          if (filteredReportData[key]) {
            const data = filteredReportData[key]?.total || {};
            categoryNOA += data.noa || 0;
          }
        });

        // Calculate grand total NOA
        const allKeys = [
          'approved_new', 'approved_additional', 'approved_renewal', 'approved_restructure', 'approved_decrease', 'approved_other',
          'reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other',
          'cancel'
        ];
        let grandTotalNOA = 0;
        allKeys.forEach(key => {
          if (filteredReportData[key]) {
            const data = filteredReportData[key]?.total || {};
            grandTotalNOA += data.noa || 0;
          }
        });

        // Calculate percentage
        const percentage = grandTotalNOA > 0 ? ((categoryNOA / grandTotalNOA) * 100).toFixed(2) : '0.00';
        rowData.push(percentage + '%');
        
        // Add zeros for all amount types (percentages don't show amounts)
        amountTypesArray.forEach(() => {
          rowData.push('0', '0');
        });
      } else if (condition.key === 'total') {
        // For 'total' row, calculate by summing all categories
        const allKeys = [
          'approved_new', 'approved_additional', 'approved_renewal', 'approved_restructure', 'approved_decrease', 'approved_other',
          'reject_new', 'reject_additional', 'reject_renewal', 'reject_restructure', 'reject_decrease', 'reject_other',
          'cancel'
        ];
        let totalNOA = 0;
        const totalAmounts: { [key: string]: { idr: number; usd: number } } = {};
        
        // Initialize totals for each amount type
        amountTypesArray.forEach(amountType => {
          totalAmounts[amountType] = { idr: 0, usd: 0 };
        });

        allKeys.forEach(key => {
          if (filteredReportData[key]) {
            const data = filteredReportData[key]?.total || {};
            totalNOA += data.noa || 0;
            
            // Only process amounts if NOA > 0
            if ((data.noa || 0) > 0 && data.summaryTotal && Array.isArray(data.summaryTotal)) {
              data.summaryTotal.forEach(summary => {
                amountTypesArray.forEach(amountType => {
                  if (summary.amountType === amountType && summary.currencyAmount) {
                    summary.currencyAmount.forEach(currency => {
                      if (currency.currency === 'IDR') {
                        totalAmounts[amountType].idr += parseFloat(currency.amount) || 0;
                      } else if (currency.currency === 'USD') {
                        totalAmounts[amountType].usd += parseFloat(currency.amount) || 0;
                      }
                    });
                  }
                });
              });
            }
          }
        });

        rowData.push(totalNOA.toString());
        amountTypesArray.forEach(amountType => {
          rowData.push(
            this.formatNumber(totalAmounts[amountType].idr),
            this.formatNumber(totalAmounts[amountType].usd)
          );
        });
      } else {
        // For other individual categories, use filteredReportData
        const totalData = filteredReportData[condition.key]?.total || {};
        rowData.push(totalData.noa || '0');
        
        // Extract data from summaryTotal array structure
        amountTypesArray.forEach(amountType => {
          let idrAmount = 0;
          let usdAmount = 0;
          
          // Only process amounts if NOA > 0
          if ((totalData.noa || 0) > 0 && totalData.summaryTotal && Array.isArray(totalData.summaryTotal)) {
            totalData.summaryTotal.forEach(summary => {
              if (summary.amountType === amountType && summary.currencyAmount) {
                summary.currencyAmount.forEach(currency => {
                  if (currency.currency === 'IDR') {
                    idrAmount = parseFloat(currency.amount) || 0;
                  } else if (currency.currency === 'USD') {
                    usdAmount = parseFloat(currency.amount) || 0;
                  }
                });
              }
            });
          }
          
          rowData.push(
            idrAmount ? this.formatNumber(idrAmount) : '0',
            usdAmount ? this.formatNumber(usdAmount) : '0'
          );
        });
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
            const columnPosition = (colIndex - 2) % columnsPerSegment;

            if (columnPosition !== 0) {
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

  public generateExcelFromData(data: any): ExcelJS.Workbook {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Summary Approval Compare');

    let lastRow = 0;

    // Process Data 1
    data.data1.forEach((item, index) => {
      this.createTableInWorksheet(
        worksheet,
        item,
        index * (processConditions(data.payloadData1.condition, data.payloadData1.debtorStatus).length + 5) + 6,
        data.payloadData1.condition,
        data.payloadData1.debtorStatus,
        data.payloadData1.amountType
      );
      lastRow = index * (processConditions(data.payloadData1.condition, data.payloadData1.debtorStatus).length + 5) + 6 + processConditions(data.payloadData1.condition, data.payloadData1.debtorStatus).length + 2;
    });

    // Process Data 2
    data.data2.forEach((item, index) => {
      const indexRowData2 = processConditions(data.payloadData2.condition, data.payloadData2.debtorStatus).length + 5;
      this.createTableInWorksheet(worksheet, item, lastRow + 2 + index * indexRowData2 + 3, data.payloadData2.condition, data.payloadData2.debtorStatus, data.payloadData2.amountType);
    });

    return workbook;
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
