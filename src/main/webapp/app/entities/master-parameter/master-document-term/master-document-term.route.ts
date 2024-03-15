import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MasterDocumentTermComponent } from './master-document-term.component';

export const MasterDocumentTermRoute: Routes = [
  {
    path: '',
    component: MasterDocumentTermComponent,
    canActivate: [UserRouteAccessService],
  },
];
