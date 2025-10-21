export interface TableData {
  title: string;
  groups: string[];
  reportData: any;
}

export const getSampleTableData = (data): TableData[] => transformAnyDataToTableData(data);

const parseAmount = (amount: string): number => parseFloat(amount) || 0;

export const transformDataIntoTableData = (data: any): TableData[] => {
  const results: TableData[] = [];

  const isRegionalData =
    data._originalType === 'SEGMENT' ||
    (!data._originalType && data.segment && data.segment.length > 0 && data.segment[0].lcType && data.segment[0].lcType.length > 0);

  if (isRegionalData) {
    data.segment.forEach((segment: any) => {
      const segmentTitle = segment.segmentName;
      const lcGroups = segment.lcType.map((lc: any) => lc.lcName);

      const reportData: any = {
        approved_new: { total: { noa: 0, summaryTotal: [] } },
        approved_additional: { total: { noa: 0, summaryTotal: [] } },
        approved_renewal: { total: { noa: 0, summaryTotal: [] } },
        approved_restructure: { total: { noa: 0, summaryTotal: [] } },
        approved_decrease: { total: { noa: 0, summaryTotal: [] } },
        approved_other: { total: { noa: 0, summaryTotal: [] } },

        reject_new: { total: { noa: 0, summaryTotal: [] } },
        reject_additional: { total: { noa: 0, summaryTotal: [] } },
        reject_renewal: { total: { noa: 0, summaryTotal: [] } },
        reject_restructure: { total: { noa: 0, summaryTotal: [] } },
        reject_decrease: { total: { noa: 0, summaryTotal: [] } },
        reject_other: { total: { noa: 0, summaryTotal: [] } },

        cancel: { total: { noa: 0, summaryTotal: [] } },
        total: { total: { noa: 0, summaryTotal: [] } },
        percent_approved: { total: { noa: '', summaryTotal: [] } },
        percent_reject: { total: { noa: '', summaryTotal: [] } },
        percent_cancel: { total: { noa: '', summaryTotal: [] } },
      };

      // Initialize data for each LC
      lcGroups.forEach((_: string, index: number) => {
        const lcKey = `lc${index + 1}`;
        Object.keys(reportData).forEach(category => {
          if (!reportData[category][lcKey]) {
            reportData[category][lcKey] = { noa: 0, summaryTotal: [] };
          }
        });
      });

      // Process each LC type for this segment
      segment.lcType.forEach((lc: any, lcIndex: number) => {
        const lcKey = `lc${lcIndex + 1}`;

        if (lc.conditionType && lc.conditionType.length > 0) {
          lc.conditionType.forEach((condition: any) => {
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
                  // Update LC data
                  const noa = parseInt(product.noa, 10) || 0;
                  reportData[categoryKey][lcKey].noa += noa;

                  // Only process summaryTotal if NOA > 0
                  if (noa > 0) {
                    // Process summaryTotal at condition level
                    const amountTypeMap = new Map();

                    if (condition.summaryTotal && condition.summaryTotal.length > 0) {
                      condition.summaryTotal.forEach((summary: any) => {
                        const amountType = summary.amountType;

                        if (!amountTypeMap.has(amountType)) {
                          amountTypeMap.set(amountType, {
                            amountType,
                            currencyAmount: [],
                          });
                        }

                        if (summary.currencyAmount) {
                          summary.currencyAmount.forEach((currency: any) => {
                            const existingCurrency = amountTypeMap
                              .get(amountType)
                              .currencyAmount.find(c => c.currency === currency.currency);
                            if (existingCurrency) {
                              existingCurrency.amount = (parseAmount(existingCurrency.amount) + parseAmount(currency.amount)).toString();
                            } else {
                              amountTypeMap.get(amountType).currencyAmount.push({
                                currency: currency.currency,
                                amount: currency.amount,
                              });
                            }
                          });
                        }
                      });
                    }

                    const summaryTotalArray = Array.from(amountTypeMap.values());
                    reportData[categoryKey][lcKey].summaryTotal = summaryTotalArray;
                  } else {
                    reportData[categoryKey][lcKey].summaryTotal = [];
                  }

                  reportData[categoryKey].total.noa += noa;

                  if (noa > 0 && reportData[categoryKey][lcKey].summaryTotal) {
                    reportData[categoryKey][lcKey].summaryTotal.forEach(summaryItem => {
                      const existingTotal = reportData[categoryKey].total.summaryTotal.find(t => t.amountType === summaryItem.amountType);
                      if (existingTotal) {
                        summaryItem.currencyAmount.forEach(currency => {
                          const existingCurrency = existingTotal.currencyAmount.find(c => c.currency === currency.currency);
                          if (existingCurrency) {
                            existingCurrency.amount = (parseAmount(existingCurrency.amount) + parseAmount(currency.amount)).toString();
                          } else {
                            existingTotal.currencyAmount.push({
                              currency: currency.currency,
                              amount: currency.amount,
                            });
                          }
                        });
                      } else {
                        reportData[categoryKey].total.summaryTotal.push({
                          amountType: summaryItem.amountType,
                          currencyAmount: [...summaryItem.currencyAmount],
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        }
      });

      let grandTotalNOA = 0;
      const grandTotalSummaryTotal = [];

      const categoriesToSum = [
        'approved_new',
        'approved_additional',
        'approved_renewal',
        'approved_restructure',
        'approved_decrease',
        'approved_other',
        'reject_new',
        'reject_additional',
        'reject_renewal',
        'reject_restructure',
        'reject_decrease',
        'reject_other',
        'cancel',
      ];

      categoriesToSum.forEach(key => {
        if (reportData[key]) {
          grandTotalNOA += reportData[key].total.noa || 0;

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
                      amount: currency.amount,
                    });
                  }
                });
              } else {
                grandTotalSummaryTotal.push({
                  amountType: summaryItem.amountType,
                  currencyAmount: [...summaryItem.currencyAmount],
                });
              }
            });
          }

          lcGroups.forEach((_: string, index: number) => {
            const lcKey = `lc${index + 1}`;
            if (reportData[key][lcKey]) {
              reportData.total[lcKey].noa += reportData[key][lcKey].noa || 0;

              if (reportData[key][lcKey].summaryTotal) {
                reportData[key][lcKey].summaryTotal.forEach(summaryItem => {
                  const existingLcTotal = reportData.total[lcKey].summaryTotal.find(t => t.amountType === summaryItem.amountType);
                  if (existingLcTotal) {
                    summaryItem.currencyAmount.forEach(currency => {
                      const existingCurrency = existingLcTotal.currencyAmount.find(c => c.currency === currency.currency);
                      if (existingCurrency) {
                        existingCurrency.amount = (parseAmount(existingCurrency.amount) + parseAmount(currency.amount)).toString();
                      } else {
                        existingLcTotal.currencyAmount.push({
                          currency: currency.currency,
                          amount: currency.amount,
                        });
                      }
                    });
                  } else {
                    reportData.total[lcKey].summaryTotal.push({
                      amountType: summaryItem.amountType,
                      currencyAmount: [...summaryItem.currencyAmount],
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

      lcGroups.forEach((_: string, index: number) => {
        const lcKey = `lc${index + 1}`;

        const approvedLcTotal = Object.keys(reportData)
          .filter(key => key.startsWith('approved_'))
          .reduce((sum, key) => sum + (reportData[key][lcKey]?.noa || 0), 0);

        const rejectLcTotal = Object.keys(reportData)
          .filter(key => key.startsWith('reject_'))
          .reduce((sum, key) => sum + (reportData[key][lcKey]?.noa || 0), 0);

        const cancelLcTotal = reportData.cancel[lcKey]?.noa || 0;
        const lcGrandTotal = reportData.total[lcKey]?.noa || 0;

        if (lcGrandTotal > 0) {
          reportData.percent_approved[lcKey].noa = `${Math.round((approvedLcTotal / lcGrandTotal) * 100)}%`;
          reportData.percent_reject[lcKey].noa = `${Math.round((rejectLcTotal / lcGrandTotal) * 100)}%`;
          reportData.percent_cancel[lcKey].noa = `${Math.round((cancelLcTotal / lcGrandTotal) * 100)}%`;
        } else {
          reportData.percent_approved[lcKey].noa = '0%';
          reportData.percent_reject[lcKey].noa = '0%';
          reportData.percent_cancel[lcKey].noa = '0%';
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
        title: segmentTitle,
        groups: lcGroups,
        reportData,
      });
    });
  } else {
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
        approved_new: { total: { noa: 0, summaryTotal: [] } },
        approved_additional: { total: { noa: 0, summaryTotal: [] } },
        approved_renewal: { total: { noa: 0, summaryTotal: [] } },
        approved_restructure: { total: { noa: 0, summaryTotal: [] } },
        approved_decrease: { total: { noa: 0, summaryTotal: [] } },
        approved_other: { total: { noa: 0, summaryTotal: [] } },

        reject_new: { total: { noa: 0, summaryTotal: [] } },
        reject_additional: { total: { noa: 0, summaryTotal: [] } },
        reject_renewal: { total: { noa: 0, summaryTotal: [] } },
        reject_restructure: { total: { noa: 0, summaryTotal: [] } },
        reject_decrease: { total: { noa: 0, summaryTotal: [] } },
        reject_other: { total: { noa: 0, summaryTotal: [] } },

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

      lcData.segments.forEach((segment: any, segmentIndex: number) => {
        const segmentKey = `sme${segmentIndex + 1}`;

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
                const noa = parseInt(product.noa, 10) || 0;
                reportData[categoryKey][segmentKey].noa += noa;

                if (noa > 0) {
                  const amountTypeMap = new Map();

                  if (condition.summaryTotal && condition.summaryTotal.length > 0) {
                    condition.summaryTotal.forEach((summary: any) => {
                      const amountType = summary.amountType;

                      if (!amountTypeMap.has(amountType)) {
                        amountTypeMap.set(amountType, {
                          amountType,
                          currencyAmount: [],
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
                              amount: currency.amount,
                            });
                          }
                        });
                      }
                    });
                  }

                  const summaryTotalArray = Array.from(amountTypeMap.values());
                  reportData[categoryKey][segmentKey].summaryTotal = summaryTotalArray;
                } else {
                  reportData[categoryKey][segmentKey].summaryTotal = [];
                }

                reportData[categoryKey].total.noa += noa;

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
                            amount: currency.amount,
                          });
                        }
                      });
                    } else {
                      reportData[categoryKey].total.summaryTotal.push({
                        amountType: summaryItem.amountType,
                        currencyAmount: [...summaryItem.currencyAmount],
                      });
                    }
                  });
                }
              }
            });
          }
        });
      });

      // Calculate totals and percentages (same as regional logic)
      let grandTotalNOA = 0;
      const grandTotalSummaryTotal = [];

      const categoriesToSum = [
        'approved_new',
        'approved_additional',
        'approved_renewal',
        'approved_restructure',
        'approved_decrease',
        'approved_other',
        'reject_new',
        'reject_additional',
        'reject_renewal',
        'reject_restructure',
        'reject_decrease',
        'reject_other',
        'cancel',
      ];

      categoriesToSum.forEach(key => {
        if (reportData[key]) {
          grandTotalNOA += reportData[key].total.noa || 0;

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
                      amount: currency.amount,
                    });
                  }
                });
              } else {
                grandTotalSummaryTotal.push({
                  amountType: summaryItem.amountType,
                  currencyAmount: [...summaryItem.currencyAmount],
                });
              }
            });
          }

          groups.forEach((_: string, index: number) => {
            const segmentKey = `sme${index + 1}`;
            if (reportData[key][segmentKey]) {
              reportData.total[segmentKey].noa += reportData[key][segmentKey].noa || 0;

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
                          amount: currency.amount,
                        });
                      }
                    });
                  } else {
                    reportData.total[segmentKey].summaryTotal.push({
                      amountType: summaryItem.amountType,
                      currencyAmount: [...summaryItem.currencyAmount],
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

      // Calculate percentages
      groups.forEach((_: string, index: number) => {
        const segmentKey = `sme${index + 1}`;

        const approvedSegmentTotal = Object.keys(reportData)
          .filter(key => key.startsWith('approved_'))
          .reduce((sum, key) => sum + (reportData[key][segmentKey]?.noa || 0), 0);

        const rejectSegmentTotal = Object.keys(reportData)
          .filter(key => key.startsWith('reject_'))
          .reduce((sum, key) => sum + (reportData[key][segmentKey]?.noa || 0), 0);

        const cancelSegmentTotal = reportData.cancel[segmentKey]?.noa || 0;
        const segmentGrandTotal = reportData.total[segmentKey]?.noa || 0;

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
  }

  return results;
};

export const transformAnyDataToTableData = (data: any): TableData[] => {
  // Detect original data type BEFORE normalization
  const isLcTypeData = data.lcType && Array.isArray(data.lcType);
  const normalizedData = normalizeDataFormat(data);

  // Pass the original data type information
  if (isLcTypeData) {
    normalizedData._originalType = 'LC';
  } else {
    normalizedData._originalType = 'SEGMENT';
  }

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

  const excludeParents = ['Total', '% Total Approved', '% Total Reject', '% Total Cancel'];

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

  const filteredGrouped = grouped.filter(item => item.label !== '' || excludeParents.includes(item.parent) || item.isParent);

  return filteredGrouped;
};
