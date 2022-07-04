import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CollateralTypeDetailComponent } from './collateral-type-detail.component';

describe('CollateralType Management Detail Component', () => {
  let comp: CollateralTypeDetailComponent;
  let fixture: ComponentFixture<CollateralTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollateralTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ collateralType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CollateralTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CollateralTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load collateralType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.collateralType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
