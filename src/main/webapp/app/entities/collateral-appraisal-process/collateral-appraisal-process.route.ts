import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import lodash from 'lodash';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
import { CollateralAppraisal, ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { CollateralAttribute } from '../collateral/collateral.model';
import { scoreCard } from '../collateral-appraisal/negative/score-card.constant';
import { CollateralAppraisalProcessMaterialComponent } from './collateral-appraisal-process-material.component';

@Injectable({
  providedIn: 'root',
})
export class CollateralAppraisalProcessResolve implements Resolve<ICollateralAppraisal> {
  constructor(private service: CollateralAppraisalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICollateralAppraisal> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((collateralAppraisal: HttpResponse<CollateralAppraisal>) => {
          if (collateralAppraisal.body) {
            if (!collateralAppraisal.body.collateral.attributes) {
              collateralAppraisal.body.collateral.attributes = new CollateralAttribute();
            }

            if (!lodash.has(collateralAppraisal.body.attributes, 'jenisObject')) {
              collateralAppraisal.body.attributes['jenisObject'] = '';
            }
            if (!lodash.has(collateralAppraisal.body.attributes, 'marketbility')) {
              collateralAppraisal.body.attributes['marketbility'] = '';
            }
            if (collateralAppraisal.body.attributes === undefined || collateralAppraisal.body.attributes === null) {
              collateralAppraisal.body.attributes['scoreCard'] = scoreCard;
              // collateralAppraisal.body.attributes['summary'] = {
              //   keterangan: '',
              //   marketbility: '',
              //   returnNotes: '',
              // };
            } else {
              if (!Object.prototype.hasOwnProperty.call(collateralAppraisal.body.attributes, 'scoreCard')) {
                collateralAppraisal.body.attributes['scoreCard'] = scoreCard;
              } else {
                collateralAppraisal.body.attributes['scoreCard'] = JSON.parse(collateralAppraisal.body.attributes['scoreCard']);
              }

              // if (!Object.prototype.hasOwnProperty.call(collateralAppraisal.body.attributes, 'summary')) {
              //   collateralAppraisal.body.attributes['summary'] = {
              //     keterangan: '',
              //     marketbility: '',
              //     returnNotes: '',
              //   };
              // } else {
              //   collateralAppraisal.body.attributes['summary'] = JSON.parse(collateralAppraisal.body.attributes['summary']);
              // }
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
            // res.attributes['scoreCard'] = scoreCard;
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

export const CollateralAppraisalProcessRoute: Routes = [
  {
    path: '',
    component: CollateralAppraisalProcessMaterialComponent,
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
];
