import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPartida } from 'app/entities/partida/partida.model';
import { PartidaService } from 'app/entities/partida/service/partida.service';
import { TimeService } from '../service/time.service';
import { ITime } from '../time.model';
import { TimeFormService } from './time-form.service';

import { TimeUpdateComponent } from './time-update.component';

describe('Time Management Update Component', () => {
  let comp: TimeUpdateComponent;
  let fixture: ComponentFixture<TimeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let timeFormService: TimeFormService;
  let timeService: TimeService;
  let partidaService: PartidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimeUpdateComponent],
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
      .overrideTemplate(TimeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    timeFormService = TestBed.inject(TimeFormService);
    timeService = TestBed.inject(TimeService);
    partidaService = TestBed.inject(PartidaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Partida query and add missing value', () => {
      const time: ITime = { id: 14578 };
      const partidas: IPartida[] = [{ id: 21967 }];
      time.partidas = partidas;

      const partidaCollection: IPartida[] = [{ id: 21967 }];
      jest.spyOn(partidaService, 'query').mockReturnValue(of(new HttpResponse({ body: partidaCollection })));
      const additionalPartidas = [...partidas];
      const expectedCollection: IPartida[] = [...additionalPartidas, ...partidaCollection];
      jest.spyOn(partidaService, 'addPartidaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ time });
      comp.ngOnInit();

      expect(partidaService.query).toHaveBeenCalled();
      expect(partidaService.addPartidaToCollectionIfMissing).toHaveBeenCalledWith(
        partidaCollection,
        ...additionalPartidas.map(expect.objectContaining),
      );
      expect(comp.partidasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const time: ITime = { id: 14578 };
      const partida: IPartida = { id: 21967 };
      time.partidas = [partida];

      activatedRoute.data = of({ time });
      comp.ngOnInit();

      expect(comp.partidasSharedCollection).toContainEqual(partida);
      expect(comp.time).toEqual(time);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITime>>();
      const time = { id: 9921 };
      jest.spyOn(timeFormService, 'getTime').mockReturnValue(time);
      jest.spyOn(timeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ time });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: time }));
      saveSubject.complete();

      // THEN
      expect(timeFormService.getTime).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(timeService.update).toHaveBeenCalledWith(expect.objectContaining(time));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITime>>();
      const time = { id: 9921 };
      jest.spyOn(timeFormService, 'getTime').mockReturnValue({ id: null });
      jest.spyOn(timeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ time: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: time }));
      saveSubject.complete();

      // THEN
      expect(timeFormService.getTime).toHaveBeenCalled();
      expect(timeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITime>>();
      const time = { id: 9921 };
      jest.spyOn(timeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ time });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(timeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePartida', () => {
      it('Should forward to partidaService', () => {
        const entity = { id: 21967 };
        const entity2 = { id: 17449 };
        jest.spyOn(partidaService, 'comparePartida');
        comp.comparePartida(entity, entity2);
        expect(partidaService.comparePartida).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
