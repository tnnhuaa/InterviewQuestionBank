# 05.4. Model-Based Estimation

> Source: `05.4. Model-Based Estimation.pdf`  
> Extracted slides: **60**  
> Structure: one Markdown section per original PowerPoint slide in the 6-up PDF handout.  
> Wording is preserved from the PDF text layer; no outside knowledge was added. Visual-only slides include a cropped image.

## Slide 001 — Model-Based Estimation

_PDF page 1, handout panel 1_

```text
Model-Based Estimation
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
To estimate size in function points.
To estimate size in use case points.
To estimate size in object points.
To estimate size, cost and schedule
using algorithmic models.
```

---

## Slide 003 — Contents

_PDF page 1, handout panel 3_

```text
Contents
I.
Function point analysis.
II.
Use case points.
III.
Object points.
IV.
Algorithmic models.
```

---

## Slide 004 — References

_PDF page 1, handout panel 4_

```text
References
1. Linda M. Laird, M. Carol Brennan (2006). Software
Measurement and Estimation A Practical Approach.
2. AJ Albrecht (1979). Measuring Application
Development Productivity.
3. CR Symons (1988). Function Point Analysis: Difficulties
and Improvements.
4. Mohammed A. Shayib (2013). Applied Statistics.
5. N.H. Bingham and John M. Fry. Regression (2010).
Linear Models in Statistics.
6. Robert T. Futrell et al. (2002). Quality Software Project
Management.
7. Daniel D. Galorath (2006). Software Sizing, Estimation,
and Risk Management.
8. Steve McConnell (2006). Software Estimation:
Demystifying the Black Art. Microsoft Press.
```

---

## Slide 005 — Function Point Analysis [1, 2, 3]

_PDF page 1, handout panel 5_

```text
Function Point Analysis [1, 2, 3]
• Function points — FP is a software metric used to measure
the delivered functionality in a program from user
perspective.
• Function point analysis is a standard method for measuring
software development from the user’s point of view.
```

---

## Slide 006 — Step 1: Determine Type of Function Point Count

_PDF page 1, handout panel 6_

```text
Step 1: Determine Type of Function Point Count
Development project function point count
Enhancement project function point count
Application function point count
```

---

## Slide 007 — Step 2: Determine Application Boundary

_PDF page 2, handout panel 1_

```text
Step 2: Determine Application Boundary
```

---

## Slide 008 — Step 3: Identify Data Functions

_PDF page 2, handout panel 2_

```text
Step 3: Identify Data Functions
Internal Logical File (ILF) – A user-identifiable group of logically related
data or control information utilized and maintained by an application
(tables, flat files, application control information).
External Interface File (EIF) –  A user-identifiable group of logically related
data or control information utilized by the application but
maintained by another application (tables, flat files, application
control information).
The system’s functionality is decomposed into:
```

---

## Slide 009 — Step 4: Identify Transactional Functions

_PDF page 2, handout panel 3_

```text
Step 4: Identify Transactional Functions
External Inputs (EIs) – Any function or transaction that moves data
into an application (data entry by users, data or file feeds by
external applications).
External Outputs (EOs) – Any function or transaction that
manipulates data and presents it to a user (reports, images).
External Inquiries (EQs) – A unique request that results in the
retrieval of data (reports, search).
```

---

## Slide 010 — Step 5: Identify ILF/EIF Complexity

_PDF page 2, handout panel 4_

```text
Step 5: Identify ILF/EIF Complexity
Data Element Types (DETs) – Unique, user-recognizable, non-
repeating fields or attributes, including foreign key
attributes that enter the boundary of the subsystem or
application (fields).
Record Element Types (RETs) – Logical sub-groupings based on
the user’s view of the data (0 RET =  1 RET).
ILF/EIF
1-19 DETs
20-50 DETs
51 + DETs
1 RET
Low
Low
Average
2-5 RETs
Low
Average
High
6+ RETs
Average
High
High
```

---

## Slide 011 — Example

_PDF page 2, handout panel 5_

