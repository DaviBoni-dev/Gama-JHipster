package dev.daviboni.repository;

import dev.daviboni.domain.Estatistica;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Estatistica entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EstatisticaRepository extends JpaRepository<Estatistica, Long> {}
