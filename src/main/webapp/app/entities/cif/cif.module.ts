import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CifComponent } from './list/cif.component';
import { CifDetailComponent } from './detail/cif-detail.component';
import { CifUpdateComponent } from './update/cif-update.component';
import { CifDeleteDialogComponent } from './delete/cif-delete-dialog.component';
import { CifRoutingModule } from './route/cif-routing.module';

@NgModule({
  imports: [SharedModule, CifRoutingModule],
  declarations: [CifComponent, CifDetailComponent, CifUpdateComponent, CifDeleteDialogComponent],
  entryComponents: [CifDeleteDialogComponent],
})
export class CifModule {}
