import { Component, ViewChild } from '@angular/core';
import { ItemModel, OpenCloseMenuEventArgs, DropDownButtonComponent } from '@syncfusion/ej2-angular-splitbuttons';

@Component({
  selector: 'jhi-collateral-appraisal-process',
  templateUrl: './collateral-appraisal-process.component.html',
  styleUrls: ['./collateral-appraisal.css', '../layout-css/layout-css-template.css'],
})
export class CollateralAppraisalProcessComponent {
  public BlodType: string[] = ['Objek Jaminan', '.........'];

  @ViewChild('dropdownbutton')
  public dropdownbutton: DropDownButtonComponent;

  public data: ItemModel[] = [
    {
      text: 'Rincian',
    },
    {
      text: 'Hapus',
    },
  ];

  public onOpen(args: OpenCloseMenuEventArgs) {
    args.element.parentElement.style.top =
      this.dropdownbutton.element.getBoundingClientRect().top - args.element.parentElement.offsetHeight + 'px';
  }
}
