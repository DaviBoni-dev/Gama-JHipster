package dev.daviboni.web.rest;

import static dev.daviboni.domain.EstatisticaAsserts.*;
import static dev.daviboni.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.daviboni.IntegrationTest;
import dev.daviboni.domain.Estatistica;
import dev.daviboni.repository.EstatisticaRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link EstatisticaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EstatisticaResourceIT {

    private static final Integer DEFAULT_PONTOS = 1;
    private static final Integer UPDATED_PONTOS = 2;

    private static final Integer DEFAULT_REBOTES = 1;
    private static final Integer UPDATED_REBOTES = 2;

    private static final Integer DEFAULT_ASSISTENCIAS = 1;
    private static final Integer UPDATED_ASSISTENCIAS = 2;

    private static final Integer DEFAULT_FALTAS = 1;
    private static final Integer UPDATED_FALTAS = 2;

    private static final String ENTITY_API_URL = "/api/estatisticas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EstatisticaRepository estatisticaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEstatisticaMockMvc;

    private Estatistica estatistica;

    private Estatistica insertedEstatistica;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estatistica createEntity() {
        return new Estatistica().pontos(DEFAULT_PONTOS).rebotes(DEFAULT_REBOTES).assistencias(DEFAULT_ASSISTENCIAS).faltas(DEFAULT_FALTAS);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estatistica createUpdatedEntity() {
        return new Estatistica().pontos(UPDATED_PONTOS).rebotes(UPDATED_REBOTES).assistencias(UPDATED_ASSISTENCIAS).faltas(UPDATED_FALTAS);
    }

    @BeforeEach
    public void initTest() {
        estatistica = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedEstatistica != null) {
            estatisticaRepository.delete(insertedEstatistica);
            insertedEstatistica = null;
        }
    }

    @Test
    @Transactional
    void createEstatistica() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Estatistica
        var returnedEstatistica = om.readValue(
            restEstatisticaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estatistica)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Estatistica.class
        );

        // Validate the Estatistica in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEstatisticaUpdatableFieldsEquals(returnedEstatistica, getPersistedEstatistica(returnedEstatistica));

        insertedEstatistica = returnedEstatistica;
    }

    @Test
    @Transactional
    void createEstatisticaWithExistingId() throws Exception {
        // Create the Estatistica with an existing ID
        estatistica.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEstatisticaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estatistica)))
            .andExpect(status().isBadRequest());

        // Validate the Estatistica in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEstatisticas() throws Exception {
        // Initialize the database
        insertedEstatistica = estatisticaRepository.saveAndFlush(estatistica);

        // Get all the estatisticaList
        restEstatisticaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(estatistica.getId().intValue())))
            .andExpect(jsonPath("$.[*].pontos").value(hasItem(DEFAULT_PONTOS)))
            .andExpect(jsonPath("$.[*].rebotes").value(hasItem(DEFAULT_REBOTES)))
            .andExpect(jsonPath("$.[*].assistencias").value(hasItem(DEFAULT_ASSISTENCIAS)))
            .andExpect(jsonPath("$.[*].faltas").value(hasItem(DEFAULT_FALTAS)));
    }

    @Test
    @Transactional
    void getEstatistica() throws Exception {
        // Initialize the database
        insertedEstatistica = estatisticaRepository.saveAndFlush(estatistica);

        // Get the estatistica
        restEstatisticaMockMvc
            .perform(get(ENTITY_API_URL_ID, estatistica.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(estatistica.getId().intValue()))
            .andExpect(jsonPath("$.pontos").value(DEFAULT_PONTOS))
            .andExpect(jsonPath("$.rebotes").value(DEFAULT_REBOTES))
            .andExpect(jsonPath("$.assistencias").value(DEFAULT_ASSISTENCIAS))
            .andExpect(jsonPath("$.faltas").value(DEFAULT_FALTAS));
    }

    @Test
    @Transactional
    void getNonExistingEstatistica() throws Exception {
        // Get the estatistica
        restEstatisticaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEstatistica() throws Exception {
        // Initialize the database
        insertedEstatistica = estatisticaRepository.saveAndFlush(estatistica);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the estatistica
        Estatistica updatedEstatistica = estatisticaRepository.findById(estatistica.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEstatistica are not directly saved in db
        em.detach(updatedEstatistica);
        updatedEstatistica.pontos(UPDATED_PONTOS).rebotes(UPDATED_REBOTES).assistencias(UPDATED_ASSISTENCIAS).faltas(UPDATED_FALTAS);

        restEstatisticaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEstatistica.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEstatistica))
            )
            .andExpect(status().isOk());

        // Validate the Estatistica in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEstatisticaToMatchAllProperties(updatedEstatistica);
    }

    @Test
    @Transactional
    void putNonExistingEstatistica() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estatistica.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstatisticaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, estatistica.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(estatistica))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estatistica in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEstatistica() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estatistica.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstatisticaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(estatistica))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estatistica in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEstatistica() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estatistica.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstatisticaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(estatistica)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estatistica in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEstatisticaWithPatch() throws Exception {
        // Initialize the database
        insertedEstatistica = estatisticaRepository.saveAndFlush(estatistica);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the estatistica using partial update
        Estatistica partialUpdatedEstatistica = new Estatistica();
        partialUpdatedEstatistica.setId(estatistica.getId());

        partialUpdatedEstatistica.assistencias(UPDATED_ASSISTENCIAS).faltas(UPDATED_FALTAS);

        restEstatisticaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstatistica.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEstatistica))
            )
            .andExpect(status().isOk());

        // Validate the Estatistica in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEstatisticaUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEstatistica, estatistica),
            getPersistedEstatistica(estatistica)
        );
    }

    @Test
    @Transactional
    void fullUpdateEstatisticaWithPatch() throws Exception {
        // Initialize the database
        insertedEstatistica = estatisticaRepository.saveAndFlush(estatistica);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the estatistica using partial update
        Estatistica partialUpdatedEstatistica = new Estatistica();
        partialUpdatedEstatistica.setId(estatistica.getId());

        partialUpdatedEstatistica.pontos(UPDATED_PONTOS).rebotes(UPDATED_REBOTES).assistencias(UPDATED_ASSISTENCIAS).faltas(UPDATED_FALTAS);

        restEstatisticaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstatistica.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEstatistica))
            )
            .andExpect(status().isOk());

        // Validate the Estatistica in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEstatisticaUpdatableFieldsEquals(partialUpdatedEstatistica, getPersistedEstatistica(partialUpdatedEstatistica));
    }

    @Test
    @Transactional
    void patchNonExistingEstatistica() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estatistica.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstatisticaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, estatistica.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(estatistica))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estatistica in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEstatistica() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estatistica.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstatisticaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(estatistica))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estatistica in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEstatistica() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        estatistica.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstatisticaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(estatistica)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estatistica in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEstatistica() throws Exception {
        // Initialize the database
        insertedEstatistica = estatisticaRepository.saveAndFlush(estatistica);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the estatistica
        restEstatisticaMockMvc
            .perform(delete(ENTITY_API_URL_ID, estatistica.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return estatisticaRepository.count();
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

    protected Estatistica getPersistedEstatistica(Estatistica estatistica) {
        return estatisticaRepository.findById(estatistica.getId()).orElseThrow();
    }

    protected void assertPersistedEstatisticaToMatchAllProperties(Estatistica expectedEstatistica) {
        assertEstatisticaAllPropertiesEquals(expectedEstatistica, getPersistedEstatistica(expectedEstatistica));
    }

    protected void assertPersistedEstatisticaToMatchUpdatableProperties(Estatistica expectedEstatistica) {
        assertEstatisticaAllUpdatablePropertiesEquals(expectedEstatistica, getPersistedEstatistica(expectedEstatistica));
    }
}
