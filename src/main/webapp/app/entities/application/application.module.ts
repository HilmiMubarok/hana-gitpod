import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationComponent } from './application.component';
import { ApplicationDetailComponent } from './application-detail.component';
import { applicationRoute } from './application.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(applicationRoute)],
  declarations: [ApplicationComponent, ApplicationDetailComponent],
  entryComponents: [ApplicationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwApplicationModule {}
