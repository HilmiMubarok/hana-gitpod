import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IReligionType, ReligionType } from './religion-type.model';
import { ReligionTypeService } from './religion-type.service';
import { ReligionTypeComponent } from './religion-type.component';
import { ReligionTypeDetailComponent } from './religion-type-detail.component';
import { ReligionTypeUpdateComponent } from './religion-type-update.component';

@Injectable({ providedIn: 'root' })
export class ReligionTypeResolve implements Resolve<IReligionType> {
  constructor(private service: ReligionTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReligionType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((religionType: HttpResponse<ReligionType>) => {
          if (religionType.body) {
            return of(religionType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IReligionType>) => res.body),
        mergeMap(res => {
          if (res) {
            return of(res);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    const newItem = new ReligionType();
    return of(newItem);
  }
}

export const religionTypeRoute: Routes = [
  {
    path: '',
    component: ReligionTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.religionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReligionTypeDetailComponent,
    resolve: {
      religionType: ReligionTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.religionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReligionTypeUpdateComponent,
    resolve: {
      content: ReligionTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.religionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReligionTypeUpdateComponent,
    resolve: {
      content: ReligionTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.religionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
