# 07. Software Configuration Management

> Source: `07. Software Configuration Management.pdf`  
> Extracted slides: **109**  
> Structure: one Markdown section per original PowerPoint slide in the 6-up PDF handout.  
> Wording is preserved from the PDF text layer; no outside knowledge was added. Visual-only slides include a cropped image.

## Slide 001 — Software Configuration

_PDF page 1, handout panel 1_

```text
Software Configuration
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
To perform configuration management
activities.
To create a configuration management
plan.
```

---

## Slide 003 — Contents

_PDF page 1, handout panel 3_

```text
Contents
I.
Configuration management
terminologies
II.
Configuration management activities
III.
Configuration management roles
IV.
Configuration management plan
V.
Configuration management solution
```

---

## Slide 004 — References

_PDF page 1, handout panel 4_

```text
References
1. Jessica Keyes (2004). Software
Configuration Management. Auerbach
Publications.
2. Anne Mette Jonassen Hass (2002).
Configuration Management Principles
and Practice. Addison Wesley.
3. Roger S. Pressman (2010). Software
Engineering : A Practitioner’s Approach.
4. Susan A. Dart (1992). The Past, Present,
and Future of Configuration
Management.
```

---

## Slide 005 — First Year

_PDF page 1, handout panel 5_

```text
First Year
```

---

## Slide 006 — Second Year

_PDF page 1, handout panel 6_

```text
Second Year
```

---

## Slide 007 — Third Year

_PDF page 2, handout panel 1_

```text
Third Year
```

---

## Slide 008 — Fourth Year

_PDF page 2, handout panel 2_

```text
Fourth Year
Software
systems are
very complex.
```

---

## Slide 009 — Creating a Release

_PDF page 2, handout panel 3_

```text
Creating a Release
1. Project vision
2. Statement of
work
3. Project
schedule
4. Resource list
1. Specs
2. System
design
1. Visual
studio
2. MS Visio
3. MS Word
4. NUnit
1. Test
plan
2. Test
report
Source code,  setup package
```

---

## Slide 010 — Visual-only slide

_PDF page 2, handout panel 4_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 010](assets/07-software-configuration-management/slide-010.png)

---

## Slide 011 — What is CM? [1]

_PDF page 2, handout panel 5_

```text
What is CM? [1]
•
Software configuration management (SCM, or just plain CM) is an organizational
framework — that is, a discipline — for managing the evolution of computer
systems throughout all stages of systems development.
```

---

## Slide 012 — Configuration Item [2]

_PDF page 2, handout panel 6_

```text
Configuration Item [2]
Configuration Item Class
The Life of a Configuration Item Class
A configuration item is any possible part of the development or
delivery of a system or product that it's necessary to identify,
produce, store, use, and change individually.
Instantiations
```

---

## Slide 013 — Electronic Objects

_PDF page 3, handout panel 1_

```text
Electronic Objects
Copies may be in
either electronic or
physical form.
It must be stored
electronically.
An unlimited number
of copies may be
easily produced.
```

---

## Slide 014 — Physical Objects

_PDF page 3, handout panel 2_

```text
Physical Objects
When a copy of the
object is delivered,
the number of
available copies is
reduced.
Most traditional
configuration
management tools
cannot handle a physical
object without a proxy-
object in electronic form.
It cannot be stored
on a computer but
must be stored in a
physical place.
```

---

## Slide 015 — Objects of a Product

_PDF page 3, handout panel 3_

```text
Objects of a Product
Hardware – Network
Procedure descriptions, service
agreements or contracts, training
material (computer-assisted
training material, teacher's
manual, slides) or user manuals.
```

---

## Slide 016 — Configuration Item Metadata [2]

_PDF page 3, handout panel 4_

```text
Configuration Item Metadata [2]
Metadata for
Unique
Identification
Metadata for
Authorization
Metadata for
Relations to Other
Configuration Items
Metadata for
Distribution
```

---

## Slide 017 — Baseline [3]

_PDF page 3, handout panel 5_

```text
Baseline [3]
•
A specification or product that has been formally reviewed and agreed
upon, that thereafter serves as the basis for further development, and
that can be changed only through formal change control procedures.
```

---

## Slide 018 — Deliveries [2]

_PDF page 3, handout panel 6_

```text
Deliveries [2]
•
Deliveries are hierarchies of configuration items and may be
constructed of other deliveries in a ramified hierarchy.

Requirement Specification Delivery
Hardware-Related Delivery
```

---

## Slide 019 — Milestone

_PDF page 4, handout panel 1_

```text
Included CIs
01/10/2011 03/15/2011 04/30/2011 06/30/2011
Project plan
1.0
3.0
4.1
4.1
Requirement
specification
1.0
1.3
1.6
1.6
Architectural
design
—
1.2
1.3
1.3
Detailed design
—
1.0
1.2
1.3
User manual
—
—
1.1
1.1
Complete system —
—
1.0
1.1
Release note
—
—
—
1.0
A dash indicates that the configuration item is not part of the delivery.
Milestone
•
A milestone is a specific point with a
specified outcome.
•
Milestones are used to track progress
toward a specific goal or event.
```

