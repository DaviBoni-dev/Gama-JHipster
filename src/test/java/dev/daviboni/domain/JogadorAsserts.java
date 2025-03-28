package dev.daviboni.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class JogadorAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertJogadorAllPropertiesEquals(Jogador expected, Jogador actual) {
        assertJogadorAutoGeneratedPropertiesEquals(expected, actual);
        assertJogadorAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertJogadorAllUpdatablePropertiesEquals(Jogador expected, Jogador actual) {
        assertJogadorUpdatableFieldsEquals(expected, actual);
        assertJogadorUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertJogadorAutoGeneratedPropertiesEquals(Jogador expected, Jogador actual) {
        assertThat(expected)
            .as("Verify Jogador auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertJogadorUpdatableFieldsEquals(Jogador expected, Jogador actual) {
        assertThat(expected)
            .as("Verify Jogador relevant properties")
            .satisfies(e -> assertThat(e.getNome()).as("check nome").isEqualTo(actual.getNome()))
            .satisfies(e -> assertThat(e.getPosicao()).as("check posicao").isEqualTo(actual.getPosicao()))
            .satisfies(e -> assertThat(e.getNumeroCamisa()).as("check numeroCamisa").isEqualTo(actual.getNumeroCamisa()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertJogadorUpdatableRelationshipsEquals(Jogador expected, Jogador actual) {
        assertThat(expected)
            .as("Verify Jogador relationships")
            .satisfies(e -> assertThat(e.getTime()).as("check time").isEqualTo(actual.getTime()));
    }
}