```text
Example
Field
Count as a DET
UserId
No
Username
Yes
Password
Yes
AddressId
Yes
Total DETs: 3
Total RETs: 1
Complexity:  Low
Field
Count as a DET
AddressId
No
Address
Yes
City
Yes
State
Yes
Zip
Yes
Country
Yes
Total DETs: 5
Total RETs: 0 (1)
Complexity:  Low
```

---

## Slide 012 — Step 6: Identify EIs/EOs/EQs Complexity

_PDF page 2, handout panel 6_

```text
Step 6: Identify EIs/EOs/EQs Complexity
EI
1-4 DETs
5-15 DETs
16 + DETs
0-1 FTR
Low
Low
Average
2 FTRs
Low
Average
Average
3+ FTRs
Average
High
High
EO/EQ
1-5 DETs
6-19 DETs
19+ DETs
0-1 FTR
Low
Low
Average
2-3 FTRs
Low
Average
High
4+ FTRs
Average
High
High
Data Element Types (DETs) – user-recognizable data elements that are
maintained as ILFs by the EIs, appear in the EIs, EQs (data fields,
buttons, search).
File Types Referenced (FTRs) – all ILFS and EIFs referenced or maintained
during the processing of the EIs/EOs/EQs (tables, flat files).
```

---

## Slide 013 — Example

_PDF page 3, handout panel 1_

```text
Example
EI DETs
EI FTRs
Complexity
4
2
Low
EO DETs
EO FTRs
Complexity
2
2
Low
```

---

## Slide 014 — Step 7: Calculate Unadjusted Function Point

_PDF page 3, handout panel 2_

```text
Step 7: Calculate Unadjusted Function Point
Program Characteristic
Low
Complexity
Medium
Complexity
High
Complexity
External Inputs
__ × 3
__ × 4
__ × 6
External Outputs
__ × 4
__ × 5
__ × 7
External Queries
__ × 3
__× 4
__ × 6
Internal Logical Files
__ × 4
__ × 10
__ × 15
External Interface Files
__ × 5
__ × 7
__ × 10
Unadjusted Function Point (UPFs) = Sum of EI FP, EO FP, EQ FP, ILF FP, EIF FP
Program Characteristic
Low Complexity
Medium
Complexity
High Complexity
External Inputs
1 × 3 = 3
0 × 4 = 0
0 × 6 = 0
External Outputs
1 × 4 = 4
0× 5 = 0
0 × 7 = 0
Internal Logical Files
3 × 4 = 8
1 × 10 = 0
0 × 15 = 0
Unadjusted Function Point

15
```

---

## Slide 015 — Step 8: Evaluate General System Characteristic

_PDF page 3, handout panel 3_

```text
Step 8: Evaluate General System Characteristic
F1
Reliable back-up and recovery
0 – 5
F2
Data communications
0 – 5
F3
Distributed functions
0 – 5
F4
Performance
0 – 5
F5
Heavily used configuration
0 – 5
F6
Online data entry
0 – 5
F7
Operational ease
0 – 5
F8
Online update
0 – 5
F9
Complex interface
0 – 5
F10
Complex processing
0 – 5
F11
Reusability
0 – 5
F12
Installation ease
0 – 5
F13
Multiple sites
0 – 5
F14
Facilitate change
0 – 5
Value adjustment factor (VAF)  = 0.65 + 0.01 * Sum(F1,F14)
Adjusted function point (AFP) = UFPs * VAF
```

---

## Slide 016 — Convert Function Points To SLOC

_PDF page 3, handout panel 4_

```text
Convert Function Points To SLOC

Programming Statements per Function Point
Language
Minimum (Minus 1
Standard Deviation)
Mode (Most
Common Value)
Maximum (Plus 1
Standard Deviation)
Ada 83
45
80
125
Ada 95
30
50
70
C
60
128
170
C#
40
55
80
C++
40
55
140
Cobol
65
107
150
Fortran 90
45
80
125
Fortran 95
30
71
100
Java
40
55
80
Macro Assembly
130
213
300
Perl
10
20
30
Second generation default (Fortran 77, Cobol, Pascal, etc.)
65
107
160
Smalltalk
10
20
40
SQL
7
13
15
Third generation default (Fortran 90, Ada 83, etc.)
45
80
125
Microsoft Visual Basic
15
32
41
```

