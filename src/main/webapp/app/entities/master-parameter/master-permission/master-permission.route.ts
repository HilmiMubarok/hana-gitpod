import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MasterPermissionComponent } from './master-permission.component';
import { MasterPermissionAddComponent } from './master-permission-add.component';

export const MASTER_PERMISSION: Routes = [
  {
    path: '',
    component: MasterPermissionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MasterPermissionAddComponent,
  },
];
