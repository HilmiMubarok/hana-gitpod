import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { CollateralAppraisalComponent } from './collateral-appraisal.component';
import { CollateralAppraisalNewComponent } from './collateral-appraisal-new.component';
import { CollateralAppraisalMainComponent } from './collateral-appraisal-main.component';
import { scoreCard } from './negative/score-card.constant';
import lodash from 'lodash';

@Injectable({ providedIn: 'root' })
export class CollateralAppraisalResolve implements Resolve<ICollateralAppraisal> {
  constructor(private service: CollateralAppraisalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICollateralAppraisal> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((collateralAppraisal: HttpResponse<CollateralAppraisal>) => {
          if (collateralAppraisal.body) {
            if (!lodash.has(collateralAppraisal.body.attributes, 'jenisObject')) {
              collateralAppraisal.body.attributes['jenisObject'] = '';
            }

            if (collateralAppraisal.body.attributes === undefined || collateralAppraisal.body.attributes === null) {
              collateralAppraisal.body.attributes['scoreCard'] = scoreCard;
			  collateralAppraisal.body.attributes['summary'] = {
				keterangan: '',
				marketbility: '',
				returnNotes: ''
			  };
            } else {
              if (!Object.prototype.hasOwnProperty.call(collateralAppraisal, 'scoreCard')) {
                collateralAppraisal.body.attributes['scoreCard'] = scoreCard;
              }else {
				collateralAppraisal.body.attributes['scoreCard'] = JSON.parse(collateralAppraisal.body.attributes['scoreCard']);
			  }

			  if (!Object.prototype.hasOwnProperty.call(collateralAppraisal, 'summary')) {
                collateralAppraisal.body.attributes['summary'] = {
				keterangan: '',
				marketbility: '',
				returnNotes: ''
			  };
              }else {
				collateralAppraisal.body.attributes['summary'] = JSON.parse(collateralAppraisal.body.attributes['summary']);
			  }
            }
            return of(collateralAppraisal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICollateralAppraisal>) => res.body),
        mergeMap(res => {
          if (res) {
            res.attributes['scoreCard'] = scoreCard;
            return of(res);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    const newItem = new CollateralAppraisal();
    const applicationId = route.queryParams['applicationId'] ? route.queryParams['applicationId'] : null;
    if (applicationId) {
      newItem.applicationId = applicationId;
    }
    const collateralId = route.queryParams['collateralId'] ? route.queryParams['collateralId'] : null;
    if (collateralId) {
      newItem.collateralId = collateralId;
    }
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    return of(newItem);
  }
}

export const CollateralAppraisalRoute: Routes = [
  {
    path: '',
    component: CollateralAppraisalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.collateralAppraisal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CollateralAppraisalMainComponent,
    resolve: {
      collateralAppraisal: CollateralAppraisalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralAppraisal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CollateralAppraisalNewComponent,
    resolve: {
      content: CollateralAppraisalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralAppraisal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CollateralAppraisalMainComponent,
    resolve: {
      content: CollateralAppraisalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralAppraisal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit/:customerId/:customerType',
    component: CollateralAppraisalMainComponent,
    resolve: {
      content: CollateralAppraisalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralAppraisal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];