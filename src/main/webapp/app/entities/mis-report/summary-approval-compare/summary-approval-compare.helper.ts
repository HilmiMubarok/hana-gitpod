export interface TableData {
  title: string;
  groups: string[];
  reportData: any;
}

export const getSampleTableData = (data): TableData[] => transformAnyDataToTableData(data);

const parseAmount = (amount: string): number => parseFloat(amount) || 0;

export const transformDataIntoTableData = (data: any): TableData[] => {
  const results: TableData[] = [];

  const lcTypeMap = new Map<string, any>();

  data.segment.forEach((segment: any) => {
    segment.lcType.forEach((lc: any) => {
      if (!lcTypeMap.has(lc.lcId)) {
        lcTypeMap.set(lc.lcId, {
          lcId: lc.lcId,
          lcName: lc.lcName,
          segments: [],
        });
      }

      lcTypeMap.get(lc.lcId).segments.push({
        segmentId: segment.segmentId,
        segmentName: segment.segmentName,
        conditionType: lc.conditionType,
      });
    });
  });

  lcTypeMap.forEach((lcData, lcId) => {
    const groups = lcData.segments.map((seg: any) => seg.segmentName);

    const reportData: any = {
      // Approved categories
      approved_new: { total: { noa: 0, summaryTotal: [] } },
      approved_additional: { total: { noa: 0, summaryTotal: [] } },
      approved_renewal: { total: { noa: 0, summaryTotal: [] } },
      approved_restructure: { total: { noa: 0, summaryTotal: [] } },
      approved_decrease: { total: { noa: 0, summaryTotal: [] } },
      approved_other: { total: { noa: 0, summaryTotal: [] } },

      // Reject categories
      reject_new: { total: { noa: 0, summaryTotal: [] } },
      reject_additional: { total: { noa: 0, summaryTotal: [] } },
      reject_renewal: { total: { noa: 0, summaryTotal: [] } },
      reject_restructure: { total: { noa: 0, summaryTotal: [] } },
      reject_decrease: { total: { noa: 0, summaryTotal: [] } },
      reject_other: { total: { noa: 0, summaryTotal: [] } },

      // Other categories
      cancel: { total: { noa: 0, summaryTotal: [] } },
      total: { total: { noa: 0, summaryTotal: [] } },
      percent_approved: { total: { noa: '', summaryTotal: [] } },
      percent_reject: { total: { noa: '', summaryTotal: [] } },
      percent_cancel: { total: { noa: '', summaryTotal: [] } },
    };

    groups.forEach((_: string, index: number) => {
      const segmentKey = `sme${index + 1}`;
      Object.keys(reportData).forEach(category => {
        if (!reportData[category][segmentKey]) {
          reportData[category][segmentKey] = { noa: 0, summaryTotal: [] };
        }
      });
    });

    // Process each segment
    lcData.segments.forEach((segment: any, segmentIndex: number) => {
      const segmentKey = `sme${segmentIndex + 1}`;

      //   if conditionType undefined
      if (!segment.conditionType) {
        segment.conditionType = [];
      }

      segment.conditionType.forEach((condition: any) => {
        const conditionName = condition.conditionName.toLowerCase();

        if (condition.product && condition.product.length > 0) {
          condition.product.forEach((product: any) => {
            const kategori = product.kategoriProduct.toLowerCase();
            let categoryKey = '';

            if (conditionName === 'approved') {
              if (kategori.includes('new') || kategori.includes('ntb')) {
                categoryKey = 'approved_new';
              } else if (kategori.includes('additional') || kategori.includes('existing')) {
                categoryKey = 'approved_additional';
              } else if (kategori.includes('renewal')) {
                categoryKey = 'approved_renewal';
              } else if (kategori.includes('restructure')) {
                categoryKey = 'approved_restructure';
              } else if (kategori.includes('decrease')) {
                categoryKey = 'approved_decrease';
              } else {
                categoryKey = 'approved_other';
              }
            } else if (conditionName === 'reject') {
              if (kategori.includes('new') || kategori.includes('ntb')) {
                categoryKey = 'reject_new';
              } else if (kategori.includes('additional') || kategori.includes('existing')) {
                categoryKey = 'reject_additional';
              } else if (kategori.includes('renewal')) {
                categoryKey = 'reject_renewal';
              } else if (kategori.includes('restructure')) {
                categoryKey = 'reject_restructure';
              } else if (kategori.includes('decrease')) {
                categoryKey = 'reject_decrease';
              } else {
                categoryKey = 'reject_other';
              }
            } else if (conditionName === 'cancel') {
              categoryKey = 'cancel';
            }

            if (categoryKey && reportData[categoryKey]) {
              // Update segment data
              const noa = parseInt(product.noa, 10) || 0;
              reportData[categoryKey][segmentKey].noa += noa;
              
              // Only process summaryTotal if NOA > 0
              if (noa > 0) {
                // Process summaryTotal at condition level (same level as product)
                const amountTypeMap = new Map();
                
                if (condition.summaryTotal && condition.summaryTotal.length > 0) {
                  condition.summaryTotal.forEach((summary: any) => {
                    const amountType = summary.amountType;
                    
                    if (!amountTypeMap.has(amountType)) {
                      amountTypeMap.set(amountType, {
                        amountType,
                        currencyAmount: []
                      });
                    }

                    if (summary.currencyAmount) {
                      summary.currencyAmount.forEach((currency: any) => {
                        const existingCurrency = amountTypeMap.get(amountType).currencyAmount.find(c => c.currency === currency.currency);
                        if (existingCurrency) {
                          existingCurrency.amount = (parseAmount(existingCurrency.amount) + parseAmount(currency.amount)).toString();
                        } else {
                          amountTypeMap.get(amountType).currencyAmount.push({
                            currency: currency.currency,
                            amount: currency.amount
                          });
                        }
                      });
                    }
                  });
                }

                // Convert map to summaryTotal array
                const summaryTotalArray = Array.from(amountTypeMap.values());
                reportData[categoryKey][segmentKey].summaryTotal = summaryTotalArray;
              } else {
                // If NOA = 0, ensure summaryTotal is empty
                reportData[categoryKey][segmentKey].summaryTotal = [];
              }

              // Update total
              reportData[categoryKey].total.noa += noa;
              
              // Merge summaryTotal for totals only if NOA > 0
              if (noa > 0 && reportData[categoryKey][segmentKey].summaryTotal) {
                reportData[categoryKey][segmentKey].summaryTotal.forEach(summaryItem => {
                  const existingTotal = reportData[categoryKey].total.summaryTotal.find(t => t.amountType === summaryItem.amountType);
                  if (existingTotal) {
                    summaryItem.currencyAmount.forEach(currency => {
                      const existingCurrency = existingTotal.currencyAmount.find(c => c.currency === currency.currency);
                      if (existingCurrency) {
                        existingCurrency.amount = (parseAmount(existingCurrency.amount) + parseAmount(currency.amount)).toString();
                      } else {
                        existingTotal.currencyAmount.push({
                          currency: currency.currency,
                          amount: currency.amount
                        });
                      }
                    });
                  } else {
                    reportData[categoryKey].total.summaryTotal.push({
                      amountType: summaryItem.amountType,
                      currencyAmount: [...summaryItem.currencyAmount]
                    });
                  }
                });
              }
            }
          });
        }
      });
    });

    // Calculate grand totals using summaryTotal structure
    let grandTotalNOA = 0;
    const grandTotalSummaryTotal = [];

    // Sum all approved, reject, and cancel
    const categoriesToSum = [
      'approved_new', 'approved_additional', 'approved_renewal', 
      'approved_restructure', 'approved_decrease', 'approved_other',
      'reject_new', 'reject_additional', 'reject_renewal', 
      'reject_restructure', 'reject_decrease', 'reject_other',
      'cancel'
    ];

    categoriesToSum.forEach(key => {
      if (reportData[key]) {
        grandTotalNOA += reportData[key].total.noa || 0;

        // Merge summaryTotal for grand total
        if (reportData[key].total.summaryTotal) {
          reportData[key].total.summaryTotal.forEach(summaryItem => {
            const existingGrandTotal = grandTotalSummaryTotal.find(t => t.amountType === summaryItem.amountType);
            if (existingGrandTotal) {
              summaryItem.currencyAmount.forEach(currency => {
                const existingCurrency = existingGrandTotal.currencyAmount.find(c => c.currency === currency.currency);
                if (existingCurrency) {
                  existingCurrency.amount = (parseAmount(existingCurrency.amount) + parseAmount(currency.amount)).toString();
                } else {
                  existingGrandTotal.currencyAmount.push({
                    currency: currency.currency,
                    amount: currency.amount
                  });
                }
              });
            } else {
              grandTotalSummaryTotal.push({
                amountType: summaryItem.amountType,
                currencyAmount: [...summaryItem.currencyAmount]
              });
            }
          });
        }

        // Update segment totals
        groups.forEach((_: string, index: number) => {
          const segmentKey = `sme${index + 1}`;
          if (reportData[key][segmentKey]) {
            reportData.total[segmentKey].noa += reportData[key][segmentKey].noa || 0;
            
            // Merge summaryTotal for segment totals
            if (reportData[key][segmentKey].summaryTotal) {
              reportData[key][segmentKey].summaryTotal.forEach(summaryItem => {
                const existingSegmentTotal = reportData.total[segmentKey].summaryTotal.find(t => t.amountType === summaryItem.amountType);
                if (existingSegmentTotal) {
                  summaryItem.currencyAmount.forEach(currency => {
                    const existingCurrency = existingSegmentTotal.currencyAmount.find(c => c.currency === currency.currency);
                    if (existingCurrency) {
                      existingCurrency.amount = (parseAmount(existingCurrency.amount) + parseAmount(currency.amount)).toString();
                    } else {
                      existingSegmentTotal.currencyAmount.push({
                        currency: currency.currency,
                        amount: currency.amount
                      });
                    }
                  });
                } else {
                  reportData.total[segmentKey].summaryTotal.push({
                    amountType: summaryItem.amountType,
                    currencyAmount: [...summaryItem.currencyAmount]
                  });
                }
              });
            }
          }
        });
      }
    });

    reportData.total.total = {
      noa: grandTotalNOA,
      summaryTotal: grandTotalSummaryTotal,
    };

    // Calculate percentages for each segment and total
    groups.forEach((_: string, index: number) => {
      const segmentKey = `sme${index + 1}`;

      // Calculate totals for this segment
      const approvedSegmentTotal = Object.keys(reportData)
        .filter(key => key.startsWith('approved_'))
        .reduce((sum, key) => sum + (reportData[key][segmentKey]?.noa || 0), 0);

      const rejectSegmentTotal = Object.keys(reportData)
        .filter(key => key.startsWith('reject_'))
        .reduce((sum, key) => sum + (reportData[key][segmentKey]?.noa || 0), 0);

      const cancelSegmentTotal = reportData.cancel[segmentKey]?.noa || 0;

      const segmentGrandTotal = reportData.total[segmentKey]?.noa || 0;

      // Calculate percentages for this segment
      if (segmentGrandTotal > 0) {
        reportData.percent_approved[segmentKey].noa = `${Math.round((approvedSegmentTotal / segmentGrandTotal) * 100)}%`;
        reportData.percent_reject[segmentKey].noa = `${Math.round((rejectSegmentTotal / segmentGrandTotal) * 100)}%`;
        reportData.percent_cancel[segmentKey].noa = `${Math.round((cancelSegmentTotal / segmentGrandTotal) * 100)}%`;
      } else {
        reportData.percent_approved[segmentKey].noa = '0%';
        reportData.percent_reject[segmentKey].noa = '0%';
        reportData.percent_cancel[segmentKey].noa = '0%';
      }
    });

    const approvedTotal = Object.keys(reportData)
      .filter(key => key.startsWith('approved_'))
      .reduce((sum, key) => sum + reportData[key].total.noa, 0);

    const rejectTotal = Object.keys(reportData)
      .filter(key => key.startsWith('reject_'))
      .reduce((sum, key) => sum + reportData[key].total.noa, 0);

    const cancelTotal = reportData.cancel.total.noa;

    if (grandTotalNOA > 0) {
      reportData.percent_approved.total.noa = `${Math.round((approvedTotal / grandTotalNOA) * 100)}%`;
      reportData.percent_reject.total.noa = `${Math.round((rejectTotal / grandTotalNOA) * 100)}%`;
      reportData.percent_cancel.total.noa = `${Math.round((cancelTotal / grandTotalNOA) * 100)}%`;
    } else {
      reportData.percent_approved.total.noa = '0%';
      reportData.percent_reject.total.noa = '0%';
      reportData.percent_cancel.total.noa = '0%';
    }
    
    results.push({
      title: `${lcData.lcName}`,
      groups,
      reportData,
    });

  });

  return results;
};