---

## Slide 020 — Release

_PDF page 4, handout panel 2_

```text
Release
A software release is the distribution of an initial or upgraded
version of a computer software product. For example, executable
program, documentation, release notes, and configuration data.
Pre-Alpha
Alpha
Beta
Release
candidate
Gold
TP
CTP
Techinal Previews
Community Technology Previews
RTM
GA
Release To
Marketing,
Manufacture
General Availability
```

---

## Slide 021 — Visual-only slide

_PDF page 4, handout panel 3_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 021](assets/07-software-configuration-management/slide-021.png)

---

## Slide 022 — Learning at Home

_PDF page 4, handout panel 4_

```text
Learning at Home
• Read slides

 Focus on tools and systems.

 Register accounts.

 Prepare slides and artifacts based on your project.

 Make a presentation.
```

---

## Slide 023 — Discussion Questions

_PDF page 4, handout panel 5_

```text
Discussion Questions
•
Baselines (Main Artifacts / Products)  ??.
•
File Name: Vietnamese / English  ??.
•
Directory Structure  ??.
•
Communication Tools  ??.
•
Tracking Tools  ??.
•
Build Automation  ??.
•
Continuous Integration: Source code  Emails/SMS
•
Continuous Delivery: Source code 👤 | (Yes)  URL (Heroku),
Emails/SMS  ??
•
Continuous Deployment: Source code  URL (Heroku), Emails/SMS  ??
•
Changes: Informal Process / Informal Procedure, Status Reporting  ??.
•
Releases  Audit  ??.
•
Backup  ??.
```

---

## Slide 024 — Visual-only slide

_PDF page 4, handout panel 6_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 024](assets/07-software-configuration-management/slide-024.png)

---

## Slide 025 — Configuration

_PDF page 5, handout panel 1_

```text
Configuration
Management Activities
```

---

## Slide 026 — 1. Identify Configuration Items

_PDF page 5, handout panel 2_

```text
1. Identify Configuration Items
Plans
Identification
CIs
1. Products delivered to the
customer
2. Designated internal work
products
3. Acquired products
4. Tools and other capital assets of
the project’s work environment
5. Other items used in creating and
describing these work products
Hardware
Software
Product Source Code
Documents
```

---

## Slide 027 — 2. Assign Unique Identifiers to CIs

_PDF page 5, handout panel 3_

```text
2. Assign Unique Identifiers to CIs
<SYSTEM>[<TLA>]_[<SUBSYSTEM>]_[<TLA>]_[R|A|B]<X>[.<Y>.<Z>][.BL<#>]
PLN
Project Plans
SOW
State Of Work
USC
Use Cases
SRD
Software
Requirements
Document
SDD
Software Design
Document
SRC
Source Code Files
TSP
Test Plan
R|A|B

Stand for release, alpha, or
beta
<X>
Integer, stands for a major
release (e.g. 1)
<Y>
Integer (optional), stands for
a minor release
<Z>
Integer (optional), stands for
an alternative release
(patches, ports, etc.)
BL
Stands for base level (an
internal release)
#
Integer, for internal releases
Windows_PLN_B1.0

Windows_IE_USC_R3.5
Windows_R7.0

Source Code?
```

---

## Slide 028 — 3. Specify the Important Characteristics

_PDF page 5, handout panel 4_

```text
3. Specify the Important Characteristics
of CIs
author
programming language
file type
when to control
reponsible people
```

---

## Slide 029 — 4. Develop System Directory Structure

_PDF page 5, handout panel 5_

```text
4. Develop System Directory Structure
```

---

## Slide 030 — 5. Develop Subsystem and Component

_PDF page 5, handout panel 6_

```text
5. Develop Subsystem and Component
Directory Structure
```

---

## Slide 031 — 6. Identify Baselines

_PDF page 6, handout panel 1_

```text
6. Identify Baselines
Activities
1. Identify role and reponsibility of
people creating and appoving baseline
2. Select Configuration Items
3. Approve
4. Document the set of configuration
items that are contained in a baseline
Baseline
Subsystem
Baselines
Requirements
Design
Source Code,
Executable Code
User Guide
...
System Baselines
Outputs
1. Baselines
2. Description of baselines
```

---

## Slide 032 — 7. Define Item Approval Template [2]

_PDF page 6, handout panel 2_

```text
7. Define Item Approval Template [2]
Item approval is evidence that items
satisfy the criteria for placing under
configuration management.
An item approval will
typically be a form; either
paper based or electronic.
Content
1.
Configuration item concerned
2.
Dated signatures (electronic or
other) by the producer, the
person responsible, and the
approver
3.
Condition(s) for approval
4.
Related metadata
```

---

## Slide 033 — 8. Define Change Request Template

