import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyCategoryType, PartyCategoryType } from './party-category-type.model';
import { PartyCategoryTypeService } from './party-category-type.service';

@Injectable({ providedIn: 'root' })
export class PartyCategoryTypeResolve implements Resolve<IPartyCategoryType> {
  constructor(private service: PartyCategoryTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyCategoryType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyCategoryType: HttpResponse<PartyCategoryType>) => {
          if (partyCategoryType.body) {
            return of(partyCategoryType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyCategoryType>) => res.body),
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
    const newItem = new PartyCategoryType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const partyCategoryTypeRoute: Routes = [];
