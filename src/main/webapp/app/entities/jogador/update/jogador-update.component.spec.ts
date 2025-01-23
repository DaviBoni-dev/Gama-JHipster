import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITime } from 'app/entities/time/time.model';
import { TimeService } from 'app/entities/time/service/time.service';
import { JogadorService } from '../service/jogador.service';
import { IJogador } from '../jogador.model';
import { JogadorFormService } from './jogador-form.service';

import { JogadorUpdateComponent } from './jogador-update.component';

describe('Jogador Management Update Component', () => {
  let comp: JogadorUpdateComponent;
  let fixture: ComponentFixture<JogadorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jogadorFormService: JogadorFormService;
  let jogadorService: JogadorService;
  let timeService: TimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JogadorUpdateComponent],
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
      .overrideTemplate(JogadorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JogadorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jogadorFormService = TestBed.inject(JogadorFormService);
    jogadorService = TestBed.inject(JogadorService);
    timeService = TestBed.inject(TimeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Time query and add missing value', () => {
      const jogador: IJogador = { id: 28109 };
      const time: ITime = { id: 9921 };
      jogador.time = time;

      const timeCollection: ITime[] = [{ id: 9921 }];
      jest.spyOn(timeService, 'query').mockReturnValue(of(new HttpResponse({ body: timeCollection })));
      const additionalTimes = [time];
      const expectedCollection: ITime[] = [...additionalTimes, ...timeCollection];
      jest.spyOn(timeService, 'addTimeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jogador });
      comp.ngOnInit();

      expect(timeService.query).toHaveBeenCalled();
      expect(timeService.addTimeToCollectionIfMissing).toHaveBeenCalledWith(
        timeCollection,
        ...additionalTimes.map(expect.objectContaining),
      );
      expect(comp.timesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const jogador: IJogador = { id: 28109 };
      const time: ITime = { id: 9921 };
      jogador.time = time;

      activatedRoute.data = of({ jogador });
      comp.ngOnInit();

      expect(comp.timesSharedCollection).toContainEqual(time);
      expect(comp.jogador).toEqual(jogador);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJogador>>();
      const jogador = { id: 29928 };
      jest.spyOn(jogadorFormService, 'getJogador').mockReturnValue(jogador);
      jest.spyOn(jogadorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jogador });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jogador }));
      saveSubject.complete();

      // THEN
      expect(jogadorFormService.getJogador).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jogadorService.update).toHaveBeenCalledWith(expect.objectContaining(jogador));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJogador>>();
      const jogador = { id: 29928 };
      jest.spyOn(jogadorFormService, 'getJogador').mockReturnValue({ id: null });
      jest.spyOn(jogadorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jogador: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jogador }));
      saveSubject.complete();

      // THEN
      expect(jogadorFormService.getJogador).toHaveBeenCalled();
      expect(jogadorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJogador>>();
      const jogador = { id: 29928 };
      jest.spyOn(jogadorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jogador });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jogadorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTime', () => {
      it('Should forward to timeService', () => {
        const entity = { id: 9921 };
        const entity2 = { id: 14578 };
        jest.spyOn(timeService, 'compareTime');
        comp.compareTime(entity, entity2);
        expect(timeService.compareTime).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
