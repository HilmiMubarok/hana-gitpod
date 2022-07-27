import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyCifComponent } from './party-cif.component';
import { PartyCifDetailComponent } from './party-cif-detail.component';
import { PartyCifUpdateComponent } from './party-cif-update.component';
import { partyCifRoute } from './party-cif.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyCifRoute)],
  declarations: [PartyCifComponent, PartyCifDetailComponent, PartyCifUpdateComponent],
  entryComponents: [PartyCifComponent, PartyCifUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyCifModule {}
