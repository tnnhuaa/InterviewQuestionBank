# 11. Software Quality Management

> Source: `11. Software Quality Management.pdf`  
> Extracted slides: **59**  
> Structure: one Markdown section per original PowerPoint slide in the 6-up PDF handout.  
> Wording is preserved from the PDF text layer; no outside knowledge was added. Visual-only slides include a cropped image.

## Slide 001 — Software Quality

_PDF page 1, handout panel 1_

```text
Software Quality
Management
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
To meet business, user and technical
requirements
To measure quality characteristics of a
product, a project, a process and a
person
To present what is quality, how to
perform quality management and why
quality management is important
To create a quality management plan
To present key concepts of ISO 9001
```

---

## Slide 003 — Contents

_PDF page 1, handout panel 3_

```text
Contents
I.
Quality characteristics
II.
Quality metrics
III.
Quality measurement
IV.
Quality standards
V.
Quality management
```

---

## Slide 004 — References

_PDF page 1, handout panel 4_

```text
References
1. J.A. McCall et al. (1977). Factors in Software Quality.
2. Robert T. Futrell et al. (2002). Quality Software Project
Management.
3. Shari Lawrence Pfleeger et al. (1997). Status Report on
Software Measurement.
4. Stephen H. Kan. (2002). Metrics and Models in
Software Quality Engineering.
5. G. Canfora et al. (2005). A Family of Experiments to
Validate Metrics for Software Process Models.
6. Paul Pocatilu (2007). IT Project Management Metrics.
7. ISO (2008). Guidance on the Documentation
Requirements of ISO 9001.
8. Aston. 14 Steps to Implementing ISO 9001 Quality
Management System.
```

---

## Slide 005 — Why Do Projects Fail?

_PDF page 1, handout panel 5_

```text
Why Do Projects Fail?
• Product delivered  Client/Sponsor/Users  Not Accepted.
• Product  Low Quality  No Usage  Failure.
• Highest Quality  Not Necessary (High Cost).
• Goal: Acceptable Quality and Cost.
```

---

## Slide 006 — How to Meet Business Requirements

_PDF page 1, handout panel 6_

```text
How to Meet Business Requirements
• Budget and revenue
• Baselines and standards:
– Similar systems (to be compared with)
```

---

## Slide 007 — How to Meet User Requirements

_PDF page 2, handout panel 1_

```text
How to Meet User Requirements
• Problems solved? Objectives achieved?
• Baselines/standards:
– Examples (to be compared with)
– Real world manual business processes (no software): Yes/No
– Prototype (workflow/story map)  Exploratory tests
(workflow/story map + BAD/MALICIUOS inputs/Hacking)

• Test cases?
• Use cases?
• Quality of
test cases!!!
```

---

## Slide 008 — Example: Performance Requirements

_PDF page 2, handout panel 2_

```text
Example: Performance Requirements
• Response: Standard 3s
• CPU usage: Standard 25%
• RAM usage: Standard 600Mb
```

---

## Slide 009 — How to Meet Technical Requirements

_PDF page 2, handout panel 3_

```text
How to Meet Technical Requirements
• Definition of done?
• Coding standards,
coding conventions?
• Unit tests?
• Examples?
• Experts?
Quality of unit tests!!!
```

---

## Slide 010 — Example: Security Requirements

_PDF page 2, handout panel 4_

```text
Example: Security Requirements
• Server
– ? (OS)
• Code
– ? (Penetration Testing,
Components)
• Protocols:
– ? (TLS 1.2)
```

---

## Slide 011 — How to Meet Document and

_PDF page 2, handout panel 5_

```text
How to Meet Document and
Process Quality Requirements?
What is mechanism for specifying
the quality of documents or process.
```

---

## Slide 012 — Products, Process, Project

_PDF page 2, handout panel 6_

```text
Products, Process, Project
and Environment Quality
• Program & Source Code
• Software Requirements Specification
• Software Design Specification
• Software Testing Specification
• Software Development Process
• Software Project Plan
• Software Risk Management Plan
• Software Quality Assurance Plan
• Software Team
• Environment
```

---

## Slide 013 — Visual-only slide

_PDF page 3, handout panel 1_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 013](assets/11-software-quality-management/slide-013.png)

---

## Slide 014 — 1. Select a Product

_PDF page 3, handout panel 2_

```text
1. Select a Product
• In fact, select any artifact.
```

---

## Slide 015 — What is Quality?

_PDF page 3, handout panel 3_

```text
What is Quality?
• Quality is the degree to which a set of inherent characteristics
fulfills requirements (need or expectation).
```

---

## Slide 016 — External Quality Characteristics [1]

