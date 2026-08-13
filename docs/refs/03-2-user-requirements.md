# 03.2. User Requirements

> Source: `03.2. User Requirements.pdf`  
> Extracted slides: **21**  
> Structure: one Markdown section per original PowerPoint slide in the 6-up PDF handout.  
> Wording is preserved from the PDF text layer; no outside knowledge was added. Visual-only slides include a cropped image.

## Slide 001 — User Requirements

_PDF page 1, handout panel 1_

```text
User Requirements
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
To discover user requirements.
To create a project vision and scope
document.
```

---

## Slide 003 — Contents

_PDF page 1, handout panel 3_

```text
Contents
I.
User Requirements
II.
Glossary
III.
Business Rules
IV.
Features
V.
Feature Model
VI.
Feature Tree
VII. Project Vision and Scope
VIII. Project Scope Statement
```

---

## Slide 004 — References

_PDF page 1, handout panel 4_

```text
References
1.
Craig Larman (2004). Applying UML and
Patterns. 3rd Edition. Prentice Hall.
2.
Don Batory (2005). Feature Models,
Grammars, and Propositional Formulas.
3.
Karl Wiegers and Joy Beatty (2013).
Software Requirements. Microsoft Press.
4.
Jennifer Greene and Andrew Stellman
(2005). Applied Software Project
Management. O'Reilly Media.
5.
Andrew Stellman and Jennifer Greene
(2014). Head First PMP. 3rd Edition. O'Reilly
Media.
```

---

## Slide 005 — Discovering User Requirements

_PDF page 1, handout panel 5_

```text
Discovering User Requirements
• Who are the users?
• What are their problems, needs or goals?
• No software or black box software.
Refer to 05.2. Business Use Cases.pptx and 05.3. Domain Models.pptx for
details.
```

---

## Slide 006 — Glossary [1]

_PDF page 1, handout panel 6_

```text
Glossary [1]
Glossary defines noteworthy terms, records requirements related to data, such
as validation rules, acceptable values, and so forth.
Term
Definition and Information
Format
Validation
Rules
Aliases
Item
A product or service for sale

Payment
authorization
Validation by an external payment authorization
service that they will make or guarantee the
payment to the seller.

Payment
authorization
request
A composite of elements electronically sent to an
authorization service, usually as a char array.
Elements include: store ID, customer account
number, amount, and timestamp.

UPC
Numeric code that identifies a product. Usually
symbolized with a bar code placed on products.
See www.gs1us.org for details of format and
validation.
12-digit
code of
several
subparts.
Digit 12 is a
check digit.
Universal
Product
Code
```

---

## Slide 007 — Business Rules

_PDF page 2, handout panel 1_

```text
Business Rules
Business rules dictate how a domain or business may operate.
ID
Rule
Changeability
Source
RULE1
Signature required for credit
payments.
Buyer "signature" will continue to
be required, but within 2 years
most of our customers want
signature capture on a digital
capture device, and within 5 years
we expect there to be demand for
support of the new unique digital
code "signature" now supported
by USA law.
The policy of
virtually all
credit
authorization
companies.
RULE2
Tax rules. Sales require
added taxes. See
government statutes for
current details.
High. Tax laws change annually, at
all government levels.
law
```

---

## Slide 008 — Features [2]

_PDF page 2, handout panel 2_

```text
Features [2]
• A feature is an end-user visible characteristic of a system.
```

---

## Slide 009 — Sub-features

_PDF page 2, handout panel 3_

```text
Sub-features
•
A feature can be decomposed into several sub-features.
•
Relationships between a parent (or compound) feature and its child
features (or sub-features) are categorized as:
–
And — all sub-features must be selected,
–
Alternative — only one sub-feature can be selected,
–
Or — one or more can be selected,
–
Mandatory — features that required, and
–
Optional — features that are optional.
```

---

## Slide 010 — Feature Model

_PDF page 2, handout panel 4_

```text
Feature Model
• A feature model is a hierarchically arranged set of features.

A feature diagram
is a graphical
representation of
a feature model.
```

---

## Slide 011 — Example

_PDF page 2, handout panel 5_

```text
Example
```

---

## Slide 012 — Feature Tree

_PDF page 2, handout panel 6_

```text
Feature Tree
• A feature tree
hierarchically
structures the
set of features
of a system.
• Simpler than
feature model:
only AND
relationship.
```

---

## Slide 013 — Example [3]

_PDF page 3, handout panel 1_

```text
Example [3]
```

---

## Slide 014 — How to Specify a Feature?

_PDF page 3, handout panel 2_

```text
How to Specify a Feature?
User
Business goal
Metric
Action
Kathy (Support)
Costly calls to
customers
Number of call
deflection
Create knowledge
based articles
based on
common search
terms
Michael (HR)
Employee
satisfaction
Number of
candidates for
every job opening
Retention rate
Create integrated
recruiting tool
```

---

## Slide 015 — How to Indentify a Correct Feature?

_PDF page 3, handout panel 3_

```text
How to Indentify a Correct Feature?
• Spot the problem
– Talk to a client
• Talk to two
– Find two other clients in that same industry
• Understand it
– Just listen and understand their problem
• Prototype it
– Walk them through how you imagine it working.
– Are they confused? Are they excited?
• Inspect them
– Build a functioning prototype and watch them use it
```

---

## Slide 016 — Visual-only slide

_PDF page 3, handout panel 4_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 016](assets/03-2-user-requirements/slide-016.png)

---

## Slide 017 — Project Vision and Scope [4]

_PDF page 3, handout panel 5_

```text
Project Vision and Scope [4]
Vision and Scope Document
o
The background, context, overview.
o
The current business use cases.
o
The current domain model.
o
The current users' problems, and their
corresponding objectives.
o
The components and features that will be
developed to obtain the users' objectives.
o
The components and features that will be
excluded.
o
The future business use cases.
o
The future domain model.
o
The assumptions, the risks.
o
The conclusion.
A project vision and scope is the picturing of the project's
deliverable as the solution to the stated need or problem.
Black box solution
```

---

## Slide 018 — Project Scope Statement [5]

_PDF page 3, handout panel 6_

```text
Project Scope Statement [5]
• Project scope statement: The description of the project scope,
major deliverables, assumptions, and constraints.
• The project scope statement tells what work you are—and are
not—going to do in the project.
• Example content:
– Product scope description
– Project exclusions
– Project deliverables
– Project acceptance criteria
– Project constraints
– Project assumptions
```

---

## Slide 019 — Visual-only slide

_PDF page 4, handout panel 1_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 019](assets/03-2-user-requirements/slide-019.png)

---

## Slide 020 — Further Reading

_PDF page 4, handout panel 2_

```text
Further Reading
• David Lorge Parna and Jan Madey (1995). Functional
Documents for Computer Systems.
– NAT, REQ, IN, OUT and SOF.
• Carl A. Gunter et al. (1998). A Reference Model for
Requirements and Specifications.
– WRSPM reference model.
```

---

## Slide 021 — Thank You & See You Again

_PDF page 4, handout panel 3_

```text
Thank You & See You Again
```

---

