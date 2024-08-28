import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartySlikComponent } from './party-slik.component';
import { PartySlikDetailComponent } from './party-slik-detail.component';
import { PartySlikUpdateComponent } from './party-slik-update.component';
import { partySlikRoute } from './party-slik.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partySlikRoute)],
  declarations: [PartySlikComponent, PartySlikDetailComponent, PartySlikUpdateComponent],
  entryComponents: [PartySlikComponent, PartySlikUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartySlikModule {}