_PDF page 3, handout panel 4_

```text
External Quality Characteristics [1]
•
CORRECTNESS. Extent to which a program satisfies its specifications and fulfills the user's mission
objectives.
•
RELIABILITY Extent to which a program can be expected to perform its intended function with
required precision.
•
EFFICIENCY The mount of computing resources and code required by a program to perform a
function.
•
INTERITY Extent to which access to software or data by unauthorized persons can be controlled.
•
USABILITY Effort required to learn, operate, prepare input, and interpret output of a program.
•
MAINTAINAILITY Effort required to locate and fix an error in an operational program.
•
TESTABILTY Effort required to test a program to insure it performs its intended function.
•
FLEXIBILITY Effort required to modify an operational program.
•
PORTABILITY Effort required to transfer a program from one hardware configuration and/or
software system environment to another.
•
REUSABILITY Extent to which a program can be used in other applications - related to the packaging
and scope of the functions that programs perform.
•
INTEROPEABILITY Effort required to couple one system with another.
Characteristic – A condition which actively contributes to the
quality of the software.
```

---

## Slide 017 — ISO 9126 Quality Characteristics [2]

_PDF page 3, handout panel 5_

```text
ISO 9126 Quality Characteristics [2]
Quality Characteristic
Subcharacteristic
Functionality
(Are the required functions available in the software?)
Functionality is the set of attributes that bear on the existence of a set of functions and their
specified properties.
Suitability
Accuracy
Interoperability
Security
Reliability
(How reliable is the software?)
Reliability is the set of attributes that bear on the capability of software to maintain its level of
performance under stated conditions for a stated period of time.
Maturity
Fault tolerance
Recoverability
Usability
(Is the software easy to use?)
Usability is the set of attributes that bear on the effort needed for use, and on the individual
assessment of such use, by a stated or implied set of users.
Understandability
Learnability
Operability
Attractiveness
Efficiency
(How efficient is the software?)
Time behavior
Resource behavior
Maintainability
(How easy is it to modify the software?)
Analyzability
Changeability
Stability
Testability
Portability
(How easy is it to transfer the software to another operating environment?)
Adaptability
Installability
Coexistence
Replace-ability
```

---

## Slide 018 — 2. Select Quality Characteristics

_PDF page 3, handout panel 6_

```text
2. Select Quality Characteristics
• How many characteristics?
```

---

## Slide 019 — 3. Define Metrics

_PDF page 4, handout panel 1_

```text
3. Define Metrics
•
Software measurement gathers information about the software product,
process, project and environment.
•
We have to turn our vague ideas about quality into something
measurable.
•
Example: Software quality characteristics
– Correctness (vague idea)
• Test cases (measurable quantities)
– Number of passed test cases (counts, metrics)
– Usability (vague idea)
• Time taken to learn how to use system (measurable quantities)
– Average learning time of 100 users (counts, metrics)
```

---

## Slide 020 — Data

_PDF page 4, handout panel 2_

```text
Data
Qualitative  Data
Quantitative Data
•
robust aroma
•
frothy appearance
•
strong taste
•
12 ounces of latte
•
serving temperature 150º F.
•
serving cup 7 inches in height
•
cost $4.95
```

---

## Slide 021 — A Test

_PDF page 4, handout panel 3_

```text
A Test
• The age of your car.

• The number of hairs on your knuckle.

• The softness of a cat.

• The color of the sky (expressed as blue,
hazel, brown, etc.).

• The number of pennies in your pocket.
```

---

## Slide 022 — Answers

_PDF page 4, handout panel 4_

```text
Answers
•
The age of your car.
‒ Quantitative.
•
The number of hairs on your knuckle.
‒ Quantitative.
•
The softness of a cat.
‒ Qualitative.
•
The color of the sky (expressed as blue,
hazel, brown, etc.).
‒ Qualitative.
•
The number of pennies in your pocket.
‒ Quantitative.
```

---

## Slide 023 — 5. Select Evaluation Method

_PDF page 4, handout panel 5_

```text
5. Select Evaluation Method
Qualitative  Measurement
Quantitative Measurement
•
Deals with descriptions
(words, categories).
•
Data can be observed but
not measured.
•
Colors, textures, smells,
tastes, appearance, beauty,
etc.
•
'Good job!' or 'He wasn't
very nice.'
•
Qualitative → Quality
•
Qualitative measurement
collects information that is
not numerical.
•
Deals with numbers.

•
Data which can be
measured.
•
Length, height, area, volume,
weight, speed, time,
temperature, humidity,
sound levels, cost, members,
ages, etc.
•
Quantitative → Quantity
•
Quantitative measurement is
measurement of data that
can be put into numbers.
```

