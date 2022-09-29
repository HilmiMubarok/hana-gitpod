import { Pipe, PipeTransform } from '@angular/core';

import { CUSTOM_DATE_TIME_FORMAT } from 'app/config/input.constants';
import moment from 'moment';

@Pipe({
  name: 'formatMediumDatetime',
})
export class FormatMediumDatetimePipe implements PipeTransform {
  transform(day: Date | null | undefined): string {
    return day ? moment(day).format(CUSTOM_DATE_TIME_FORMAT) : '';
  }
}
