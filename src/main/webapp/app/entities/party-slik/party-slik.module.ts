import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PartySlikComponent } from './party-slik.component';
import { PartySlikDetailComponent } from './party-slik-detail.component';
import { PartySlikUpdateComponent } from './party-slik-update.component';
import { partySlikRoute } from './party-slik.route';
import { PartySlikAsListComponent } from './party-slik-as-list.component';
import { PartySlikViewComponent } from './party-slik-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(partySlikRoute)],
  declarations: [PartySlikComponent, PartySlikDetailComponent, PartySlikUpdateComponent, PartySlikAsListComponent, PartySlikViewComponent],
  entryComponents: [PartySlikComponent, PartySlikUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartySlikModule {}
