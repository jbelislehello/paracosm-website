-- Publish OPEN chapter draft
WITH ch AS (
  SELECT id FROM public.book_chapters WHERE slug='living-the-ontology'
), upd AS (
  UPDATE public.book_chapters
    SET published_excerpt = $$# Living the Ontology

*What if the map was not a picture of the territory, but a living part of it? What if, by changing a word on the map, the territory itself rearranged, making new paths possible and old confusions obsolete?*

## The Map That Wakes Up

In the CALM phase, we did the quiet, careful work of architects. We stood before the whiteboards and the diagrams, charting the unseen forces of our organization. We named the essential entities—the `People`, the `Projects`, the `Decisions`, the `Risks`. We drew the relationships between them, revealing the hidden grammar of how work actually gets done. We designed an ontology, a schematic of our shared reality. It was a beautiful, intricate, and utterly static blueprint.

Now, in the OPEN phase, we breathe life into the machine. This is the moment the blueprint is laid over the landscape, and the landscape begins to respond. The map wakes up. The drawing ceases to be a *model* of the work and becomes the work’s living nervous system. This is the single greatest point of failure for most transformations. They build the beautiful machine, present it in a series of triumphant slide decks, and then walk away, leaving it to rust in a corner. They mistake the blueprint for the building.

Living the ontology is the act of plugging the schematic into the daily flow of electricity. It is the transition from designing a system to inhabiting it. The graph of nodes and edges we so carefully plotted is no longer a depiction; it is a dynamic, queryable, and editable substrate for our collective action. It is not a report on what happened last week. It is the real-time, interactive surface upon which this week is happening.

## Naming Is Plumbing

Before an ontology is alive, language is merely descriptive. We talk *about* the project. We describe the blocker. We summarize the decision. The words are labels we affix to a reality that feels separate from us, solid and immutable.

Once the ontology goes live, language becomes functional. Naming becomes plumbing. The words we chose in the CALM phase— `Initiative`, `Friction`, `Assumption`, `Proposal`—are no longer just nouns. They are the names of the pipes through which intention, value, and information now flow. To speak the name of a node is to summon it. To connect it to another node is to direct the flow of work.

Think of a typical organization. A critical decision is made in a meeting, mentioned in a Slack channel, and its rationale is buried in a private email thread. The "decision" exists in three different places, in three different forms, creating leaks and pressure drops across the system. No one knows where the canonical truth is. The plumbing is broken.

In an organization living its ontology, the conversation *is* the act of plumbing. When a `Proposal` is debated, the outcome is not just a verbal "yes." The outcome is the instantiation of a `Decision` node, connected directly to the `Proposal` it resolves and the `Team` who ratified it. The rationale isn't lost in an email; it's an attribute of that `Decision` node, forever discoverable. When someone says, “I’m blocked,” it’s not just a complaint. It's the creation of a `Friction` node, linked to their `Role` and the `Initiative` they are working on.

Suddenly, the system has pressure. The graph has integrity. We are no longer just talking *about* our work; our conversation is the hydraulic force that moves the work through a well-plumbed system. The ontology transforms language from a representational tool into an operational one.

## The Graph Is the Workflow

When the graph becomes the workflow, the texture of daily life changes. The familiar rituals of work are not abandoned, but they are upgraded. They become thinner, more transparent, and radically more effective.

A team meeting looks different. Before, it was a status report, a round-robin of anecdotes. Now, the agenda is a query against the graph. The meeting opens with a shared screen displaying all open `Frictions` linked to the team’s current `Sprint`. The conversation is not "What's up?" but "Let's resolve the connections on this map." The output of the meeting isn't just a list of action items in someone’s notebook; it's a series of commits to the graph. A `Friction` is resolved and linked to a new `Decision`. An `Assumption` is validated and its status is changed to `Confirmed`. The meeting becomes a live editing session of the organization's reality.

A Slack thread is no longer a chaotic firehose of chatter. It is an estuary where new nodes are born. A simple slash command—`/create_risk: 'Deployment pipeline is brittle'`—instantiates a new `Risk` node in the graph, automatically tagged with the channel, the user, and the timestamp. The conversation can continue, but the critical piece of insight has been captured, instrumented, and made part of the whole. It is no longer an ephemeral comment; it is a permanent address in the organization's memory.

A one-on-one is transformed from a subjective check-in to a collaborative tour of a specific part of the graph. A manager and their report can query for all the `Contributions` a person has made in the last month, all the `Dependencies` they are waiting on from other teams, and all the `Skills` they have applied. This isn’t surveillance; it is a shared, objective look at the flow of work centered around an individual, revealing opportunities for support, recognition, and growth that were previously invisible.

In this way, we stop documenting our work as a chore after the fact. We simply do our work, and the work documents itself. The graph *is* the workflow.

## Adjustment as a Daily Practice

The ontology you designed in the CALM phase was a hypothesis. A brilliant, well-researched, and deeply considered hypothesis, but a hypothesis nonetheless. The moment it meets the friction of reality, it will begin to show its flaws. And this is not a problem; it is the entire point.

A brittle ontology is one that is decreed from on high, frozen in time. When reality inevitably outruns its definitions, people create workarounds. They use the `Bug Report` node for feature requests because there is no `Feature Request` node. They stuff crucial context into a generic `Comment` field because the schema is too rigid. The graph becomes a liar, and the people abandon it. The system dies.

An open, living ontology accepts its own fallibility. It builds in the loops for its own correction. The practice of adjusting the ontology is not a painful, bureaucratic, once-a-year review. It is a lightweight, continuous, and empowering daily practice.

Imagine a small product team in a planning session. They’re looking at their board, which is a view of the graph. The designer says, “This card, ‘Clarify User Journey,’ isn’t really a `Task`. It’s not about producing an asset. It’s more like a question we need to answer.”

In a brittle system, the conversation ends there. They shrug and get on with it.

In an organization practicing Calm Magic, the engineer might reply, “You’re right. We keep having these. They’re not `Tasks`, they’re not `Stories`. They’re `Inquiries`. Should we create an `Inquiry` node type?”

The product lead, who is a steward of this part of the ontology, considers it. “I like that. An `Inquiry` is resolved by a `Finding`, not by a `Deliverable`. That feels true.” She opens the schema editor—a tool as accessible as a wiki page—and proposes the change. She defines the new `Inquiry` node and its potential relationships: an `Inquiry` can be connected to a `Team`, spawned from an `Initiative`, and resolved by a `Finding`. The team agrees. The change is committed.

In that ten-minute conversation, the team did not just have a semantic debate. They reshaped their shared reality. The next time the designer has a question to explore, she has a perfect place to put it. The system becomes more honest, more useful, and more deeply their own. This is not top-down change management; it is bottom-up reality gardening.

## When the Ontology Goes Open

Making an ontology "open" is a profound cultural shift. It means moving from a paradigm of control to a paradigm of coherence. A closed ontology is a system of rules enforced by a central authority. It is rigid, predictable, and ultimately fragile. An open ontology is a system of conventions stewarded by the community that uses it. It is flexible, adaptable, and resilient.

"Open" does not mean anarchic. It means the process of change is visible, negotiable, and witnessed by the collective. Changes to the schema are versioned like code. Debates about terminology happen in the open, not in closed rooms. Certain parts of the ontology might be more stable and require more ceremony to change—the core financial entities, for instance. Other parts, closer to the fast-moving work of product teams, might be more fluid.

This requires a social contract. It requires trust. It requires that we empower individuals and teams to be responsible stewards of their slice of the shared map. The organization must trust its people not to burn the map, and the people must trust the organization not to snatch the map away and lock it in a drawer.

When this trust is established, the ontology becomes a source of immense psychological safety. It is a shared understanding of what is real, what is important, and how things relate to one another. It gives people the power to point to a `Friction` and know they will be understood. It gives teams the autonomy to refine the language they use to describe their own unique work, while still connecting that work to the larger whole. The ontology is no longer a cage; it is the trellis upon which the organization can grow in healthy, coherent new directions.

Living the ontology is the discipline of keeping the conversation between the map and the territory alive and honest. It is the daily work of tuning, editing, and plumbing our shared understanding. As this practice becomes less a deliberate discipline and more an unconscious reflex, the organization makes another turn. The effort of maintaining the system begins to dissolve into the natural flow of work itself, opening a space for something even more fluid and generative.$$,
        status = 'published',
        published_at = COALESCE(published_at, now()),
        updated_at = now()
    WHERE slug = 'living-the-ontology'
    RETURNING id
), demote AS (
  UPDATE public.book_chapter_drafts
    SET is_current = false
    WHERE chapter_id = (SELECT id FROM ch) AND is_current = true
    RETURNING id
)
INSERT INTO public.book_chapter_drafts (chapter_id, model, prompt_snapshot, draft_md, is_current)
SELECT (SELECT id FROM ch),
       'google/gemini-2.5-pro',
       'Calm Magic Chapter 7 OPEN — Living the Ontology. Synthesized from open_ontology_and_graph, open_real_workflow, open_adjustment_plan PRD fields.',
       $$# Living the Ontology — see published_excerpt$$,
       true;