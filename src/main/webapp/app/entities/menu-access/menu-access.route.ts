import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MenuAccessComponent } from './menu-access.component';
import { MenuAccessViewComponent } from './view/menu-access-view.component';
import { MenuAccessEditComponent } from './edit/menu-access-edit.component';
import { MenuAccessAddComponent } from './add/menu-access-add.component';
import { MenuAccessStatusComponent } from './menu-access-status/menu-access-status.component';
import { MenuAccessStatusEditComponent } from './menu-access-status/menu-access-edit/munu-access-status-edit.component';
import { MenuAccessStatusVeiwComponent } from './menu-access-status/menu-status-view/menu-access-status-view.component';

export const menuAccess: Routes = [
  {
    path: '',
    component: MenuAccessComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MenuAccessViewComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MenuAccessEditComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'add',
    component: MenuAccessAddComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'status',
    component: MenuAccessStatusComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'status/' + ':id/menu-access-edit',
    component: MenuAccessStatusEditComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'status/' + ':id/menu-access-view',
    component: MenuAccessStatusVeiwComponent,
    canActivate: [UserRouteAccessService],
  },
];
