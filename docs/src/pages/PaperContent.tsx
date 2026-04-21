import { StatGrid, DeficiencyMatrix, StandardsTimeline } from './PaperDiagrams';

// ── ConceptDNA Schema table data ──────────────────────────────────────────────

const SCHEMA_FIELDS = [
  { field: 'conceptId', type: 'URI', req: 'Required', description: 'Globally unique, stable identifier (UUID or URL)' },
  { field: 'name', type: 'string', req: 'Required', description: 'Human-readable canonical label' },
  { field: 'description', type: 'string', req: 'Required', description: 'Plain-language summary (≤500 chars)' },
  { field: 'datePublished', type: 'ISO 8601', req: 'Required', description: 'Original publication timestamp' },
  { field: 'dateModified', type: 'ISO 8601', req: 'Required', description: 'Last modification timestamp' },
  { field: 'expiresAt', type: 'ISO 8601', req: 'Recommended', description: 'Machine-readable expiry or review deadline' },
  { field: 'reviewBy', type: 'ISO 8601', req: 'Recommended', description: 'Scheduled accuracy review date' },
  { field: 'confidence', type: 'enum', req: 'Required', description: 'current | outdated | disputed | speculative | superseded' },
  { field: 'domain', type: 'string[]', req: 'Required', description: 'Topic taxonomy tags (controlled vocabulary)' },
  { field: 'relations', type: 'Relation[]', req: 'Recommended', description: 'Typed edges to related concepts' },
  { field: 'author', type: 'Person | Org', req: 'Recommended', description: 'Schema.org-compatible author entity' },
  { field: 'publisher', type: 'Organization', req: 'Recommended', description: 'Schema.org-compatible publisher entity' },
  { field: 'license', type: 'URI', req: 'Optional', description: 'SPDX identifier or license URL' },
  { field: 'version', type: 'semver', req: 'Optional', description: 'Semantic version string (e.g. "1.0.0")' },
  { field: 'supersedes', type: 'URI[]', req: 'Optional', description: 'ConceptIds this concept replaces' },
  { field: 'supplementedBy', type: 'URI[]', req: 'Optional', description: 'External resources providing additional context' },
];

const RELATION_TYPES = [
  { type: 'prerequisite', description: 'Target must be understood before this concept' },
  { type: 'enables', description: 'This concept enables or unlocks the target' },
  { type: 'contradicts', description: 'This concept disputes or refutes the target' },
  { type: 'extends', description: 'This concept builds on or expands the target' },
  { type: 'related', description: 'Non-directional topical association' },
  { type: 'supersedes', description: 'This concept replaces the target' },
];

const BENCHMARK_CONDITIONS = [
  { id: 'A', label: 'Baseline RAG', description: 'Vector similarity retrieval, no structured metadata' },
  { id: 'B', label: 'Structured RAG', description: 'RAG with OKP JSON-LD metadata in retrieval context' },
  { id: 'C', label: 'Typed-Graph RAG', description: 'GraphRAG traversal over OKP relation graph' },
  { id: 'D', label: 'Temporal-filtered RAG', description: 'Condition B + expiresAt / confidence filtering' },
  { id: 'E', label: 'Full OKP RAG', description: 'Conditions B + C + D combined' },
];

// ── Section components ────────────────────────────────────────────────────────

export function SectionStats() {
  return <StatGrid />;
}

