import { Component, Inject, Input } from '@angular/core';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';

@Component({
  selector: 'jhi-offering-page',
  templateUrl: './offering-page.component.html',
  styleUrls: ['./offering-page.css'],
})
export class OfferingLetterOfferingPageComponent extends AbstractEntityBaseViewComponent<IPostalAddress> {
  constructor(protected postalAddressService: PostalAddressService) {
    super(postalAddressService);
    this.item = new PostalAddress();
  }

  get postalAddress() {
    return this.item;
  }

  set postalAddress(postalAddress: IPostalAddress) {
    this.item = postalAddress;
  }
}