_PDF page 6, handout panel 3_

```text
8. Define Change Request Template
A change request is a
document containing a call for
an adjustment of a system.
1. A wrong formulation, caught
during the review of a document
2. A coding mistake
3. An enhancement
4. A mistake found in the
integration test
5. An inquiry to a helpdesk about a
problem in connection with
usage of a system
6. A change required in the code
because of an upgrade to a new
version of the middleware
supporting the system, which
may not be backward compatible
Content
1. The change: identification, identification
of the underlying event, configuration
item concerned, and priority
2. Phase information for the change: phase,
date and time, name of the person
responsible, description
```

---

## Slide 034 — 9. Define Release Request Template

_PDF page 6, handout panel 4_

```text
9. Define Release Request Template
A release request is a document
defining what is released from
the configuration management
library, and to whom.
A release request may be a
form, either paper based or
electronic.
Content
1.
Configuration item concerned
2.
Dated signature(s) by
requester or requesters
3.
If desired, dated signature by
the person responsible
4.
Reason for release request
5.
Delivery medium and/or
destination
```

---

## Slide 035 — 10. Establish Communication Tools

_PDF page 6, handout panel 5_

```text
10. Establish Communication Tools
```

---

## Slide 036 — Hands-On Communication Tools

_PDF page 6, handout panel 6_

```text
Hands-On Communication Tools
1.
Zoom. https://zoom.us/
2.
Skype. https://www.skype.com/en/
3.
Discord. https://discordapp.com
4.
Viber. https://www.viber.com/en/
5.
Telegram. https://web.telegram.org/
6.
Gmail. https://www.google.com/gmail
7.
Outlook. https://outlook.office365.com/mail/
8.
Slack. https://slack.com/
```

---

## Slide 037 — 11. Establish Requirements Management

_PDF page 7, handout panel 1_

```text
11. Establish Requirements Management
Tools
```

---

## Slide 038 — Hands-On Requirements

_PDF page 7, handout panel 2_

```text
Hands-On Requirements
Management Tools
• Confluence. https://www.atlassian.com/software/confluence
• Google Sheets. https://www.google.com/sheets/about/
```

---

## Slide 039 — 12. Establish Task Tracking Tools

_PDF page 7, handout panel 3_

```text
12. Establish Task Tracking Tools
```

---

## Slide 040 — Hands-On Task Tracking Tools

_PDF page 7, handout panel 4_

```text
Hands-On Task Tracking Tools
1.
Trello. https://trello.com/
2.
Asana. https://asana.com
3.
Atlassian Cloud. https://www.atlassian.com/software/free
4.
ClickUp. https://app.clickup.com
```

---

## Slide 041 — 13. Establish Version Control Systems

_PDF page 7, handout panel 5_

```text
13. Establish Version Control Systems
The tools for accessing the
configuration system
•
Ensure that a configuration item will not
disappear or be damaged
•
It can be found at any time and delivered in
the condition in which you expect to find it.
•
Record is kept to indicate who has been
given the item or a copy of it.
Storage media
Procedures
```

---

## Slide 042 — Source Control System

_PDF page 7, handout panel 6_

```text
Source Control System
Source Code Reversion
Source Code Sharing
Source Code Branching
and Merging
```

---

## Slide 043 — Permissions

_PDF page 8, handout panel 1_

```text
Permissions
The
Controlled
Library
The
Dynamic
Library
The
Dynamic
Library
```

---

## Slide 044 — Hands-On Version Control Systems

_PDF page 8, handout panel 2_

```text
Hands-On Version Control Systems
1.
GitHub. https://github.com/
2.
GitLab. https://about.gitlab.com/
3.
Git. https://git-scm.com/
4.
Apache Subversion.
https://subversion.apache.org/
5.
VisualSVN Server.
https://www.visualsvn.com/server/
6.
TortoiseSVN. https://tortoisesvn.net/
7.
Google Docs. https://docs.google.com
8.
Confluence.
https://www.atlassian.com/software/confluence
```

---

## Slide 045 — CI/CD Process

_PDF page 8, handout panel 3_

```text
CI/CD Process
•
https://www.atlassian.com/continuous-delivery/ci-vs-ci-vs-cd
•
Continuous integration: The developer's changes are validated by creating a build
and running automated tests against the build.
•
Continuous delivery is an extension of continuous integration: on top of having
automated your testing, you also have automated your release process and you
can deploy your application at any point of time by clicking on a button.
•
Continuous deployment: Every change that passes all stages of your production
pipeline is released to your customers. There's no human intervention, and only a
failed test will prevent a new change to be deployed to production.
```

---

## Slide 046 — 14. Implement Continuous Integration

_PDF page 8, handout panel 4_

```text
14. Implement Continuous Integration
```

---

## Slide 047 — 15. Implement Continuous Deployment

_PDF page 8, handout panel 5_

```text
15. Implement Continuous Deployment
```

