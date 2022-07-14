import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { DATE_FORMAT } from '../constants/base.constants';

@Pipe({
  name: 'formatMediumDate',
})
export class FormatMediumDatePipe implements PipeTransform {
  transform(day: Date | null | undefined): string {
    return day ? moment(day).format(DATE_FORMAT) : '';
  }
}
