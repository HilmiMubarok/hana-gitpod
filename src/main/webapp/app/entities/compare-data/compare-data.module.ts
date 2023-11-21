import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { CompareDataComponent } from './compare-data.component';
import { CompareDataService } from './services/compare-data.service';

@NgModule({
  declarations: [
    // Loan Facility
    // Collateral
    // Covenant

    CompareDataComponent,
  ],
  imports: [
    // your other modules here
    SharedEntityModule,
    SharedModule,
  ],
  exports: [
    // components that you want to make available to other modules

    CompareDataComponent,
  ],
  providers: [
    // your services here
    CompareDataService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompareDataModule {}
