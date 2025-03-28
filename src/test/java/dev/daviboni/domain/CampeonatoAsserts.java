package dev.daviboni.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class CampeonatoAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCampeonatoAllPropertiesEquals(Campeonato expected, Campeonato actual) {
        assertCampeonatoAutoGeneratedPropertiesEquals(expected, actual);
        assertCampeonatoAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCampeonatoAllUpdatablePropertiesEquals(Campeonato expected, Campeonato actual) {
        assertCampeonatoUpdatableFieldsEquals(expected, actual);
        assertCampeonatoUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCampeonatoAutoGeneratedPropertiesEquals(Campeonato expected, Campeonato actual) {
        assertThat(expected)
            .as("Verify Campeonato auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCampeonatoUpdatableFieldsEquals(Campeonato expected, Campeonato actual) {
        assertThat(expected)
            .as("Verify Campeonato relevant properties")
            .satisfies(e -> assertThat(e.getNome()).as("check nome").isEqualTo(actual.getNome()))
            .satisfies(e -> assertThat(e.getDescricao()).as("check descricao").isEqualTo(actual.getDescricao()))
            .satisfies(e -> assertThat(e.getDataInicio()).as("check dataInicio").isEqualTo(actual.getDataInicio()))
            .satisfies(e -> assertThat(e.getDataFim()).as("check dataFim").isEqualTo(actual.getDataFim()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertCampeonatoUpdatableRelationshipsEquals(Campeonato expected, Campeonato actual) {
        // empty method
    }
}