---

## Slide 017 — Pros & Cons of FPA

_PDF page 3, handout panel 5_

```text
Pros & Cons of FPA
•
FPA is independent of language used, development platform.
•
FPA can be executed at the end of each phase/stage of a
project.
•
ISO standard
•
Labor-intensive method
•
Requires significant training and experience to be proficient
•
Functional complexity weights and degrees of influence
determined by trial and debate
```

---

## Slide 018 — Visual-only slide

_PDF page 3, handout panel 6_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 018](assets/05-4-model-based-estimation/slide-018.png)

---

## Slide 019 — Use Case Points

_PDF page 4, handout panel 1_

```text
Use Case Points
System
Use
cases
User
interface
Database
Scenario
Classes
Actors
Another
system via
API
Another
system via
protocol
(TCP/IP)
Person via
Interface
```

---

## Slide 020 — Unadjusted Use Case Weight – UUCW

_PDF page 4, handout panel 2_

```text
Unadjusted Use Case Weight – UUCW
Use Case
Type
Description
Weight
Number
of Use
Cases
Result
Simple
A simple user interface and touches only a single
database entity; its success scenario has 3 steps
or less; its implementation involves less than 5
classes.
5
8
40
Average
More interface design and touches 2 or more
database entities; between 4 to 7 steps; its
implementation involves between 5 to 10
classes.
10
12
120
Complex
Involves a complex user interface or processing
and touches 3 or more database entities; over
seven steps; its implementation involves more
than 10 classes.
15
4
60
Total Unadjusted Use Case Weight
Total
UUCW
220
```

---

## Slide 021 — Unadjusted Actor Weight – UAW

_PDF page 4, handout panel 3_

```text
Unadjusted Actor Weight – UAW
Actor
Type
Description
Weight
Number of
Actors
Result
Simple
The Actor represents
another system with
a defined API
1
8
8
Average
The Actor represents
another system
interacting through a
protocol, like TCP/IP
2
12
24
Complex
The Actor is a person
interacting via an
interface.
3
4
12
Total Unadjusted
Actor Weight
Total UAW
44
```

---

## Slide 022 — Technical Factor

_PDF page 4, handout panel 4_

```text
Technical Factor
Technical
Factor
Description
Weight
Project
Perceived
Complexity
Calculated Factor
(weight*perceive
d complexity)
T1
Distributed System
2
5
10
T2
Performance
1
4
4
T3
End User Efficiency
1
2
2
T4
Complex internal Processing
1
4
4
T5
Reusability
1
2
2
T6
Easy to install
0.5
5
2
T7
Easy to use
0.5
3
2
T8
Portable
2
3
6
T9
Easy to change
1
3
3
T10
Concurrent
1
2
2
T11
Special security features
1
2
2
T12
Provides direct access for third parties
1
5
5
T13
Special user training facilities are required
1
3
3
TCF = 0.6 + (0.01*Total Factor).
0 - 5
47 (Total Factor)
```

---

## Slide 023 — Environment Complexity Factor – ECF

_PDF page 4, handout panel 5_

```text
Environment Complexity Factor – ECF
Environmental
Factor
Description
Weight Perceived
Impact
Calculated Factor
(weight*perceived
complexity)
E1
Familiarity with UML
1.5
4
6
E2
Application Experience
0.5
2
1
E3
Object Oriented
Experience
1
5
5
E4
Lead analyst capability
0.5
2
1
E5
Motivation
1
1
1
E6
Stable Requirements
2
5
10
E7
Part-time workers
-1
0
0
E8
Difficult Programming
language
2
1
2
Environment
Complexity
Factor
ECF = 1.4 + (-0.03*Total
Factor)
Total
Factor
26
```

---

## Slide 024 — Use Case Points

_PDF page 4, handout panel 6_

