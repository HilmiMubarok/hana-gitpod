import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrganizationLegalService } from '../service/organization-legal.service';
import { IOrganizationLegal, OrganizationLegal } from '../organization-legal.model';

import { OrganizationLegalUpdateComponent } from './organization-legal-update.component';

describe('OrganizationLegal Management Update Component', () => {
  let comp: OrganizationLegalUpdateComponent;
  let fixture: ComponentFixture<OrganizationLegalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organizationLegalService: OrganizationLegalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrganizationLegalUpdateComponent],
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
      .overrideTemplate(OrganizationLegalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationLegalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organizationLegalService = TestBed.inject(OrganizationLegalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const organizationLegal: IOrganizationLegal = { id: 456 };

      activatedRoute.data = of({ organizationLegal });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organizationLegal));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationLegal>>();
      const organizationLegal = { id: 123 };
      jest.spyOn(organizationLegalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationLegal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationLegal }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organizationLegalService.update).toHaveBeenCalledWith(organizationLegal);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationLegal>>();
      const organizationLegal = new OrganizationLegal();
      jest.spyOn(organizationLegalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationLegal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationLegal }));
      saveSubject.complete();

      // THEN
      expect(organizationLegalService.create).toHaveBeenCalledWith(organizationLegal);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationLegal>>();
      const organizationLegal = { id: 123 };
      jest.spyOn(organizationLegalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationLegal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organizationLegalService.update).toHaveBeenCalledWith(organizationLegal);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
