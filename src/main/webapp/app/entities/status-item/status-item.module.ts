import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { StatusItemComponent } from './status-item.component';
import { StatusItemDetailComponent } from './status-item-detail.component';
import { StatusItemUpdateComponent } from './status-item-update.component';
import { statusItemRoute } from './status-item.route';
import { StatusItemViewComponent } from './status-item-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(statusItemRoute)],
  declarations: [StatusItemComponent, StatusItemDetailComponent, StatusItemUpdateComponent, StatusItemViewComponent],
  entryComponents: [StatusItemComponent, StatusItemUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwStatusItemModule {}
