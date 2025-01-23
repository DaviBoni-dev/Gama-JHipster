import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IJogador } from '../jogador.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../jogador.test-samples';

import { JogadorService } from './jogador.service';

const requireRestSample: IJogador = {
  ...sampleWithRequiredData,
};

describe('Jogador Service', () => {
  let service: JogadorService;
  let httpMock: HttpTestingController;
  let expectedResult: IJogador | IJogador[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(JogadorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Jogador', () => {
      const jogador = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jogador).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Jogador', () => {
      const jogador = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jogador).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Jogador', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Jogador', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Jogador', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJogadorToCollectionIfMissing', () => {
      it('should add a Jogador to an empty array', () => {
        const jogador: IJogador = sampleWithRequiredData;
        expectedResult = service.addJogadorToCollectionIfMissing([], jogador);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jogador);
      });

      it('should not add a Jogador to an array that contains it', () => {
        const jogador: IJogador = sampleWithRequiredData;
        const jogadorCollection: IJogador[] = [
          {
            ...jogador,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJogadorToCollectionIfMissing(jogadorCollection, jogador);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Jogador to an array that doesn't contain it", () => {
        const jogador: IJogador = sampleWithRequiredData;
        const jogadorCollection: IJogador[] = [sampleWithPartialData];
        expectedResult = service.addJogadorToCollectionIfMissing(jogadorCollection, jogador);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jogador);
      });

      it('should add only unique Jogador to an array', () => {
        const jogadorArray: IJogador[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jogadorCollection: IJogador[] = [sampleWithRequiredData];
        expectedResult = service.addJogadorToCollectionIfMissing(jogadorCollection, ...jogadorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jogador: IJogador = sampleWithRequiredData;
        const jogador2: IJogador = sampleWithPartialData;
        expectedResult = service.addJogadorToCollectionIfMissing([], jogador, jogador2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jogador);
        expect(expectedResult).toContain(jogador2);
      });

      it('should accept null and undefined values', () => {
        const jogador: IJogador = sampleWithRequiredData;
        expectedResult = service.addJogadorToCollectionIfMissing([], null, jogador, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jogador);
      });

      it('should return initial array if no Jogador is added', () => {
        const jogadorCollection: IJogador[] = [sampleWithRequiredData];
        expectedResult = service.addJogadorToCollectionIfMissing(jogadorCollection, undefined, null);
        expect(expectedResult).toEqual(jogadorCollection);
      });
    });

    describe('compareJogador', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJogador(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 29928 };
        const entity2 = null;

        const compareResult1 = service.compareJogador(entity1, entity2);
        const compareResult2 = service.compareJogador(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 29928 };
        const entity2 = { id: 28109 };

        const compareResult1 = service.compareJogador(entity1, entity2);
        const compareResult2 = service.compareJogador(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 29928 };
        const entity2 = { id: 29928 };

        const compareResult1 = service.compareJogador(entity1, entity2);
        const compareResult2 = service.compareJogador(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
