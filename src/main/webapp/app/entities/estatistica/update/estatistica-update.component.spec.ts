import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IJogador } from 'app/entities/jogador/jogador.model';
import { JogadorService } from 'app/entities/jogador/service/jogador.service';
import { IPartida } from 'app/entities/partida/partida.model';
import { PartidaService } from 'app/entities/partida/service/partida.service';
import { IEstatistica } from '../estatistica.model';
import { EstatisticaService } from '../service/estatistica.service';
import { EstatisticaFormService } from './estatistica-form.service';

import { EstatisticaUpdateComponent } from './estatistica-update.component';

describe('Estatistica Management Update Component', () => {
  let comp: EstatisticaUpdateComponent;
  let fixture: ComponentFixture<EstatisticaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estatisticaFormService: EstatisticaFormService;
  let estatisticaService: EstatisticaService;
  let jogadorService: JogadorService;
  let partidaService: PartidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EstatisticaUpdateComponent],
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
      .overrideTemplate(EstatisticaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstatisticaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estatisticaFormService = TestBed.inject(EstatisticaFormService);
    estatisticaService = TestBed.inject(EstatisticaService);
    jogadorService = TestBed.inject(JogadorService);
    partidaService = TestBed.inject(PartidaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Jogador query and add missing value', () => {
      const estatistica: IEstatistica = { id: 1903 };
      const jogador: IJogador = { id: 29928 };
      estatistica.jogador = jogador;

      const jogadorCollection: IJogador[] = [{ id: 29928 }];
      jest.spyOn(jogadorService, 'query').mockReturnValue(of(new HttpResponse({ body: jogadorCollection })));
      const additionalJogadors = [jogador];
      const expectedCollection: IJogador[] = [...additionalJogadors, ...jogadorCollection];
      jest.spyOn(jogadorService, 'addJogadorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estatistica });
      comp.ngOnInit();

      expect(jogadorService.query).toHaveBeenCalled();
      expect(jogadorService.addJogadorToCollectionIfMissing).toHaveBeenCalledWith(
        jogadorCollection,
        ...additionalJogadors.map(expect.objectContaining),
      );
      expect(comp.jogadorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Partida query and add missing value', () => {
      const estatistica: IEstatistica = { id: 1903 };
      const partida: IPartida = { id: 21967 };
      estatistica.partida = partida;

      const partidaCollection: IPartida[] = [{ id: 21967 }];
      jest.spyOn(partidaService, 'query').mockReturnValue(of(new HttpResponse({ body: partidaCollection })));
      const additionalPartidas = [partida];
      const expectedCollection: IPartida[] = [...additionalPartidas, ...partidaCollection];
      jest.spyOn(partidaService, 'addPartidaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estatistica });
      comp.ngOnInit();

      expect(partidaService.query).toHaveBeenCalled();
      expect(partidaService.addPartidaToCollectionIfMissing).toHaveBeenCalledWith(
        partidaCollection,
        ...additionalPartidas.map(expect.objectContaining),
      );
      expect(comp.partidasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const estatistica: IEstatistica = { id: 1903 };
      const jogador: IJogador = { id: 29928 };
      estatistica.jogador = jogador;
      const partida: IPartida = { id: 21967 };
      estatistica.partida = partida;

      activatedRoute.data = of({ estatistica });
      comp.ngOnInit();

      expect(comp.jogadorsSharedCollection).toContainEqual(jogador);
      expect(comp.partidasSharedCollection).toContainEqual(partida);
      expect(comp.estatistica).toEqual(estatistica);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstatistica>>();
      const estatistica = { id: 7748 };
      jest.spyOn(estatisticaFormService, 'getEstatistica').mockReturnValue(estatistica);
      jest.spyOn(estatisticaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estatistica });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estatistica }));
      saveSubject.complete();

      // THEN
      expect(estatisticaFormService.getEstatistica).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(estatisticaService.update).toHaveBeenCalledWith(expect.objectContaining(estatistica));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstatistica>>();
      const estatistica = { id: 7748 };
      jest.spyOn(estatisticaFormService, 'getEstatistica').mockReturnValue({ id: null });
      jest.spyOn(estatisticaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estatistica: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estatistica }));
      saveSubject.complete();

      // THEN
      expect(estatisticaFormService.getEstatistica).toHaveBeenCalled();
      expect(estatisticaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstatistica>>();
      const estatistica = { id: 7748 };
      jest.spyOn(estatisticaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estatistica });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estatisticaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJogador', () => {
      it('Should forward to jogadorService', () => {
        const entity = { id: 29928 };
        const entity2 = { id: 28109 };
        jest.spyOn(jogadorService, 'compareJogador');
        comp.compareJogador(entity, entity2);
        expect(jogadorService.compareJogador).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