---

## Slide 024 — 6. Define Quality Requirements

_PDF page 4, handout panel 6_

```text
6. Define Quality Requirements
• Quality is the degree to which a set of inherent characteristics
fulfills requirements (need or expectation).
• No requirements (no baselines, no standards)  No quality.

Quality requirements
Meets
Quality characteristics
Quality requirements should be included in a specification.
```

---

## Slide 025 — Example Quality Requirements

_PDF page 5, handout panel 1_

```text
Example Quality Requirements
• Quality is the degree to which a set of inherent characteristics
fulfills requirements (need or expectation).
• Number of passed test cases: 100%
• Average learning time of 100 users: 10 minutes
• Unit tests coverage: ?
• UIs: ?
• Business processes: ?
```

---

## Slide 026 — Software Quality Standards

_PDF page 5, handout panel 2_

```text
Software Quality Standards
• Software quality management is concerned with ensuring
that software meets its required standards.
• Software standards are an encapsulation of best practice.
• There are no standardized and universally applicable software
metrics.

Quantification
(metrics)?
```

---

## Slide 027 — Summary: How to Manage

_PDF page 5, handout panel 3_

```text
1.
Describe the entity being measured (product).
2.
Describe what you want to find out (characteristics).
3.
Describe the attributes you will measure and the set of possible
resulting measures (metrics).
4.
Describe how to approach measuring the attributes (evaluation
method).
5.
Have standards to compare against (requirements).
•
Example:
1. Software application
2. Performance > Resource utilization
3. CPU utilization, memory utilization
4. Run the application, start Task Manager, locate values
5. Max CPU utilization: 10%, max memory utilization: 200Mb
Summary: How to Manage
Quality of Something? [3]
```

---

## Slide 028 — Visual-only slide

_PDF page 5, handout panel 4_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 028](assets/11-software-quality-management/slide-028.png)

---

## Slide 029 — Software Quality Metrics

_PDF page 5, handout panel 5_

```text
Software Quality Metrics
(Customer’s View) [4]
• Mean time to failure
– The time between failures
• Defect density (rate)
– The defects relative to the
 software size (lines of code, function points, etc.)
• Customer problems
– Total problems that customers reported (true defects and
non-defect-oriented problems) for a time period
• Customer satisfaction
– Customer survey (Satisfied, Neutral, Dissatisfied)
```

---

## Slide 030 — Process Quality Characteristics [5]

_PDF page 5, handout panel 6_

```text
Process Quality Characteristics [5]
Maintainability
Sub-characteristic
Definition
Analyzability
Easiness shown by the model in discovering
errors or deficiencies and in guessing the
parts that should be modified.
Understandability
Easiness with which the model can be
understood.
Modifiability
Easiness with which the model can be
modified, for possible errors, a specific
modification request or new requirements.
```

---

## Slide 031 — Process Quality Metrics

_PDF page 6, handout panel 1_

```text
Process Quality Metrics
Metric
Definition
NA
Number of activities of the software process model
NWP
Number of work products of the software process model
NPR
Number of roles which participate in the process
NDWPIn
Number of input dependences of the work products with
the activities in the process
NDWPOut
Number of output dependences of the work products
with the activities in the process
NDWP
Number of dependences between work products and
activities NDWP(PM) = NDWPIn(MP) + NDWPOut(MP)
NDA
Number of precedence dependences between activities
…
…
```

---

## Slide 032 — Project Quality Metrics [6]

_PDF page 6, handout panel 2_

```text
Project Quality Metrics [6]
Category
Metrics
Productivity
The number of lines of code/modules/classes/deliverables etc.
developed on time unit or per resource
Quality
Project complexity
Portfolio complexity
The degree of client or executive management satisfaction by
completing the project objectives
Deliverables
The ratio between the achieved deliverables and the planned
deliverables
The number of reworks because of no concordances between the
specifications and the results
Costs
Statistics regarding different costs categories
Project portfolio value
Resources
Statistics regarding resources usage
Statistics regarding resources costs
Statistics regarding resources loading and distribution
```

---

## Slide 033 — Person Quality Metrics

_PDF page 6, handout panel 3_

```text
Person Quality Metrics
Metric
Subjective evaluation
Social abilities
Use well known models
Personnel experience
The years of experience in the
project’s specific field.
Degree of satisfaction
Sum of the degree of satisfaction for
each requirement / total number of
requirements
```

---

## Slide 034 — Visual-only slide

_PDF page 6, handout panel 4_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 034](assets/11-software-quality-management/slide-034.png)

---

## Slide 035 — 7. Create Quality Management Plan

