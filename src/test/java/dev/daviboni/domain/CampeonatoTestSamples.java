package dev.daviboni.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CampeonatoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Campeonato getCampeonatoSample1() {
        return new Campeonato().id(1L).nome("nome1").descricao("descricao1");
    }

    public static Campeonato getCampeonatoSample2() {
        return new Campeonato().id(2L).nome("nome2").descricao("descricao2");
    }

    public static Campeonato getCampeonatoRandomSampleGenerator() {
        return new Campeonato().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString()).descricao(UUID.randomUUID().toString());
    }
}
