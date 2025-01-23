package dev.daviboni.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PartidaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Partida getPartidaSample1() {
        return new Partida().id(1L).local("local1").pontuacaoTime1(1).pontuacaoTime2(1);
    }

    public static Partida getPartidaSample2() {
        return new Partida().id(2L).local("local2").pontuacaoTime1(2).pontuacaoTime2(2);
    }

    public static Partida getPartidaRandomSampleGenerator() {
        return new Partida()
            .id(longCount.incrementAndGet())
            .local(UUID.randomUUID().toString())
            .pontuacaoTime1(intCount.incrementAndGet())
            .pontuacaoTime2(intCount.incrementAndGet());
    }
}
