# 11.1. Agile Quality Management

> Source: `11.1. Agile Quality Management.pdf`  
> Extracted slides: **25**  
> Structure: one Markdown section per original PowerPoint slide in the 6-up PDF handout.  
> Wording is preserved from the PDF text layer; no outside knowledge was added. Visual-only slides include a cropped image.

## Slide 001 — Agile Quality Management

_PDF page 1, handout panel 1_

```text
Agile Quality Management
Lecturer: Ngo Huy Bien
Software Engineering Department
Faculty of Information Technology
VNUHCM - University of Science
Ho Chi Minh City, Vietnam
nhbien@fit.hcmus.edu.vn
```

---

## Slide 002 — Objectives

_PDF page 1, handout panel 2_

```text
Objectives
To improve your software quality.
To improve your team collaboration
quality.
```

---

## Slide 003 — Contents

_PDF page 1, handout panel 3_

```text
Contents
I.
Agile quality assurance techniques
II.
Documentation
III.
Retrospectives
```

---

## Slide 004 — References

_PDF page 1, handout panel 4_

```text
References
1. James Shore and Shane Warden (2008).
The Art of Agile Development. O'Reilly.
2. Esther Derby and Diana Larsen (2006).
Agile Retrospectives: Making Good Teams
Great. Pragmatic Bookshelf.
```

---

## Slide 005 — 1. Create Coding Standards [1]

_PDF page 1, handout panel 5_

```text
1. Create Coding Standards [1]
• Coding standards and conventions
– Formatting
– Tools and IDE
– File and directory layout
– Error handling
– Approach to events
– Logging
• Don’t allow coding standards to become a divisive issue
for your team.
Refer to 03. Coding Standards.pptx
for details.
```

---

## Slide 006 — 2. Create Unit Tests

_PDF page 1, handout panel 6_

```text
2. Create Unit Tests
Refer to Software Construction: 08.
Unit Testing.pptx for details.
```

---

## Slide 007 — 3. Create Exploratory Test Scenarios

_PDF page 2, handout panel 1_

```text
3. Create Exploratory Test Scenarios
• Finding bugs based on common types of faults: zero, one,
many, too big, too small, create, read, update, delete, data
types
```

---

## Slide 008 — Example Exploratory Test Scenarios

_PDF page 2, handout panel 2_

```text
Example Exploratory Test Scenarios
•
https://ontestpad.com/signup

A more compact version
```

---

## Slide 009 — 4. Create End-to-End Unit Tests

_PDF page 2, handout panel 3_

```text
4. Create End-to-End Unit Tests
• https://www.cypress.io/
```

---

## Slide 010 — 5. Integrate Unit Tests with

_PDF page 2, handout panel 4_

```text
5. Integrate Unit Tests with
CI/CD/DevOps System
```

---

## Slide 011 — 6. Perform Code Inspection

_PDF page 2, handout panel 5_

```text
6. Perform Code Inspection
```

---

## Slide 012 — Simple Design

_PDF page 2, handout panel 6_

```text
Simple Design
• Appropriate for the intended audience.
– It doesn’t matter how brilliant and elegant a piece of design is; if the people
who need to work with it don’t understand it, it isn’t simple for them.
• Communicative.
– Every idea that needs to be communicated is represented in the system. Like
words in a vocabulary, the elements of the system communicate to future
readers.
• Factored.
– Duplication of logic or structure makes code hard to understand and modify.
• Minimal.
– Within the above three constraints, the system should have the fewest
elements possible. Fewer elements means less to test, document, and
communicate.
```

---

## Slide 013 — Code Smells & Refactoring

_PDF page 3, handout panel 1_

```text
Code Smells & Refactoring
• Divergent Change occurs when unrelated changes affect the
same class.
• Shotgun Surgery is just the opposite: it occurs when you have
to modify multiple classes to support changes to a single idea.
• Time Dependencies occur when a class’ methods must be
called in a specific order. Time Dependencies often indicate an
encapsulation problem. Rather than managing its state itself,
the class expects its callers to manage some of its state.
• Half-Baked Objects are a special case of Time Dependency:
they must first be constructed, then initialized with a method
call, then used.
```

---

## Slide 014 — 7. Create Documentation

_PDF page 3, handout panel 2_

```text
7. Create Documentation
• The team does document some things, such as the vision
statement and story cards, but these act more as reminders
than as formal documentation.
• Some projects need to produce specific kinds of
documentation to provide business value.
– Examples include user manuals, comprehensive API reference
documentation, and reports. Create, estimate, and prioritize stories
for product documentation.
• Handoff documentation: create a small set of documents
recording big decisions and information.
– Your goal is to summarize the most important information you’ve
learned while creating the software—the kind of information
necessary to sustain and maintain the project.
```

---

## Slide 015 — 8. Ask Customer to Perform Tests

_PDF page 3, handout panel 3_

```text
8. Ask Customer to Perform Tests
• Problem-solution, business cases, goals.
• Customer tests are for communication.
• Customer feedback report.
```

---

## Slide 016 — 9. Create “Definition of Done”

_PDF page 3, handout panel 4_

```text
9. Create “Definition of Done”
• We’re done when we’re production-ready.
```

---

## Slide 017 — Visual-only slide

_PDF page 3, handout panel 5_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 017](assets/11-1-agile-quality-management/slide-017.png)

---

## Slide 018 — 1a. Conduct a Retrospective Meeting

_PDF page 3, handout panel 6_

```text
1a. Conduct a Retrospective Meeting
• Set the stage
– Regardless of what we discover today, we understand and truly
believe that everyone did the best job they could, given what
they knew at the time, their skills and abilities, the resources
available, and the situation at hand.
```

---

## Slide 019 — 1b. Conduct a Retrospective Meeting

_PDF page 4, handout panel 1_

```text
1b. Conduct a Retrospective Meeting
• Brainstorming
– Index cards and pencils
Frustrating
Same
Less
More
Enjoyable
Same
Less
More
Puzzling
Same
Less
More
```

---

## Slide 020 — 1c. Conduct a Retrospective Meeting

_PDF page 4, handout panel 2_

```text
1c. Conduct a Retrospective Meeting
• Mute Mapping
– Put related cards close
together.
– Put unrelated cards far
apart.
– No talking.
– Circle the categories.
– Read a sampling of
cards from each circle
and ask the team to
name the category.
```

---

## Slide 021 — 1d. Conduct a Retrospective Meeting

_PDF page 4, handout panel 3_

```text
1d. Conduct a Retrospective Meeting
• Retrospective Objective
– Give each person five votes. Participants can put all their votes
on one category if they wish, or spread their votes amongst
several categories.
– After the voting ends, one category should be the clear winner.
If not, don’t spend too much time; flip a coin or something.
– Come up with options for improving it.
– Apply your root-cause analysis skills.
– Read the cards in the category again, then brainstorm some
ideas.
– Create user stories for action items.
```

---

## Slide 022 — 2. Apply Five Whys

_PDF page 4, handout panel 4_

```text
2. Apply Five Whys
```

---

## Slide 023 — 3. Apply Force Field Analysis [2]

_PDF page 4, handout panel 5_

```text
3. Apply Force Field Analysis [2]
```

---

## Slide 024 — 4. Apply Fishbone

_PDF page 4, handout panel 6_

```text
4. Apply Fishbone
```

---

## Slide 025 — Thank You & See You Again

_PDF page 5, handout panel 1_

```text
Thank You & See You Again
```

---

