import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrganizationManagementDetailComponent } from './organization-management-detail.component';

describe('OrganizationManagement Management Detail Component', () => {
  let comp: OrganizationManagementDetailComponent;
  let fixture: ComponentFixture<OrganizationManagementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationManagementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ organizationManagement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OrganizationManagementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OrganizationManagementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load organizationManagement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.organizationManagement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
