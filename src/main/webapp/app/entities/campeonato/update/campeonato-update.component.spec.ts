import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { CampeonatoService } from '../service/campeonato.service';
import { ICampeonato } from '../campeonato.model';
import { CampeonatoFormService } from './campeonato-form.service';

import { CampeonatoUpdateComponent } from './campeonato-update.component';

describe('Campeonato Management Update Component', () => {
  let comp: CampeonatoUpdateComponent;
  let fixture: ComponentFixture<CampeonatoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let campeonatoFormService: CampeonatoFormService;
  let campeonatoService: CampeonatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CampeonatoUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CampeonatoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CampeonatoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    campeonatoFormService = TestBed.inject(CampeonatoFormService);
    campeonatoService = TestBed.inject(CampeonatoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const campeonato: ICampeonato = { id: 19911 };

      activatedRoute.data = of({ campeonato });
      comp.ngOnInit();

      expect(comp.campeonato).toEqual(campeonato);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICampeonato>>();
      const campeonato = { id: 4328 };
      jest.spyOn(campeonatoFormService, 'getCampeonato').mockReturnValue(campeonato);
      jest.spyOn(campeonatoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ campeonato });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: campeonato }));
      saveSubject.complete();

      // THEN
      expect(campeonatoFormService.getCampeonato).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(campeonatoService.update).toHaveBeenCalledWith(expect.objectContaining(campeonato));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICampeonato>>();
      const campeonato = { id: 4328 };
      jest.spyOn(campeonatoFormService, 'getCampeonato').mockReturnValue({ id: null });
      jest.spyOn(campeonatoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ campeonato: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: campeonato }));
      saveSubject.complete();

      // THEN
      expect(campeonatoFormService.getCampeonato).toHaveBeenCalled();
      expect(campeonatoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICampeonato>>();
      const campeonato = { id: 4328 };
      jest.spyOn(campeonatoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ campeonato });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(campeonatoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
