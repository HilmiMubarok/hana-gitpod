import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CifService } from '../service/cif.service';
import { ICif, Cif } from '../cif.model';

import { CifUpdateComponent } from './cif-update.component';

describe('Cif Management Update Component', () => {
  let comp: CifUpdateComponent;
  let fixture: ComponentFixture<CifUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cifService: CifService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CifUpdateComponent],
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
      .overrideTemplate(CifUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CifUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cifService = TestBed.inject(CifService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const cif: ICif = { id: 456 };

      activatedRoute.data = of({ cif });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(cif));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cif>>();
      const cif = { id: 123 };
      jest.spyOn(cifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cif }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(cifService.update).toHaveBeenCalledWith(cif);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cif>>();
      const cif = new Cif();
      jest.spyOn(cifService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cif }));
      saveSubject.complete();

      // THEN
      expect(cifService.create).toHaveBeenCalledWith(cif);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cif>>();
      const cif = { id: 123 };
      jest.spyOn(cifService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cif });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cifService.update).toHaveBeenCalledWith(cif);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
