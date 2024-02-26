import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { Observable } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IMenuPermissions } from './menu-permissions.model';
@Injectable({ providedIn: 'root' })
export class MenuPermissionService extends AbstractEntityService<IMenuPermissions> {
  public menuPermission: string;
  private resourceUrlSegregasi: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.menuPermission = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-permission');
  }

  protected isNew(entity: IMenuPermissions): boolean {
    return entity.id === undefined || entity.id === null;
  }

  //   public getAppMenuPermission(parameter: string, positionTypeId: string): Observable<HttpResponse<IMenuPermissions[]>> {
  //     return this.http.get<IMenuPermissions[]>(`${this.menuPermission}/filterBy/${parameter},${positionTypeId}`, {
  //       observe: 'response',
  //     });
  //   }
  public getAppMenuPermission(menuItemId: string, positionTypeId: string, statusId: string): Observable<HttpResponse<IMenuPermissions[]>> {
    const url = `?menuItemId=${menuItemId}&positionTypeId=${positionTypeId}&statusId=${statusId}`;
    return this.http.get<IMenuPermissions[]>(`${this.menuPermission}/filterBy` + url, {
      observe: 'response',
    });
  }
  protected preSave(entity: IMenuPermissions) {}
}
