import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganizationLegalDetailComponent } from './organization-legal-detail.component';

describe('OrganizationLegal Management Detail Component', () => {
  let comp: OrganizationLegalDetailComponent;
  let fixture: ComponentFixture<OrganizationLegalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationLegalDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ organizationLegal: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrganizationLegalDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrganizationLegalDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load organizationLegal on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.organizationLegal).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
