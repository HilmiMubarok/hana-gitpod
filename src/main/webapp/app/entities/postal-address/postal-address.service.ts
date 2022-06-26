import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPostalAddress } from './postal-address.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

@Injectable({ providedIn: 'root' })
export class PostalAddressService extends AbstractEntityService<IPostalAddress> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/postal-addresses');
  }

  protected isNew(entity: IPostalAddress): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: IPostalAddress) {}
}
