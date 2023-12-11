// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'percentage'
// })
// export class PercentagePipe implements PipeTransform {

//   transform(value: string, status: string, previousOfferingLetterAttribute: any): string {
//     const num = parseFloat(value).toFixed(2);
//     if (num === 'Infinity') {
//       return this.handleInfinity(status, previousOfferingLetterAttribute, '0.00');
//     } else if (isNaN(parseFloat(num))) {
//       return this.handleInfinity(status, previousOfferingLetterAttribute, '0.00');
//     } else {
//       return this.handleFiniteValue(num, status, previousOfferingLetterAttribute);
//     }
//   }

//   private handleInfinity(status: string, previousOfferingLetterAttribute: any, defaultValue: string): string {
//     const fields = {
//       'mv': 'mvInternalCoverage',
//       'lv': 'lvInternalCoverage',
//       'mvKjjp': 'mvKjjpCoverage',
//       'lvKjjp': 'lvKjjpCoverage'
//     };
//     if (fields[status]) {
//       previousOfferingLetterAttribute.coverageTotal[fields[status]] = defaultValue;
//     }
//     return defaultValue + 'x';
//   }

//   private handleFiniteValue(num: string, status: string, previousOfferingLetterAttribute: any): string {
//     const fields = {
//       'mv': 'mvInternalCoverage',
//       'lv': 'lvInternalCoverage',
//       'mvKjjp': 'mvKjjpCoverage',
//       'lvKjjp': 'lvKjjpCoverage'
//     };
//     if (fields[status]) {
//       previousOfferingLetterAttribute.coverageTotal[fields[status]] = num;
//     }
//     return num + 'x';
//   }
// }
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
