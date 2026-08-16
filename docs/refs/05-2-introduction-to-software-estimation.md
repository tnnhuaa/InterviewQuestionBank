# 05.2. Introduction To Software Estimation

> Source: `05.2. Introduction To Software Estimation.pdf`  
> Extracted slides: **62**  
> Structure: one Markdown section per original PowerPoint slide in the 6-up PDF handout.  
> Wording is preserved from the PDF text layer; no outside knowledge was added. Visual-only slides include a cropped image.

## Slide 001 — Introduction to

_PDF page 1, handout panel 1_

```text
Introduction to
Software Estimation
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
To communicate in software estimation
field.
To estimate size and effort using
counting, computing, and judging
method.
To estimate size and effort using
analogy method.
To estimate size and effort using
structured expert judgment method.
```

---

## Slide 003 — Contents

_PDF page 1, handout panel 3_

```text
Contents
I.
Software Size Metrics.
II.
Count, Compute, Judge.
III.
Estimation by Analogy.
IV.
Structured Expert Judgment.
```

---

## Slide 004 — References

_PDF page 1, handout panel 4_

```text
References
1. Steve McConnell (2006). Software Estimation:
Demystifying the Black Art. Microsoft Press.
2. Jonathan Rasmusson (2010). The Agile
Samurai: How Agile Masters Deliver Great
Software. Pragmatic Bookshelf.
```

---

## Slide 005 — Problems

_PDF page 1, handout panel 5_

```text
Problems
• You have relatively good requirements (25 use cases or 80
user stories).
• How long will it take to develop the system.
• What is the cost?
• How many people do you need to develop the system?
• How much is your team’s productivity?
```

---

## Slide 006 — Software Estimation [1]

_PDF page 1, handout panel 6_

```text
Software Estimation [1]
Software estimation is the act of predicting size,
duration and cost of a project.
Who needs it?
Project
Managers
Customers
Managers
Architects
Developers
Testers
Researchers
```

---

## Slide 007 — How Big is Your Software?

_PDF page 2, handout panel 1_

```text
How Big is Your Software?
• When will you complete your project if there is only you
working on the project?
• Effort = staff × time
```

---

## Slide 008 — Source Lines of Code (SLOC)

_PDF page 2, handout panel 2_

```text
Source Lines of Code (SLOC)
• Source lines of code — SLOC is a software metric used to
measure the amount of code in a program.
```

---

## Slide 009 — How many SLOC does your Project Have?

_PDF page 2, handout panel 3_

```text
• Well . . . it depends on how you count.
– Physical SLOC
– LOC (lines of code), SLOC (Source lines of code), logical SLOC — non-
blank, non-comment, logical source lines. KLOC = 1000*LOC, KSLOC =
1000*SLOC
– ELOC (Executable lines of code), DSI (Delivered source instructions) —
SLOC but excludes data declarations, compiler declarations, and other
lines that do not generate executable instructions.
– ESLOC (Effective source lines of code) — SLOC that have been adjusted
by the amount of rework required for portions of the system that were
pre-existing at the start of the development.
• Reused code
• Language productivity factor
How many SLOC does your Project Have?
```

---

## Slide 010 — Pros & Cons of SLOC

_PDF page 2, handout panel 4_

```text
Pros & Cons of SLOC
Well understood, easy to
count
Correlates well with
functionality and effort
Other metrics can be
derived from the SLOC
metric: productivity
(SLOC/(staff*month)) ,
quality (defects/SLOC)
measurements
No SLOC exist at the
onset of a project
At micro-level, SLOC
can be misleading
```

---

## Slide 011 — Other Metrics

_PDF page 2, handout panel 5_

```text
Other Metrics
• Story point
• Function points — FP is a software metric used to measure
the delivered functionality in a program from user
perspective.
• Use case point, object point
```

---

## Slide 012 — Why Measure Software Size?

_PDF page 2, handout panel 6_

```text
Why Measure Software Size?
You cannot plan if you cannot measure, and if you fail
to plan, you have planned to fail.
Request for proposals
Contract negotiations
Planning and scheduling
Monitoring and control

(productivity = size/time

quality = defects/size)
```

