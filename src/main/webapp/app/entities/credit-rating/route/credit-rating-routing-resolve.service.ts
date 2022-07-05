import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICreditRating, CreditRating } from '../credit-rating.model';
import { CreditRatingService } from '../service/credit-rating.service';

@Injectable({ providedIn: 'root' })
export class CreditRatingRoutingResolveService implements Resolve<ICreditRating> {
  constructor(protected service: CreditRatingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditRating> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditRating: HttpResponse<CreditRating>) => {
          if (creditRating.body) {
            return of(creditRating.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CreditRating());
  }
}
