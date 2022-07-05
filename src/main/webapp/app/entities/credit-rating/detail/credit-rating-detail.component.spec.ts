import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreditRatingDetailComponent } from './credit-rating-detail.component';

describe('CreditRating Management Detail Component', () => {
  let comp: CreditRatingDetailComponent;
  let fixture: ComponentFixture<CreditRatingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditRatingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ creditRating: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CreditRatingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CreditRatingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load creditRating on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.creditRating).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
