package dev.daviboni.domain;

import static dev.daviboni.domain.CampeonatoTestSamples.*;
import static dev.daviboni.domain.PartidaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import dev.daviboni.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CampeonatoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Campeonato.class);
        Campeonato campeonato1 = getCampeonatoSample1();
        Campeonato campeonato2 = new Campeonato();
        assertThat(campeonato1).isNotEqualTo(campeonato2);

        campeonato2.setId(campeonato1.getId());
        assertThat(campeonato1).isEqualTo(campeonato2);

        campeonato2 = getCampeonatoSample2();
        assertThat(campeonato1).isNotEqualTo(campeonato2);
    }

    @Test
    void partidasTest() {
        Campeonato campeonato = getCampeonatoRandomSampleGenerator();
        Partida partidaBack = getPartidaRandomSampleGenerator();

        campeonato.addPartidas(partidaBack);
        assertThat(campeonato.getPartidas()).containsOnly(partidaBack);
        assertThat(partidaBack.getCampeonato()).isEqualTo(campeonato);

        campeonato.removePartidas(partidaBack);
        assertThat(campeonato.getPartidas()).doesNotContain(partidaBack);
        assertThat(partidaBack.getCampeonato()).isNull();

        campeonato.partidas(new HashSet<>(Set.of(partidaBack)));
        assertThat(campeonato.getPartidas()).containsOnly(partidaBack);
        assertThat(partidaBack.getCampeonato()).isEqualTo(campeonato);

        campeonato.setPartidas(new HashSet<>());
        assertThat(campeonato.getPartidas()).doesNotContain(partidaBack);
        assertThat(partidaBack.getCampeonato()).isNull();
    }
}