---

## Slide 048 — Hands-On CI/CD

_PDF page 8, handout panel 6_

```text
Hands-On CI/CD
1.
GitHub Actions.
https://github.com/features/actions
2.
GitLab. https://docs.gitlab.com/ee/ci/
3.
CircleCI.
https://circleci.com/docs/getting-
started/
4.
Jenkins.
https://www.jenkins.io/doc/tutorials/
5.
Xcode Cloud.
https://developer.apple.com/xcode-
cloud/
```

---

## Slide 049 — 16. Implement DevOps

_PDF page 9, handout panel 1_

```text
16. Implement DevOps
• Infrastructure as code (use scripts to automate tasks
whenever possible).
• Create configuration setting for enabling/disabling a new
feature whenever possible.
• Use IF ELSE for enabling or disabling code of the new feature.
–  Features separation/coupling.
• Continuous monitoring.
```

---

## Slide 050 — Hands-On DevOps

_PDF page 9, handout panel 2_

```text
Hands-On DevOps
1.
Docker https://www.docker.com/
2.
Kubernetes https://kubernetes.io/
3.
Chef https://www.chef.io/
4.
Ansible https://www.ansible.com/
5.
Nagios https://www.nagios.org/
```

---

## Slide 051 — 17. Establish Bug Tracking Tools

_PDF page 9, handout panel 3_

```text
17. Establish Bug Tracking Tools
```

---

## Slide 052 — Hands-On Bug Tracking Tools

_PDF page 9, handout panel 4_

```text
Hands-On Bug Tracking Tools
1.
Jira. https://www.atlassian.com/software/jira
2.
Bugzilla. https://bugzilla.readthedocs.io/en/latest/installing/
3.
MantisBT. https://mantisbt.org/download.php
```

---

## Slide 053 — 18. Establish Time Tracking Tools

_PDF page 9, handout panel 5_

```text
18. Establish Time Tracking Tools
```

---

## Slide 054 — Hands-On Time Tracking Tools

_PDF page 9, handout panel 6_

```text
Hands-On Time Tracking Tools
1.
Clockify. https://clockify.me/
2.
Toggl. https://toggl.com/
```

---

## Slide 055 — 19. Operate Configuration Management

_PDF page 10, handout panel 1_

```text
19. Operate Configuration Management
System
•
Activities:
o
Establish a mechanism to manage multiple control levels of
configuration management.
o
Store and retrieve configuration items in a configuration
management system.
o
Share and transfer configuration items between control
levels within the configuration management system.
o
Store, update, and retrieve configuration management
records.
•
Outputs: Configuration Management Records
o
Revision history of configuration items
o
Change log
o
Copy of the change requests
o
Status of configuration items
o
Differences between baselines
```

---

## Slide 056 — Other Helpful Tools

_PDF page 10, handout panel 2_

```text
Other Helpful Tools
• Screen Capture: https://www.screenpresso.com
```

---

## Slide 057 — Visual-only slide

_PDF page 10, handout panel 3_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 057](assets/07-software-configuration-management/slide-057.png)

---

## Slide 058 — 20. Establish Change

_PDF page 10, handout panel 4_

```text
20. Establish Change
Control Process
•
Defining the change process
•
Establishing change control policies
and procedures
•
Maintaining baselines
•
Processing changes
•
Developing change report forms
The goal of configuration change control
is to establish mechanisms that will help
ensure the production of quality
software as well as ensure that each
version of the software contains all
necessary elements, and that all
elements in a version will work correctly
together.
```

---

## Slide 059 — Visual-only slide

_PDF page 10, handout panel 5_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 059](assets/07-software-configuration-management/slide-059.png)

---

## Slide 060 — 21. Perform Status Reporting

_PDF page 10, handout panel 6_

```text
21. Perform Status Reporting
Status reporting makes available, in a useful and readable way, the
information necessary to effectively manage a product's
development and maintenance.
Activities:
•
List baselines
•
Hightlight current CIs and changed CIs
•
List changes
Why status reporting?
•
Get information on change decisions
•
Assist future planning efforts
•
Review the complete configuration of
a product or any of its component
parts
•
Review maintenance information
•
Review documentation
•
Review source code
```

---

## Slide 061 — Configuration Audits

_PDF page 11, handout panel 1_

```text
Configuration Audits
Configuration audits confirm that the resulting
baselines and documentation conform to a specified
standard or requirement.
```

---

## Slide 062 — Functional Configuration Audits

_PDF page 11, handout panel 2_

```text
Functional Configuration Audits
• Functional Configuration Audits (FCA) – Audits conducted to
verify that the actual performance of the CI meets the
requirements stated in its performance specification and to
certify that the CI has met those requirements.
• Why FCA?
• A multi million dollar system is shipped to a customer
with three important features missing.
• The customer's business is disrupted.
• The missing features were clearly specified in the
Contract Software Requirements Specification.
• The customer successfully sues the developer for
damages.
```

