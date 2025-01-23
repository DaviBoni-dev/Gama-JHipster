package dev.daviboni.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Partida.
 */
@Entity
@Table(name = "partida")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Partida implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Column(name = "local")
    private String local;

    @Column(name = "pontuacao_time_1")
    private Integer pontuacaoTime1;

    @Column(name = "pontuacao_time_2")
    private Integer pontuacaoTime2;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_partida__times",
        joinColumns = @JoinColumn(name = "partida_id"),
        inverseJoinColumns = @JoinColumn(name = "times_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "partidas" }, allowSetters = true)
    private Set<Time> times = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "partidas" }, allowSetters = true)
    private Campeonato campeonato;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Partida id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getData() {
        return this.data;
    }

    public Partida data(LocalDate data) {
        this.setData(data);
        return this;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getLocal() {
        return this.local;
    }

    public Partida local(String local) {
        this.setLocal(local);
        return this;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public Integer getPontuacaoTime1() {
        return this.pontuacaoTime1;
    }

    public Partida pontuacaoTime1(Integer pontuacaoTime1) {
        this.setPontuacaoTime1(pontuacaoTime1);
        return this;
    }

    public void setPontuacaoTime1(Integer pontuacaoTime1) {
        this.pontuacaoTime1 = pontuacaoTime1;
    }

    public Integer getPontuacaoTime2() {
        return this.pontuacaoTime2;
    }

    public Partida pontuacaoTime2(Integer pontuacaoTime2) {
        this.setPontuacaoTime2(pontuacaoTime2);
        return this;
    }

    public void setPontuacaoTime2(Integer pontuacaoTime2) {
        this.pontuacaoTime2 = pontuacaoTime2;
    }

    public Set<Time> getTimes() {
        return this.times;
    }

    public void setTimes(Set<Time> times) {
        this.times = times;
    }

    public Partida times(Set<Time> times) {
        this.setTimes(times);
        return this;
    }

    public Partida addTimes(Time time) {
        this.times.add(time);
        return this;
    }

    public Partida removeTimes(Time time) {
        this.times.remove(time);
        return this;
    }

    public Campeonato getCampeonato() {
        return this.campeonato;
    }

    public void setCampeonato(Campeonato campeonato) {
        this.campeonato = campeonato;
    }

    public Partida campeonato(Campeonato campeonato) {
        this.setCampeonato(campeonato);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Partida)) {
            return false;
        }
        return getId() != null && getId().equals(((Partida) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Partida{" +
            "id=" + getId() +
            ", data='" + getData() + "'" +
            ", local='" + getLocal() + "'" +
            ", pontuacaoTime1=" + getPontuacaoTime1() +
            ", pontuacaoTime2=" + getPontuacaoTime2() +
            "}";
    }
}
