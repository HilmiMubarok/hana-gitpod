import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IApplicationProduct } from '../application-product/application-product.model';

@Component({
  selector: 'jhi-loan-purpose',
  template: ` Loan Purpose : {{ applicationTypes }} `,
})
export class LoanPurposeComponent implements OnChanges {
  @Input() products: IApplicationProduct[];

  public applicationTypes: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.products && changes.products.currentValue) {
      this.products = changes.products.currentValue;
      this.populateApplicationType();
    }
  }

  // Get application type of all products
  getApplicationType(): string[] {
    const applicationTypes: string[] = [];

    for (const product of this.products) {
      applicationTypes.push(product.applicationType);
    }

    return applicationTypes;
  }

  // populate application type
  populateApplicationType(): void {
    // filter unique application types
    const uniqueApplicationTypes: string[] = Array.from(new Set(this.getApplicationType()));

    // join all application types
    this.applicationTypes = uniqueApplicationTypes.join(', ');
  }
}