_PDF page 6, handout panel 5_

```text
7. Create Quality Management Plan
• The products, project, process,
and environment selection
• The entity attributes selection
• The quality requirements
• The methods to evaluate the
selected entities
– Qualitative (CATEGORIES):
subjective
– Quantitative (HOW MANY):
objective
```

---

## Slide 036 — Software Quality Assurance Plan

_PDF page 6, handout panel 6_

```text
Software Quality Assurance Plan
•
Purpose
•
Reference documents
•
Management
•
Documentation
•
Standards, practices, conventions, and metrics
•
Software reviews
•
Test
•
Problem reporting and corrective action
•
Tools, techniques, and methodologies
•
Media control
•
Supplier control
•
Records collection, maintenance, and
retention
•
Training
•
Risk management
•
Glossary
•
SQAP change procedure and history
The IEEE 730-2002
```

---

## Slide 037 — 8. Perform Quality Assurance

_PDF page 7, handout panel 1_

```text
8. Perform Quality Assurance
Quality assurance is the part of quality management focused on
providing confidence that quality requirements will be fulfilled.
QA
Process
(PQA)
Products
(SQA)
People
Services
The purpose of quality
assurance is to prevent defects.
Process
definition
Tools selection
Training
…
```

---

## Slide 038 — 9. Perform Quality Control

_PDF page 7, handout panel 2_

```text
9. Perform Quality Control
Quality control is the part of quality management focused on
fulfilling quality requirements.
QC
Process
Products
People
Services
The purpose of quality control
is to detect defects.
Lowest number of errors.
Desk-checks
Walkthrough
Testing
Inspection
…
```

---

## Slide 039 — Test Management Tools

_PDF page 7, handout panel 3_

```text
Test Management Tools
• https://app.qase.io/signup
• https://ontestpad.com/signup
• https://trello.com/signup
```

---

## Slide 040 — Who is Responsible for Quality?

_PDF page 7, handout panel 4_

```text
Who is Responsible for Quality?
```

---

## Slide 041 — When to Manage Quality?

_PDF page 7, handout panel 5_

```text
When to Manage Quality?
• Statement of work.
• Project charter.
• Project vision and scope.
```

---

## Slide 042 — Why Quality Management?

_PDF page 7, handout panel 6_

```text
Why Quality Management?
•
Improving customer’s satisfaction
•
Reducing development cost
•
Reducing maintenance cost
•
Required by some standards (ISO,
CMMI)
```

---

## Slide 043 — QA/QC Hire (HP)

_PDF page 8, handout panel 1_

```text
QA/QC Hire (HP)
o
Define and measure product quality.
o
Define and establish appropriate quality management processes and tools across the R&D
organization.
o
Work closely with the Development and QA teams to establish and execute appropriate
practices to actually meet the defined quality goals.
o
Work closely with the Management team to report on relevant quality metrics, and make
recommendations as to whether a product is ready to be released to customers.
o
Look for opportunities to increase product quality and team efficiency, and drive
improvement programs across the entire development project.
•
Bachelor’s Degree in Computer Science/Software Engineering or comparable.
•
Solid understanding of, and practical experience with software quality tools and
processes (e.g. test planning, progress tracking, defect tracking, black box/white
box testing, code coverage measurement, code complexity measurement, code
analyzers, test automation, etc.).
•
Knowledge of SW Engineering tools (e.g. source code revision control systems, build
process, etc.).
•
Thorough understanding of the entire Software Development process (using
traditional waterfall-like development and/or agile/iterative development) in order
to establish quality metrics and practices along the development cycle and not only
in final product testing.
•
Experience working with customers (understanding customer needs/expectations).
```

---

## Slide 044 — Test vs. Evaluation vs. Assessment

_PDF page 8, handout panel 2_

```text
Test vs. Evaluation vs. Assessment
• Test is the process of measuring a quality attribute
quantitatively or qualitatively.
– Input  Test  Output vs. Expected Output.
– Product A passes performance test.
• Evaluation is the process of making judgments based on
criteria and evidence. An evidence can be a test.
– Evidence  Criteria  Score  Judgement.
– Product A is better product B.
• Assessment is the process of collecting information,
performing tests, making evaluation and providing conclusion.
– We should use product A for our project.
– Product A meets our requirements.
```

---

## Slide 045 — Visual-only slide

_PDF page 8, handout panel 3_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 045](assets/11-software-quality-management/slide-045.png)

---

## Slide 046 — What is a Quality Management System? [7]

_PDF page 8, handout panel 4_

```text
What is a Quality Management System? [7]
• A quality management
system is a way of defining
how an organization can
meet the requirements of
its customers and other
stakeholders affected by its
work.
```