---

## Slide 013 — Estimate vs. Commitment

_PDF page 3, handout panel 1_

```text
Estimate vs. Commitment
• An estimate is a prediction of how long a project will take or
how much it will cost.
• A target is a statement of a desirable business objective.
– These functions need to be completed by July 1 so that we'll be in
compliance with government regulations.
• A commitment is a promise to deliver defined functionality at
a specific level of quality by a certain date.
• Do not assume that the commitment has to be the same as
the estimate.
```

---

## Slide 014 — Why Software Estimation?

_PDF page 3, handout panel 2_

```text
Why Software Estimation?
• It is to determine whether a project's targets are
realistic enough to allow the project to be controlled
to meet them.
• It is used for making commitment.
```

---

## Slide 015 — What If My Estimate is Not Correct

_PDF page 3, handout panel 3_

```text
What If My Estimate is Not Correct
Can You Beat the Cone?
The Cone of Uncertainty
```

---

## Slide 016 — The Cone Doesn't Narrow Itself

_PDF page 3, handout panel 4_

```text
The Cone Doesn't Narrow Itself
• If the project is not well controlled, or if the estimators aren't
very skilled, estimates can fail to improve.
• The Cone narrows only as you make decisions that eliminate
variability.
• Meaningful commitments are not possible in the early, wide
part of the Cone.
```

---

## Slide 017 — Again [2]

_PDF page 3, handout panel 5_

```text
Again [2]
```

---

## Slide 018 — Iterative Development

_PDF page 3, handout panel 6_

```text
Iterative Development
• You'll go through a miniature Cone on each iteration.
• What you give up with approaches that leave requirements
undefined until the beginning of each iteration is long-range
predictability.
• Your business might prioritize that flexibility highly, or it might
prefer that your projects provide more predictability.
• The alternative to total iteration is not no iteration. The
alternatives are less iteration or different iteration.
• Less iteration: Staged delivery.
• Different iteration: Rational Unified Process.
```

---

## Slide 019 — Visual-only slide

_PDF page 4, handout panel 1_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 019](assets/05-2-introduction-to-software-estimation/slide-019.png)

---

## Slide 020 — Inputs for Estimation

_PDF page 4, handout panel 2_

```text
Inputs for Estimation
• There is really no way we can expect the technique to
compensate for our lack of definition or understanding of
the software job to be done.
• The inputs do not need to be detailed requirements.
```

---

## Slide 021 — Visual-only slide

_PDF page 4, handout panel 3_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 021](assets/05-2-introduction-to-software-estimation/slide-021.png)

---

## Slide 022 — Count, Compute, Judge [1]

_PDF page 4, handout panel 4_

```text
Count, Compute, Judge [1]
• How many students are there?
• Count if at all possible.
• Compute when you can't count.
• Use judgment alone only as a last resort.
```

---

## Slide 023 — 1. Decide What to Count

_PDF page 4, handout panel 5_

```text
1. Decide What to Count
• Find something to count that's available sooner.
• Find something you can count with minimal effort.
• Examples:
– Marketing requirements
– Features
– Use cases
– Stories
– Web pages, dialog boxes
– Reports
– Database tables
```

---

## Slide 024 — 2. Convert Counts to Estimates

_PDF page 4, handout panel 6_

```text
2. Convert Counts to Estimates
•
If you collect historical data related to counts, you can convert the
counts to something useful, such as estimated effort.
• If you don't currently have historical data, begin collecting it
as soon as possible.
Quantity to Count
Historical Data
Marketing requirements Average effort hours per requirement for
development
Features
Average effort hours per feature for
development
Use cases
Average total effort hours per use case
Stories
Average total effort hours per story
Web pages
Average effort per Web page for user interface
work
```

---

## Slide 025 — 3. Use Judgment only as a Last Resort

_PDF page 5, handout panel 1_

```text
3. Use Judgment only as a Last Resort
```

---

## Slide 026 — Example (I)

_PDF page 5, handout panel 2_

