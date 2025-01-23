package dev.daviboni.web.rest;

import static dev.daviboni.domain.PartidaAsserts.*;
import static dev.daviboni.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.daviboni.IntegrationTest;
import dev.daviboni.domain.Partida;
import dev.daviboni.repository.PartidaRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PartidaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PartidaResourceIT {

    private static final LocalDate DEFAULT_DATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_LOCAL = "AAAAAAAAAA";
    private static final String UPDATED_LOCAL = "BBBBBBBBBB";

    private static final Integer DEFAULT_PONTUACAO_TIME_1 = 1;
    private static final Integer UPDATED_PONTUACAO_TIME_1 = 2;

    private static final Integer DEFAULT_PONTUACAO_TIME_2 = 1;
    private static final Integer UPDATED_PONTUACAO_TIME_2 = 2;

    private static final String ENTITY_API_URL = "/api/partidas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PartidaRepository partidaRepository;

    @Mock
    private PartidaRepository partidaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPartidaMockMvc;

    private Partida partida;

    private Partida insertedPartida;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Partida createEntity() {
        return new Partida()
            .data(DEFAULT_DATA)
            .local(DEFAULT_LOCAL)
            .pontuacaoTime1(DEFAULT_PONTUACAO_TIME_1)
            .pontuacaoTime2(DEFAULT_PONTUACAO_TIME_2);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Partida createUpdatedEntity() {
        return new Partida()
            .data(UPDATED_DATA)
            .local(UPDATED_LOCAL)
            .pontuacaoTime1(UPDATED_PONTUACAO_TIME_1)
            .pontuacaoTime2(UPDATED_PONTUACAO_TIME_2);
    }

    @BeforeEach
    public void initTest() {
        partida = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedPartida != null) {
            partidaRepository.delete(insertedPartida);
            insertedPartida = null;
        }
    }

    @Test
    @Transactional
    void createPartida() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Partida
        var returnedPartida = om.readValue(
            restPartidaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(partida)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Partida.class
        );

        // Validate the Partida in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPartidaUpdatableFieldsEquals(returnedPartida, getPersistedPartida(returnedPartida));

        insertedPartida = returnedPartida;
    }

    @Test
    @Transactional
    void createPartidaWithExistingId() throws Exception {
        // Create the Partida with an existing ID
        partida.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPartidaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(partida)))
            .andExpect(status().isBadRequest());

        // Validate the Partida in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDataIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        partida.setData(null);

        // Create the Partida, which fails.

        restPartidaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(partida)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPartidas() throws Exception {
        // Initialize the database
        insertedPartida = partidaRepository.saveAndFlush(partida);

        // Get all the partidaList
        restPartidaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(partida.getId().intValue())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
            .andExpect(jsonPath("$.[*].local").value(hasItem(DEFAULT_LOCAL)))
            .andExpect(jsonPath("$.[*].pontuacaoTime1").value(hasItem(DEFAULT_PONTUACAO_TIME_1)))
            .andExpect(jsonPath("$.[*].pontuacaoTime2").value(hasItem(DEFAULT_PONTUACAO_TIME_2)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPartidasWithEagerRelationshipsIsEnabled() throws Exception {
        when(partidaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPartidaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(partidaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPartidasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(partidaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPartidaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(partidaRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPartida() throws Exception {
        // Initialize the database
        insertedPartida = partidaRepository.saveAndFlush(partida);

        // Get the partida
        restPartidaMockMvc
            .perform(get(ENTITY_API_URL_ID, partida.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(partida.getId().intValue()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()))
            .andExpect(jsonPath("$.local").value(DEFAULT_LOCAL))
            .andExpect(jsonPath("$.pontuacaoTime1").value(DEFAULT_PONTUACAO_TIME_1))
            .andExpect(jsonPath("$.pontuacaoTime2").value(DEFAULT_PONTUACAO_TIME_2));
    }

    @Test
    @Transactional
    void getNonExistingPartida() throws Exception {
        // Get the partida
        restPartidaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPartida() throws Exception {
        // Initialize the database
        insertedPartida = partidaRepository.saveAndFlush(partida);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the partida
        Partida updatedPartida = partidaRepository.findById(partida.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPartida are not directly saved in db
        em.detach(updatedPartida);
        updatedPartida
            .data(UPDATED_DATA)
            .local(UPDATED_LOCAL)
            .pontuacaoTime1(UPDATED_PONTUACAO_TIME_1)
            .pontuacaoTime2(UPDATED_PONTUACAO_TIME_2);

        restPartidaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPartida.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPartida))
            )
            .andExpect(status().isOk());

        // Validate the Partida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPartidaToMatchAllProperties(updatedPartida);
    }

    @Test
    @Transactional
    void putNonExistingPartida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        partida.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPartidaMockMvc
            .perform(put(ENTITY_API_URL_ID, partida.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(partida)))
            .andExpect(status().isBadRequest());

        // Validate the Partida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPartida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        partida.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartidaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(partida))
            )
            .andExpect(status().isBadRequest());

        // Validate the Partida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPartida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        partida.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartidaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(partida)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Partida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePartidaWithPatch() throws Exception {
        // Initialize the database
        insertedPartida = partidaRepository.saveAndFlush(partida);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the partida using partial update
        Partida partialUpdatedPartida = new Partida();
        partialUpdatedPartida.setId(partida.getId());

        partialUpdatedPartida.data(UPDATED_DATA).pontuacaoTime1(UPDATED_PONTUACAO_TIME_1).pontuacaoTime2(UPDATED_PONTUACAO_TIME_2);

        restPartidaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPartida.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPartida))
            )
            .andExpect(status().isOk());

        // Validate the Partida in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPartidaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPartida, partida), getPersistedPartida(partida));
    }

    @Test
    @Transactional
    void fullUpdatePartidaWithPatch() throws Exception {
        // Initialize the database
        insertedPartida = partidaRepository.saveAndFlush(partida);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the partida using partial update
        Partida partialUpdatedPartida = new Partida();
        partialUpdatedPartida.setId(partida.getId());

        partialUpdatedPartida
            .data(UPDATED_DATA)
            .local(UPDATED_LOCAL)
            .pontuacaoTime1(UPDATED_PONTUACAO_TIME_1)
            .pontuacaoTime2(UPDATED_PONTUACAO_TIME_2);

        restPartidaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPartida.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPartida))
            )
            .andExpect(status().isOk());

        // Validate the Partida in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPartidaUpdatableFieldsEquals(partialUpdatedPartida, getPersistedPartida(partialUpdatedPartida));
    }

    @Test
    @Transactional
    void patchNonExistingPartida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        partida.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPartidaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partida.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(partida))
            )
            .andExpect(status().isBadRequest());

        // Validate the Partida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPartida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        partida.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartidaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partida))
            )
            .andExpect(status().isBadRequest());

        // Validate the Partida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPartida() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        partida.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartidaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(partida)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Partida in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePartida() throws Exception {
        // Initialize the database
        insertedPartida = partidaRepository.saveAndFlush(partida);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the partida
        restPartidaMockMvc
            .perform(delete(ENTITY_API_URL_ID, partida.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return partidaRepository.count();
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

    protected Partida getPersistedPartida(Partida partida) {
        return partidaRepository.findById(partida.getId()).orElseThrow();
    }

    protected void assertPersistedPartidaToMatchAllProperties(Partida expectedPartida) {
        assertPartidaAllPropertiesEquals(expectedPartida, getPersistedPartida(expectedPartida));
    }

    protected void assertPersistedPartidaToMatchUpdatableProperties(Partida expectedPartida) {
        assertPartidaAllUpdatablePropertiesEquals(expectedPartida, getPersistedPartida(expectedPartida));
    }
}
