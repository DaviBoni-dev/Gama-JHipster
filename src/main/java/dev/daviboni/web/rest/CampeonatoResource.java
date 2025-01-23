package dev.daviboni.web.rest;

import dev.daviboni.domain.Campeonato;
import dev.daviboni.repository.CampeonatoRepository;
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
 * REST controller for managing {@link dev.daviboni.domain.Campeonato}.
 */
@RestController
@RequestMapping("/api/campeonatoes")
@Transactional
public class CampeonatoResource {

    private static final Logger LOG = LoggerFactory.getLogger(CampeonatoResource.class);

    private static final String ENTITY_NAME = "campeonato";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CampeonatoRepository campeonatoRepository;

    public CampeonatoResource(CampeonatoRepository campeonatoRepository) {
        this.campeonatoRepository = campeonatoRepository;
    }

    /**
     * {@code POST  /campeonatoes} : Create a new campeonato.
     *
     * @param campeonato the campeonato to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new campeonato, or with status {@code 400 (Bad Request)} if the campeonato has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Campeonato> createCampeonato(@Valid @RequestBody Campeonato campeonato) throws URISyntaxException {
        LOG.debug("REST request to save Campeonato : {}", campeonato);
        if (campeonato.getId() != null) {
            throw new BadRequestAlertException("A new campeonato cannot already have an ID", ENTITY_NAME, "idexists");
        }
        campeonato = campeonatoRepository.save(campeonato);
        return ResponseEntity.created(new URI("/api/campeonatoes/" + campeonato.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, campeonato.getId().toString()))
            .body(campeonato);
    }

    /**
     * {@code PUT  /campeonatoes/:id} : Updates an existing campeonato.
     *
     * @param id the id of the campeonato to save.
     * @param campeonato the campeonato to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated campeonato,
     * or with status {@code 400 (Bad Request)} if the campeonato is not valid,
     * or with status {@code 500 (Internal Server Error)} if the campeonato couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Campeonato> updateCampeonato(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Campeonato campeonato
    ) throws URISyntaxException {
        LOG.debug("REST request to update Campeonato : {}, {}", id, campeonato);
        if (campeonato.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, campeonato.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!campeonatoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        campeonato = campeonatoRepository.save(campeonato);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, campeonato.getId().toString()))
            .body(campeonato);
    }

    /**
     * {@code PATCH  /campeonatoes/:id} : Partial updates given fields of an existing campeonato, field will ignore if it is null
     *
     * @param id the id of the campeonato to save.
     * @param campeonato the campeonato to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated campeonato,
     * or with status {@code 400 (Bad Request)} if the campeonato is not valid,
     * or with status {@code 404 (Not Found)} if the campeonato is not found,
     * or with status {@code 500 (Internal Server Error)} if the campeonato couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Campeonato> partialUpdateCampeonato(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Campeonato campeonato
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Campeonato partially : {}, {}", id, campeonato);
        if (campeonato.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, campeonato.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!campeonatoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Campeonato> result = campeonatoRepository
            .findById(campeonato.getId())
            .map(existingCampeonato -> {
                if (campeonato.getNome() != null) {
                    existingCampeonato.setNome(campeonato.getNome());
                }
                if (campeonato.getDescricao() != null) {
                    existingCampeonato.setDescricao(campeonato.getDescricao());
                }
                if (campeonato.getDataInicio() != null) {
                    existingCampeonato.setDataInicio(campeonato.getDataInicio());
                }
                if (campeonato.getDataFim() != null) {
                    existingCampeonato.setDataFim(campeonato.getDataFim());
                }

                return existingCampeonato;
            })
            .map(campeonatoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, campeonato.getId().toString())
        );
    }

    /**
     * {@code GET  /campeonatoes} : get all the campeonatoes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of campeonatoes in body.
     */
    @GetMapping("")
    public List<Campeonato> getAllCampeonatoes() {
        LOG.debug("REST request to get all Campeonatoes");
        return campeonatoRepository.findAll();
    }

    /**
     * {@code GET  /campeonatoes/:id} : get the "id" campeonato.
     *
     * @param id the id of the campeonato to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the campeonato, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Campeonato> getCampeonato(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Campeonato : {}", id);
        Optional<Campeonato> campeonato = campeonatoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(campeonato);
    }

    /**
     * {@code DELETE  /campeonatoes/:id} : delete the "id" campeonato.
     *
     * @param id the id of the campeonato to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampeonato(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Campeonato : {}", id);
        campeonatoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
