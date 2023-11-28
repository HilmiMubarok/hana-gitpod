import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IApplicationProduct } from '../application-product/application-product.model';

@Component({
  selector: 'jhi-loan-purpose',
  template: `
    <p>Loan Purpose :</p>
    <div class="container">
      <div class="row">
        <div *ngFor="let productArray of applicationTypes" class="col-6">
          <ul>
            <li *ngFor="let item of productArray">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class LoanPurposeComponent implements OnChanges {
  @Input() products: IApplicationProduct[];

  public applicationTypes: string[][];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.products && changes.products.currentValue) {
      this.products = changes.products.currentValue;
      this.populateApplicationType();
    }
  }

  // Get application type of all products
  getApplicationType(): string[] {
    const applicationTypes: string[] = Array.from(
      new Set(this.products.filter(item => item.applicationType !== 'Existing').map(item => item.applicationType))
    );

    return applicationTypes;
  }

  // populate application type
  populateApplicationType(): void {
    // filter unique application types and separate by min 6 items per array
    const separatedProduct = this.separateProducts(this.getApplicationType());

    this.applicationTypes = separatedProduct;
  }

  /**
   * Separates an array of products into chunks of size 6.
   * @param products - The array of products to be separated.
   * @returns An array of arrays, where each inner array contains a chunk of size 6 products.
   */
  separateProducts(products: string[]): string[][] {
    const separatedProducts: string[][] = [];
    const chunkSize = 6;

    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize).filter((item): item is string => item !== undefined);
      separatedProducts.push(chunk);
    }

    return separatedProducts;
  }
}
