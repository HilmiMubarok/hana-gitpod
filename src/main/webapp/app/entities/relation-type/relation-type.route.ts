import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IRelationType, RelationType } from './relation-type.model';
import { RelationTypeService } from './relation-type.service';
import { RelationTypeComponent } from './relation-type.component';
import { RelationTypeDetailComponent } from './relation-type-detail.component';
import { RelationTypeUpdateComponent } from './relation-type-update.component';

@Injectable({ providedIn: 'root' })
export class RelationTypeResolve implements Resolve<IRelationType> {
  constructor(private service: RelationTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRelationType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((relationType: HttpResponse<RelationType>) => {
          if (relationType.body) {
            return of(relationType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IRelationType>) => res.body),
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
    const newItem = new RelationType();
    return of(newItem);
  }
}

export const relationTypeRoute: Routes = [
  {
    path: '',
    component: RelationTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.relationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RelationTypeDetailComponent,
    resolve: {
      relationType: RelationTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.relationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RelationTypeUpdateComponent,
    resolve: {
      content: RelationTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.relationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RelationTypeUpdateComponent,
    resolve: {
      content: RelationTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.relationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
