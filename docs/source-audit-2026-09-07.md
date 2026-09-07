# Physics Atlas source and content audit

Checked on **7 September 2026**, starting from commit `6a98ba3`.

## Scope and result

- Audited all 214 existing catalogue entries and attempted all 219 distinct source/answer URLs. Retried failed requests through public web retrieval and checked available source titles, course years, question collections, and answer coverage.
- Added 60 resources, including 54 practice entries. The resulting catalogue has 274 resources, 190 practice entries, 33 books, and 29 fields.
- Recorded checks for all 281 distinct URLs in the resulting catalogue: **270 retrieved; 11 remain incompletely verified** because of access challenges or upstream server failures. These are not counted as confirmed dead links.
- Reviewed the reasoning, assumptions, and results in all 38 pre-existing worked exercises. Added two original Nanomaterials exercises, bringing the total to 40.
- Retrieved all 29 newly linked Oxford PDFs and checked their metadata against the official index. Their file hashes are distinct. Most have extractable cover pages; the scanned 2016 Quantum Condensed Matter Theory II paper relies on the official index for its subject/year. The undated topological-insulator project is labelled with the archive’s 2025 year.

The [per-URL audit record](source-audit-2026-09-07.json) records retrieval outcomes. A working collection page does not certify every nested download indefinitely. This audit checks source provenance and stated solution availability; it does not independently re-solve every university problem or validate every external solution mathematically.

## Corrections and additions

- Updated Newman’s exercise and program/data links to the author’s second-edition companion resources, matching the book already in the catalogue. Clarified that the full solution manual is restricted to instructors.
- Corrected the Euler-method explanation: at `h = 1/k`, the first step reaches zero, so the stated boundary permits nonnegative decay rather than strictly positive decay.
- Labelled Oxford’s topological-phases document as a mini-project, following the PDF itself rather than its placement under the archive’s take-home-exam heading.
- Kept mixed solution coverage explicit. For example, MIT 18.435J Quiz 2 has no posted solution, MIT 8.325 (2003) lacks a solution to set 5, and MIT 8.871 supplies solutions only for sets 1–7.
- Added Nanomaterials as a field connected to Condensed Matter and to Semester 5, with books, courses, characterization notes, practice, and original worked exercises.

| Field | Practice entries before | Practice entries after |
| --- | ---: | ---: |
| Nanomaterials | 0 | 13 |
| Condensed matter | 11 | 36 |
| Quantum field theory | 7 | 28 |
| Quantum information | 4 | 14 |
| Gauge theory & QCD | 6 | 16 |
| Many-body physics | 8 | 20 |

Entries include both individual papers and collections containing multiple papers. Relevant resources may appear under several fields, so field totals overlap.

## Verification limitations

The following 11 catalogue URLs could not be fully retrieved. Their existing references were retained; the new Cao–Wang book was identified through its official publisher listing. Browser-verification failures and timeouts alone do not show that a link is broken for a normal reader.

| Resource | Limitation |
| --- | --- |
| [Mathematical Methods in the Physical Sciences](https://www.wiley.com/en-kr/Mathematical%2BMethods%2Bin%2Bthe%2BPhysical%2BSciences%2C%2B3rd%2BEdition-p-9780471198260) | Publisher blocks automated retrieval or requires a browser verification step. |
| [An Introduction to Thermal Physics](https://global.oup.com/academic/product/an-introduction-to-thermal-physics-9780192895547) | Publisher blocks automated retrieval or requires a browser verification step. |
| [Concepts in Thermal Physics](https://global.oup.com/ukhe/product/concepts-in-thermal-physics-9780199562107) | Publisher blocks automated retrieval or requires a browser verification step. |
| [Atomic Physics](https://global.oup.com/academic/product/atomic-physics-9780198506966) | Publisher blocks automated retrieval or requires a browser verification step. |
| [Introduction to Solid State Physics](https://www.wiley.com/en-us/Introduction%2Bto%2BSolid%2BState%2BPhysics%2C%2B8th%2BEdition-p-9780471415268) | Publisher blocks automated retrieval or requires a browser verification step. |
| [Introductory Nuclear Physics](https://www.wiley.com/en-us/Introductory%2BNuclear%2BPhysics%2C%2B3rd%2BEdition-p-9780471805533) | Publisher blocks automated retrieval or requires a browser verification step. |
| [Elementary Fluid Dynamics](https://global.oup.com/academic/product/elementary-fluid-dynamics-9780198596790) | Publisher blocks automated retrieval or requires a browser verification step. |
| [Lie Algebras in Particle Physics](https://www.routledge.com/Lie-Algebras-In-Particle-Physics-from-Isospin-To-Unified-Theories/Georgi/p/book/9780738202334) | Publisher blocks automated retrieval or requires a browser verification step. |
| [Principles of Quantum Mechanics](https://www.damtp.cam.ac.uk/user/dbs26/PQM.html) | Older Cambridge server returned gateway errors/timeouts. |
| [Advanced Quantum Field Theory](https://www.damtp.cam.ac.uk/user/dbs26/AQFT.html) | Older Cambridge server returned gateway errors/timeouts. |
| [Nanostructures and Nanomaterials: Synthesis, Properties, and Applications](https://www.worldscientific.com/worldscibooks/10.1142/7885) | Publisher blocks automated retrieval or requires a browser verification step. |

## Validation

The repository validator checks JavaScript syntax, local assets, catalogue schema, topic relationships, book/exercise coverage, and solution-link consistency. Additional checks compare the changes against the starting catalogue, verify unique practice URLs, confirm the new field and Semester 5 link, and preserve unrelated application and styling files.
