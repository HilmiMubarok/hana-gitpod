import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmploymentDetailComponent } from './employment-detail.component';

describe('Employment Management Detail Component', () => {
  let comp: EmploymentDetailComponent;
  let fixture: ComponentFixture<EmploymentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmploymentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ employment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EmploymentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EmploymentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load employment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.employment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
