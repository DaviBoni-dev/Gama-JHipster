package dev.daviboni.web.rest;

import dev.daviboni.domain.Partida;
import dev.daviboni.repository.PartidaRepository;
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
 * REST controller for managing {@link dev.daviboni.domain.Partida}.
 */
@RestController
@RequestMapping("/api/partidas")
@Transactional
public class PartidaResource {

    private static final Logger LOG = LoggerFactory.getLogger(PartidaResource.class);

    private static final String ENTITY_NAME = "partida";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PartidaRepository partidaRepository;

    public PartidaResource(PartidaRepository partidaRepository) {
        this.partidaRepository = partidaRepository;
    }

    /**
     * {@code POST  /partidas} : Create a new partida.
     *
     * @param partida the partida to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new partida, or with status {@code 400 (Bad Request)} if the partida has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Partida> createPartida(@Valid @RequestBody Partida partida) throws URISyntaxException {
        LOG.debug("REST request to save Partida : {}", partida);
        if (partida.getId() != null) {
            throw new BadRequestAlertException("A new partida cannot already have an ID", ENTITY_NAME, "idexists");
        }
        partida = partidaRepository.save(partida);
        return ResponseEntity.created(new URI("/api/partidas/" + partida.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, partida.getId().toString()))
            .body(partida);
    }

    /**
     * {@code PUT  /partidas/:id} : Updates an existing partida.
     *
     * @param id the id of the partida to save.
     * @param partida the partida to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated partida,
     * or with status {@code 400 (Bad Request)} if the partida is not valid,
     * or with status {@code 500 (Internal Server Error)} if the partida couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Partida> updatePartida(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Partida partida
    ) throws URISyntaxException {
        LOG.debug("REST request to update Partida : {}, {}", id, partida);
        if (partida.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, partida.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!partidaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        partida = partidaRepository.save(partida);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, partida.getId().toString()))
            .body(partida);
    }

    /**
     * {@code PATCH  /partidas/:id} : Partial updates given fields of an existing partida, field will ignore if it is null
     *
     * @param id the id of the partida to save.
     * @param partida the partida to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated partida,
     * or with status {@code 400 (Bad Request)} if the partida is not valid,
     * or with status {@code 404 (Not Found)} if the partida is not found,
     * or with status {@code 500 (Internal Server Error)} if the partida couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Partida> partialUpdatePartida(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Partida partida
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Partida partially : {}, {}", id, partida);
        if (partida.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, partida.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!partidaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Partida> result = partidaRepository
            .findById(partida.getId())
            .map(existingPartida -> {
                if (partida.getData() != null) {
                    existingPartida.setData(partida.getData());
                }
                if (partida.getLocal() != null) {
                    existingPartida.setLocal(partida.getLocal());
                }
                if (partida.getPontuacaoTime1() != null) {
                    existingPartida.setPontuacaoTime1(partida.getPontuacaoTime1());
                }
                if (partida.getPontuacaoTime2() != null) {
                    existingPartida.setPontuacaoTime2(partida.getPontuacaoTime2());
                }

                return existingPartida;
            })
            .map(partidaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, partida.getId().toString())
        );
    }

    /**
     * {@code GET  /partidas} : get all the partidas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of partidas in body.
     */
    @GetMapping("")
    public List<Partida> getAllPartidas(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        LOG.debug("REST request to get all Partidas");
        if (eagerload) {
            return partidaRepository.findAllWithEagerRelationships();
        } else {
            return partidaRepository.findAll();
        }
    }

    /**
     * {@code GET  /partidas/:id} : get the "id" partida.
     *
     * @param id the id of the partida to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the partida, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Partida> getPartida(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Partida : {}", id);
        Optional<Partida> partida = partidaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(partida);
    }

    /**
     * {@code DELETE  /partidas/:id} : delete the "id" partida.
     *
     * @param id the id of the partida to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePartida(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Partida : {}", id);
        partidaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