---

## Slide 063 — Physical Configuration Audit

_PDF page 11, handout panel 3_

```text
Physical Configuration Audit
• Physical Configuration Audit (PCA) – Audits conducted to
verify that the related design documentation matches the
design of the deliverable CI.
• Why PCA?
– A steel company installs a complex control system in their
rolling mill.
– Seven years later the computer hardware platform ceases to
be supported by its supplier.
– The company initiates a project to refactor the software for a
new hardware platform.
– The source code on file does not match the executables
running on the operational system. Further, the requirements
specifications and design descriptions have been lost.
```

---

## Slide 064 — 22. Perform Configuration Audits

_PDF page 11, handout panel 4_

```text
22. Perform Configuration Audits
•
Assess the integrity of the baselines.
•
Confirm that the configuration management
records correctly identify the configuration
items.
•
Review the structure and integrity of the
items in the configuration management
system.
•
Confirm the completeness and correctness of
the items in the configuration management
system. Completeness and correctness of
the content is based on the requirements as
stated in the plan and the disposition of
approved change requests.
•
Confirm compliance with applicable
configuration management standards and
procedures.
•
Track action items from the audit to closure.
Outputs:
1.
Configuration audit
results
2.
Action items
```

---

## Slide 065 — 23. Manage Releases

_PDF page 11, handout panel 5_

```text
23. Manage Releases
Software release management contains identification,
packaging, and delivery of the elements of a product.
• Identify baselines.
• Create Configuration Status
Accounting Reports (CSAR).
• Perform PCA, FCA.
• Package files and documents.
• Receive client’s confirmation.
```

---

## Slide 066 — 24. Set Up Backup Process

_PDF page 11, handout panel 6_

```text
24. Set Up Backup Process
•
Benefits:
1. Recovery data when there are problems.
2. Support version control.
```

---

## Slide 067 — 25. Perform Archiving

_PDF page 12, handout panel 1_

```text
25. Perform Archiving
•
Data archiving is the process of moving data that is no longer
actively used to a separate data storage device for long-term
retention.
•
Data archives consist of older data that is still important and
necessary for future reference, as well as data that must be retained
for regulatory compliance.
•
When project is finished:
o Archive data of project
o Archive or remove paper documents
o Clean all information of project
```

---

## Slide 068 — Why CM?

_PDF page 12, handout panel 2_

```text
Safer
Faster
Better
Why CM?
SCM
Identification
Control
Status
Accounting
Audit
And
Review
The purpose of configuration management
is to establish and maintain the integrity of
work products using configuration
identification, configuration control,
configuration status accounting, and
configuration audits.
```

---

## Slide 069 — Visual-only slide

_PDF page 12, handout panel 3_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 069](assets/07-software-configuration-management/slide-069.png)

---

## Slide 070 — Configuration

_PDF page 12, handout panel 4_

```text
Configuration
Management Roles
```

---

## Slide 071 — Configuration Manager

_PDF page 12, handout panel 5_

```text
Configuration Manager
The person responsible for configuration
management implements, maintains, and improves
configuration management within the framework
provided by management.
1. Transforming the company's needs and requirements
for configuration management to relevant, practical
procedures, resources, and tools
2. Selecting and testing configuration management tools
3. Updating information about new versions of existing
tools and new tools
4. Following up on the performance and efficiency of
configuration management
5. Making status reports to management with data
analysis and recommendations for improvement
```

---

## Slide 072 — Librarian

_PDF page 12, handout panel 6_

```text
Librarian
1.
Establishing the
configuration management
library—a controlled
master library for storing
configuration items
2.
Maintaining and controlling
the contents of the library
3.
Communicating contents of
the configuration
management library
4.
Controlling the
configuration management
library
```

---

## Slide 073 — Configuration Control Board

_PDF page 13, handout panel 1_

```text
Configuration Control Board
Configuration Manager
Project Manager
Technical Lead
Test Lead
Quality Engineer
Related People
1.
Analyst
2.
Architect
3.
Developer
4.
Integrator
5.
Tester
6.
Customer
Contact
7.
People Being
Resposible For
Assets
Operation,
Process
Management
Support

Librarian
```

---

## Slide 074 — Analyst

_PDF page 13, handout panel 2_

```text
Analyst
1.
Identifying relevant configuration items
2.
Placing relevant items in storage after
due approval
3.
Producing appropriate event
registrations for the items used in
connection with analysis (such as
contracts or user requirement
specifications)
1.
Extracting related configuration items as the basis for producing
analysis objects, such as contracts or user requirement
specifications
2.
Getting information about the status and history of these items
3.
Getting trace analysis results toward these items, to ensure the
analysis covers all requirements
```

---

## Slide 075 — Architect

_PDF page 13, handout panel 3_

