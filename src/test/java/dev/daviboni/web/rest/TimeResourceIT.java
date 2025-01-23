package dev.daviboni.web.rest;

import static dev.daviboni.domain.TimeAsserts.*;
import static dev.daviboni.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.daviboni.IntegrationTest;
import dev.daviboni.domain.Time;
import dev.daviboni.repository.TimeRepository;
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
 * Integration tests for the {@link TimeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TimeResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CIDADE = "AAAAAAAAAA";
    private static final String UPDATED_CIDADE = "BBBBBBBBBB";

    private static final Integer DEFAULT_VITORIAS = 1;
    private static final Integer UPDATED_VITORIAS = 2;

    private static final Integer DEFAULT_DERROTAS = 1;
    private static final Integer UPDATED_DERROTAS = 2;

    private static final Integer DEFAULT_EMPATES = 1;
    private static final Integer UPDATED_EMPATES = 2;

    private static final String ENTITY_API_URL = "/api/times";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private TimeRepository timeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTimeMockMvc;

    private Time time;

    private Time insertedTime;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Time createEntity() {
        return new Time()
            .nome(DEFAULT_NOME)
            .cidade(DEFAULT_CIDADE)
            .vitorias(DEFAULT_VITORIAS)
            .derrotas(DEFAULT_DERROTAS)
            .empates(DEFAULT_EMPATES);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Time createUpdatedEntity() {
        return new Time()
            .nome(UPDATED_NOME)
            .cidade(UPDATED_CIDADE)
            .vitorias(UPDATED_VITORIAS)
            .derrotas(UPDATED_DERROTAS)
            .empates(UPDATED_EMPATES);
    }

    @BeforeEach
    public void initTest() {
        time = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedTime != null) {
            timeRepository.delete(insertedTime);
            insertedTime = null;
        }
    }

    @Test
    @Transactional
    void createTime() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Time
        var returnedTime = om.readValue(
            restTimeMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(time)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Time.class
        );

        // Validate the Time in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertTimeUpdatableFieldsEquals(returnedTime, getPersistedTime(returnedTime));

        insertedTime = returnedTime;
    }

    @Test
    @Transactional
    void createTimeWithExistingId() throws Exception {
        // Create the Time with an existing ID
        time.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(time)))
            .andExpect(status().isBadRequest());

        // Validate the Time in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        time.setNome(null);

        // Create the Time, which fails.

        restTimeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(time)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTimes() throws Exception {
        // Initialize the database
        insertedTime = timeRepository.saveAndFlush(time);

        // Get all the timeList
        restTimeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(time.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].cidade").value(hasItem(DEFAULT_CIDADE)))
            .andExpect(jsonPath("$.[*].vitorias").value(hasItem(DEFAULT_VITORIAS)))
            .andExpect(jsonPath("$.[*].derrotas").value(hasItem(DEFAULT_DERROTAS)))
            .andExpect(jsonPath("$.[*].empates").value(hasItem(DEFAULT_EMPATES)));
    }

    @Test
    @Transactional
    void getTime() throws Exception {
        // Initialize the database
        insertedTime = timeRepository.saveAndFlush(time);

        // Get the time
        restTimeMockMvc
            .perform(get(ENTITY_API_URL_ID, time.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(time.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.cidade").value(DEFAULT_CIDADE))
            .andExpect(jsonPath("$.vitorias").value(DEFAULT_VITORIAS))
            .andExpect(jsonPath("$.derrotas").value(DEFAULT_DERROTAS))
            .andExpect(jsonPath("$.empates").value(DEFAULT_EMPATES));
    }

    @Test
    @Transactional
    void getNonExistingTime() throws Exception {
        // Get the time
        restTimeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTime() throws Exception {
        // Initialize the database
        insertedTime = timeRepository.saveAndFlush(time);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the time
        Time updatedTime = timeRepository.findById(time.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTime are not directly saved in db
        em.detach(updatedTime);
        updatedTime
            .nome(UPDATED_NOME)
            .cidade(UPDATED_CIDADE)
            .vitorias(UPDATED_VITORIAS)
            .derrotas(UPDATED_DERROTAS)
            .empates(UPDATED_EMPATES);

        restTimeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTime.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedTime))
            )
            .andExpect(status().isOk());

        // Validate the Time in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedTimeToMatchAllProperties(updatedTime);
    }

    @Test
    @Transactional
    void putNonExistingTime() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        time.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeMockMvc
            .perform(put(ENTITY_API_URL_ID, time.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(time)))
            .andExpect(status().isBadRequest());

        // Validate the Time in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTime() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        time.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(time))
            )
            .andExpect(status().isBadRequest());

        // Validate the Time in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTime() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        time.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(time)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Time in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTimeWithPatch() throws Exception {
        // Initialize the database
        insertedTime = timeRepository.saveAndFlush(time);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the time using partial update
        Time partialUpdatedTime = new Time();
        partialUpdatedTime.setId(time.getId());

        partialUpdatedTime.nome(UPDATED_NOME).cidade(UPDATED_CIDADE);

        restTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTime.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTime))
            )
            .andExpect(status().isOk());

        // Validate the Time in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTimeUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedTime, time), getPersistedTime(time));
    }

    @Test
    @Transactional
    void fullUpdateTimeWithPatch() throws Exception {
        // Initialize the database
        insertedTime = timeRepository.saveAndFlush(time);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the time using partial update
        Time partialUpdatedTime = new Time();
        partialUpdatedTime.setId(time.getId());

        partialUpdatedTime
            .nome(UPDATED_NOME)
            .cidade(UPDATED_CIDADE)
            .vitorias(UPDATED_VITORIAS)
            .derrotas(UPDATED_DERROTAS)
            .empates(UPDATED_EMPATES);

        restTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTime.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedTime))
            )
            .andExpect(status().isOk());

        // Validate the Time in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertTimeUpdatableFieldsEquals(partialUpdatedTime, getPersistedTime(partialUpdatedTime));
    }

    @Test
    @Transactional
    void patchNonExistingTime() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        time.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeMockMvc
            .perform(patch(ENTITY_API_URL_ID, time.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(time)))
            .andExpect(status().isBadRequest());

        // Validate the Time in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTime() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        time.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(time))
            )
            .andExpect(status().isBadRequest());

        // Validate the Time in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTime() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        time.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(time)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Time in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTime() throws Exception {
        // Initialize the database
        insertedTime = timeRepository.saveAndFlush(time);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the time
        restTimeMockMvc
            .perform(delete(ENTITY_API_URL_ID, time.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return timeRepository.count();
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

    protected Time getPersistedTime(Time time) {
        return timeRepository.findById(time.getId()).orElseThrow();
    }

    protected void assertPersistedTimeToMatchAllProperties(Time expectedTime) {
        assertTimeAllPropertiesEquals(expectedTime, getPersistedTime(expectedTime));
    }

    protected void assertPersistedTimeToMatchUpdatableProperties(Time expectedTime) {
        assertTimeAllUpdatablePropertiesEquals(expectedTime, getPersistedTime(expectedTime));
    }
}
