import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export abstract class AbstractExcelMISReport {
  protected workbook: ExcelJS.Workbook;
  protected worksheet: ExcelJS.Worksheet;

  constructor(sheetName = 'Sheet 1') {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet(sheetName);
  }

  protected abstract processData(data: any[]): void;

  protected setUpColumns(columns): void {
    this.worksheet.columns = columns;
  }

  protected applyStyles(): void {
    this.worksheet.columns.forEach((column, index) => {
      this.worksheet.getCell(1, index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'fffefd32' },
      };
    });

    this.worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber === 1) {
        this.worksheet.getRow(rowNumber).font = { bold: true };
        this.worksheet.getRow(rowNumber).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      }

      row.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
  }

  protected async downloadFile(fileName: string): Promise<void> {
    const buffer = await this.workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const date = new Date();
    const outputName = `${fileName}_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;
    saveAs(blob, outputName);
  }

  public async generateReport(data: any[], fileName: string): Promise<void> {
    this.processData(data);
    this.applyStyles();
    await this.downloadFile(fileName);
  }

  // ============= HELPER METHODS FOR CP GENERAL ============= //

  protected _convertStatusToString(status: Array<string>): string {
    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  protected _getFacilityProposedDataSource(proposal) {
    // if proposal.previousHistory null
    if (proposal.previousHistory === null) {
      return '';
    }

    const products = proposal.previousHistory[0].product;

    // if products null
    if (products === null) {
      return '';
    }

    return products
      .map(product => {
        product.pengajuan;
      })
      .join(',\n');
  }

  protected _gettotalPlafondProposed(proposal, currency: 'IDR' | 'USD') {
    // if proposal.previousHistory null
    if (proposal.previousHistory === null) {
      return '';
    }

    const facility = proposal.previousHistory[0].facility;

    // if products null
    if (facility === null) {
      return '';
    }

    return currency === 'IDR' ? facility.totalPlafondIDR : facility.totalPlafondUSD;
  }

  protected _getTotalPlafond(proposal, currency: 'IDR' | 'USD', facilityType: 'Cash' | 'Installment') {
    // check if proposal.product is null
    if (proposal.product === null) {
      return '';
    }

    const products = proposal.product;
    const installmentFacilities = ['WCL', 'IL'];

    return products
      .filter(product => product.currency === currency) // Filter by currency
      .filter(product => {
        if (facilityType === 'Cash') {
          // For 'Cash', facility should NOT be 'WCL' or 'IL'
          return !installmentFacilities.includes(product.facility);
        } else if (facilityType === 'Installment') {
          // For 'Installment', facility should ONLY be 'WCL' or 'IL'
          return installmentFacilities.includes(product.facility);
        }
        return false; // In case an unsupported facilityType is passed
      })
      .reduce((sum, product) => sum + parseFloat(product.totalPlafond), 0)
      .toString();
  }

  protected _getRate(proposal: any, type: 'Proposed' | 'DAR Final'): string {
    // Determine the products based on the type, either from previous history or current proposal
    const products = type === 'Proposed' ? proposal.previousHistory?.product : proposal.product;

    // Return an '' if products is null or undefined
    if (!products) {
      return '';
    }

    // Map over each product to extract proposed rates and join them with a newline separator
    return products.map(({ rateProposed }) => rateProposed).join(',\n');
  }

  protected _getDebiturGroup(proposal: any): string {
    const { businessGroup } = proposal;

    // Return '' if businessGroup is null
    if (!businessGroup) {
      return '';
    }

    const { customersGrup } = businessGroup;

    // Return '' if customersGrup is null
    if (!customersGrup) {
      return '';
    }

    // Map over each customer group to extract customer names and join them with a newline separator
    return customersGrup.map(({ customerName }) => customerName).join(',\n');
  }

  protected _getDeviation(proposal: any): 'Yes' | 'No' | '' {
    const { covenant, proposalType } = proposal;

    // Return '' if covenant is null
    if (!covenant) {
      return '';
    }

    let covenantList: any[] = [];

    if (proposalType === 'Total Exposure <= IDR 15 Bio') {
      covenantList = covenant.below || [];
    } else if (proposalType === 'Total Exposure > IDR 15 Bio') {
      covenantList = covenant.above || [];
    } else {
      covenantList = (covenant.general || []).concat(covenant.deposit || []);
    }

    // Find if any covenant status is NOT 'Applied', if found return 'No', otherwise return 'Yes'
    return covenantList.find(c => c.status !== 'Applied') ? 'No' : 'Yes';
  }

  protected _getCollateralIdAndCode(proposal: any): { id: string; collateralCode: string } {
    const { collateral } = proposal;

    // Return '' if there is no collateral data
    if (!collateral) {
      return {
        id: '',
        collateralCode: '',
      };
    }

    const idList = collateral.map(({ id: collateralId }) => collateralId).join(',\n');
    const codeList = collateral.map(({ collateralCode: code }) => code).join(',\n');

    return {
      id: idList,
      collateralCode: codeList,
    };
  }

  protected _clearEmptyEntries(input) {
    return input
      .split(',')
      .map(item => item.trim()) // Remove any surrounding spaces
      .filter(item => item !== '') // Filter out empty entries
      .join(',\n'); // Join them back with commas
  }

  protected _getStatus(
    proposal: any,
    key: 'fromStatusDescription' | 'statusDescription',
    position: 'first' | 'last',
    statusPredicates: string[]
  ): string {
    const { timeLineCreditProposal } = proposal;

    // Return '' if there is no timeline data
    if (!timeLineCreditProposal) {
      return '';
    }

    // Sort timelines based on the position, if 'first' sort in ascending order, otherwise sort in descending order
    const sortedTimelines = [...timeLineCreditProposal].sort((a, b) => (position === 'first' ? a.id - b.id : b.id - a.id));

    // Find the timeline entry that matches the status predicate
    const status = sortedTimelines.find(t => statusPredicates.includes(t[key]));

    // Return the fromDate if status is found, otherwise return an empty string
    return status?.fromDate || '';
  }
}
