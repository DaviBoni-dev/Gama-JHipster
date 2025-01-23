package dev.daviboni.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class TimeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Time getTimeSample1() {
        return new Time().id(1L).nome("nome1").cidade("cidade1").vitorias(1).derrotas(1).empates(1);
    }

    public static Time getTimeSample2() {
        return new Time().id(2L).nome("nome2").cidade("cidade2").vitorias(2).derrotas(2).empates(2);
    }

    public static Time getTimeRandomSampleGenerator() {
        return new Time()
            .id(longCount.incrementAndGet())
            .nome(UUID.randomUUID().toString())
            .cidade(UUID.randomUUID().toString())
            .vitorias(intCount.incrementAndGet())
            .derrotas(intCount.incrementAndGet())
            .empates(intCount.incrementAndGet());
    }
}
