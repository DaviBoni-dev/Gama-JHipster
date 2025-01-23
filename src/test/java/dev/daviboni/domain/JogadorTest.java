package dev.daviboni.domain;

import static dev.daviboni.domain.JogadorTestSamples.*;
import static dev.daviboni.domain.TimeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import dev.daviboni.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JogadorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Jogador.class);
        Jogador jogador1 = getJogadorSample1();
        Jogador jogador2 = new Jogador();
        assertThat(jogador1).isNotEqualTo(jogador2);

        jogador2.setId(jogador1.getId());
        assertThat(jogador1).isEqualTo(jogador2);

        jogador2 = getJogadorSample2();
        assertThat(jogador1).isNotEqualTo(jogador2);
    }

    @Test
    void timeTest() {
        Jogador jogador = getJogadorRandomSampleGenerator();
        Time timeBack = getTimeRandomSampleGenerator();

        jogador.setTime(timeBack);
        assertThat(jogador.getTime()).isEqualTo(timeBack);

        jogador.time(null);
        assertThat(jogador.getTime()).isNull();
    }
}
