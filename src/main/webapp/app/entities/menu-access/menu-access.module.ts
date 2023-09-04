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
import { MenuAccessStatusComponent } from './menu-access-status/menu-access-status.component';
import { MenuAccessStatusVeiwComponent } from './menu-access-status/menu-status-view/menu-access-status-view.component';
import { MenuAccessStatusEditComponent } from './menu-access-status/menu-access-edit/munu-access-status-edit.component';
import { MenuAccessStatusDialogComponent } from './menu-access-status/munu-status-dialog/menu-access-status-dialog.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(menuAccess)],
  declarations: [
    MenuAccessComponent,
    MenuAccessViewComponent,
    MenuAccessEditComponent,
    MenuAccessAddComponent,
    MenuAccessStatusComponent,
    MenuAccessStatusVeiwComponent,
    MenuAccessStatusEditComponent,
    MenuAccessStatusDialogComponent,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMenuAccessModule {}
