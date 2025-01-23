package dev.daviboni.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Estatistica.
 */
@Entity
@Table(name = "estatistica")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Estatistica implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "pontos")
    private Integer pontos;

    @Column(name = "rebotes")
    private Integer rebotes;

    @Column(name = "assistencias")
    private Integer assistencias;

    @Column(name = "faltas")
    private Integer faltas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "time" }, allowSetters = true)
    private Jogador jogador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "times", "campeonato" }, allowSetters = true)
    private Partida partida;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Estatistica id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPontos() {
        return this.pontos;
    }

    public Estatistica pontos(Integer pontos) {
        this.setPontos(pontos);
        return this;
    }

    public void setPontos(Integer pontos) {
        this.pontos = pontos;
    }

    public Integer getRebotes() {
        return this.rebotes;
    }

    public Estatistica rebotes(Integer rebotes) {
        this.setRebotes(rebotes);
        return this;
    }

    public void setRebotes(Integer rebotes) {
        this.rebotes = rebotes;
    }

    public Integer getAssistencias() {
        return this.assistencias;
    }

    public Estatistica assistencias(Integer assistencias) {
        this.setAssistencias(assistencias);
        return this;
    }

    public void setAssistencias(Integer assistencias) {
        this.assistencias = assistencias;
    }

    public Integer getFaltas() {
        return this.faltas;
    }

    public Estatistica faltas(Integer faltas) {
        this.setFaltas(faltas);
        return this;
    }

    public void setFaltas(Integer faltas) {
        this.faltas = faltas;
    }

    public Jogador getJogador() {
        return this.jogador;
    }

    public void setJogador(Jogador jogador) {
        this.jogador = jogador;
    }

    public Estatistica jogador(Jogador jogador) {
        this.setJogador(jogador);
        return this;
    }

    public Partida getPartida() {
        return this.partida;
    }

    public void setPartida(Partida partida) {
        this.partida = partida;
    }

    public Estatistica partida(Partida partida) {
        this.setPartida(partida);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Estatistica)) {
            return false;
        }
        return getId() != null && getId().equals(((Estatistica) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Estatistica{" +
            "id=" + getId() +
            ", pontos=" + getPontos() +
            ", rebotes=" + getRebotes() +
            ", assistencias=" + getAssistencias() +
            ", faltas=" + getFaltas() +
            "}";
    }
}
