package dev.daviboni.repository;

import dev.daviboni.domain.Campeonato;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Campeonato entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CampeonatoRepository extends JpaRepository<Campeonato, Long> {}
