package dev.daviboni.domain;

import static dev.daviboni.domain.PartidaTestSamples.*;
import static dev.daviboni.domain.TimeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import dev.daviboni.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TimeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Time.class);
        Time time1 = getTimeSample1();
        Time time2 = new Time();
        assertThat(time1).isNotEqualTo(time2);

        time2.setId(time1.getId());
        assertThat(time1).isEqualTo(time2);

        time2 = getTimeSample2();
        assertThat(time1).isNotEqualTo(time2);
    }

    @Test
    void partidaTest() {
        Time time = getTimeRandomSampleGenerator();
        Partida partidaBack = getPartidaRandomSampleGenerator();

        time.addPartida(partidaBack);
        assertThat(time.getPartidas()).containsOnly(partidaBack);
        assertThat(partidaBack.getTimes()).containsOnly(time);

        time.removePartida(partidaBack);
        assertThat(time.getPartidas()).doesNotContain(partidaBack);
        assertThat(partidaBack.getTimes()).doesNotContain(time);

        time.partidas(new HashSet<>(Set.of(partidaBack)));
        assertThat(time.getPartidas()).containsOnly(partidaBack);
        assertThat(partidaBack.getTimes()).containsOnly(time);

        time.setPartidas(new HashSet<>());
        assertThat(time.getPartidas()).doesNotContain(partidaBack);
        assertThat(partidaBack.getTimes()).doesNotContain(time);
    }
}
