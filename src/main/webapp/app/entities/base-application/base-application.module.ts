import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseApplicationComponent } from './base-application.component';
import { BaseApplicationDetailComponent } from './base-application-detail.component';
import { BaseApplicationUpdateComponent } from './base-application-update.component';
import { baseApplicationRoute } from './base-application.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(baseApplicationRoute)],
  declarations: [BaseApplicationComponent, BaseApplicationDetailComponent, BaseApplicationUpdateComponent],
  entryComponents: [BaseApplicationComponent, BaseApplicationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBaseApplicationModule {}
