import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICif, Cif } from './cif.model';
import { CifService } from './cif.service';
import { CifComponent } from './cif.component';
import { CifDetailComponent } from './cif-detail.component';
import { CifUpdateComponent } from './cif-update.component';

@Injectable({ providedIn: 'root' })
export class CifResolve implements Resolve<ICif> {
  constructor(private service: CifService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICif> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cif: HttpResponse<Cif>) => {
          if (cif.body) {
            return of(cif.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICif>) => res.body),
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
    const newItem = new Cif();
    return of(newItem);
  }
}

export const cifRoute: Routes = [
  {
    path: '',
    component: CifComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.cif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CifDetailComponent,
    resolve: {
      cif: CifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.cif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CifUpdateComponent,
    resolve: {
      content: CifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.cif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CifUpdateComponent,
    resolve: {
      content: CifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.cif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
