import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditRatingComponent } from '../list/credit-rating.component';
import { CreditRatingDetailComponent } from '../detail/credit-rating-detail.component';
import { CreditRatingUpdateComponent } from '../update/credit-rating-update.component';
import { CreditRatingRoutingResolveService } from './credit-rating-routing-resolve.service';

const creditRatingRoute: Routes = [
  {
    path: '',
    component: CreditRatingComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditRatingDetailComponent,
    resolve: {
      creditRating: CreditRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditRatingUpdateComponent,
    resolve: {
      creditRating: CreditRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditRatingUpdateComponent,
    resolve: {
      creditRating: CreditRatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(creditRatingRoute)],
  exports: [RouterModule],
})
export class CreditRatingRoutingModule {}
