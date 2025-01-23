package dev.daviboni.web.rest;

import dev.daviboni.domain.Time;
import dev.daviboni.repository.TimeRepository;
import dev.daviboni.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link dev.daviboni.domain.Time}.
 */
@RestController
@RequestMapping("/api/times")
@Transactional
public class TimeResource {

    private static final Logger LOG = LoggerFactory.getLogger(TimeResource.class);

    private static final String ENTITY_NAME = "time";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TimeRepository timeRepository;

    public TimeResource(TimeRepository timeRepository) {
        this.timeRepository = timeRepository;
    }

    /**
     * {@code POST  /times} : Create a new time.
     *
     * @param time the time to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new time, or with status {@code 400 (Bad Request)} if the time has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Time> createTime(@Valid @RequestBody Time time) throws URISyntaxException {
        LOG.debug("REST request to save Time : {}", time);
        if (time.getId() != null) {
            throw new BadRequestAlertException("A new time cannot already have an ID", ENTITY_NAME, "idexists");
        }
        time = timeRepository.save(time);
        return ResponseEntity.created(new URI("/api/times/" + time.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, time.getId().toString()))
            .body(time);
    }

    /**
     * {@code PUT  /times/:id} : Updates an existing time.
     *
     * @param id the id of the time to save.
     * @param time the time to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated time,
     * or with status {@code 400 (Bad Request)} if the time is not valid,
     * or with status {@code 500 (Internal Server Error)} if the time couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Time> updateTime(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Time time)
        throws URISyntaxException {
        LOG.debug("REST request to update Time : {}, {}", id, time);
        if (time.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, time.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        time = timeRepository.save(time);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, time.getId().toString()))
            .body(time);
    }

    /**
     * {@code PATCH  /times/:id} : Partial updates given fields of an existing time, field will ignore if it is null
     *
     * @param id the id of the time to save.
     * @param time the time to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated time,
     * or with status {@code 400 (Bad Request)} if the time is not valid,
     * or with status {@code 404 (Not Found)} if the time is not found,
     * or with status {@code 500 (Internal Server Error)} if the time couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Time> partialUpdateTime(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Time time
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Time partially : {}, {}", id, time);
        if (time.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, time.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Time> result = timeRepository
            .findById(time.getId())
            .map(existingTime -> {
                if (time.getNome() != null) {
                    existingTime.setNome(time.getNome());
                }
                if (time.getCidade() != null) {
                    existingTime.setCidade(time.getCidade());
                }
                if (time.getVitorias() != null) {
                    existingTime.setVitorias(time.getVitorias());
                }
                if (time.getDerrotas() != null) {
                    existingTime.setDerrotas(time.getDerrotas());
                }
                if (time.getEmpates() != null) {
                    existingTime.setEmpates(time.getEmpates());
                }

                return existingTime;
            })
            .map(timeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, time.getId().toString())
        );
    }

    /**
     * {@code GET  /times} : get all the times.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of times in body.
     */
    @GetMapping("")
    public List<Time> getAllTimes() {
        LOG.debug("REST request to get all Times");
        return timeRepository.findAll();
    }

    /**
     * {@code GET  /times/:id} : get the "id" time.
     *
     * @param id the id of the time to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the time, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Time> getTime(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Time : {}", id);
        Optional<Time> time = timeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(time);
    }

    /**
     * {@code DELETE  /times/:id} : delete the "id" time.
     *
     * @param id the id of the time to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTime(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Time : {}", id);
        timeRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
