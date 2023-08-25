import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MenuAccessComponent } from './menu-access.component';
import { MenuAccessViewComponent } from './view/menu-access-view.component';
import { MenuAccessEditComponent } from './edit/menu-access-view.component';
import { MenuAccessAddComponent } from './add/menu-access-add.component';

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
];
