# Foundational practice review — 9 September 2026

Added **118 individual papers and problem sheets**, and tagged **5 existing individual papers**. The focused catalogue contains **123 distinct question PDFs** and **264 topic assignments** across all 38 existing units in the five foundational fields. Every unit has at least five distinct documents. Mixed papers may appear under several relevant topics; the counts are not additive.

## How to use it

Open **Practice → Field → Subtopic**, or open a field’s **Topic map** and select a unit. Each focused card identifies the relevant questions. The URL records the field, subtopic, level and solution filter so it can be bookmarked. No answer key is required for a question paper to appear.

## Coverage

| Field | Subtopic | Distinct papers |
| --- | --- | ---: |
| Classical mechanics | Newtonian dynamics | 6 |
| Classical mechanics | Energy & momentum | 7 |
| Classical mechanics | Oscillations | 11 |
| Classical mechanics | Central forces | 8 |
| Classical mechanics | Lagrangian mechanics | 7 |
| Classical mechanics | Hamiltonian mechanics | 5 |
| Classical mechanics | Rigid bodies | 7 |
| Classical mechanics | Chaos | 6 |
| Electromagnetism | Electrostatics | 8 |
| Electromagnetism | Gauss’s law | 5 |
| Electromagnetism | Potential & boundary conditions | 8 |
| Electromagnetism | Dielectrics | 5 |
| Electromagnetism | Magnetostatics | 7 |
| Electromagnetism | Induction | 7 |
| Electromagnetism | Maxwell’s equations | 7 |
| Electromagnetism | Radiation | 8 |
| Thermal physics | Laws of thermodynamics | 8 |
| Thermal physics | Equations of state | 8 |
| Thermal physics | Entropy | 8 |
| Thermal physics | Thermodynamic potentials | 6 |
| Thermal physics | Maxwell relations | 6 |
| Thermal physics | Heat engines | 5 |
| Thermal physics | Phase equilibrium | 8 |
| Oscillations and waves | Harmonic motion | 7 |
| Oscillations and waves | Damping & resonance | 5 |
| Oscillations and waves | Normal modes | 9 |
| Oscillations and waves | Wave equation | 5 |
| Oscillations and waves | Superposition | 6 |
| Oscillations and waves | Fourier analysis | 7 |
| Oscillations and waves | Dispersion | 8 |
| Quantum mechanics | Wavefunctions | 8 |
| Quantum mechanics | Operators & measurement | 9 |
| Quantum mechanics | Bound states | 9 |
| Quantum mechanics | Angular momentum | 6 |
| Quantum mechanics | Spin | 7 |
| Quantum mechanics | Perturbation theory | 5 |
| Quantum mechanics | Identical particles | 5 |
| Quantum mechanics | Scattering | 7 |

## Source verification

Opened official course/author sources and retrieved each selected question PDF; inspected question text for relevance. Focus notes identify fully stated questions where a sheet also references textbooks. Solution files were retrieved and matched to the source course and set; their mathematical answers were not independently re-solved.

All 123 selected question PDFs were retrieved successfully, identified as PDFs and content-hashed. 40 focused resources have separately retrieved, matching official solution documents. For engineering dynamics, the main worked solutions and concept-answer files are separate, so the cards say Selected solutions.

Only institution-hosted or author-hosted materials are linked. No third-party question text, scans or solutions are copied into this repository. Descriptions and focus notes are independently written. Course-source links allow readers to inspect the original context and licensing.

The [machine-readable review](foundational-practice-2026-09-09.json) records every question URL, source page, document hash, retrieval status, solution match and topic-specific coverage note. It records this addition; it does not repeat the earlier whole-catalogue audit. Availability can change after this review.

## Scope and source limitations

- A mixed sheet counts only for the fully stated relevant questions identified in its focus notes. Textbook exercise-number lists and source collection indexes do not count toward the five-paper minimum.
- The chaos unit includes nonlinear-dynamics preparation: limit cycles, bifurcations, Poincare maps and parametric instability, as well as explicit chaotic systems and maps. Numerical parts require plotting or computation.
- Some courses publish closely related questions across years. These are disclosed where identified; distinct PDF hashes do not mean every question is novel. The 2016 and 2018 identical-particle sheets overlap in exchange questions but also supply different additional tasks.
- MIT 8.044 Exam 3 is dated 2003 inside the PDF, although its OCW resource label refers to the 2013 archive. Its helium-contact problem also appears in 2013 Problem Set 7; it is not counted as a heat-engine problem.
- MIT 8.333 Test 1 Review is a 2007 sheet in the 2013 course. MIT 8.04’s final cover prints May 24, 2012 although it is archived in Spring 2013. Neither mismatch is silently rewritten.
- RES.2-008 filenames say Summer 2022 while the question PDF says MOSTEC 2021; the card discloses both. Its selected Questions 1–3 are written exercises, while later questions require coding.
- The MIT 8.02 worksheet labelled EM radiation on the source list actually develops displacement current and energy flow into a capacitor; the catalogue labels and tags its actual contents.
- Graduate-level electromagnetic and thermal sheets are labelled Graduate. Difficulty is an editorial guide, and all-level counts are the five-paper guarantee. Filtering to one level or to worked solutions can produce fewer than five.

## Validation

`node scripts/validate.mjs` checks catalogue integrity, all 38 units, at least five distinct question hashes per unit, review metadata, source and solution consistency, filter intersections and bookmark-route round trips. Browser verification of the deployed page is performed separately.

The original carousel, books, study paths, worked exercises and other repositories are outside this change.
