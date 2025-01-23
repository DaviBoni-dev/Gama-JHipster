import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITime } from 'app/entities/time/time.model';
import { TimeService } from 'app/entities/time/service/time.service';
import { ICampeonato } from 'app/entities/campeonato/campeonato.model';
import { CampeonatoService } from 'app/entities/campeonato/service/campeonato.service';
import { IPartida } from '../partida.model';
import { PartidaService } from '../service/partida.service';
import { PartidaFormService } from './partida-form.service';

import { PartidaUpdateComponent } from './partida-update.component';

describe('Partida Management Update Component', () => {
  let comp: PartidaUpdateComponent;
  let fixture: ComponentFixture<PartidaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let partidaFormService: PartidaFormService;
  let partidaService: PartidaService;
  let timeService: TimeService;
  let campeonatoService: CampeonatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PartidaUpdateComponent],
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
      .overrideTemplate(PartidaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PartidaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    partidaFormService = TestBed.inject(PartidaFormService);
    partidaService = TestBed.inject(PartidaService);
    timeService = TestBed.inject(TimeService);
    campeonatoService = TestBed.inject(CampeonatoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Time query and add missing value', () => {
      const partida: IPartida = { id: 17449 };
      const times: ITime[] = [{ id: 9921 }];
      partida.times = times;

      const timeCollection: ITime[] = [{ id: 9921 }];
      jest.spyOn(timeService, 'query').mockReturnValue(of(new HttpResponse({ body: timeCollection })));
      const additionalTimes = [...times];
      const expectedCollection: ITime[] = [...additionalTimes, ...timeCollection];
      jest.spyOn(timeService, 'addTimeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ partida });
      comp.ngOnInit();

      expect(timeService.query).toHaveBeenCalled();
      expect(timeService.addTimeToCollectionIfMissing).toHaveBeenCalledWith(
        timeCollection,
        ...additionalTimes.map(expect.objectContaining),
      );
      expect(comp.timesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Campeonato query and add missing value', () => {
      const partida: IPartida = { id: 17449 };
      const campeonato: ICampeonato = { id: 4328 };
      partida.campeonato = campeonato;

      const campeonatoCollection: ICampeonato[] = [{ id: 4328 }];
      jest.spyOn(campeonatoService, 'query').mockReturnValue(of(new HttpResponse({ body: campeonatoCollection })));
      const additionalCampeonatoes = [campeonato];
      const expectedCollection: ICampeonato[] = [...additionalCampeonatoes, ...campeonatoCollection];
      jest.spyOn(campeonatoService, 'addCampeonatoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ partida });
      comp.ngOnInit();

      expect(campeonatoService.query).toHaveBeenCalled();
      expect(campeonatoService.addCampeonatoToCollectionIfMissing).toHaveBeenCalledWith(
        campeonatoCollection,
        ...additionalCampeonatoes.map(expect.objectContaining),
      );
      expect(comp.campeonatoesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const partida: IPartida = { id: 17449 };
      const times: ITime = { id: 9921 };
      partida.times = [times];
      const campeonato: ICampeonato = { id: 4328 };
      partida.campeonato = campeonato;

      activatedRoute.data = of({ partida });
      comp.ngOnInit();

      expect(comp.timesSharedCollection).toContainEqual(times);
      expect(comp.campeonatoesSharedCollection).toContainEqual(campeonato);
      expect(comp.partida).toEqual(partida);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPartida>>();
      const partida = { id: 21967 };
      jest.spyOn(partidaFormService, 'getPartida').mockReturnValue(partida);
      jest.spyOn(partidaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partida });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partida }));
      saveSubject.complete();

      // THEN
      expect(partidaFormService.getPartida).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(partidaService.update).toHaveBeenCalledWith(expect.objectContaining(partida));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPartida>>();
      const partida = { id: 21967 };
      jest.spyOn(partidaFormService, 'getPartida').mockReturnValue({ id: null });
      jest.spyOn(partidaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partida: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: partida }));
      saveSubject.complete();

      // THEN
      expect(partidaFormService.getPartida).toHaveBeenCalled();
      expect(partidaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPartida>>();
      const partida = { id: 21967 };
      jest.spyOn(partidaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ partida });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(partidaService.update).toHaveBeenCalled();
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

    describe('compareCampeonato', () => {
      it('Should forward to campeonatoService', () => {
        const entity = { id: 4328 };
        const entity2 = { id: 19911 };
        jest.spyOn(campeonatoService, 'compareCampeonato');
        comp.compareCampeonato(entity, entity2);
        expect(campeonatoService.compareCampeonato).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