```text
Use Case Points
•  Adjusted Use Case Points
 AUCPs = UUCP *TCP * ECF

where

UUCP - Unadjusted Use Case Points = UUCW + UUCA

TCF - Technical Complexity Factor.

ECF  - Environment Complexity Factor.
• Effort (person-hours) = AUCPs*PF

where the Productivity Factor (PF) is a ratio of the number of man hours
per use case point based on past projects. If no historical data has been
collected, a figure between 15 and 30 is suggested by industry experts. A
typical value is 20.
```

---

## Slide 025 — Pros & Cons of UC Point

_PDF page 5, handout panel 1_

```text
Pros & Cons of UC Point
Can be done early
Simple, quick, and
transparent
o
The lack of clearly
accepted weights
```

---

## Slide 026 — Visual-only slide

_PDF page 5, handout panel 2_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 026](assets/05-4-model-based-estimation/slide-026.png)

---

## Slide 027 — Object Points

_PDF page 5, handout panel 3_

```text
Object Points
• The system is decomposed into:
– Screens that are displayed
– Reports that are produced by the system
– Third-generation language (3GL) modules - the number of
program modules that must be developed

 Object points are NOT the same as object classes.
```

---

## Slide 028 — Determine Complexity

_PDF page 5, handout panel 4_

```text
Determine Complexity
• Classify each element instance into simple,
medium and difficult complexity levels

Screens
Number and source of data tables
Number of views contained
Total <4
Total <8
Total 8+
<3
simple
simple
medium
3-7
simple
medium
difficult
8+
medium
difficult
difficult
Reports
Number and source of data tables
Number of views contained
Total <4
Total <8
Total 8+
<3
simple
simple
medium
3-7
simple
medium
difficult
8+
medium
difficult
difficult
```

---

## Slide 029 — New Object Points

_PDF page 5, handout panel 5_

```text
New Object Points
• Weight the number in each cell using the
following table.
Object type
Simple
Medium
Difficult
Screen
1
2
3
Report
2
5
8
3GL
component
-
-
10
• Add all the weighted object instances to get
one number, the object points (OP)
• Compute the New Object Points to be
developed, NOP=(OP) (100-%reuse)/100
```

---

## Slide 030 — Example

_PDF page 5, handout panel 6_

```text
Example
Hello World

Weighting Simple
Sum
GUI inputs / screen
1
1
1
GUI outputs /
reports
3
5
15
Number of 3 GL-
Modules
1
10
10

Object Points
26
Reuse 50%
New Object Points
13
Hello world
Hello world
Hello world
```

---

## Slide 031 — Effort Estimation

_PDF page 6, handout panel 1_

```text
Effort Estimation
• COCOMO II - Application composition model:
 Effort (person-month) = NOP/PROD
 where Productivity Rate

Developers
experience
and
maturity
capability
Very low
Low
Nominal
High
Very high
PROD
4
7
13
25
50
```

---

## Slide 032 — Pros & Cons of Object Point

_PDF page 6, handout panel 2_

```text
Pros & Cons of Object Point
Can be done early
Simple, quick, and transparent
o
The lack of clearly accepted weights
```

---

## Slide 033 — Visual-only slide

_PDF page 6, handout panel 3_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 033](assets/05-4-model-based-estimation/slide-033.png)

---

## Slide 034 — Regression Analysis [4, 5]

_PDF page 6, handout panel 4_

```text
Regression Analysis [4, 5]
• The investigator likes to check how variables are related.
• Am I able to predict the value of a random variable if I have
the value of one or more variables available?
• This kind of study is what we call regression analysis.
Scatter Plot
Fitted Line
linear regression
y = a + bx
In multiple regression,
the dependent variable
is considered to depend
on more than a single
independent variable.
```

---

## Slide 035 — Example

_PDF page 6, handout panel 5_

```text
Example
• Estimate the regression line of specific heat on temperature,
and predict the value of the specific heat when the
temperature is 250C.

• n = 5, ⅀xi = 100, mean of x = 20, ⅀yi = 2.85, mean of y = 0.57

⅀xi yi = 59.8, b1 = 0.0028, b0 = 0.514

Hence the fitted equation will be given by ŷ = 0.514 + 0.0028x.

When the temperature x = 250C, the predicted specific heat is
0.514+0.0028*25 = 0.584.
Temp 0C
0
10
20
30
40
Specific Heat 0.51 0.55 0.57 0.59 0.63
```

