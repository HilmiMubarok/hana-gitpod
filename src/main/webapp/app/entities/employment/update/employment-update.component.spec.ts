import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmploymentService } from '../service/employment.service';
import { IEmployment, Employment } from '../employment.model';

import { EmploymentUpdateComponent } from './employment-update.component';

describe('Employment Management Update Component', () => {
  let comp: EmploymentUpdateComponent;
  let fixture: ComponentFixture<EmploymentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let employmentService: EmploymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmploymentUpdateComponent],
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
      .overrideTemplate(EmploymentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmploymentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    employmentService = TestBed.inject(EmploymentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const employment: IEmployment = { id: 456 };

      activatedRoute.data = of({ employment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(employment));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Employment>>();
      const employment = { id: 123 };
      jest.spyOn(employmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(employmentService.update).toHaveBeenCalledWith(employment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Employment>>();
      const employment = new Employment();
      jest.spyOn(employmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employment }));
      saveSubject.complete();

      // THEN
      expect(employmentService.create).toHaveBeenCalledWith(employment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Employment>>();
      const employment = { id: 123 };
      jest.spyOn(employmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(employmentService.update).toHaveBeenCalledWith(employment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
