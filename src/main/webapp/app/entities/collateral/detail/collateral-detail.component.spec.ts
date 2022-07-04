import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CollateralDetailComponent } from './collateral-detail.component';

describe('Collateral Management Detail Component', () => {
  let comp: CollateralDetailComponent;
  let fixture: ComponentFixture<CollateralDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollateralDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ collateral: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CollateralDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CollateralDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load collateral on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.collateral).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
