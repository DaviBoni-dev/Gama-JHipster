package dev.daviboni.web.rest;

import dev.daviboni.domain.Estatistica;
import dev.daviboni.repository.EstatisticaRepository;
import dev.daviboni.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link dev.daviboni.domain.Estatistica}.
 */
@RestController
@RequestMapping("/api/estatisticas")
@Transactional
public class EstatisticaResource {

    private static final Logger LOG = LoggerFactory.getLogger(EstatisticaResource.class);

    private static final String ENTITY_NAME = "estatistica";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstatisticaRepository estatisticaRepository;

    public EstatisticaResource(EstatisticaRepository estatisticaRepository) {
        this.estatisticaRepository = estatisticaRepository;
    }

    /**
     * {@code POST  /estatisticas} : Create a new estatistica.
     *
     * @param estatistica the estatistica to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estatistica, or with status {@code 400 (Bad Request)} if the estatistica has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Estatistica> createEstatistica(@RequestBody Estatistica estatistica) throws URISyntaxException {
        LOG.debug("REST request to save Estatistica : {}", estatistica);
        if (estatistica.getId() != null) {
            throw new BadRequestAlertException("A new estatistica cannot already have an ID", ENTITY_NAME, "idexists");
        }
        estatistica = estatisticaRepository.save(estatistica);
        return ResponseEntity.created(new URI("/api/estatisticas/" + estatistica.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, estatistica.getId().toString()))
            .body(estatistica);
    }

    /**
     * {@code PUT  /estatisticas/:id} : Updates an existing estatistica.
     *
     * @param id the id of the estatistica to save.
     * @param estatistica the estatistica to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estatistica,
     * or with status {@code 400 (Bad Request)} if the estatistica is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estatistica couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Estatistica> updateEstatistica(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Estatistica estatistica
    ) throws URISyntaxException {
        LOG.debug("REST request to update Estatistica : {}, {}", id, estatistica);
        if (estatistica.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estatistica.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estatisticaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        estatistica = estatisticaRepository.save(estatistica);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, estatistica.getId().toString()))
            .body(estatistica);
    }

    /**
     * {@code PATCH  /estatisticas/:id} : Partial updates given fields of an existing estatistica, field will ignore if it is null
     *
     * @param id the id of the estatistica to save.
     * @param estatistica the estatistica to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estatistica,
     * or with status {@code 400 (Bad Request)} if the estatistica is not valid,
     * or with status {@code 404 (Not Found)} if the estatistica is not found,
     * or with status {@code 500 (Internal Server Error)} if the estatistica couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Estatistica> partialUpdateEstatistica(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Estatistica estatistica
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Estatistica partially : {}, {}", id, estatistica);
        if (estatistica.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estatistica.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estatisticaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Estatistica> result = estatisticaRepository
            .findById(estatistica.getId())
            .map(existingEstatistica -> {
                if (estatistica.getPontos() != null) {
                    existingEstatistica.setPontos(estatistica.getPontos());
                }
                if (estatistica.getRebotes() != null) {
                    existingEstatistica.setRebotes(estatistica.getRebotes());
                }
                if (estatistica.getAssistencias() != null) {
                    existingEstatistica.setAssistencias(estatistica.getAssistencias());
                }
                if (estatistica.getFaltas() != null) {
                    existingEstatistica.setFaltas(estatistica.getFaltas());
                }

                return existingEstatistica;
            })
            .map(estatisticaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, estatistica.getId().toString())
        );
    }

    /**
     * {@code GET  /estatisticas} : get all the estatisticas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estatisticas in body.
     */
    @GetMapping("")
    public List<Estatistica> getAllEstatisticas() {
        LOG.debug("REST request to get all Estatisticas");
        return estatisticaRepository.findAll();
    }

    /**
     * {@code GET  /estatisticas/:id} : get the "id" estatistica.
     *
     * @param id the id of the estatistica to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estatistica, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Estatistica> getEstatistica(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Estatistica : {}", id);
        Optional<Estatistica> estatistica = estatisticaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(estatistica);
    }

    /**
     * {@code DELETE  /estatisticas/:id} : delete the "id" estatistica.
     *
     * @param id the id of the estatistica to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstatistica(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Estatistica : {}", id);
        estatisticaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
