import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayCount',
})
export class ArrayCountPipe implements PipeTransform {
  transform(data: [] | null | undefined | string): number {
    let result = 0;
    if (data) {
      if (typeof data === 'string') {
        result = JSON.parse(data).length;
      } else {
        result = data.length;
      }
    }
    return result;
  }
}
