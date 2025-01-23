package dev.daviboni.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class EstatisticaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Estatistica getEstatisticaSample1() {
        return new Estatistica().id(1L).pontos(1).rebotes(1).assistencias(1).faltas(1);
    }

    public static Estatistica getEstatisticaSample2() {
        return new Estatistica().id(2L).pontos(2).rebotes(2).assistencias(2).faltas(2);
    }

    public static Estatistica getEstatisticaRandomSampleGenerator() {
        return new Estatistica()
            .id(longCount.incrementAndGet())
            .pontos(intCount.incrementAndGet())
            .rebotes(intCount.incrementAndGet())
            .assistencias(intCount.incrementAndGet())
            .faltas(intCount.incrementAndGet());
    }
}