---

## Slide 036 — 1965 System Development

_PDF page 6, handout panel 6_

```text
1965 System Development
Corporation Cost Model [6]
•
104 attributes of 169 software projects were collected and treated
to extensive statistical analysis.
•
13-parameter linear estimation model:
MM = -33.63
+ 9.15 (Lack of Requirements) (0-2)
+ 10.73 (Stability of Design) (0-3)
+ 0.51 (Percent Math Instructions)
+ 0.46 (Percent Storage/Retrieval Instructions)
+ 0.40 (Number of Subprograms)
+ 7.28 (Programming Language) (0-1)
- 21.45 (Business Application) (0-1)
+ 13.53 (Stand-Alone Program) (0-1)
+ 12.35 (First Program on Computer) (0-1)
+ 58.82 (Concurrent Hardware Development) (0-1)
+ 30.61 (Random Access Device Used) (0-1)
+ 29.55 (Difference Host, Target Hardware) (0-1)
+ 0.54 (Number of Personnel Trips)
- 25.20 (Developed by Military Organization) (0-1).
```

---

## Slide 037 — The Putnam SLIM Model [6, 7]

_PDF page 7, handout panel 1_

```text
The Putnam SLIM Model [6, 7]
•
With regression modeling, the emphasis is on constructing a
formula that best represents scattered data points.
•
In mathematical modeling, the emphasis is on matching the data to
the form of an existing mathematical function.
•
Based on statistical analysis of several thousand projects, Putnam
found that the relationship among the three principal elements of
software estimating—size, schedule, and effort—matched the
Norden/Rayleigh function.

     where
S = software size in LOC
C = environmental factor (constant), dependent on the state of technology
K = total effort for the overall project
td = delivery time constraint (schedule) in years (development time in years)
```

---

## Slide 038 — COnstructive COst MOdel

_PDF page 7, handout panel 2_

```text
COnstructive COst MOdel
• COCOMO is actually a
hierarchy of three
increasingly detailed
models that range from
– a single macro-estimation
scaling model as a function
of product size to
– a micro-estimation model
with a three-level work
breakdown structure and a
set of phase-sensitive
multipliers for each cost
driver attribute.
```

---

## Slide 039 — Project Development Modes

_PDF page 7, handout panel 3_

```text
Project Development Modes
•
The organic mode is typified by systems such as payroll, inventory, and scientific calculation.
•
The semidetached mode is typified by utility systems such as compilers, database systems, and
editors.
•
The embedded mode is typified by real-time systems such as those for air traffic control, ATMs,
or weapon systems.
Mode
Product Size
Project/Team Size
Innovation
Deadline
and
Constraints
Development
Environment
Organic
Typically
2–50 KLOC
Small project, small team—
development team is
familiar with the application
language and tools
Little
Not Tight
Stable,
In-House
Semi–
detached
Typically
50–300 KLOC
Medium project, medium
team—team is average in
terms of abilities
Medium
Medium
Medium
Embedded
Typically
over 300 KLOC
Large project requiring a
large team
Greater
Severe
Constraints
Complex
HW/Customer
Interfaces
```

---

## Slide 040 — Nominal Effort and Schedule

_PDF page 7, handout panel 4_

```text
Nominal Effort and Schedule
Estimation
• Boehm plotted his observed 63 projects.
• Basic level of the COnstructive COst MOdel (COCOMO) uses
only mode and size to determine the effort and schedule.
• It is useful for fast, rough estimates of small to medium-size
projects.
MM: man-months
Size = KDSI = thousands of lines of code
```

---

## Slide 041 — COCOMO Example

_PDF page 7, handout panel 5_

