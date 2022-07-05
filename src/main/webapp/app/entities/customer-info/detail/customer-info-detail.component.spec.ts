import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CustomerInfoDetailComponent } from './customer-info-detail.component';

describe('CustomerInfo Management Detail Component', () => {
  let comp: CustomerInfoDetailComponent;
  let fixture: ComponentFixture<CustomerInfoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerInfoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ customerInfo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CustomerInfoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CustomerInfoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load customerInfo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.customerInfo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
