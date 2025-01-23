package dev.daviboni.domain;

import static dev.daviboni.domain.CampeonatoTestSamples.*;
import static dev.daviboni.domain.PartidaTestSamples.*;
import static dev.daviboni.domain.TimeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import dev.daviboni.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PartidaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Partida.class);
        Partida partida1 = getPartidaSample1();
        Partida partida2 = new Partida();
        assertThat(partida1).isNotEqualTo(partida2);

        partida2.setId(partida1.getId());
        assertThat(partida1).isEqualTo(partida2);

        partida2 = getPartidaSample2();
        assertThat(partida1).isNotEqualTo(partida2);
    }

    @Test
    void timesTest() {
        Partida partida = getPartidaRandomSampleGenerator();
        Time timeBack = getTimeRandomSampleGenerator();

        partida.addTimes(timeBack);
        assertThat(partida.getTimes()).containsOnly(timeBack);

        partida.removeTimes(timeBack);
        assertThat(partida.getTimes()).doesNotContain(timeBack);

        partida.times(new HashSet<>(Set.of(timeBack)));
        assertThat(partida.getTimes()).containsOnly(timeBack);

        partida.setTimes(new HashSet<>());
        assertThat(partida.getTimes()).doesNotContain(timeBack);
    }

    @Test
    void campeonatoTest() {
        Partida partida = getPartidaRandomSampleGenerator();
        Campeonato campeonatoBack = getCampeonatoRandomSampleGenerator();

        partida.setCampeonato(campeonatoBack);
        assertThat(partida.getCampeonato()).isEqualTo(campeonatoBack);

        partida.campeonato(null);
        assertThat(partida.getCampeonato()).isNull();
    }
}