```text
Example (I)
• Converting a .NET website (*.aspx, *.cs) to JEE
• Counts:
– Open powershell and execute below command
(gci -include *.aspx, *.skin, *.master, *.ascx -
recurse | select-string .).Count
– 45 aspx files, 6996 lines of code
(gci -include *.cs, *.config -recurse | select-
string .).Count
– 50 cs files, 12232 lines of code
```

---

## Slide 027 — Example (II)

_PDF page 5, handout panel 3_

```text
Example (II)
• Judgment:
• 45 aspx files, 6996 lines of code
• 20-day UI conversion
– 50 cs files, 12232 lines of code
• 30-day code conversion
– JEE frameworks and tools investigation and review
• 10-day
```

---

## Slide 028 — Tools

_PDF page 5, handout panel 4_

```text
Tools
• VS Code Counter
–
https://marketplace.visualstudio.com/items?itemName=uctakeoff.vscode-counter

• Get Lines of Code from GitHub
– https://codetabs.com/count-loc/count-loc-online.html
• Tokei
– https://github.com/XAMPPRocky/tokei
```

---

## Slide 029 — Visual-only slide

_PDF page 5, handout panel 5_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 029](assets/05-2-introduction-to-software-estimation/slide-029.png)

---

## Slide 030 — Estimation by Analogy

_PDF page 5, handout panel 6_

```text
Estimation by Analogy
```

---

## Slide 031 — 1. Get Detailed Size, Effort, and Cost

_PDF page 6, handout panel 1_

```text
1. Get Detailed Size, Effort, and Cost
Results for a Similar Previous Project
Old Project
Database
5,000 lines of code (LOC) 10 tables
User interface
14,000 LOC
14 Web pages
Graphs and reports 9,000 LOC
10 graphs + 8
reports
Foundation classes 4,500 LOC
15 classes
Business rules
11,000 LOC
???
TOTAL
43,500 LOC
```

---

## Slide 032 — 2. Compare the Size of the New Project

_PDF page 6, handout panel 2_

```text
2. Compare the Size of the New Project
to a Similar Past Project
Subsystem
Actual Size of
Old Project
Estimated Size
of New Project
Multiplication
Factor
Database
10 tables
14 tables
1.4
User interface
14 Web pages
19 Web pages
1.4
Graphs and
reports
10 graphs + 8
reports
14 graphs + 16
reports
1.7
Foundation
classes
15 classes
15 classes
1.0
Business rules
???
???
1.5
```

---

## Slide 033 — 3. Build Up the Estimate for the New Project's

_PDF page 6, handout panel 3_

```text
3. Build Up the Estimate for the New Project's
Size as a Percentage of the Old Project's Size
Subsystem
Old Project Multiplication Factor  New Project
Database
5,000
1.4
7,000
User interface
14,000
1.4
19,600
Graphs and reports 9,000
1.7
15,300
Foundation classes 4,500
1.0
4,500
Business rules
11,000
1.5
16,500
TOTAL
43,500
-
62,900
```

---

## Slide 034 — 4. Create an Effort Estimate Based on the Size of the

_PDF page 6, handout panel 4_

```text
4. Create an Effort Estimate Based on the Size of the
New Project Compared to the Previous Project
Term
Value
Size of New Project
62,900 LOC
Size of Old Project
÷ 43,500 LOC
Size ratio
= 1.45
Effort for Old Project
× 30 staff months
Estimated effort for New
Project
= 44 staff months
```

---

## Slide 035 — 5. Check for Consistent Assumptions

_PDF page 6, handout panel 5_

```text
5. Check for Consistent Assumptions
Across the Old and the New Project
Unique
properties
Technology
Team
Members
Kinds Of
Software
```

---

## Slide 036 — Pros & Cons of Analogy

_PDF page 6, handout panel 6_

```text
Pros & Cons of Analogy
Simple, accurate, cheap
Based on proven characteristics
o
Impossible if no comparable project has been
tackled.
o
The need to determine the most important
variables to be used for describing the solution.
```

---

## Slide 037 — Visual-only slide

_PDF page 7, handout panel 1_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 037](assets/05-2-introduction-to-software-estimation/slide-037.png)

---

