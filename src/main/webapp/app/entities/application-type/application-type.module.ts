import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationTypeComponent } from './application-type.component';
import { ApplicationTypeDetailComponent } from './application-type-detail.component';
import { ApplicationTypeUpdateComponent } from './application-type-update.component';
import { applicationTypeRoute } from './application-type.route';
import { ApplicationTypeViewComponent } from './application-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(applicationTypeRoute)],
  declarations: [ApplicationTypeComponent, ApplicationTypeDetailComponent, ApplicationTypeUpdateComponent, ApplicationTypeViewComponent],
  entryComponents: [ApplicationTypeComponent, ApplicationTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class losgwApplicationTypeModule {}
