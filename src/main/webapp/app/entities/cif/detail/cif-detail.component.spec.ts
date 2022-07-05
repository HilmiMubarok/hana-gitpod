import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CifDetailComponent } from './cif-detail.component';

describe('Cif Management Detail Component', () => {
  let comp: CifDetailComponent;
  let fixture: ComponentFixture<CifDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CifDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ cif: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CifDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CifDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load cif on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.cif).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