export const transformAnyDataToTableData = (data: any): TableData[] => {
  const normalizedData = normalizeDataFormat(data);
  return transformDataIntoTableData(normalizedData);
};

const normalizeDataFormat = (data: any): any => {
  if (data.segment && Array.isArray(data.segment)) {
    const hasListLC = data.segment.some((segment: any) => segment.lcType && segment.lcType.some((lc: any) => lc.listLC));

    if (hasListLC) {

      const normalizedSegments = data.segment.map((segment: any) => {
        const flattenedLcTypes: any[] = [];

        if (segment.lcType && Array.isArray(segment.lcType)) {
          segment.lcType.forEach((lcGroup: any) => {
            if (lcGroup.listLC && Array.isArray(lcGroup.listLC)) {
              lcGroup.listLC.forEach((lc: any) => {
                flattenedLcTypes.push({
                  lcId: lc.lcId,
                  lcName: lc.lcName,
                  conditionType: lc.conditionType || [],
                });
              });
            } else {
              flattenedLcTypes.push(lcGroup);
            }
          });
        }

        return {
          segmentId: segment.segmentId,
          segmentName: segment.segmentName,
          lcType: flattenedLcTypes,
        };
      });

      return {
        createDate: data.createDate || new Date().toISOString().split('T')[0],
        proposalType: data.proposalType || 'Flattened ListLC Data',
        segment: normalizedSegments,
      };
    }

    return data;
  }

  if (data.lcType && Array.isArray(data.lcType)) {
    const allSegments = new Map<string, any>();

    data.lcType.forEach((lc: any) => {
      if (lc.segment && Array.isArray(lc.segment)) {
        lc.segment.forEach((segment: any) => {
          const segmentKey = `${segment.segmentId}_${segment.segmentName}`;

          if (!allSegments.has(segmentKey)) {
            allSegments.set(segmentKey, {
              segmentId: segment.segmentId,
              segmentName: segment.segmentName,
              lcType: [],
            });
          }

          const segmentData = allSegments.get(segmentKey);
          segmentData.lcType.push({
            lcId: lc.lcId,
            lcName: lc.lcName,
            conditionType: segment.conditionType || [],
          });
        });
      }
    });

    return {
      createDate: data.createDate || new Date().toISOString().split('T')[0],
      proposalType: data.proposalType || 'Converted JsonData',
      segment: Array.from(allSegments.values()),
    };
  }

  if (Array.isArray(data)) {
    return {
      createDate: new Date().toISOString().split('T')[0],
      proposalType: 'Converted Data',
      segment: data,
    };
  }

  if (data.segments && Array.isArray(data.segments)) {
    return {
      createDate: data.createDate || new Date().toISOString().split('T')[0],
      proposalType: data.proposalType || 'Converted Data',
      segment: data.segments,
    };
  }

  if (data.segmentId || data.segmentName) {
    return {
      createDate: new Date().toISOString().split('T')[0],
      proposalType: 'Single Segment Data',
      segment: [data],
    };
  }

  return data;
};

