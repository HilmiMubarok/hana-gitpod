import { Component, OnInit } from '@angular/core';
import { ANIMATION } from 'app/shared/constants/base.constants';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { Tab, TabComponent, SelectEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-sample-form-nested',
  templateUrl: './sample-form-nested.component.html',
})
export class SampleFormNestedComponent {
  public usaItems: Object[];
  public franceItems: Object[];
  public australiaItems: Object[];
  public animation: object = ANIMATION;

  public handleCreatedEvent(e: SelectEventArgs): void {
    if (isNOU(document.querySelector('#usa_tab.e-tab'))) {
      const usa_obj: Tab = new Tab({
        items: this.usaItems,
      });
      usa_obj.appendTo('#usa_tab');
    }
  }

  public handleSelectEvent(e: SelectEventArgs): void {
    if (e.selectedIndex === 1 && isNOU(document.querySelector('#france_tab.e-tab'))) {
      const france_obj: Tab = new Tab({
        items: this.franceItems,
      });
      france_obj.appendTo('#france_tab');
    } else if (e.selectedIndex === 2 && isNOU(document.querySelector('#australia_tab.e-tab'))) {
      const australia_obj: Tab = new Tab({
        items: this.australiaItems,
      });
      australia_obj.appendTo('#australia_tab');
    }
  }
}
