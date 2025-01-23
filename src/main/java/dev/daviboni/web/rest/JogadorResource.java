package dev.daviboni.web.rest;

import dev.daviboni.domain.Jogador;
import dev.daviboni.repository.JogadorRepository;
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
 * REST controller for managing {@link dev.daviboni.domain.Jogador}.
 */
@RestController
@RequestMapping("/api/jogadors")
@Transactional
public class JogadorResource {

    private static final Logger LOG = LoggerFactory.getLogger(JogadorResource.class);

    private static final String ENTITY_NAME = "jogador";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JogadorRepository jogadorRepository;

    public JogadorResource(JogadorRepository jogadorRepository) {
        this.jogadorRepository = jogadorRepository;
    }

    /**
     * {@code POST  /jogadors} : Create a new jogador.
     *
     * @param jogador the jogador to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jogador, or with status {@code 400 (Bad Request)} if the jogador has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Jogador> createJogador(@Valid @RequestBody Jogador jogador) throws URISyntaxException {
        LOG.debug("REST request to save Jogador : {}", jogador);
        if (jogador.getId() != null) {
            throw new BadRequestAlertException("A new jogador cannot already have an ID", ENTITY_NAME, "idexists");
        }
        jogador = jogadorRepository.save(jogador);
        return ResponseEntity.created(new URI("/api/jogadors/" + jogador.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, jogador.getId().toString()))
            .body(jogador);
    }

    /**
     * {@code PUT  /jogadors/:id} : Updates an existing jogador.
     *
     * @param id the id of the jogador to save.
     * @param jogador the jogador to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jogador,
     * or with status {@code 400 (Bad Request)} if the jogador is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jogador couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Jogador> updateJogador(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Jogador jogador
    ) throws URISyntaxException {
        LOG.debug("REST request to update Jogador : {}, {}", id, jogador);
        if (jogador.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jogador.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jogadorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        jogador = jogadorRepository.save(jogador);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, jogador.getId().toString()))
            .body(jogador);
    }

    /**
     * {@code PATCH  /jogadors/:id} : Partial updates given fields of an existing jogador, field will ignore if it is null
     *
     * @param id the id of the jogador to save.
     * @param jogador the jogador to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jogador,
     * or with status {@code 400 (Bad Request)} if the jogador is not valid,
     * or with status {@code 404 (Not Found)} if the jogador is not found,
     * or with status {@code 500 (Internal Server Error)} if the jogador couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Jogador> partialUpdateJogador(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Jogador jogador
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Jogador partially : {}, {}", id, jogador);
        if (jogador.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jogador.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jogadorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Jogador> result = jogadorRepository
            .findById(jogador.getId())
            .map(existingJogador -> {
                if (jogador.getNome() != null) {
                    existingJogador.setNome(jogador.getNome());
                }
                if (jogador.getPosicao() != null) {
                    existingJogador.setPosicao(jogador.getPosicao());
                }
                if (jogador.getNumeroCamisa() != null) {
                    existingJogador.setNumeroCamisa(jogador.getNumeroCamisa());
                }

                return existingJogador;
            })
            .map(jogadorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, jogador.getId().toString())
        );
    }

    /**
     * {@code GET  /jogadors} : get all the jogadors.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jogadors in body.
     */
    @GetMapping("")
    public List<Jogador> getAllJogadors() {
        LOG.debug("REST request to get all Jogadors");
        return jogadorRepository.findAll();
    }

    /**
     * {@code GET  /jogadors/:id} : get the "id" jogador.
     *
     * @param id the id of the jogador to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jogador, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Jogador> getJogador(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Jogador : {}", id);
        Optional<Jogador> jogador = jogadorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jogador);
    }

    /**
     * {@code DELETE  /jogadors/:id} : delete the "id" jogador.
     *
     * @param id the id of the jogador to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJogador(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Jogador : {}", id);
        jogadorRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
