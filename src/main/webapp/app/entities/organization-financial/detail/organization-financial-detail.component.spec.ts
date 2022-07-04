import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganizationFinancialDetailComponent } from './organization-financial-detail.component';

describe('OrganizationFinancial Management Detail Component', () => {
  let comp: OrganizationFinancialDetailComponent;
  let fixture: ComponentFixture<OrganizationFinancialDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationFinancialDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ organizationFinancial: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrganizationFinancialDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrganizationFinancialDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load organizationFinancial on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.organizationFinancial).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