```text
Architect
1.
Identifying relevant configuration items
(design documents)
2.
Placing relevant configuration items in
storage after due approval
3.
Producing appropriate event registrations
for items used in connection with design
work, such as user requirement
specifications and software requirements
specifications
1.
Extracting related configuration items as the basis for
producing design items, such as software requirements
specifications
2.
Getting information on the status and history of these items
3.
Getting trace analysis results toward these items, to ensure
that the design covers all demands
```

---

## Slide 076 — Developer

_PDF page 13, handout panel 4_

```text
Developer
1. Identifying relevant configuration items (source
code and object files)
2. Placing relevant configuration items in storage
after due approval
3. Producing appropriate event registrations for
items used in connection with programming,
such as requirement specifications or design
1. Extracting related configuration items as the basis for producing
programming objects, such as software requirement specifications and
design
2. Getting information on the status and history of these items
3. Getting trace analysis results toward these items, to ensure that the
code and related objects cover at least the design and possibly also
explicitly all software requirements
```

---

## Slide 077 — Integrator

_PDF page 13, handout panel 5_

```text
Integrator
1.
Identifying relevant configuration items
(build scripts and, not least, deliveries in the
form of larger and larger subsystems)
2.
Placing relevant items in storage after due
approval
3.
Producing appropriate event registrations
for items used in connection with
integration, such as source code
1.
Extracting related configuration items as a basis for integration, such
as architectural design, development plans, and test plans
2.
Extracting configuration items from which their own items must be
produced
3.
Getting information on the status and history of these items
```

---

## Slide 078 — Tester

_PDF page 13, handout panel 6_

```text
Tester
1.
Identifying relevant configuration items (test
plans, descriptions, scripts, and data, and
releases for an entire test, including test
environment)
2.
Placing relevant items in storage after
appropriate approval
3.
Producing appropriate event registrations for
items used in connection with testing, such as
source code or (sub)systems
1.
Extracting related configuration items as the basis for testing, such
as individual configuration items or, more important, deliveries in
terms of integrated (sub)systems
2.
Getting information on the status and history of these items
3.
Getting information about relevant event registrations and their
progress
```

---

## Slide 079 — Project Manager

_PDF page 14, handout panel 1_

```text
Project Manager
1.
Producing and updating a configuration management
plan in agreement with the overall project plan
2.
Identifying necessary configuration management
roles for the project
3.
Assigning responsibility for configuration
management activities in accordance with identified
roles
4.
Allocating resources for configuration management
5.
Following up on planned configuration management
activities
1.
Status reports from the configuration management system concerning
configuration items
2.
Information about event registrations and their progress
3.
Measurements produced from the configuration management system,
concerning both configuration management itself and other processes
```

---

## Slide 080 — Customer And Customer Contact

_PDF page 14, handout panel 2_

```text
Customer And Customer Contact
1. Participating in one or more
configuration control boards
2. Creating event registrations
3. Approving produced
configuration items
1.
Producing documentation to fulfill the customer's
configuration management requirements
2.
Receiving and possibly performing quality assurance on
deliveries from the customer, such as user requirement
specifications, and possibly performing internal
configuration management on them
3.
Possibly forwarding event registrations to the customer
4.
Receiving event registrations from the customer, such as in
connection with a review of documentation or with early
user or acceptance tests
```

---

## Slide 081 — Subcontractor and Subcontractor

_PDF page 14, handout panel 3_

```text
Subcontractor and Subcontractor
Contact
Study, understand, and use the
contractor's configuration
management system
Deliver event registrations or
change requests (depending on
the form of cooperation) to the
subcontractor
```

---

## Slide 082 — Visual-only slide

_PDF page 14, handout panel 4_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 082](assets/07-software-configuration-management/slide-082.png)

---

## Slide 083 — Configuration

_PDF page 14, handout panel 5_

```text
Configuration
Management Plan
```

---

## Slide 084 — Configuration Management Plan

_PDF page 14, handout panel 6_

```text
The plan forces you to define and describe
the process.
The plan causes you to think about what
you will do and how you will do it.
The plan serves as a contract vehicle for
the project.
Configuration Management Plan
CM plan is the actual plan that will be
implemented to address the CM needs.
It gives all the procedures, policies,
schedules, responsibilities, etc.
A plan describes what you will do and a
procedure describes how it will be done.
The plan
documents the
CM process
and as such
acts as the tool
used to gain
project and
management
support for the
process.
```

---

## Slide 085 — Interviews (I)

_PDF page 15, handout panel 1_

```text
Interviews (I)
Do standards
aid in the
development
of a CM plan?
Should CM
procedures be
part of the CM
plan or be
separate?
Is the CM plan
updated
throughout the
project life cycle?
Was the CM
plan used after
it was
developed? If
so, by whom
and how?
```

---

## Slide 086 — Interviews (II)

_PDF page 15, handout panel 2_

```text
Interviews (II)
Is there a need for a
CM plan at the
company/division
level as well as at
the project level?
Are there significant
differences between a CM
plan written for a
development project and a
CM plan written for a
maintenance project?
Are there significant differences
between a CM plan written for
hardware versus software?
```

