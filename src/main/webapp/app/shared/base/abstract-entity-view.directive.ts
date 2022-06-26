import { Directive } from '@angular/core';

@Directive({
  selector: '[jhiCardView]',
})
export class CardViewDirective {
  constructor() {}
}

@Directive({
  selector: '[jhiEditView]',
})
export class EditViewDirective {
  constructor() {}
}

@Directive({
  selector: '[jhiItemView]',
})
export class ItemViewDirective {
  constructor() {}
}

@Directive({
  selector: '[jhiSimpleView]',
})
export class SimpleViewDirective {
  constructor() {}
}

@Directive({
  selector: '[jhiHeaderView]',
})
export class HeaderViewDirective {
  constructor() {}
}

@Directive({
  selector: '[jhiFooterView]',
})
export class FooterViewDirective {
  constructor() {}
}
