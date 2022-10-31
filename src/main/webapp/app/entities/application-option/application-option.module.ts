import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationOptionViewDialogComponent } from './application-option-view-dialog.component';
import { ApplicationOptionComponent } from './application-option.component';
import { applicationOptionRoute } from './application-option.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(applicationOptionRoute)],
  declarations: [ApplicationOptionComponent, ApplicationOptionViewDialogComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwApplicationOptionModule {}
