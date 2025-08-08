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
      approved_new: { total: { noa: 0, idr: 0, usd: 0 } },
      approved_additional: { total: { noa: 0, idr: 0, usd: 0 } },
      approved_renewal: { total: { noa: 0, idr: 0, usd: 0 } },
      approved_restructure: { total: { noa: 0, idr: 0, usd: 0 } },
      approved_decrease: { total: { noa: 0, idr: 0, usd: 0 } },
      approved_other: { total: { noa: 0, idr: 0, usd: 0 } },

      // Reject categories
      reject_new: { total: { noa: 0, idr: 0, usd: 0 } },
      reject_additional: { total: { noa: 0, idr: 0, usd: 0 } },
      reject_renewal: { total: { noa: 0, idr: 0, usd: 0 } },
      reject_restructure: { total: { noa: 0, idr: 0, usd: 0 } },
      reject_decrease: { total: { noa: 0, idr: 0, usd: 0 } },
      reject_other: { total: { noa: 0, idr: 0, usd: 0 } },

      // Other categories
      cancel: { total: { noa: 0, idr: 0, usd: 0 } },
      total: { total: { noa: 0, idr: 0, usd: 0 } },
      percent_approved: { total: { noa: '', idr: '', usd: '' } },
      percent_reject: { total: { noa: '', idr: '', usd: '' } },
      percent_cancel: { total: { noa: '', idr: '', usd: '' } },
    };

    groups.forEach((_: string, index: number) => {
      const segmentKey = `sme${index + 1}`;
      Object.keys(reportData).forEach(category => {
        if (!reportData[category][segmentKey]) {
          reportData[category][segmentKey] = { noa: 0, idr: 0, usd: 0 };
        }
      });
    });

    // Process each segment
    lcData.segments.forEach((segment: any, segmentIndex: number) => {
      console.log('Segment: ', segment);
      console.log('Segment Index: ', segmentIndex);

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
              // Sum up amounts from summaryAmount
              let totalIDR = 0;
              let totalUSD = 0;

              if (product.summaryAmount && product.summaryAmount.length > 0) {
                product.summaryAmount.forEach((summary: any) => {
                  if (summary.currencyAmount) {
                    summary.currencyAmount.forEach((currency: any) => {
                      const amount = parseAmount(currency.amount);
                      if (currency.currency === 'IDR') {
                        totalIDR += amount;
                      } else if (currency.currency === 'USD') {
                        totalUSD += amount;
                      }
                    });
                  }
                });
              }

              // If no USD amount, set to 0
              if (totalUSD === 0 && totalIDR > 0) {
                totalUSD = 0;
              }

              // Update segment data
              const noa = parseInt(product.noa, 10) || 0;
              reportData[categoryKey][segmentKey].noa += noa;
              reportData[categoryKey][segmentKey].idr += totalIDR;
              reportData[categoryKey][segmentKey].usd += totalUSD;

              // Update total
              reportData[categoryKey].total.noa += noa;
              reportData[categoryKey].total.idr += totalIDR;
              reportData[categoryKey].total.usd += totalUSD;
            }
          });
        }
      });
    });

    // Calculate grand totals
    let grandTotalNOA = 0;
    let grandTotalIDR = 0;
    let grandTotalUSD = 0;

    // Sum all approved, reject, and cancel
    Object.keys(reportData).forEach(key => {
      if (key !== 'total' && !key.startsWith('percent_')) {
        grandTotalNOA += reportData[key].total.noa;
        grandTotalIDR += reportData[key].total.idr;
        grandTotalUSD += reportData[key].total.usd;

        // Update segment totals
        groups.forEach((_: string, index: number) => {
          const segmentKey = `sme${index + 1}`;
          reportData.total[segmentKey].noa += reportData[key][segmentKey].noa;
          reportData.total[segmentKey].idr += reportData[key][segmentKey].idr;
          reportData.total[segmentKey].usd += reportData[key][segmentKey].usd;
        });
      }
    });

    reportData.total.total = {
      noa: grandTotalNOA,
      idr: grandTotalIDR,
      usd: grandTotalUSD,
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

    const tableData: TableData = {
      title: lcData.lcName,
      groups,
      reportData,
    };

    results.push(tableData);
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
      console.log('🔄 Converting segment structure with listLC...');

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