export const processConditions = (conditions: string, debtorStatus: string) => {
  const allConditions = [
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

  // Dynamic excludeParents based on selected conditions
  const conditionsArray = conditions.split(',').map(c => c.trim());
  const excludeParents = ['Total']; // Total always included
  
  // Only include percentage items for selected conditions
  if (conditionsArray.includes('Approved')) {
    excludeParents.push('% Total Approved');
  }
  if (conditionsArray.includes('Reject')) {
    excludeParents.push('% Total Reject');
  }
  if (conditionsArray.includes('Cancel')) {
    excludeParents.push('% Total Cancel');
  }

  if (conditions.length === 0 && debtorStatus.length === 0) {
    return allConditions;
  }

  const mapped = allConditions.map(item => {
    if (excludeParents.includes(item.parent)) {
      return item;
    }

    if (!conditions.includes(item.parent)) {
      return { ...item, label: '' };
    }

    if (item.isSubItem) {
      const cleanLabel = item.label.replace(/^- /, '');
      if (!debtorStatus.includes(cleanLabel)) {
        return { ...item, label: '' };
      }
    }

    return item;
  });

  const grouped = [];
  let currentParent = null;
  let buffer = [];

  mapped.forEach(item => {
    if (item.isParent) {
      if (buffer.length > 0) {
        grouped.push(
          ...buffer.sort((a, b) => {
            if (a.label === '' && b.label !== '') {
              return 1;
            }
            if (a.label !== '' && b.label === '') {
              return -1;
            }
            return 0;
          })
        );
        buffer = [];
      }
      grouped.push(item);
      currentParent = item.parent;
    } else {
      buffer.push(item);
    }
  });

  if (buffer.length > 0) {
    grouped.push(
      ...buffer.sort((a, b) => {
        if (a.label === '' && b.label !== '') {
          return 1;
        }
        if (a.label !== '' && b.label === '') {
          return -1;
        }
        return 0;
      })
    );
  }

  // First filter: remove empty labels except for excludeParents and parents
  const filteredGrouped = grouped.filter(item => item.label !== '' || excludeParents.includes(item.parent) || item.isParent);

  // Second filter: remove parents that don't have any active sub-items
  const finalFiltered = [];
  let i = 0;
  
  while (i < filteredGrouped.length) {
    const currentItem = filteredGrouped[i];
    
    if (currentItem.isParent && !excludeParents.includes(currentItem.parent)) {
      // Check if this parent has any active sub-items
      let hasActiveSubItems = false;
      let j = i + 1;
      
      // Look ahead to find sub-items for this parent
      while (j < filteredGrouped.length && !filteredGrouped[j].isParent) {
        if (filteredGrouped[j].parent === currentItem.parent && filteredGrouped[j].label !== '') {
          hasActiveSubItems = true;
          break;
        }
        j++;
      }
      
      // Only include parent if it has active sub-items
      if (hasActiveSubItems) {
        finalFiltered.push(currentItem);
        // Add all sub-items for this parent
        j = i + 1;
        while (j < filteredGrouped.length && !filteredGrouped[j].isParent) {
          if (filteredGrouped[j].parent === currentItem.parent) {
            finalFiltered.push(filteredGrouped[j]);
          }
          j++;
        }
        i = j; // Skip to next parent
      } else {
        // Skip this parent and all its sub-items
        j = i + 1;
        while (j < filteredGrouped.length && !filteredGrouped[j].isParent) {
          j++;
        }
        i = j; // Skip to next parent
      }
    } else {
      // For excludeParents or non-parent items, always include
      finalFiltered.push(currentItem);
      i++;
    }
  }

  return finalFiltered;
};