import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { BaseApplicationComponent } from './base-application.component';
import { BaseApplicationDetailComponent } from './base-application-detail.component';
import { BaseApplicationUpdateComponent } from './base-application-update.component';
import { baseApplicationRoute } from './base-application.route';
import { BaseApplicationViewComponent } from './base-application-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(baseApplicationRoute)],
  declarations: [BaseApplicationComponent, BaseApplicationDetailComponent, BaseApplicationUpdateComponent, BaseApplicationViewComponent],
  entryComponents: [BaseApplicationComponent, BaseApplicationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBaseApplicationModule {}
