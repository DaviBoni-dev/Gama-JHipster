package dev.daviboni.domain;

import static dev.daviboni.domain.EstatisticaTestSamples.*;
import static dev.daviboni.domain.JogadorTestSamples.*;
import static dev.daviboni.domain.PartidaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import dev.daviboni.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EstatisticaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Estatistica.class);
        Estatistica estatistica1 = getEstatisticaSample1();
        Estatistica estatistica2 = new Estatistica();
        assertThat(estatistica1).isNotEqualTo(estatistica2);

        estatistica2.setId(estatistica1.getId());
        assertThat(estatistica1).isEqualTo(estatistica2);

        estatistica2 = getEstatisticaSample2();
        assertThat(estatistica1).isNotEqualTo(estatistica2);
    }

    @Test
    void jogadorTest() {
        Estatistica estatistica = getEstatisticaRandomSampleGenerator();
        Jogador jogadorBack = getJogadorRandomSampleGenerator();

        estatistica.setJogador(jogadorBack);
        assertThat(estatistica.getJogador()).isEqualTo(jogadorBack);

        estatistica.jogador(null);
        assertThat(estatistica.getJogador()).isNull();
    }

    @Test
    void partidaTest() {
        Estatistica estatistica = getEstatisticaRandomSampleGenerator();
        Partida partidaBack = getPartidaRandomSampleGenerator();

        estatistica.setPartida(partidaBack);
        assertThat(estatistica.getPartida()).isEqualTo(partidaBack);

        estatistica.partida(null);
        assertThat(estatistica.getPartida()).isNull();
    }
}
