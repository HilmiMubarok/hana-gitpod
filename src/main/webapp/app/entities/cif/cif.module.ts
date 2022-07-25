import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CifComponent } from './cif.component';
import { CifDetailComponent } from './cif-detail.component';
import { CifUpdateComponent } from './cif-update.component';
import { cifRoute } from './cif.route';
import { SharedLibsModule } from 'app/shared/shared-libs.module';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(cifRoute)],
  declarations: [CifComponent, CifDetailComponent, CifUpdateComponent],
  entryComponents: [CifComponent, CifUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCifModule {}
