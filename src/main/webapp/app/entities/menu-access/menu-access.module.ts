import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { SharedEntityModule } from '../shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { RouterModule } from '@angular/router';
import { menuAccess } from './menu-access.route';
import { MenuAccessComponent } from './menu-access.component';
import { MenuAccessViewComponent } from './view/menu-access-view.component';
import { MenuAccessEditComponent } from './edit/menu-access-edit.component';
import { MenuAccessAddComponent } from './add/menu-access-add.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(menuAccess)],
  declarations: [MenuAccessComponent, MenuAccessViewComponent, MenuAccessEditComponent, MenuAccessAddComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMenuAccessModule {}
