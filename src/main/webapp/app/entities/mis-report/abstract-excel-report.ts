import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { MisReportService } from './mis-report.service';

export abstract class AbstractExcelMISReport {
  protected workbook: ExcelJS.Workbook;
  protected worksheet: ExcelJS.Worksheet;

  constructor(protected service: MisReportService, sheetName = 'Sheet 1') {
    this._setupReport(sheetName);
  }

  protected abstract processData(data: any[]): void;

  protected _setupReport(sheetName = 'Sheet 1'): void {
    this.workbook = new ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet(sheetName);
  }

  protected _resetData(): void {
    this._setupReport();
  }

  protected _setAutoWidthForAllColumns(): void {
    this.worksheet.columns.forEach(column => {
      let maxLength = 0;
      let cloneValues;
      column['eachCell']({ includeEmpty: true }, cell => {
        if (cell.value) {
          cloneValues = cell.value.toString().replace(/\n/g, '').split(',')[0];
        }
        const columnLength = cloneValues ? cloneValues.toString().length + 1 : 10;
        if (cell.type === ExcelJS.ValueType.Date) {
          maxLength = 20;
        } else if (columnLength > maxLength) {
          maxLength = columnLength + 1;
        }
      });
      if (column.key === 'no') {
        column.width = 5;
      } else {
        let finalLength = maxLength < 10 ? 10 : maxLength;

        if (finalLength > 100) {
          finalLength = 50;
        }

        column.width = finalLength;
      }
    });
  }