## Slide 038 — Structured Expert Judgment

_PDF page 7, handout panel 2_

```text
Structured Expert Judgment
• "intuitive expert judgment" tends to be inaccurate.
• "structured expert judgment," can produce estimates that are
about as accurate as model-based estimates.
```

---

## Slide 039 — Who Creates the Estimates?

_PDF page 7, handout panel 3_

```text
Who Creates the Estimates?
To create the task-level estimates,
have the people who will actually
do the work create the estimates.
Expert Estimator
Expert development, quality
assurance, and documentation
staff
```

---

## Slide 040 — Estimation by Decomposition

_PDF page 7, handout panel 4_

```text
Estimation by Decomposition
Feature
Estimated Staff Weeks to Complete
Feature 1
1.5
Feature 2
4
Feature 3
3
Feature 4
1
Feature 5
4
Feature 6
6
Feature 7
2
Feature 8
1
Feature 9
3
Feature 10
1.5
TOTAL
27
```

---

## Slide 041 — Decomposition via an

_PDF page 7, handout panel 5_

```text
Decomposition via an
Activity-Based WBS
Category
Create/Do  Plan  Manage  Review  Rework  Report Defects
General management
•
•
•
•

Planning
•

•
•
•

Corporate activities (meetings, vacation, holidays, and so on) •

Hardware setup/Software setup/Maintenance
•
•
•
•
•
•
Staff preparation
•
•
•
•

Technical Processes/Practices
•
•
•
•
•
•
Requirements work
•
•
•
•
•
•
Coordinate with other projects
•
•
•
•

Change management
•
•
•
•
•
•
User-interface prototyping
•
•
•
•
•
•
Architecture work
•
•
•
•
•
•
Detailed designing
•
•
•
•
•
•
Coding
•
•
•
•
•
•
Component acquisition
•
•
•
•
•
•
Automated build
•
•
•
•
•
•
Integration
•
•
•
•
•
•
Manual system tests
•
•
•
•
•
•
Automated system tests
•
•
•
•
•
•
Software release (interim, alpha, beta, and final releases)
•
•
•
•
•
•
Documents (user docs, technical docs)
•
•
•
•
•
•
```

---

## Slide 042 — How Many Items?

_PDF page 7, handout panel 6_

```text
How Many Items?
• Very early in a project, it can be a struggle to get enough
detailed information to create a decomposed estimate.
• Later in the project, you might have too much detail.
• You need 5 to 10 individual items before you get much benefit
from the Law of Large Numbers, but even 5 items are better
than 1.
```

---

## Slide 043 — Task Granularity

_PDF page 8, handout panel 1_

```text
Task Granularity
• One of the best ways to improve the accuracy of task-level
estimates is to separate large tasks into smaller tasks.
• When estimating at the task level, decompose estimates into
tasks that will require no more than about 2 days of effort.
• Ending up with estimates that are at the 1/4 day, 1/2 day, or
full day of granularity is appropriate.
```

---

## Slide 044 — Why Does It Works?

_PDF page 8, handout panel 2_

```text
Why Does It Works?
– The Law of Large Numbers
Feature
Estimated Staff
Weeks to
Complete
Actual Effort
Raw Error
Magnitude of
Relative Error
Feature 1
1.5
3.0
-1.5
50%
Feature 2
4.5
2.5
2.0
80%
Feature 3
3
1.5
1.5
100%
Feature 4
1
2.5
-1.5
60%
Feature 5
4
4.5
-0.5
11%
Feature 6
6
4.5
1.5
33%
Feature 7
2
3.0
-1.0
33%
Feature 8
1
1.5
-0.5
33%
Feature 9
3
2.5
0.5
20%
Feature 10
1.5
3.5
-2.0
57%
TOTAL
27
29
-2
-
Average
-
-
-7%
46%
```

---

## Slide 045 — The Issue of Best Case Estimates

_PDF page 8, handout panel 3_