---

## Slide 087 — Interviews (III)

_PDF page 15, handout panel 3_

```text
Interviews (III)
Are there significant differences
between a CM plan written for a
large project versus a small
project?
What makes a CM plan hard to write?
1.
How to perform CM?
2.
What processes you will implement?
3.
Lack of a defined CM process makes it
impossible to write the CM plan

Would having an automated tool to assist
in developing a CM plan help?
```

---

## Slide 088 — Outline of a Model CM Plan (I)

_PDF page 15, handout panel 4_

```text
Outline of a Model CM Plan (I)
1.0 INTRODUCTION
1.1 Purpose
1.2 Scope
1.3 Definitions
1.4 References
1.5 Tailoring
2.0 SOFTWARE CONFIGURATION MANAGEMENT
2.1 SCM organization
2.2 SCM responsibilities
2.3 Relationship of CM to the software process life cycle
2.3.1 Interfaces to other organizations on the project
2.3.2 Other project organizations CM responsibilities
```

---

## Slide 089 — Outline of a Model CM Plan (II)

_PDF page 15, handout panel 5_

```text
Outline of a Model CM Plan (II)
3.0 SOFTWARE CONFIGURATION MANAGEMENT ACTIVITIES
3.1 Configuration Identification
3.1.1 Specification Identification
Labeling and numbering scheme for
documents and files
How identification between documents and
files relate
Description of identification tracking scheme
When a document/file identification number
enters controlled status
How the identification scheme addresses
versions and releases
How the identification scheme addresses
hardware, application software system
software, COTS products, support software
(e.g., test data and files), etc.
3.1.2 Change Control Form Identification
Numbering scheme for each of the forms
used
```

---

## Slide 090 — Outline of a Model CM Plan (III)

_PDF page 15, handout panel 6_

```text
Outline of a Model CM Plan (III)
3.1.3 Project Baselines
Identify various baselines for the project
For each baseline created provide the following
information:
o
How and when it is created
o
Who authorizes and who verifies it
o
The purpose
o
What goes into it (software and documentation)
3.1.4 Library
Identification and control mechanisms used
Number of libraries and the types
Backup and disaster plans and procedures
Recovery process for any type of loss
Retention policies and procedures
oWhat needs to be retained, for who, and for how long
oHow is the information retained (on-line, off-line,
media type and format)
```

---

## Slide 091 — Outline of a Model CM Plan (IV)

_PDF page 16, handout panel 1_

```text
Outline of a Model CM Plan (IV)
3.2 Configuration Control
      3.2.1 Procedures for changing baselines (procedures may vary with each baseline)
      3.2.2 Procedures for processing change requests and approvals-change
classification scheme
          o Change reporting documentation
          o Change control flow diagram
      3.2.3 Organizations assigned responsibilities for change control
      3.2.4 Change Control Boards (CCBs) - describe and provide
the following information for each:
          o Charter
          o Members
          o Role
          o Procedures
          o Approval mechanisms
      3.2.5 Interfaces, overall hierarchy, and
the responsibility for communication between multiple CCBs, when applicable
      3.2.6 Level of control - identify how it will change throughout the life cycle, when
applicable
      3.2.7 Document revisions - how they will be handled
      3.2.8 Automated tools used to perform change control
```

---

## Slide 092 — Outline of a Model CM Plan (V)

_PDF page 16, handout panel 2_

```text
Outline of a Model CM Plan (V)
3.3 Configuration Status Accounting
      3.3.1 Storage, handling and release
 of project media
      3.3.2 Types of information needed
 to be reported and the control
 over this information that is needed
      3.3.3 Reports to be produced
(e.g., management reports, QA reports,
 CCB reports) and who the audience
is for each and the information needed
 to produce each report
      3.3.4 Release process, to include the following information:
          o What is in the release
          o Who the release is being provided to and when
          o The media the release is on
          o Any known problems in the release
          o Any known fixes in the release
          o Installation instructions
      3.3.5 Document status accounting and change management status accounting
that needs to occur
```

---

## Slide 093 — Outline of a Model CM Plan (VI)

_PDF page 16, handout panel 3_

```text
Outline of a Model CM Plan (VI)
3.4 Configuration Auditing
      3.4.1 Number of audits to be done and when
they will be done (internal audits as well as
configuration audits); for each audit provide the
following:
          o Which baseline it is tied to, if applicable
          o Who performs the audit
          o What is audited
          o What is the CM role in the audit, and what
are the roles of other organizations in the audit
          o How formal is the audit
      3.4.3 All reviews that CM supports; for each
provide the following:
          o The materials to be reviewed
          o CM responsibility in the review and the responsibilities
of other organizations
```

---

## Slide 094 — Outline of a Model CM Plan (VII)

_PDF page 16, handout panel 4_