```text
COCOMO Example
• Suppose we are estimating the cost to develop the
microprocessor-based communications processing software
– for a highly ambitious new electronic funds transfer network
– with high reliability, performance, development schedule, and
interface requirements.
• We determine that these characteristics best fit the profile of
an embedded-mode project.
• We next estimate the size of the product as 10,000 delivered
source instructions, or 10 KDSI.
• We then determine that the nominal development effort for
this embedded mode project is

2.8(10)1.20 = 44 man-months (MM).
```

---

## Slide 042 — Intermediate Level

_PDF page 7, handout panel 6_

```text
Intermediate Level
•
Intermediate level uses size, mode, and 15 additional variables to
determine effort.
•
The additional variables are called "cost drivers" and relate to
product, personnel, computer, and project attributes that will result
in more effort or less effort required for the software project.
•
Effort (E) = a x (Size)b x C

C: effort adjustment factor (EAF) There are two steps in determining
this multiplying factor:
– Step 1. is to assign numerical values to the cost drivers.
– Step 2. is to multiply the cost drivers together to generate the effort
adjustment factor, C.
– EAF = C1 x C2 x . . . x Cn, [Ci = ith cost adjustment factor]
```

---

## Slide 043 — Detailed Level

_PDF page 8, handout panel 1_

```text
Detailed Level
•
Detailed level builds upon intermediate COCOMO by introducing
the additional capabilities of phase-sensitive effort multipliers and a
three-level product hierarchy.
•
The program is decomposed into specific products and components
of products.
•
Boehm calls this the three-level product hierarchy:
– system, subsystem, and module.
– Cost drivers are analyzed separately for each component.
•
The project development activities are partitioned into phases.
– Boehm used four major phases: requirements (RQ), product design (PD),
detailed design (DD), and coding and unit test (CUT) for development.
Integration and testing (IT) and maintenance (MN) describe the entire life
cycle.
– Phases may be used to partition systems, subsystems, and/or modules.
```

---

## Slide 044 — COCOMO Drawbacks

_PDF page 8, handout panel 2_

```text
COCOMO Drawbacks
• Estimation of
–object-oriented software,
–software created via spiral or evolutionary
models, and
–applications developed from commercial-
off-the-shelf software.

• Project size or project staff information
```

---

## Slide 045 — COCOMO II

_PDF page 8, handout panel 3_

```text
COCOMO II
• COCOMO II is a revised and extended version of the model,
built upon the original COCOMO.
• During the earliest conceptual stages of a project, the model
uses object point estimates to compute effort.

• During the early design stages, when little is known about
project size or project staff, unadjusted function points are
used as an input to the model.

• After an architecture has been selected, design and
development begin with SLOC input to the model.
```

---

## Slide 046 — COCOMO II Models

_PDF page 8, handout panel 4_

```text
COCOMO II Models
• COCOMO II – The Early Design Model
 Converting FPs to KLOC then use
 Effort = 2.45*KLOC*EAF

• COCOMO II – The Post-Architecture Model
 Converting FPs to KLOC then use
 Effort = 2.55*KLOCB*EAF
```

---

## Slide 047 — Model Calibration

_PDF page 8, handout panel 5_

```text
Model Calibration
• Calibration is the process of determining the deviation from a
standard in order to compute the correction factors.
• Items which can be calibrated in a model include:
– product types,
– operating environments,
– labor rates and factors,
– various relationships between functional cost items.
• Calibration is to
– run the model with normal inputs (known parameters such as
software lines of code) against items for which the actual cost are
known.
– These estimates are then compared with the actual costs and the
average deviation becomes a correction factor for the model.
```

---

## Slide 048 — Other Models [8]

_PDF page 8, handout panel 6_

```text
Other Models [8]
• Albrect–Gaffney: Effort = 13.39 + 0.0545*FP

• Kemerer: Effort = 60.62 + 7.728*(10-8)*FP3

• Matson–Barret–Meltichamp: Effort = 585.7 + 15.12*FP

• Benchmark: Effort = FP / Delivery Rate.

where Delivery Rate - based on the most recent 600 projects.
```

---

## Slide 049 — Effort Activities Estimation

_PDF page 9, handout panel 1_

