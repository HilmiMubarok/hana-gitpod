import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { IDocumentType, DocumentType } from './document-type.model';
import { DocumentTypeService } from './document-type.service';
import { DocumentTypeComponent } from './document-type.component';
import { DocumentTypeUpdateComponent } from './document-type-update.component';
import { DocumentTypeViewComponent } from './document-type-view.component';
import { DocumentTypeCreateComponent } from './document-type-create.component';

@Injectable({ providedIn: 'root' })
export class DocumentTypeResolve implements Resolve<IDocumentType> {
  constructor(private service: DocumentTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((documentType: HttpResponse<DocumentType>) => {
          if (documentType.body) {
            return of(documentType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IDocumentType>) => res.body),
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
    const newItem = new DocumentType();
    return of(newItem);
  }
}

export const documentTypeRoute: Routes = [
  {
    path: '',
    component: DocumentTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.documentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DocumentTypeViewComponent,
    resolve: {
      documentType: DocumentTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.documentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/create',
    component: DocumentTypeCreateComponent,
    resolve: {
      content: DocumentTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.documentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DocumentTypeUpdateComponent,
    resolve: {
      content: DocumentTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.documentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
