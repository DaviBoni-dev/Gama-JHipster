package dev.daviboni.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Time.
 */
@Entity
@Table(name = "time")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Time implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "cidade")
    private String cidade;

    @Column(name = "vitorias")
    private Integer vitorias;

    @Column(name = "derrotas")
    private Integer derrotas;

    @Column(name = "empates")
    private Integer empates;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "times")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "times", "campeonato" }, allowSetters = true)
    private Set<Partida> partidas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Time id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Time nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCidade() {
        return this.cidade;
    }

    public Time cidade(String cidade) {
        this.setCidade(cidade);
        return this;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public Integer getVitorias() {
        return this.vitorias;
    }

    public Time vitorias(Integer vitorias) {
        this.setVitorias(vitorias);
        return this;
    }

    public void setVitorias(Integer vitorias) {
        this.vitorias = vitorias;
    }

    public Integer getDerrotas() {
        return this.derrotas;
    }

    public Time derrotas(Integer derrotas) {
        this.setDerrotas(derrotas);
        return this;
    }

    public void setDerrotas(Integer derrotas) {
        this.derrotas = derrotas;
    }

    public Integer getEmpates() {
        return this.empates;
    }

    public Time empates(Integer empates) {
        this.setEmpates(empates);
        return this;
    }

    public void setEmpates(Integer empates) {
        this.empates = empates;
    }

    public Set<Partida> getPartidas() {
        return this.partidas;
    }

    public void setPartidas(Set<Partida> partidas) {
        if (this.partidas != null) {
            this.partidas.forEach(i -> i.removeTimes(this));
        }
        if (partidas != null) {
            partidas.forEach(i -> i.addTimes(this));
        }
        this.partidas = partidas;
    }

    public Time partidas(Set<Partida> partidas) {
        this.setPartidas(partidas);
        return this;
    }

    public Time addPartida(Partida partida) {
        this.partidas.add(partida);
        partida.getTimes().add(this);
        return this;
    }

    public Time removePartida(Partida partida) {
        this.partidas.remove(partida);
        partida.getTimes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Time)) {
            return false;
        }
        return getId() != null && getId().equals(((Time) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Time{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", cidade='" + getCidade() + "'" +
            ", vitorias=" + getVitorias() +
            ", derrotas=" + getDerrotas() +
            ", empates=" + getEmpates() +
            "}";
    }
}