```text
Effort Activities Estimation
• 11.30%
Requirement
• 8.25%
A&D
• 48.55%
Implementation
• 16.05%
Test
• 2.55%
Deployment
• 6.15%
Management
• 2.03%
Environment
• 1.86%
SCM
• 1.80%
SQA
• 0.63%
Training
• 0.85%
Defect Prev.
```

---

## Slide 050 — Schedule Estimation

_PDF page 9, handout panel 2_

```text
Schedule Estimation
• Schedule = 3*Effort1/3
• Past schedule:

Schedule = PastSchedule*(EstimatedEffort/PastEffort)1/3
• Jones's First-Order estimation practice:

Schedule = FPsX
where x
Kind of software
Better
Average  Worse
Object-oriented software
0.33
0.36
0.39
Client-server software
0.34
0.37
0.40
Business systems, internal intranet systems
0.36
0.39
0.42
Shrink-wrapped, scientific systems, engineering systems,
public internet systems
0.37
0.40
0.43
Embedded systems, telecommunications, device drivers,
systems software
0.38
0.41
0.44
```

---

## Slide 051 — Pros & Cons of Algorithmic Models

_PDF page 9, handout panel 3_

```text
Pros & Cons of Algorithmic Models
Repeatable estimations
Objectively calibrated to previous experience
Various extensions for almost every purpose
Tool support
Poor sizing inputs and inaccurate cost driver
rating will result in inaccurate estimation.
```

---

## Slide 052 — Visual-only slide

_PDF page 9, handout panel 4_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 052](assets/05-4-model-based-estimation/slide-052.png)

---

## Slide 053 — Halstead's Software Science (I)

_PDF page 9, handout panel 5_

```text
Halstead's Software Science (I)
• The measurable and countable properties are :
1) n1 = number of unique or distinct operators appearing in
that implementation
2) n2 = number of unique or distinct operands appearing in
that implementation
3) N1 = total usage of all of the operators appearing in that
implementation
4) N2 = total usage of all of the operands appearing in that
implementation
```

---

## Slide 054 — Halstead's Software Science (II)

_PDF page 9, handout panel 6_

```text
Halstead's Software Science (II)
• The vocabulary n = n1 + n2
• The implementation length N = N1 + N2
• Volume V = n1log2n1 + n2log2n2
• Difficulity D = (n1/2) * (N2 / n2)
• Effort E = D*V
• Schedules S = ( n1N2( n1log2n1 + n2log2n2) log2n) / 2n2S, where
S from 5 to 20.
```

---

## Slide 055 — Pros & Cons of Halstead's Method

_PDF page 10, handout panel 1_

```text
Pros & Cons of Halstead's Method
 Depends on
completed code
 No predictive
 Simple to
calculate
 Can be used for
any programming
language
```

---

## Slide 056 — Visual-only slide

_PDF page 10, handout panel 2_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 056](assets/05-4-model-based-estimation/slide-056.png)

---

## Slide 057 — Measurement vs. Rating

_PDF page 10, handout panel 3_

```text
Measurement vs. Rating
• A measurement is objective and can be manipulated
mathematically.
• A rating is subjective and cannot be manipulated
mathematically.
• FPs, UCPs, OPs are a rating, not a measurement.
– 1 (2000 FPs Application) = 2 * (1000 FPs Application)???
– If a team completes an application of 250 FP in 10 weeks, then
they can complete an application 500 FPs in 20 weeks???
– How about complexity between 100 FPs application and 50 FPs
application???
```

---

## Slide 058 — Visual-only slide

_PDF page 10, handout panel 4_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 058](assets/05-4-model-based-estimation/slide-058.png)

---

## Slide 059 — Further Reading

_PDF page 10, handout panel 5_

```text
Further Reading
• McCabe's Cyclomatic Number.
• Fan-In Fan-Out Complexity - Henry's and Kafura's.
• Defects Estimation.
• Reliability Estimation.
```

---

## Slide 060 — Thank You & See You Again

_PDF page 10, handout panel 6_

```text
Thank You & See You Again
```

---

