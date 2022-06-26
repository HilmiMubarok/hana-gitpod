import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IVendor } from './vendor.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class VendorService extends AbstractEntityService<IVendor> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/vendors');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/vendors');
  }

  protected isNew(entity: IVendor): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IVendor) {}
}