```text
The Issue of Best Case Estimates
•
The root cause is a
combination of the "90%
confident" problem.
•
When developers are asked
to provide single-point
estimates, they often
unconsciously present Best
Case estimates.
•
P(F1 completed on time)

= 0.25 (not bad)
•
P (All completed on time) =
P(F1)*P(F2)*P(F3)*…*P(F10)
= 0.000095% (extremely
small)
•
Solution: ?
Feature
Estimated
Staff Weeks
to Complete  Actual Effort
Feature 1
1.6
3.0
Feature 2
1.8
2.5
Feature 3
2.0
1.5
Feature 4
0.8
2.5
Feature 5
3.8
4.5
Feature 6
3.8
4.5
Feature 7
2.2
3.0
Feature 8
0.8
1.5
Feature 9
1.6
2.5
Feature 10
1.6
3.5
TOTAL
20.0
29.0
```

---

## Slide 046 — Solution: Use of Ranges

_PDF page 8, handout panel 4_

```text
Solution: Use of Ranges
Feature
Estimated Days to Complete
Best Case
Worst Case
Feature 1
1.25
2.0
Feature 2
1.5
2.5
Feature 3
2.0
3.0
Feature 4
0.75
2.0
Feature 5
0.5
1.25
Feature 6
0.25
0.5
Feature 7
1.5
2.5
Feature 8
1.0
1.5
Feature 9
0.5
1.0
Feature 10
1.25
2.0
TOTAL
10.5
18.25
Should we
use the
mathematic
al midpoint?
```

---

## Slide 047 — Formulas

_PDF page 8, handout panel 5_

```text
Formulas
• In many cases, the Worst Case is
much worse than what's called
the Expected Case.
• Taking the midpoints of the
ranges could result in an
unnecessarily high estimate.
Expected Case = (Optimistic + (4 X Most Likely) + Pessimistic)/6
• You can estimate the Most Likely Case using expert
judgment.
• You then calculate the Expected Case using this formula
(Program Evaluation and Review Technique (PERT)):
```

---

## Slide 048 — Example

_PDF page 8, handout panel 6_

```text
Example
Feature
Estimated Days to Complete
Best Case (25%
Likely)
Most Likely
Case
Worst Case
(75% Likely)
Expected Case (50%
Likely)
Feature 1
1.25
1.5
2.0
1.54
Feature 2
1.5
1.75
2.5
1.83
Feature 3
2.0
2.25
3.0
2.33
Feature 4
0.75
1
2.0
1.13
Feature 5
0.5
0.75
1.25
0.79
Feature 6
0.25
0.5
0.5
0.46
Feature 7
1.5
2
2.5
2.00
Feature 8
1.0
1.25
1.5
1.25
Feature 9
0.5
0.75
1.0
0.75
Feature 10 1.25
1.5
2.0
1.54
TOTAL
10.5
13.25
18.25
13.62
```

---

## Slide 049 — Percentage Confident

_PDF page 9, handout panel 1_

```text
Percentage Confident
Percentage Confident  Calculation
2%
Expected case - (2 x StandardDeviation)
10%
Expected case - (1.28 x StandardDeviation)
16%
Expected case - (1 x StandardDeviation)
20%
Expected case - (0.84 x StandardDeviation)
25%
Expected case - (0.67 x StandardDeviation)
30%
Expected case - (0.52 x StandardDeviation)
40%
Expected case - (0.25 x StandardDeviation)
50%
Expected case
60%
Expected case + (0.25 x StandardDeviation)
70%
Expected case + (0.52 x StandardDeviation)
75%
Expected case + (0.67 x StandardDeviation)
80%
Expected case + (0.84 x StandardDeviation)
84%
Expected case + (1 x StandardDeviation)
90%
Expected case + (1.28 x StandardDeviation)
98%
Expected case + (2 x StandardDeviation)
```

---

## Slide 050 — Checklist for Individual Estimates

_PDF page 9, handout panel 2_

```text
Checklist for Individual Estimates
• Is what's being estimated clearly defined?
• Does the estimate include all the kinds of work
needed to complete the task?
• Does the estimate include all the functionality
areas needed to complete the task?
• Is the estimate broken down into enough
detail to expose hidden work?
• Did you look at documented facts (written
notes) from past work rather than estimating
purely from memory?
• Is the estimate approved by the person who
will actually do the work?
```

