import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customPercentage',
})
export class CustomPercentagePipe implements PipeTransform {
  transform(value: string, status: string, previousOfferingLetterAttribute: any): string {
    const num = parseFloat(value).toFixed(2);

    if (num === 'Infinity' || num === 'NaN') {
      this.handleInvalidValues(status, previousOfferingLetterAttribute);
      return '0.00' + 'x';
    } else {
      this.handleValidValues(num, status, previousOfferingLetterAttribute);
      return num + 'x';
    }
  }

  private handleInvalidValues(status: string, previousOfferingLetterAttribute: any): void {
    const zeroValue = '0.00';
    if (status === 'mv') {
      previousOfferingLetterAttribute.coverageTotal.mvInternalCoverage = zeroValue;
    } else if (status === 'lv') {
      previousOfferingLetterAttribute.coverageTotal.lvInternalCoverage = zeroValue;
    } else if (status === 'mvKjjp') {
      previousOfferingLetterAttribute.coverageTotal.mvKjjpCoverage = zeroValue;
    } else if (status === 'lvKjjp') {
      previousOfferingLetterAttribute.coverageTotal.lvKjjpCoverage = zeroValue;
    }
  }

  private handleValidValues(num: string, status: string, previousOfferingLetterAttribute: any): void {
    if (status === 'mv') {
      previousOfferingLetterAttribute.coverageTotal.mvInternalCoverage = num;
    } else if (status === 'lv') {
      previousOfferingLetterAttribute.coverageTotal.lvInternalCoverage = num;
    } else if (status === 'mvKjjp') {
      previousOfferingLetterAttribute.coverageTotal.mvKjjpCoverage = num;
    } else if (status === 'lvKjjp') {
      previousOfferingLetterAttribute.coverageTotal.lvKjjpCoverage = num;
    }
  }
}
