import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DppkAssignToComponent } from './dppk-assign-to.component';

@NgModule({
  imports: [SharedModule],
  declarations: [DppkAssignToComponent],
  exports: [DppkAssignToComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class DppkAssignToModule {}
