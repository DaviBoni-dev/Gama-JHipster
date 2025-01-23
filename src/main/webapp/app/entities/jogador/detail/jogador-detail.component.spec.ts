import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { JogadorDetailComponent } from './jogador-detail.component';

describe('Jogador Management Detail Component', () => {
  let comp: JogadorDetailComponent;
  let fixture: ComponentFixture<JogadorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JogadorDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./jogador-detail.component').then(m => m.JogadorDetailComponent),
              resolve: { jogador: () => of({ id: 29928 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(JogadorDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JogadorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load jogador on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JogadorDetailComponent);

      // THEN
      expect(instance.jogador()).toEqual(expect.objectContaining({ id: 29928 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