  protected _setAutoHeightForAllRows(): void {
    this.worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      let maxHeight = 0;
      row.eachCell({ includeEmpty: true }, cell => {
        if (cell.value && rowNumber > 1) {
          const cellValue = cell.value.toString();
          const cellLines = cellValue.split('\n');
          const lineCount = cellLines.length;
          const maxLineLength = Math.max(...cellLines.map(line => line.length));

          // Estimate height based on line count and length
          const estimatedHeight = Math.max(lineCount * 7, Math.ceil(maxLineLength / 7) * 7) * 5;

          if (estimatedHeight > maxHeight) {
            maxHeight = estimatedHeight;
          }
        }
      });

      // Set a minimum height and cap the maximum height
      const finalHeight = Math.max(50, maxHeight);
      row.height = finalHeight;
    });
  }

  protected getStatusLOV(appMenuId: string) {
    return this.service.getStatuses(appMenuId);
  }

  protected getUsernameLOV(positionTypeId) {
    return this.service.getLovUsername(positionTypeId);
  }

  protected setUpColumns(columns): void {
    this.worksheet.columns = columns;
  }

  protected countWeekdays(start, end) {
    const startDate = new Date(start);
    startDate.setDate(startDate.getDate() + 1); // Mulai dari hari setelah start
    const endDate = new Date(end);
    let count = 0;

    while (startDate <= endDate) {
      const day = startDate.getDay();
      if (day !== 0 && day !== 6) {
        // 0 = Minggu, 6 = Sabtu
        count++;
      }
      startDate.setDate(startDate.getDate() + 1);
    }

    return count;
  }

  protected applyStyles(headerBackgroundColor = 'fffefd32'): void {
    this.worksheet.columns.forEach((column, index) => {
      this.worksheet.getCell(1, index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerBackgroundColor },
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
    const outputName = `${fileName}_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
    saveAs(blob, outputName);
  }

  public async generateReport(data: any[], fileName: string): Promise<void> {
    this.processData(data);
    this.applyStyles();
    await this.downloadFile(fileName);
  }

  protected applyDisabledStyle(element: HTMLElement, disabled: boolean): void {
    if (disabled) {
      element.classList.add('disabled-form');
    } else {
      element.classList.remove('disabled-form');
    }
  }

  // ============= HELPER METHODS FOR CP BSU ============= //

  protected _getTotalPlafondPerFacility(proposal, type: 'History' | 'Current'): string {
    // if proposal.previousHistory null
    if (proposal.previousHistory === null) {
      return '';
    }

    const products = type === 'History' ? proposal.previousHistory[0].product : proposal.product;

    return products.map(product => product.totalPlafond).join(',\n');
  }

  protected getProductsOtherThanExisting(proposal, isFromHistory = false): any[] {
    return proposal.product;

    // previousHistory
    const history = proposal.previousHistory;

    // if history null
    if (history === null) {
      return [];
    }

    const products = isFromHistory ? history[0].product : proposal.product;

    // filter products.pengajuan !== 'Existing'
    const filteredProducts = products.filter(product => product.pengajuan !== 'Existing');

    console.log('Product other existing: ', {
      productsOriginal: proposal.products,
      previousHistory: proposal.previousHistory,
      isFromHistory,
      productsFiltered: filteredProducts,
    });

    return filteredProducts;
  }

  protected _convertStatusToString(status: Array<string>): string {
    if (status === null) {
      return null;
    }

    // if length is 0, return empty string
    if (status.length === 0) {
      return '';
    }

    return status.join(',');
  }

  protected _getFacilityProposedDataSource(proposal): string {
    // if proposal.previousHistory null
    if (proposal.previousHistory === null) {
      return '';
    }

    const products = proposal.previousHistory[0].product;

    // if products null
    if (products === null) {
      return '';
    }

    const pengajuan = products.map(product => product.facility).join(',\n');

    return pengajuan;
  }

  protected _gettotalPlafondProposed(proposal: any, currency: 'IDR' | 'USD'): string {
    // if proposal.previousHistory null
    if (proposal.previousHistory === null) {
      return '';
    }

    const facility = proposal.previousHistory[0].facility;

    // if facility null
    if (facility === null) {
      return '';
    }

    const value = currency === 'IDR' ? facility.totalPlafondIDR : facility.totalPlafondUSD;

    if (!value || value === '0.00' || value === 'null' || value === '') {
      return '';
    }

    const numberValue = parseFloat(value);

    if (!isNaN(numberValue)) {
      const fixedValue = numberValue.toFixed(2);
      return fixedValue.endsWith('.00') ? fixedValue.replace('.00', '') : fixedValue;
    }

    return '';
  }

  protected _getTotalPlafond(proposal: any, currency: 'IDR' | 'USD', facilityType: 'Cash' | 'Installment'): string {
    // check if proposal.product is null
    if (proposal.product === null) {
      return '';
    }

    const products = proposal.product;
    const installmentFacilities = ['WCI', 'IL'];

    const total = products
      .filter(product => product.currency === currency)
      .filter(product => {
        if (facilityType === 'Cash') {
          return !installmentFacilities.includes(product.facility);
        } else if (facilityType === 'Installment') {
          return installmentFacilities.includes(product.facility);
        }
        return false;
      })
      .reduce((sum, product) => sum + parseFloat(product.totalPlafond), 0);

    if (!total || total === 0 || total === '0.00' || total === 'null') {
      return '';
    }

    const fixedValue = total.toFixed(2);
    return fixedValue.endsWith('.00') ? fixedValue.replace('.00', '') : fixedValue;
  }

  protected _getRate(proposal: any, type: 'Proposed' | 'DAR Final'): string {
    const products = type === 'Proposed' ? proposal.previousHistory?.[0]?.product : proposal.product;

    if (!products) {
      return '';
    }

    return products.map(({ rateProposed }) => (rateProposed && rateProposed !== 'null' ? rateProposed : '')).join(',\n');
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
      covenantList = (covenant.below || []).concat(covenant.other || []);
    } else if (proposalType === 'Total Exposure > IDR 15 Bio') {
      covenantList = (covenant.above || []).concat(covenant.other || []);
    } else {
      covenantList = (covenant.general || []).concat(covenant.deposit || []).concat(covenant.other || []);
    }

    return covenantList.find(c => c.status !== 'Applied') ? 'Yes' : 'No';
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

  protected _clearEmptyEntries(input: string): string {
    // if input is ''
    if (input === '') {
      return '';
    }

    if (input === 'null') {
      return '';
    }

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
    return this._formatDate(status?.fromDate) || '';
  }

  protected _getCity(proposal: any): string {
    if (proposal.collateral === null) {
      return '';
    }

    const collaterals = proposal.collateral;

    const city = collaterals.map(collateral => collateral.city).join(',\n');

    return city || '';
  }

  protected _formatDate(dateStr: string): string {
    if (!dateStr) {
      return '';
    }

    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'long' }); // "August"
    const year = date.getFullYear().toString();
    return `${day} ${month} ${year}`;
  }

  // ============= HELPER METHODS FOR SLA Reviewer ============= //
  protected _getDateOfAssignment(proposal: any, type: 'single' | 'all'): string {
    const { timeLineCreditProposal: timelines } = proposal;

    // Return '' if there is no timeline data
    if (!timelines) {
      return '';
    }

    // Find the timeline entry that has statusDescription 'Assignment', if type is 'single', return the first object found.
    // Otherwise, return all objects found.
    if (type === 'single') {
      const assignment = timelines.find(t => t.statusDescription === 'Assignment');
      return assignment?.fromDate || '';
    }

    return timelines
      .filter(t => t.statusDescription === 'Assignment')
      .map(t => t.fromDate)
      .join(',\n');
  }

  protected _getPengajuan(proposal) {
    const products = proposal.product;

    // if products null
    if (products === null) {
      return '';
    }

    return products.map(product => product.pengajuan).join(',\n');
  }

  protected _getTotalChangesAmountInMio(proposal, currency: 'IDR' | 'USD'): string {
    const history = proposal.previousHistory;

    // Return '' if history is null
    if (!history) {
      return '';
    }

    const facility = history[0].facility;

    // Return '' if facility is null
    if (!facility) {
      return '';
    }

    // Return the total changes amount based on the currency
    return currency === 'IDR' ? facility.totalChangesIDR.toString() : facility.totalChangesUSD.toString() || '';
  }

  protected _gettotalChangesEqToIDR(proposal, type: 'History' | 'Current'): string {
    if (type === 'History') {
      const history = proposal.previousHistory;

      // Return '' if history is null
      if (!history) {
        return '';
      }

      const facility = history[0].facility;

      // Return '' if facility is null
      if (!facility) {
        return '';
      }

      return facility.totalChangesEqToIDR.toString();
    } else if (type === 'Current') {
      const facility = proposal.facility;

      // Return '' if facility is null
      if (!facility) {
        return '';
      }

      return facility.totalChangesEqToIDR.toString();
    }

    return '';
  }

  protected _getSubTotalPlafondEqToIDR(proposal, type: 'History' | 'Current'): string {
    // if proposal.previousHistory null
    if (proposal.previousHistory === null) {
      return '';
    }

    const facility = proposal.previousHistory[0].facility;

    // if facility null
    if (facility === null) {
      return '';
    }

    return facility.totalPlafond.toString() || '';
  }

  protected _getMaturityDate(proposal: any): string {
    const products = proposal.product;

    // if products null
    if (products === null) {
      return '';
    }

    // filter maturitydate
    const filteredProducts = products.filter(product => product.maturityDate !== null && product.maturityDate !== 'null');

    return filteredProducts.map(product => product.maturityDate).join(',\n');
  }

  protected _getFromDateBasedOnField(
    proposal: any,
    field: 'statusDescription' | 'fromStatusDescription',
    status: string[],
    outputType: 'Default' | 'Count' = 'Default',
    isFormatted = true
  ): string {
    const timelines = proposal.timeLineCreditProposal;

    // Return '' if there is no timeline data
    if (!timelines || !Array.isArray(timelines)) {
      return '';
    }

    // Sort timelines asc by id
    timelines.sort((a, b) => a.id - b.id);

    // Filter timelines based on the specified field and statuses in the array
    const filteredTimelines = timelines.filter(t => status.includes(t[field]));

    if (outputType === 'Default') {
      // Map the filtered timelines to their fromDate and join them with a newline separator
      if (isFormatted) {
        return filteredTimelines.map(t => this._formatDateSLA(t.fromDate)).join(',\n');
      }

      return filteredTimelines.map(t => t.fromDate).join(',\n');
    }

    // Return the count of the filtered timelines' fromDate
    return filteredTimelines.length.toString();
  }

  protected _getGenerateDAR(proposal: any, isFormatted = true): string {
    const documentGenerate = proposal.documentGenerate;

    // Return '' if documentGenerate is null

    if (!documentGenerate) {
      return '';
    }

    return isFormatted ? this._formatDateSLA(documentGenerate.generateDate) || '' : documentGenerate.generateDate || '';
  }

  protected _getDaysToMaturityDate(proposal: any): string {
    const tanggalCRA = this._getFromDateBasedOnField(proposal, 'fromStatusDescription', ['Approve To Loan Analysis'], 'Default', false)
      .split(',')
      .pop();
    const jatuhTempo = this._getMaturityDate(proposal).split(',');

    // subtract tanggalCRA - each jatuhTempo. output will be how many days between tanggalCRA and jatuhTempo in array
    if (!tanggalCRA || !jatuhTempo) {
      return '';
    }

    const craDate = new Date(tanggalCRA);
    const maturityDates = jatuhTempo.map(date => new Date(date));

    const diffDays = maturityDates.map(date => {
      const diffTime = Math.abs(craDate.getTime() - date.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    });

    // find the most approaching a positive value from diffDays
    const minDiff = diffDays.filter(diff => diff >= 0);

    return minDiff.length > 0 ? minDiff.reduce((a, b) => Math.max(a, b)).toString() : '';
  }

  protected _getSlaLength(proposal: any): string {
    const generateDarDate = this._getGenerateDAR(proposal, false);
    const craDate = this._getFromDateBasedOnField(proposal, 'statusDescription', ['Assignment'], 'Default', false).split(',').pop();

    // return generateDarDate - craDate. output will be how many days between generateDarDate and craDate
    if (!generateDarDate || !craDate) {
      return '';
    }

    const generateDate = new Date(generateDarDate);
    const assignmentDate = new Date(craDate);

    // Calculate the difference in time
    const diffTime = generateDate.getTime() - assignmentDate.getTime();
    // Calculate the difference in days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays.toString();
  }

  protected _formatDateSLA(dateStr: string): string {
    if (!dateStr) {
      return '';
    }

    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  }

  protected sortCreditProposalByEarliestDate(creditProposal, statuses) {
    return creditProposal
      .map(user => {
        const filteredTimeLine =
          user.timeLineCreditProposal
            ?.filter(item => statuses.includes(item.statusDescription) && item.fromDate)
            .sort((a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime()) || [];

        return {
          ...user,
          timeLineCreditProposal: filteredTimeLine,
        };
      })
      .sort((a, b) => {
        const earliestA = a.timeLineCreditProposal.length > 0 ? new Date(a.timeLineCreditProposal[0].fromDate).getTime() : Number.MAX_VALUE;
        const earliestB = b.timeLineCreditProposal.length > 0 ? new Date(b.timeLineCreditProposal[0].fromDate).getTime() : Number.MAX_VALUE;

        if (earliestA !== earliestB) {
          return earliestA - earliestB;
        }
        return a.id - b.id;
      });
  }

  protected formatDateID(dateStr: string) {
    if (!dateStr) {
      return {
        getDay: () => '',
        getMonth: () => '',
        getYear: () => '',
        getFullDate: () => '',
      };
    }

    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString();
    return {
      getDay: () => day,
      getMonth: () => month,
      getYear: () => year,
      getFullDate: () => `${day} ${month} ${year}`,
    };
  }
}
