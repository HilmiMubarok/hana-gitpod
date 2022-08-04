import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {
  transform(value: any): string {
    if (value) {
      const diff = moment().diff(moment(value).format('YYYY-MM-DD').toString(), 'years');
      if (diff === 1) {
        return diff.toString() + ' year';
      }

      return diff.toString() + ' years';
    }

    return null;
  }
}
