import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CreditRatingService } from '../service/credit-rating.service';
import { ICreditRating, CreditRating } from '../credit-rating.model';

import { CreditRatingUpdateComponent } from './credit-rating-update.component';

describe('CreditRating Management Update Component', () => {
  let comp: CreditRatingUpdateComponent;
  let fixture: ComponentFixture<CreditRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let creditRatingService: CreditRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CreditRatingUpdateComponent],
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
      .overrideTemplate(CreditRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    creditRatingService = TestBed.inject(CreditRatingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const creditRating: ICreditRating = { id: 456 };

      activatedRoute.data = of({ creditRating });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(creditRating));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CreditRating>>();
      const creditRating = { id: 123 };
      jest.spyOn(creditRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditRating }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(creditRatingService.update).toHaveBeenCalledWith(creditRating);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CreditRating>>();
      const creditRating = new CreditRating();
      jest.spyOn(creditRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditRating }));
      saveSubject.complete();

      // THEN
      expect(creditRatingService.create).toHaveBeenCalledWith(creditRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CreditRating>>();
      const creditRating = { id: 123 };
      jest.spyOn(creditRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(creditRatingService.update).toHaveBeenCalledWith(creditRating);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
