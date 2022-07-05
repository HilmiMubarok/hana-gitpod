import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrganizationManagementService } from '../service/organization-management.service';
import { IOrganizationManagement, OrganizationManagement } from '../organization-management.model';

import { OrganizationManagementUpdateComponent } from './organization-management-update.component';

describe('OrganizationManagement Management Update Component', () => {
  let comp: OrganizationManagementUpdateComponent;
  let fixture: ComponentFixture<OrganizationManagementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organizationManagementService: OrganizationManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrganizationManagementUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OrganizationManagementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationManagementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organizationManagementService = TestBed.inject(OrganizationManagementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const organizationManagement: IOrganizationManagement = { id: 456 };

      activatedRoute.data = of({ organizationManagement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organizationManagement));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationManagement>>();
      const organizationManagement = { id: 123 };
      jest.spyOn(organizationManagementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationManagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationManagement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organizationManagementService.update).toHaveBeenCalledWith(organizationManagement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationManagement>>();
      const organizationManagement = new OrganizationManagement();
      jest.spyOn(organizationManagementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationManagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationManagement }));
      saveSubject.complete();

      // THEN
      expect(organizationManagementService.create).toHaveBeenCalledWith(organizationManagement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationManagement>>();
      const organizationManagement = { id: 123 };
      jest.spyOn(organizationManagementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationManagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organizationManagementService.update).toHaveBeenCalledWith(organizationManagement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
