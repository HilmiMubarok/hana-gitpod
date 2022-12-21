import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IContactMechType, ContactMechType } from './contact-mech-type.model';
import { ContactMechTypeService } from './contact-mech-type.service';

@Injectable({ providedIn: 'root' })
export class ContactMechTypeResolve implements Resolve<IContactMechType> {
  constructor(private service: ContactMechTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IContactMechType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((contactMechType: HttpResponse<ContactMechType>) => {
          if (contactMechType.body) {
            return of(contactMechType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IContactMechType>) => res.body),
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
    const newItem = new ContactMechType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const contactMechTypeRoute: Routes = [];