---

## Slide 047 — International Standards Organization

_PDF page 8, handout panel 5_

```text
International Standards Organization
• ISO (the International Organization for Standardization) is
a worldwide federation of national standards bodies (ISO
member bodies).
• The work of preparing International Standards is normally
carried out through ISO technical committees.
• Each member body interested in a subject for which a
technical committee has been established has the right to
be represented on that committee.
• International organizations, governmental and non-
governmental, in liaison with ISO, also take part in the
work.
```

---

## Slide 048 — ISO 9000

_PDF page 8, handout panel 6_

```text
ISO 9000
• ISO 9000:2008 specifies the terms and
definitions that apply to all quality
management and quality management
system standards developed by ISO/TC 176.
```

---

## Slide 049 — ISO 9001

_PDF page 9, handout panel 1_

```text
ISO 9001
• ISO 9001 is a standard that sets out the requirements for a
quality management system.
• It helps businesses and organizations to be more efficient and
improve customer satisfaction.
• ISO 9001 is based on the idea of continual improvement.
• It doesn’t specify what the objectives relating to “quality” or
“meeting customer needs” should be, but requires
organizations to define these objectives themselves and
continually improve their processes in order to reach them.
```

---

## Slide 050 — ISO 19011 and ISO 9004

_PDF page 9, handout panel 2_

```text
ISO 19011 and ISO 9004
• ISO 19011 gives guidance for performing both
internal and external audits to ISO 9001.
– This will help ensure your quality management
system delivers on promise and will prepare you
for an external audit, should you decide to seek
third-party certification.
• ISO 9004 provides guidance on how to achieve
sustained success with your quality
management system.
```

---

## Slide 051 — Why ISO 9001?

_PDF page 9, handout panel 3_

```text
Why  ISO 9001?
• Management problems happened
• Quality control approach showed failure
• Certificate is required
```

---

## Slide 052 — ISO 9001:2008 Terms and Definitions

_PDF page 9, handout panel 4_

```text
ISO 9001:2008 Terms and Definitions
• Document – information and its supporting medium
• Procedure – specified way to carry out an activity or a process
(Note: Procedures can be documented or not)
• Quality Manual – document specifying the quality
management system of an  organization
• Quality Plan – document specifying which procedures and
associated resources shall be applied by whom and when to a
specific project, product, process or contract
• Record – document stating results achieved or providing
evidence of activities performed
• Specification – document stating requirements
```

---

## Slide 053 — Records Required by ISO 9001:2008

_PDF page 9, handout panel 5_

```text
Records Required by ISO 9001:2008
•
Management reviews
•
Education, training, skills and experience
•
Evidence that the realization processes and resulting product fulfill
requirements
•
Design and development inputs relating to product requirements
•
Results of design and development reviews and any necessary
actions
•
Results of design and development validation and any necessary
actions
•
Results of the review of design and development changes and any
necessary actions
•
…
```

---

## Slide 054 — What Should We Do?

_PDF page 9, handout panel 6_

```text
What Should We Do?
• Quality assurance procedures should be
documented in an organizational quality
manual.
```

---

## Slide 055 — Implement ISO 9001 Quality

_PDF page 10, handout panel 1_

```text
Implement ISO 9001 Quality
Management System (I) [8]
1)
Top management commitment
2)
Establish implementation team
3)
Start ISO 9000 awareness programs
4)
Provide Training
5)
Conduct initial status survey
```

---

## Slide 056 — Implement ISO 9001 Quality

_PDF page 10, handout panel 2_

```text
Implement ISO 9001 Quality
Management System (II)
6)
Create a documented implementation plan
```

---

## Slide 057 — Implement ISO 9001 Quality

_PDF page 10, handout panel 3_

```text
Implement ISO 9001 Quality
Management System (III)
7)
Develop quality management system documentation (Use
ISO 10013:1995 for guidance in quality documentation.)
```

---

## Slide 058 — Implement ISO 9001 Quality

_PDF page 10, handout panel 4_

```text
Implement ISO 9001 Quality
Management System (IV)
8)
Document control (Control is simply a means of managing
the creation, approval, distribution, revision, storage, and
disposal of the various types of documentation.)
9)
Implementation
10) Internal quality audit (Use ISO 19011 for guidance in
auditing, auditor qualification and programmes.)
11) Management review
12) Pre-assessment audit
13) Certification and registration
14) Continual Improvement (ISO 9004:2008 provides a
methodology for continual improvement).
```

---

## Slide 059 — Thank You & See You Again

_PDF page 10, handout panel 5_

```text
Thank You & See You Again
```

---