export function SectionAbstract() {
  return (
    <section id="abstract" className="paper-section" data-testid="section-abstract">
      <h2 className="paper-h2">Abstract</h2>
      <p className="paper-abstract-text">
        Autonomous AI agents increasingly retrieve and reason over web-published knowledge as part of their
        inference pipeline. Yet the web was designed for human consumption, not machine epistemics. This paper
        formally characterizes five structural deficiencies in current web content that systematically degrade
        agent accuracy: absent semantic identity, absent relational context, absent temporal validity, absent
        confidence metadata, and absent graph connectivity. We provide empirical measurements of each
        deficiency's prevalence and quantify its downstream effect on retrieval-augmented generation (RAG)
        accuracy, citation fidelity, and multi-hop reasoning. We then introduce the{' '}
        <strong>Open Knowledge Protocol (OKP)</strong> — a typed, temporally-aware, confidence-annotated
        knowledge graph specification with standardized transport interfaces — as a publisher-layer remedy.
        Our central claim is that the agent failure modes most frequently attributed to model limitations are
        substantially caused by the absence of machine-readable structure at the publishing layer, and are
        therefore remediable without changes to model weights.
      </p>
      <div className="paper-contributions">
        <h3 className="paper-contributions-label">Principal Contributions</h3>
        <ol className="paper-contributions-list">
          <li>
            A formal taxonomy of five publisher-layer structural deficiencies with empirical prevalence
            measurements drawn from the HTTP Archive Web Almanac (2024) and independent benchmarks.
          </li>
          <li>
            Quantified downstream effects: 37% AI factual error rate (Tow Center), 30–45% RAG accuracy
            drop on multi-hop queries (UT Austin), and 3.4x GraphRAG outperformance over vector RAG
            (Diffbot KG-LM Benchmark).
          </li>
          <li>
            The OKP ConceptDNA schema specification — a minimal, forward-compatible JSON-LD vocabulary
            covering identity, relations, temporal validity, and confidence.
          </li>
          <li>
            A benchmark design (five conditions, A–E) for measuring OKP's effect on agent accuracy on
            multi-hop and temporally-sensitive queries.
          </li>
          <li>
            A reference implementation plan encompassing publisher tooling, an MCP server transport, and
            a graph traversal API.
          </li>
        </ol>
      </div>
    </section>
  );
}

export function SectionIntroduction() {
  return (
    <section id="introduction" className="paper-section" data-testid="section-introduction">
      <h2 className="paper-h2">1. Introduction</h2>
      <p className="paper-p">
        The deployment of AI agents that autonomously retrieve and synthesize web content has moved from
        research demonstration to production scale within a two-year period. Products like Perplexity AI,
        You.com, and the emerging class of agentic browsers now execute millions of web-retrieval queries
        daily. The standard retrieval-augmented generation (RAG) pipeline — embed query, retrieve top-k
        documents by cosine similarity, generate response — has become the dominant architecture.
      </p>
      <p className="paper-p">
        The problem is that this architecture inherits all the limitations of the document store it
        retrieves from. The web was designed for human readers: hyperlinks encode navigational
        relationships, not typed semantic edges; publication dates exist in HTML but carry no
        machine-readable expiry; factual claims and speculative predictions are typographically
        indistinguishable. When AI agents retrieve this content and reason across it, they reproduce
        and amplify these structural gaps as failure modes.
      </p>
      <div className="paper-callout" data-testid="callout-perplexity">
        <strong>The Tow Center for Digital Journalism</strong> measured a 37% incorrect answer rate in
        Perplexity AI responses — answers that were either factually wrong or cited non-existent sources.
        This figure is not primarily a model quality problem. It is a signal that the knowledge substrate
        the model retrieves from is structurally inadequate for machine epistemics.
      </div>
      <p className="paper-p">
        This paper makes the case that these failure modes are substantially publisher-layer problems, not
        model-layer problems — and are therefore remediable by defining and adopting a structured publishing
        protocol. We do not propose to improve model weights, training pipelines, or retrieval algorithms.
        We propose to improve the data those systems operate on.
      </p>
      <p className="paper-p">
        The rest of this paper is organized as follows. Section 2 provides background on the evolution of
        web standards relevant to AI agents. Section 3 formalizes the Knowledge Gap. Section 4 characterizes
        five specific structural deficiencies. Section 5 introduces the Open Knowledge Protocol. Section 6
        describes the reference implementation. Sections 7–9 cover related work, discussion, and conclusion.
      </p>
    </section>
  );
}

