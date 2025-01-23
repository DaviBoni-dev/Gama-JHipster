package dev.daviboni.web.rest;

import static dev.daviboni.domain.CampeonatoAsserts.*;
import static dev.daviboni.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.daviboni.IntegrationTest;
import dev.daviboni.domain.Campeonato;
import dev.daviboni.repository.CampeonatoRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CampeonatoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CampeonatoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_INICIO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_INICIO = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATA_FIM = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_FIM = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/campeonatoes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CampeonatoRepository campeonatoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCampeonatoMockMvc;

    private Campeonato campeonato;

    private Campeonato insertedCampeonato;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Campeonato createEntity() {
        return new Campeonato().nome(DEFAULT_NOME).descricao(DEFAULT_DESCRICAO).dataInicio(DEFAULT_DATA_INICIO).dataFim(DEFAULT_DATA_FIM);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Campeonato createUpdatedEntity() {
        return new Campeonato().nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).dataInicio(UPDATED_DATA_INICIO).dataFim(UPDATED_DATA_FIM);
    }

    @BeforeEach
    public void initTest() {
        campeonato = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedCampeonato != null) {
            campeonatoRepository.delete(insertedCampeonato);
            insertedCampeonato = null;
        }
    }

    @Test
    @Transactional
    void createCampeonato() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Campeonato
        var returnedCampeonato = om.readValue(
            restCampeonatoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(campeonato)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Campeonato.class
        );

        // Validate the Campeonato in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCampeonatoUpdatableFieldsEquals(returnedCampeonato, getPersistedCampeonato(returnedCampeonato));

        insertedCampeonato = returnedCampeonato;
    }

    @Test
    @Transactional
    void createCampeonatoWithExistingId() throws Exception {
        // Create the Campeonato with an existing ID
        campeonato.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCampeonatoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(campeonato)))
            .andExpect(status().isBadRequest());

        // Validate the Campeonato in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        campeonato.setNome(null);

        // Create the Campeonato, which fails.

        restCampeonatoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(campeonato)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCampeonatoes() throws Exception {
        // Initialize the database
        insertedCampeonato = campeonatoRepository.saveAndFlush(campeonato);

        // Get all the campeonatoList
        restCampeonatoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(campeonato.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].dataInicio").value(hasItem(DEFAULT_DATA_INICIO.toString())))
            .andExpect(jsonPath("$.[*].dataFim").value(hasItem(DEFAULT_DATA_FIM.toString())));
    }

    @Test
    @Transactional
    void getCampeonato() throws Exception {
        // Initialize the database
        insertedCampeonato = campeonatoRepository.saveAndFlush(campeonato);

        // Get the campeonato
        restCampeonatoMockMvc
            .perform(get(ENTITY_API_URL_ID, campeonato.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(campeonato.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.dataInicio").value(DEFAULT_DATA_INICIO.toString()))
            .andExpect(jsonPath("$.dataFim").value(DEFAULT_DATA_FIM.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCampeonato() throws Exception {
        // Get the campeonato
        restCampeonatoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCampeonato() throws Exception {
        // Initialize the database
        insertedCampeonato = campeonatoRepository.saveAndFlush(campeonato);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the campeonato
        Campeonato updatedCampeonato = campeonatoRepository.findById(campeonato.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCampeonato are not directly saved in db
        em.detach(updatedCampeonato);
        updatedCampeonato.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).dataInicio(UPDATED_DATA_INICIO).dataFim(UPDATED_DATA_FIM);

        restCampeonatoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCampeonato.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCampeonato))
            )
            .andExpect(status().isOk());

        // Validate the Campeonato in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCampeonatoToMatchAllProperties(updatedCampeonato);
    }

    @Test
    @Transactional
    void putNonExistingCampeonato() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        campeonato.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCampeonatoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, campeonato.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(campeonato))
            )
            .andExpect(status().isBadRequest());

        // Validate the Campeonato in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCampeonato() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        campeonato.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCampeonatoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(campeonato))
            )
            .andExpect(status().isBadRequest());

        // Validate the Campeonato in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCampeonato() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        campeonato.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCampeonatoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(campeonato)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Campeonato in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCampeonatoWithPatch() throws Exception {
        // Initialize the database
        insertedCampeonato = campeonatoRepository.saveAndFlush(campeonato);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the campeonato using partial update
        Campeonato partialUpdatedCampeonato = new Campeonato();
        partialUpdatedCampeonato.setId(campeonato.getId());

        partialUpdatedCampeonato.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).dataInicio(UPDATED_DATA_INICIO);

        restCampeonatoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCampeonato.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCampeonato))
            )
            .andExpect(status().isOk());

        // Validate the Campeonato in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCampeonatoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCampeonato, campeonato),
            getPersistedCampeonato(campeonato)
        );
    }

    @Test
    @Transactional
    void fullUpdateCampeonatoWithPatch() throws Exception {
        // Initialize the database
        insertedCampeonato = campeonatoRepository.saveAndFlush(campeonato);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the campeonato using partial update
        Campeonato partialUpdatedCampeonato = new Campeonato();
        partialUpdatedCampeonato.setId(campeonato.getId());

        partialUpdatedCampeonato.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).dataInicio(UPDATED_DATA_INICIO).dataFim(UPDATED_DATA_FIM);

        restCampeonatoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCampeonato.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCampeonato))
            )
            .andExpect(status().isOk());

        // Validate the Campeonato in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCampeonatoUpdatableFieldsEquals(partialUpdatedCampeonato, getPersistedCampeonato(partialUpdatedCampeonato));
    }

    @Test
    @Transactional
    void patchNonExistingCampeonato() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        campeonato.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCampeonatoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, campeonato.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(campeonato))
            )
            .andExpect(status().isBadRequest());

        // Validate the Campeonato in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCampeonato() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        campeonato.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCampeonatoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(campeonato))
            )
            .andExpect(status().isBadRequest());

        // Validate the Campeonato in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCampeonato() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        campeonato.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCampeonatoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(campeonato)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Campeonato in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCampeonato() throws Exception {
        // Initialize the database
        insertedCampeonato = campeonatoRepository.saveAndFlush(campeonato);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the campeonato
        restCampeonatoMockMvc
            .perform(delete(ENTITY_API_URL_ID, campeonato.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return campeonatoRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Campeonato getPersistedCampeonato(Campeonato campeonato) {
        return campeonatoRepository.findById(campeonato.getId()).orElseThrow();
    }

    protected void assertPersistedCampeonatoToMatchAllProperties(Campeonato expectedCampeonato) {
        assertCampeonatoAllPropertiesEquals(expectedCampeonato, getPersistedCampeonato(expectedCampeonato));
    }

    protected void assertPersistedCampeonatoToMatchUpdatableProperties(Campeonato expectedCampeonato) {
        assertCampeonatoAllUpdatablePropertiesEquals(expectedCampeonato, getPersistedCampeonato(expectedCampeonato));
    }
}
