package dev.daviboni.repository;

import dev.daviboni.domain.Partida;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class PartidaRepositoryWithBagRelationshipsImpl implements PartidaRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String PARTIDAS_PARAMETER = "partidas";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Partida> fetchBagRelationships(Optional<Partida> partida) {
        return partida.map(this::fetchTimes);
    }

    @Override
    public Page<Partida> fetchBagRelationships(Page<Partida> partidas) {
        return new PageImpl<>(fetchBagRelationships(partidas.getContent()), partidas.getPageable(), partidas.getTotalElements());
    }

    @Override
    public List<Partida> fetchBagRelationships(List<Partida> partidas) {
        return Optional.of(partidas).map(this::fetchTimes).orElse(Collections.emptyList());
    }

    Partida fetchTimes(Partida result) {
        return entityManager
            .createQuery("select partida from Partida partida left join fetch partida.times where partida.id = :id", Partida.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Partida> fetchTimes(List<Partida> partidas) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, partidas.size()).forEach(index -> order.put(partidas.get(index).getId(), index));
        List<Partida> result = entityManager
            .createQuery("select partida from Partida partida left join fetch partida.times where partida in :partidas", Partida.class)
            .setParameter(PARTIDAS_PARAMETER, partidas)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
