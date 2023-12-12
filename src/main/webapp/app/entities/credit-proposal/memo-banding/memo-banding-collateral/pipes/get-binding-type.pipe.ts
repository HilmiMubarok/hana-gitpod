import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getBindingType',
})
export class GetBindingTypePipe implements PipeTransform {
  transform(element: string, bindingTypeHobies: any) {
    if (bindingTypeHobies) {
      const data = bindingTypeHobies.find(obj => obj.code === element);
      if (data) {
        return data.value;
      }
    }
    return '';
  }
}