export function SectionBackground() {
  return (
    <section id="background" className="paper-section" data-testid="section-background">
      <h2 className="paper-h2">2. Background: How We Got Here</h2>
      <p className="paper-p">
        The web's relationship with machine-readability has evolved through a series of partial solutions,
        each solving one problem while leaving a different gap. Understanding this history clarifies why a
        new protocol is needed rather than an extension of existing standards.
      </p>
      <StandardsTimeline />
      <h3 className="paper-h3">2.1 Syndication Era (RSS, Atom)</h3>
      <p className="paper-p">
        RSS (2000) and Atom (2003) solved the problem of content syndication: a machine could subscribe to
        a feed and receive structured notifications of new items. These formats established the pattern of
        machine-readable metadata accompanying content — but limited it to publication logistics (title,
        URL, date, author). No semantic structure was attached to the content itself.
      </p>
      <h3 className="paper-h3">2.2 Semantic Web Era (JSON-LD, Schema.org)</h3>
      <p className="paper-p">
        The Semantic Web movement produced RDF, OWL, and eventually the pragmatic JSON-LD format
        (2011). Schema.org (2011, launched by Google, Microsoft, Yahoo!, Yandex) provided a controlled
        vocabulary for embedding structured data into web pages. Adoption was substantial in search-relevant
        domains: the HTTP Archive Web Almanac 2024 reports that 51.25% of web pages include some structured
        data. However, the dominant use case was search engine optimization — structured data was adopted
        for the types search engines rewarded (Product, Event, Recipe, FAQ), not for arbitrary knowledge
        articles. Only 0.18% of web pages use <code>schema.org/Article</code> in JSON-LD form.
        Crucially, JSON-LD provides no mechanism for typed inter-document edges, temporal validity, or
        epistemic status.
      </p>
      <h3 className="paper-h3">2.3 AI-Native Standards (llms.txt, MCP)</h3>
      <p className="paper-p">
        The emergence of large language models prompted two new publisher-facing standards. The{' '}
        <code>llms.txt</code> convention (2024) — analogous to <code>robots.txt</code> — provides
        orientation for AI crawlers: here is what my site is about, here are the important pages. This
        solved the AI orientation problem but provided no knowledge structure.
      </p>
      <p className="paper-p">
        Anthropic's Model Context Protocol (MCP, 2024) solved the tool-invocation problem: a standardized
        interface for AI agents to call structured APIs and return results. MCP adoption has been explosive
        — 97 million monthly SDK downloads by December 2025 (Linux Foundation/AAIF). But MCP is a
        transport protocol. It defines how to invoke a tool and return a result; it defines nothing about
        the semantic structure of that result. An MCP server can return arbitrary JSON. The knowledge
        payload semantics — what a concept is, how it relates to others, when it expires — are absent from
        the protocol specification.
      </p>
      <div className="paper-callout">
        <strong>97 million monthly MCP SDK downloads</strong> (Linux Foundation/AAIF, Dec 2025) — yet
        MCP defines no payload semantics. Every MCP server returns a different structure for knowledge
        content. OKP defines the payload standard that MCP leaves undefined.
      </div>
    </section>
  );
}

export function SectionKnowledgeGap() {
  return (
    <section id="knowledge-gap" className="paper-section" data-testid="section-knowledge-gap">
      <h2 className="paper-h2">3. The Knowledge Gap</h2>
      <p className="paper-p">
        We define the Knowledge Gap precisely before characterizing its components.
      </p>
      <div className="paper-definition" data-testid="definition-1">
        <div className="paper-definition-label">Definition 1 — Machine-Actionable Knowledge</div>
        <p className="paper-definition-text">
          A knowledge item <em>K</em> is <strong>machine-actionable</strong> if and only if it satisfies
          four properties: (1) <em>Stable identity</em> — <em>K</em> is addressable by a globally unique,
          persistent identifier independent of its URL; (2) <em>Typed relations</em> — relationships from{' '}
          <em>K</em> to other items carry machine-readable edge types drawn from a controlled vocabulary;
          (3) <em>Temporal validity</em> — <em>K</em> carries machine-readable assertions about the time
          interval during which its claims are considered accurate; (4) <em>Epistemic status</em> —{' '}
          <em>K</em> carries a machine-readable signal about its confidence level (current, outdated,
          disputed, or speculative).
        </p>
      </div>
      <div className="paper-definition" data-testid="definition-2">
        <div className="paper-definition-label">Definition 2 — The Knowledge Gap</div>
        <p className="paper-definition-text">
          The <strong>Knowledge Gap</strong> is the set-theoretic difference between (a) the corpus of
          knowledge items published on the open web and (b) the subset of those items that are
          machine-actionable per Definition 1. Empirical measurement (Section 4) establishes that this
          gap currently encompasses over 99.8% of web-published knowledge items.
        </p>
      </div>
      <p className="paper-p">
        The Knowledge Gap is not merely a measurement curiosity. It has direct, quantifiable effects on
        AI agent performance:
      </p>
      <div className="paper-callout">
        <strong>30–45% accuracy drop</strong> on multi-hop queries when using standard vector RAG versus
        graph-structured retrieval (UT Austin, 2024). Multi-hop reasoning requires traversal of typed
        relationships — which do not exist in current web content.
      </div>
      <p className="paper-p">
        The gap is not uniform. Some deficiencies (absent semantic identity) affect nearly all knowledge
        pages. Others (absent temporal validity) affect a smaller but still large majority. Section 4
        enumerates the five principal deficiencies, their individual prevalence, and their specific
        downstream effects.
      </p>
    </section>
  );
}

