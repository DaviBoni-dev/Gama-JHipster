package dev.daviboni.repository;

import dev.daviboni.domain.Jogador;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Jogador entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JogadorRepository extends JpaRepository<Jogador, Long> {}
