import { Pipe, PipeTransform } from '@angular/core';
import { DATE_FORMAT } from 'app/config/input.constants';
import moment from 'moment';

@Pipe({
  name: 'formatMediumDate',
})
export class FormatMediumDatePipe implements PipeTransform {
  transform(day: Date | null | undefined): string {
    return day ? moment(day).format(DATE_FORMAT) : '';
  }
}