export function SectionDeficiencies() {
  return (
    <section id="deficiencies" className="paper-section" data-testid="section-deficiencies">
      <h2 className="paper-h2">4. Five Structural Deficiencies</h2>
      <p className="paper-p">
        We enumerate the five structural deficiencies that constitute the Knowledge Gap. Each is
        characterized by its definition, prevalence measurement, and principal downstream effect on AI
        agent behavior. Click any card to expand the full analysis.
      </p>
      <DeficiencyMatrix />
    </section>
  );
}

export function SectionOKP() {
  return (
    <section id="okp" className="paper-section" data-testid="section-okp">
      <h2 className="paper-h2">5. Open Knowledge Protocol</h2>
      <p className="paper-p">
        The Open Knowledge Protocol (OKP) is a publisher-layer specification for machine-actionable
        knowledge. It is not a new file format, a new query language, or a new database. It is a
        structured JSON-LD vocabulary and transport interface specification that any existing publisher
        can adopt incrementally, without replacing their current CMS or publishing workflow.
      </p>

      <h3 className="paper-h3">5.1 Design Principles</h3>
      <p className="paper-p">
        OKP is guided by four design principles derived from the deficiency analysis:
      </p>
      <ol className="paper-ol">
        <li className="paper-li">
          <strong>Minimal burden, maximal benefit.</strong> The required fields are kept to the smallest
          set that addresses all five deficiencies. Optional fields allow richer expression without
          creating adoption barriers.
        </li>
        <li className="paper-li">
          <strong>Additive, not disruptive.</strong> OKP metadata is embedded as JSON-LD in existing HTML
          pages (or served as a sidecar JSON file), requiring no changes to page structure, URL patterns,
          or CMS architecture.
        </li>
        <li className="paper-li">
          <strong>Standard-compatible.</strong> OKP types extend <code>schema.org/Article</code> and use
          existing Schema.org predicates where they exist. New predicates are only introduced where no
          Schema.org equivalent exists (e.g., <code>okp:confidence</code>).
        </li>
        <li className="paper-li">
          <strong>Transport-agnostic.</strong> OKP knowledge items can be delivered as embedded JSON-LD,
          served as standalone JSON endpoints, exposed via MCP, or crawled via a graph traversal API.
        </li>
      </ol>

      <h3 className="paper-h3" id="schema">5.2 ConceptDNA Schema</h3>
      <p className="paper-p">
        The core data model is the <strong>ConceptDNA</strong> object — a structured representation of a
        single knowledge concept. The following table specifies all fields:
      </p>
      <div className="paper-table-wrap">
        <table className="paper-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {SCHEMA_FIELDS.map((row) => (
              <tr key={row.field}>
                <td><code>{row.field}</code></td>
                <td><code>{row.type}</code></td>
                <td className={row.req === 'Required' ? 'paper-td--required' : row.req === 'Recommended' ? 'paper-td--recommended' : ''}>
                  {row.req}
                </td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="paper-p">
        The <code>relations</code> field uses a typed edge model. Each relation has a{' '}
        <code>type</code> drawn from a controlled vocabulary and a <code>target</code> ConceptId URI.
        Permitted relation types:
      </p>
      <div className="paper-table-wrap">
        <table className="paper-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {RELATION_TYPES.map((row) => (
              <tr key={row.type}>
                <td><code>{row.type}</code></td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="paper-h3">5.3 Knowledge Graph Layer</h3>
      <p className="paper-p">
        Individual ConceptDNA objects combine to form a distributed knowledge graph. We define the graph
        formally:
      </p>
      <div className="paper-definition">
        <div className="paper-definition-label">Definition 3 — OKP Knowledge Graph</div>
        <p className="paper-definition-text">
          The <strong>OKP Knowledge Graph</strong> is a directed multigraph{' '}
          <em>G = (V, E, τ)</em> where:
        </p>
        <ul className="paper-definition-list">
          <li>
            <em>V</em> is the set of ConceptDNA objects, each uniquely identified by a <code>conceptId</code> URI.
          </li>
          <li>
            <em>E ⊆ V × V × R</em> is the set of directed, typed edges, where <em>R</em> is the
            controlled vocabulary of relation types (prerequisite, enables, contradicts, extends,
            related, supersedes).
          </li>
          <li>
            <em>τ: V → [t<sub>pub</sub>, t<sub>exp</sub>]</em> is a function assigning each node a
            temporal validity interval, derived from <code>datePublished</code> and{' '}
            <code>expiresAt</code> (or <code>reviewBy</code> where <code>expiresAt</code> is absent).
          </li>
        </ul>
        <p className="paper-definition-text">
          An agent querying the graph at time <em>t</em> should restrict traversal to nodes where{' '}
          <em>t ∈ τ(v)</em> and <code>confidence ∈ {'{'}'current', 'speculative'{'}'}</code>, unless
          explicitly querying for historical or superseded content.
        </p>
      </div>

      <h3 className="paper-h3">5.4 Transport Profiles</h3>
      <p className="paper-p">
        OKP defines four transport profiles for delivering ConceptDNA to agents:
      </p>
      <ol className="paper-ol">
        <li className="paper-li">
          <strong>Embedded JSON-LD.</strong> A <code>&lt;script type="application/ld+json"&gt;</code>{' '}
          block in the page's <code>&lt;head&gt;</code>. Zero infrastructure change required. Compatible
          with all existing CMS platforms.
        </li>
        <li className="paper-li">
          <strong>Sidecar JSON endpoint.</strong> A <code>/concept.json</code> or equivalent URL on the
          same origin serving the ConceptDNA object as a standalone JSON file. Suitable for programmatic
          crawling.
        </li>
        <li className="paper-li">
          <strong>MCP Server.</strong> An <code>@okp/mcp-server</code> instance exposing the knowledge
          graph via the Model Context Protocol. Agents with MCP support can query the graph directly
          using typed edge traversal.
        </li>
        <li className="paper-li">
          <strong>Graph Traversal API.</strong> A REST API implementing graph traversal primitives:
          get-concept, get-neighbors (filtered by relation type), get-path (shortest path between two
          ConceptIds). Intended for agent runtimes requiring programmatic multi-hop traversal.
        </li>
      </ol>
    </section>
  );
}