```text
Outline of a Model CM Plan (VII)
4.0 CM MILESTONES
Define all CM project milestones (e.g., baselines,
reviews, audits)
Describe how the CM milestones tie into the
software development process
Identify what the criteria are for reaching each
milestone
5.0 TRAINING
Identify the kinds and amounts of
training (e.g., orientation, tools)
6.0 SUBCONTRACTOR/VENDOR SUPPORT
Describe any subcontractor and/or
vendor support and interfacing, if applicable
```

---

## Slide 095 — Visual-only slide

_PDF page 16, handout panel 5_

> No extractable text was found in the PDF text layer for this slide. The visual is preserved below.

![Slide 095](assets/07-software-configuration-management/slide-095.png)

---

## Slide 096 — Configuration Management

_PDF page 16, handout panel 6_

```text
Configuration Management
Solution
```

---

## Slide 097 — ISO/IEC 15504 (SPICE) [4]

_PDF page 17, handout panel 1_

```text
ISO/IEC 15504 (SPICE) [4]
SPICE: Software Process Improvement and Capability Determination
Work product management
means that for any given
process area to obtain level
2, all relevant work
products from the
performance of the process
area must be placed under
configuration management.
```

---

## Slide 098 — Goals

_PDF page 17, handout panel 2_

```text
Goals
•
A configuration management strategy
will be developed.
•
All items generated by the process or
project will be identified, defined, and
base-lined.
•
Modifications and releases of the items
will be controlled.
•
The status of the items and modification
requests will be recorded and reported.
•
The completeness and consistency of the
items will be ensured.
•
Storage, handling, and delivery of the
items will be controlled.
```

---

## Slide 099 — Practices

_PDF page 17, handout panel 3_

```text
Practices
Develop
configuration
management
strategy
Establish
configuration
management system
Identify
configuration items
Maintain
configuration item
description
Manage changes
Manage product
releases
Maintain
configuration item
history
Report configuration
status
Manage the release
and delivery of
configuration items
```

---

## Slide 100 — Standard Definition of CM

_PDF page 17, handout panel 4_

```text
Standard Definition of CM
Standard definition (IEEE 729-1983)
• identifying components, structure
• What version of the file is this?
Identification
• controlling releases and changes
• What changes went into the latest version of
this product?
Control
• recording, reporting status
• How many files were affected by fixing this one
bug?
Status accounting
• validating completeness
• Are all the correct versions of files used in this
current release?
Audit and review
```

---

## Slide 101 — Broaden Definition of CM

_PDF page 17, handout panel 5_

```text
Broaden Definition of CM
Based on existing CM systems, broaden definition
• managing construction, building
• What versions of files and tools were used to
generate this latest release?
Manufacture
• ensuring life-cycle model
• Were all the files tested and checked for quality
before being released to the customer?
Process
modelling
• controlling team interactions
• Were all the locally made changes of the
programmers merged into the last release of the
product?
Team work
```

---

## Slide 102 — Effects

_PDF page 17, handout panel 6_

```text
Effects
Software
development
environment
Software process
model
Quality of
software product
User’s organization
CM
```

---

## Slide 103 — CM Solution

_PDF page 18, handout panel 1_

```text
CM Solution
• Capturing all the important aspects about doing
CM
Planning
• Capturing all the steps, tasks, and associated
policies and procedures needed for doing CM
Defining a process
• Catering for different user roles that exist in the
organization
Dealing with people
• Helping with maintaining integrity and quality of
the process and product
Automating
support
• Deciding when to start using CM, whether to buy
or build a CM system and how to best perform
technology transition for the CM system
Making management
decisions
```

---

## Slide 104 — Perspectives

_PDF page 18, handout panel 2_

```text
Perspectives
• organization’s view and process
of CM
Corporate
• each project group may use a
different CM system
Project
• entails the specific functionality
provided by a CM system
Developer
• how CM is applied to a specific
problem
Application
```

---

## Slide 105 — Manual procedures

_PDF page 18, handout panel 3_

```text
In-house
Manual procedures
and policies
Compiling
code
Tracking
and
dealing
with bugs
Version
control
Third-
party
solutions?
```

---

## Slide 106 — CM concepts

_PDF page 18, handout panel 4_

```text
CM Technology
CM concepts
Management
Political
Process
orientation
Standardization
```

---

## Slide 107 — The Power of

_PDF page 18, handout panel 5_

```text
CM Services Model
The Power of
Information
Workflow
Automation
A Branch
too Far
```

---

## Slide 108 — Further Reading

_PDF page 18, handout panel 6_

```text
Further Reading
• Len Bass, Ingo Weber and Liming Zhu (2015). DevOps - A
Software Architect's Perspective. Pearson Education.
• Gene Kim et al. (2016). The DevOps Handbook. IT Revolution.
• Julien Vehent (2018). Securing Devops. Manning Publications.
```

---

## Slide 109 — Thank You & See You Again

_PDF page 19, handout panel 1_

```text
Thank You & See You Again
```

---

