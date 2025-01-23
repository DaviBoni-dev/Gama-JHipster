package dev.daviboni.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class JogadorTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Jogador getJogadorSample1() {
        return new Jogador().id(1L).nome("nome1").posicao("posicao1").numeroCamisa(1);
    }

    public static Jogador getJogadorSample2() {
        return new Jogador().id(2L).nome("nome2").posicao("posicao2").numeroCamisa(2);
    }

    public static Jogador getJogadorRandomSampleGenerator() {
        return new Jogador()
            .id(longCount.incrementAndGet())
            .nome(UUID.randomUUID().toString())
            .posicao(UUID.randomUUID().toString())
            .numeroCamisa(intCount.incrementAndGet());
    }
}