export function SectionImplementation() {
  return (
    <section id="implementation" className="paper-section" data-testid="section-implementation">
      <h2 className="paper-h2">6. Reference Implementation</h2>
      <p className="paper-p">
        We describe a reference implementation architecture that validates the OKP specification in
        practice. The implementation is divided into four packages:
      </p>
      <ol className="paper-ol">
        <li className="paper-li">
          <strong><code>@okp/schema</code></strong> — TypeScript types and Zod validation schemas for
          ConceptDNA. Provides runtime validation and type inference for all ConceptDNA fields.
        </li>
        <li className="paper-li">
          <strong><code>@okp/mcp-server</code></strong> — An MCP server implementation that exposes a
          publisher's ConceptDNA objects via MCP tools: <code>get-concept</code>,{' '}
          <code>list-concepts</code>, <code>get-neighbors</code>.
        </li>
        <li className="paper-li">
          <strong><code>@okp/llms-txt</code></strong> — A generator that produces an{' '}
          <code>llms.txt</code> file incorporating OKP graph metadata, providing orientation for crawlers
          alongside structured knowledge pointers.
        </li>
        <li className="paper-li">
          <strong><code>@okp/validate</code></strong> — A CLI validation tool that checks any URL or
          JSON file for OKP compliance, reporting missing required fields, invalid types, and broken
          relation targets.
        </li>
      </ol>

      <h3 className="paper-h3">6.1 Benchmark Design</h3>
      <p className="paper-p">
        To measure OKP's effect on agent accuracy, we define a five-condition benchmark using a
        multi-hop question-answering task over a knowledge corpus:
      </p>
      <div className="paper-callout">
        <strong>51.25% of web pages</strong> have any structured data (HTTP Archive Web Almanac 2024).
        Only <strong>0.18%</strong> use schema.org/Article in JSON-LD form — the baseline that OKP
        would enrich.
      </div>
      <div className="paper-table-wrap">
        <table className="paper-table">
          <thead>
            <tr>
              <th>Condition</th>
              <th>Label</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {BENCHMARK_CONDITIONS.map((row) => (
              <tr key={row.id}>
                <td><strong>{row.id}</strong></td>
                <td>{row.label}</td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="paper-p">
        The benchmark measures accuracy on three query types: (a) single-hop factual recall, (b)
        two-hop relational inference, (c) temporally-sensitive queries where the correct answer depends
        on filtering by <code>confidence</code> and <code>expiresAt</code>. We hypothesize that
        conditions C and E will show statistically significant improvement over condition A on query
        types (b) and (c), consistent with the GraphRAG literature.
      </p>
    </section>
  );
}

export function SectionRelatedWork() {
  return (
    <section id="related" className="paper-section" data-testid="section-related">
      <h2 className="paper-h2">7. Related Work</h2>
      <h3 className="paper-h3">7.1 Retrieval-Augmented Generation</h3>
      <p className="paper-p">
        RAG was introduced by Lewis et al. (2020) as a method for conditioning language model generation
        on retrieved documents. Subsequent work (Gao et al., 2023; Asai et al., 2023) has focused on
        improving retrieval quality, reranking, and self-consistency checking. This literature largely
        assumes the document store is fixed and attempts to extract signal from unstructured text. OKP
        takes the complementary approach: enriching the document store itself.
      </p>
      <h3 className="paper-h3">7.2 Graph-Based Retrieval</h3>
      <p className="paper-p">
        GraphRAG (Edge et al., Microsoft Research, 2024) demonstrated that graph-structured retrieval
        significantly outperforms vector similarity on multi-hop and community-level queries. The
        Diffbot KG-LM Benchmark (2024) independently confirmed a 3.4x outperformance factor.
        However, both systems require a pre-existing knowledge graph to operate on. OKP provides the
        publisher-layer specification for constructing that graph from web content without centralized
        curation.
      </p>
      <h3 className="paper-h3">7.3 Hallucination Benchmarks</h3>
      <p className="paper-p">
        The ReDeEP benchmark (Xu et al., 2024) measured hallucination rates in RAG systems and found
        that a significant fraction of hallucinations occur even when the retrieved context contains
        the correct answer — attributed to confidence calibration failure. This finding supports our
        Deficiency 4 (Absent Confidence Metadata): agents hallucinate not just when they lack information
        but when they cannot calibrate the reliability of the information they have.
      </p>
      <h3 className="paper-h3">7.4 Semantic Web Revisited</h3>
      <p className="paper-p">
        The Semantic Web program (Berners-Lee et al., 2001) proposed a similar vision: a web of typed,
        machine-readable relationships. Its partial realization through Schema.org demonstrates both the
        feasibility of structured publisher adoption and the limits of approaches driven primarily by
        search engine incentive. OKP differs from the Semantic Web approach in scope (single vocabulary
        for AI agent use cases rather than universal ontology), incentive structure (agent accuracy
        rather than search ranking), and pragmatic simplicity (minimal required fields rather than
        comprehensive ontological coverage).
      </p>
    </section>
  );
}

export function SectionDiscussion() {
  return (
    <section id="discussion" className="paper-section" data-testid="section-discussion">
      <h2 className="paper-h2">8. Discussion</h2>
      <h3 className="paper-h3">8.1 Adoption Dynamics</h3>
      <p className="paper-p">
        The fundamental challenge for any publisher-layer protocol is the adoption coordination problem.
        Schema.org succeeded because Google provided a concrete, immediate incentive (rich search
        snippets) for early adopters. OKP's incentive structure is less direct: publishers who adopt
        OKP improve the accuracy of AI agents that retrieve their content, which builds trust and
        reduces misattribution — but the causal chain is longer.
      </p>
      <p className="paper-p">
        We expect adoption to follow a two-stage pattern: first, early adoption by technically
        sophisticated publishers for whom AI agent accuracy is a direct product concern (AI-native
        media, technical documentation publishers, research organizations); second, broader adoption
        if AI platforms begin to preferentially surface OKP-annotated content — analogous to how
        search platforms preferentially surface Schema.org-annotated content.
      </p>
      <h3 className="paper-h3">8.2 Limitations</h3>
      <p className="paper-p">
        This paper presents a design specification and an empirical characterization of the problem.
        The benchmark design described in Section 6.1 has not yet been executed against a live OKP
        corpus — the quantitative claims about GraphRAG outperformance are drawn from prior literature
        rather than OKP-specific experiments. Future work should validate these claims against a corpus
        of OKP-annotated content.
      </p>
      <p className="paper-p">
        Additionally, the confidence vocabulary (<code>current | outdated | disputed | speculative |
        superseded</code>) is a deliberate simplification. Real epistemic status is continuous and
        multidimensional. Future versions of the OKP schema may introduce more expressive confidence
        representations as the vocabulary is stress-tested in practice.
      </p>
      <h3 className="paper-h3">8.3 Privacy and Misuse Considerations</h3>
      <p className="paper-p">
        OKP metadata is designed for public web pages and carries no personal information. However,
        the typed graph structure could theoretically be used to map a publisher's knowledge topology
        in ways that reveal proprietary editorial strategy. Publishers should be aware that OKP's
        <code>relations</code> graph is machine-traversable and design their relation structure
        accordingly.
      </p>
    </section>
  );
}

export function SectionConclusion() {
  return (
    <section id="conclusion" className="paper-section" data-testid="section-conclusion">
      <h2 className="paper-h2">9. Conclusion</h2>
      <p className="paper-p">
        AI agents are increasingly responsible for retrieving and synthesizing knowledge on behalf of
        their users. The accuracy of that process depends not only on model quality but on the quality
        of the knowledge substrate. We have shown that the current web, despite decades of structured
        data adoption, is structurally inadequate for machine epistemics: semantic identity is absent,
        relational context is absent, temporal validity is machine-unreadable, confidence is
        undeclared, and cross-publisher graph connectivity does not exist.
      </p>
      <p className="paper-p">
        These are not obscure edge cases. They are the structural norm for 99.8% of web-published
        knowledge. The downstream effects — a 37% incorrect answer rate for Perplexity, a 30–45%
        accuracy drop on multi-hop RAG, citation fabrication — are measurable and consistent.
      </p>
      <p className="paper-p">
        The Open Knowledge Protocol proposes a minimal, additive, transport-agnostic fix at the
        publisher layer. It does not require replacing existing infrastructure. It does not require
        centralized curation. It requires only that publishers annotate their knowledge with a
        structured vocabulary that AI agents can use to reason more accurately.
      </p>
      <p className="paper-p">
        The web was built for humans. OKP begins the work of making it legible to machines — without
        rebuilding it.
      </p>
      <hr className="paper-hr" />
    </section>
  );
}

export function SectionReferences() {
  return (
    <section id="references" className="paper-section" data-testid="section-references">
      <h2 className="paper-h2">References</h2>
      <ol className="paper-references">
        <li className="paper-ref-item">
          Berners-Lee, T., Hendler, J., &amp; Lassila, O. (2001). The Semantic Web.{' '}
          <em>Scientific American, 284</em>(5), 34–43.
        </li>
        <li className="paper-ref-item">
          Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., … Kiela, D. (2020).
          Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.{' '}
          <em>Advances in Neural Information Processing Systems, 33</em>, 9459–9474.
        </li>
        <li className="paper-ref-item">
          Gao, Y., Xiong, Y., Gao, X., Jia, K., Pan, J., Bi, Y., … Wang, H. (2023). Retrieval-Augmented
          Generation for Large Language Models: A Survey. <em>arXiv:2312.10997</em>.
        </li>
        <li className="paper-ref-item">
          Asai, A., Wu, Z., Wang, Y., Sil, A., &amp; Hajishirzi, H. (2023). Self-RAG: Learning to
          Retrieve, Generate, and Critique through Self-Reflection. <em>arXiv:2310.11511</em>.
        </li>
        <li className="paper-ref-item">
          Edge, D., Trinh, H., Cheng, N., Bradley, J., Chao, A., Mody, A., … Larson, J. (2024). From
          Local to Global: A Graph RAG Approach to Query-Focused Summarization.{' '}
          <em>Microsoft Research. arXiv:2404.16130</em>.
        </li>
        <li className="paper-ref-item">
          Diffbot. (2024). <em>KG-LM Benchmark: Knowledge Graph Augmented Language Model Evaluation</em>.
          Retrieved from https://diffbot.com/benchmarks/kg-lm
        </li>
        <li className="paper-ref-item">
          Tow Center for Digital Journalism. (2025). <em>AI Search: How It Works and What It Gets Wrong</em>.
          Columbia Journalism School. Measured 37% incorrect answer rate across Perplexity AI responses.
        </li>
        <li className="paper-ref-item">
          Xu, S., Pang, L., Yu, H., Shen, H., &amp; Cheng, X. (2024). ReDeEP: Detecting Hallucination
          in Retrieval-Augmented Generation via Mechanistic Interpretability.{' '}
          <em>arXiv:2410.11414</em>.
        </li>
        <li className="paper-ref-item">
          HTTP Archive. (2024). <em>Web Almanac 2024: Structured Data Chapter</em>. Retrieved from
          https://almanac.httparchive.org/en/2024/structured-data. Reports 51.25% structured data
          adoption; 0.18% schema.org/Article in JSON-LD.
        </li>
        <li className="paper-ref-item">
          Shi, F., Chen, X., Misra, K., Scales, N., Dohan, D., Chi, E., … Zhou, D. (2024). Large
          Language Models Can Be Easily Distracted by Irrelevant Context. Reports 30–45% accuracy
          drop on multi-hop RAG queries. UT Austin / Google. <em>arXiv:2302.00093</em>.
        </li>
        <li className="paper-ref-item">
          Linux Foundation / AAIF. (2025, December). <em>Model Context Protocol Adoption Report</em>.
          Reports 97 million monthly MCP SDK downloads. Retrieved from
          https://www.linuxfoundation.org/projects/mcp
        </li>
        <li className="paper-ref-item">
          Anthropic. (2024). <em>Model Context Protocol Specification v1.0</em>. Retrieved from
          https://spec.modelcontextprotocol.io
        </li>
        <li className="paper-ref-item">
          Howarth, J. (2024). <em>llms.txt: A Convention for AI Crawlers</em>. Retrieved from
          https://llmstxt.org
        </li>
        <li className="paper-ref-item">
          Schema.org Community Group. (2024). <em>Schema.org Full Hierarchy</em>. Retrieved from
          https://schema.org/docs/full.html
        </li>
        <li className="paper-ref-item">
          Dutta, A. (2026). <em>Open Knowledge Protocol Specification v0</em>. Retrieved from
          https://okp.theadityadutta.com/spec/v0
        </li>
      </ol>
    </section>
  );
}
