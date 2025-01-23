package dev.daviboni.repository;

import dev.daviboni.domain.Partida;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PartidaRepositoryWithBagRelationships {
    Optional<Partida> fetchBagRelationships(Optional<Partida> partida);

    List<Partida> fetchBagRelationships(List<Partida> partidas);

    Page<Partida> fetchBagRelationships(Page<Partida> partidas);
}