---

## Slide 051 — Compare Estimates to Actuals

_PDF page 9, handout panel 3_

```text
Compare Estimates to Actuals
•
Keep a list of your estimates, and fill in your actual results when you
complete them.
•
Then compute the Magnitude of Relative Error (MRE) of your estimates.
•
When you compare your actual performance to your estimates, you
should try to understand what went right, what went wrong, what you
overlooked, and how to avoid making those mistakes in the future.
Estimated Days to Complete

Feature
Best Case
Worst Case
Expected
Case
Actual
Outcome
MRE
In Range
from Best
Case to
Worst Case?
Feature 1
1.25
2
1.54
2
23%
Yes
Feature 2
1.5
2.5
1.83
2.5
27%
Yes
Feature 3
2
3
2.33
1.25
87%
No
```

---

## Slide 052 — Pros & Cons of Expert Opinion

_PDF page 9, handout panel 4_

```text
Pros & Cons of Expert Opinion
Cannot be
quantified
Requires experts
Can be used in
a new business area,
new technology, or
a brand-new kind of
software
```

---

## Slide 053 — Visual-only slide

_PDF page 9, handout panel 5_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 053](assets/05-2-introduction-to-software-estimation/slide-053.png)

---

## Slide 054 — Top-Down and Bottom-Up [1]

_PDF page 9, handout panel 6_

```text
Top-Down and Bottom-Up [1]
Start at the
component level and
estimate the effort
required for each
component. Add
these efforts to reach
a final estimate.
Start at the system
level and assess the
overall system
functionality and how
this is delivered
through sub-systems.
Any of these approaches may be used top-down or bottom-up.
Usable when the architecture of the system is
known and components identified.
It may underestimate the costs of system level
activities such as integration and
documentation.
Usable without knowledge of the system
architecture and the components that
might be part of the system.
Can underestimate the cost of solving
difficult low-level technical problems.
```

---

## Slide 055 — Question 1

_PDF page 10, handout panel 1_

```text
Question 1
• Is it better to overestimate or underestimate?
```

---

## Slide 056 — Answer 1

_PDF page 10, handout panel 2_

```text
Answer 1
```

---

## Slide 057 — Question 2

_PDF page 10, handout panel 3_

```text
Question 2
• In most of the companies, presales and marketing gurus will
set the figures and the due date even before you start
communicating with your client as proceed to the analysis
phase.
• My question is when you can do the estimation.
```

---

## Slide 058 — Answer 2

_PDF page 10, handout panel 4_

```text
Answer 2
• In that case you can use “Price to Win” technique.
• The estimated effort depends upon the customer's budget
and not on the software functionality.
• The estimate is made as low as necessary to win the job.
• When you're asked to provide an estimate, determine
whether you're supposed to be estimating or figuring out how
to hit a target.
• "The price-to-win technique has won a large number of
software contracts for a large number of software
companies. Almost all of them are out of business
today."[Boehm 81], p337.
```

---

## Slide 059 — Question3

_PDF page 10, handout panel 5_

```text
Question3
•
EXECUTIVE: How long do you think this project will take? We need
to have this software ready in 3 months for a trade show. I can't
give you any more team members, so you'll have to do the work
with your current staff. Here's a list of the features we'll need.
•
PROJECT LEAD: OK, let me crunch some numbers, and get back to
you.
•
Later…
•
PROJECT LEAD: We've estimated the project will take 5 months.
•
EXECUTIVE: Five months!? Didn't you hear me? I said we needed to
have this software ready in 3 months for a trade show!
•
PROJECT LEAD: ???
```

---

## Slide 060 — Answer 3

_PDF page 10, handout panel 6_

```text
Answer 3
• Software may be priced (estimated) to gain a
contract and the functionality adjusted to the price.
```

---

## Slide 061 — Best Practices

_PDF page 11, handout panel 1_

```text
Best Practices
• Using more than one estimation technique.
• Including risk impact.
```

---

## Slide 062 — Thank You & See You Again

_PDF page 11, handout panel 2_

```text
Thank You & See You Again
```

---

