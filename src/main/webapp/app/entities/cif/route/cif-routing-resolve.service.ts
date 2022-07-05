import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICif, Cif } from '../cif.model';
import { CifService } from '../service/cif.service';

@Injectable({ providedIn: 'root' })
export class CifRoutingResolveService implements Resolve<ICif> {
  constructor(protected service: CifService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICif> | Observable<never> {
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
    return of(new Cif());
  }
}
