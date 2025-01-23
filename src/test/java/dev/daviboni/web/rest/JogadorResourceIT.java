package dev.daviboni.web.rest;

import static dev.daviboni.domain.JogadorAsserts.*;
import static dev.daviboni.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.daviboni.IntegrationTest;
import dev.daviboni.domain.Jogador;
import dev.daviboni.repository.JogadorRepository;
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
 * Integration tests for the {@link JogadorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JogadorResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_POSICAO = "AAAAAAAAAA";
    private static final String UPDATED_POSICAO = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMERO_CAMISA = 1;
    private static final Integer UPDATED_NUMERO_CAMISA = 2;

    private static final String ENTITY_API_URL = "/api/jogadors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private JogadorRepository jogadorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJogadorMockMvc;

    private Jogador jogador;

    private Jogador insertedJogador;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Jogador createEntity() {
        return new Jogador().nome(DEFAULT_NOME).posicao(DEFAULT_POSICAO).numeroCamisa(DEFAULT_NUMERO_CAMISA);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Jogador createUpdatedEntity() {
        return new Jogador().nome(UPDATED_NOME).posicao(UPDATED_POSICAO).numeroCamisa(UPDATED_NUMERO_CAMISA);
    }

    @BeforeEach
    public void initTest() {
        jogador = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedJogador != null) {
            jogadorRepository.delete(insertedJogador);
            insertedJogador = null;
        }
    }

    @Test
    @Transactional
    void createJogador() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Jogador
        var returnedJogador = om.readValue(
            restJogadorMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(jogador)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Jogador.class
        );

        // Validate the Jogador in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertJogadorUpdatableFieldsEquals(returnedJogador, getPersistedJogador(returnedJogador));

        insertedJogador = returnedJogador;
    }

    @Test
    @Transactional
    void createJogadorWithExistingId() throws Exception {
        // Create the Jogador with an existing ID
        jogador.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJogadorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(jogador)))
            .andExpect(status().isBadRequest());

        // Validate the Jogador in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        jogador.setNome(null);

        // Create the Jogador, which fails.

        restJogadorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(jogador)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllJogadors() throws Exception {
        // Initialize the database
        insertedJogador = jogadorRepository.saveAndFlush(jogador);

        // Get all the jogadorList
        restJogadorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jogador.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].posicao").value(hasItem(DEFAULT_POSICAO)))
            .andExpect(jsonPath("$.[*].numeroCamisa").value(hasItem(DEFAULT_NUMERO_CAMISA)));
    }

    @Test
    @Transactional
    void getJogador() throws Exception {
        // Initialize the database
        insertedJogador = jogadorRepository.saveAndFlush(jogador);

        // Get the jogador
        restJogadorMockMvc
            .perform(get(ENTITY_API_URL_ID, jogador.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jogador.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.posicao").value(DEFAULT_POSICAO))
            .andExpect(jsonPath("$.numeroCamisa").value(DEFAULT_NUMERO_CAMISA));
    }

    @Test
    @Transactional
    void getNonExistingJogador() throws Exception {
        // Get the jogador
        restJogadorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingJogador() throws Exception {
        // Initialize the database
        insertedJogador = jogadorRepository.saveAndFlush(jogador);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the jogador
        Jogador updatedJogador = jogadorRepository.findById(jogador.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedJogador are not directly saved in db
        em.detach(updatedJogador);
        updatedJogador.nome(UPDATED_NOME).posicao(UPDATED_POSICAO).numeroCamisa(UPDATED_NUMERO_CAMISA);

        restJogadorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJogador.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedJogador))
            )
            .andExpect(status().isOk());

        // Validate the Jogador in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedJogadorToMatchAllProperties(updatedJogador);
    }

    @Test
    @Transactional
    void putNonExistingJogador() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jogador.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJogadorMockMvc
            .perform(put(ENTITY_API_URL_ID, jogador.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(jogador)))
            .andExpect(status().isBadRequest());

        // Validate the Jogador in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJogador() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jogador.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJogadorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(jogador))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jogador in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJogador() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jogador.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJogadorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(jogador)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Jogador in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJogadorWithPatch() throws Exception {
        // Initialize the database
        insertedJogador = jogadorRepository.saveAndFlush(jogador);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the jogador using partial update
        Jogador partialUpdatedJogador = new Jogador();
        partialUpdatedJogador.setId(jogador.getId());

        partialUpdatedJogador.nome(UPDATED_NOME).posicao(UPDATED_POSICAO).numeroCamisa(UPDATED_NUMERO_CAMISA);

        restJogadorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJogador.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedJogador))
            )
            .andExpect(status().isOk());

        // Validate the Jogador in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertJogadorUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedJogador, jogador), getPersistedJogador(jogador));
    }

    @Test
    @Transactional
    void fullUpdateJogadorWithPatch() throws Exception {
        // Initialize the database
        insertedJogador = jogadorRepository.saveAndFlush(jogador);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the jogador using partial update
        Jogador partialUpdatedJogador = new Jogador();
        partialUpdatedJogador.setId(jogador.getId());

        partialUpdatedJogador.nome(UPDATED_NOME).posicao(UPDATED_POSICAO).numeroCamisa(UPDATED_NUMERO_CAMISA);

        restJogadorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJogador.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedJogador))
            )
            .andExpect(status().isOk());

        // Validate the Jogador in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertJogadorUpdatableFieldsEquals(partialUpdatedJogador, getPersistedJogador(partialUpdatedJogador));
    }

    @Test
    @Transactional
    void patchNonExistingJogador() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jogador.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJogadorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, jogador.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(jogador))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jogador in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJogador() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jogador.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJogadorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(jogador))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jogador in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJogador() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jogador.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJogadorMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(jogador)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Jogador in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJogador() throws Exception {
        // Initialize the database
        insertedJogador = jogadorRepository.saveAndFlush(jogador);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the jogador
        restJogadorMockMvc
            .perform(delete(ENTITY_API_URL_ID, jogador.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return jogadorRepository.count();
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

    protected Jogador getPersistedJogador(Jogador jogador) {
        return jogadorRepository.findById(jogador.getId()).orElseThrow();
    }

    protected void assertPersistedJogadorToMatchAllProperties(Jogador expectedJogador) {
        assertJogadorAllPropertiesEquals(expectedJogador, getPersistedJogador(expectedJogador));
    }

    protected void assertPersistedJogadorToMatchUpdatableProperties(Jogador expectedJogador) {
        assertJogadorAllUpdatablePropertiesEquals(expectedJogador, getPersistedJogador(expectedJogador));
    }
}
