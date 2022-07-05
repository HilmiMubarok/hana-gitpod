import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrganizationFinancialService } from '../service/organization-financial.service';
import { IOrganizationFinancial, OrganizationFinancial } from '../organization-financial.model';

import { OrganizationFinancialUpdateComponent } from './organization-financial-update.component';

describe('OrganizationFinancial Management Update Component', () => {
  let comp: OrganizationFinancialUpdateComponent;
  let fixture: ComponentFixture<OrganizationFinancialUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organizationFinancialService: OrganizationFinancialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrganizationFinancialUpdateComponent],
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
      .overrideTemplate(OrganizationFinancialUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationFinancialUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organizationFinancialService = TestBed.inject(OrganizationFinancialService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const organizationFinancial: IOrganizationFinancial = { id: 456 };

      activatedRoute.data = of({ organizationFinancial });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organizationFinancial));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationFinancial>>();
      const organizationFinancial = { id: 123 };
      jest.spyOn(organizationFinancialService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationFinancial });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationFinancial }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organizationFinancialService.update).toHaveBeenCalledWith(organizationFinancial);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationFinancial>>();
      const organizationFinancial = new OrganizationFinancial();
      jest.spyOn(organizationFinancialService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationFinancial });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organizationFinancial }));
      saveSubject.complete();

      // THEN
      expect(organizationFinancialService.create).toHaveBeenCalledWith(organizationFinancial);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrganizationFinancial>>();
      const organizationFinancial = { id: 123 };
      jest.spyOn(organizationFinancialService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organizationFinancial });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organizationFinancialService.update).toHaveBeenCalledWith(organizationFinancial);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
