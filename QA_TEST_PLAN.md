# Smart Task Planner QA Test Plan

Role: Senior QA Engineer + Senior Backend Engineer  
Goal: Break the application using negative, edge, API, graph, UI, validation, performance, and data-integrity tests.

Priority scale:

- P0: Critical, submission-blocking
- P1: Major, important for assignment quality
- P2: Minor, should improve if time permits
- P3: Nice-to-have polish

## Likely Findings To Check First

### Critical Bugs

No confirmed P0 bug from the latest automated checks. Backend tests, frontend lint, and frontend build currently pass.

### Major Bugs Or Risks

- UI uses `window.confirm` for force delete. It works, but it is less polished than the app's modal pattern.
- Frontend `parseResponse` assumes every backend error response is JSON. Malformed JSON sent to Express may produce a non-JSON error response and cause a generic frontend failure.
- Modals do not support ESC key or outside-click close.
- Create/Edit submit buttons are not disabled while a request is pending, so double-click or slow-network duplicate submissions can create/update multiple times.
- Load task failure on initial page load is not displayed to the user.

### Minor Bugs Or Risks

- Very long task fields may affect card/modal layout unless manually tested across small screens.
- There is no success message after create/edit/dependency save/delete.
- Search is client-side only, which is fine for in-memory assignment scale but not for large data.
- Duplicate task titles are allowed. This is acceptable unless product requirements say titles must be unique.

### Nice-To-Have Improvements

- Add browser/E2E tests with Playwright or Cypress.
- Add API tests for invalid JSON and wrong methods.
- Add loading and disabled states.
- Add accessible modal focus handling.
- Add API request/response examples to README.

## Test Cases

| Test ID | Module | Priority | Title | Purpose | Preconditions | Steps | Expected Result |
|---|---|---:|---|---|---|---|---|
| CT-001 | Create Task | P0 | Create valid task | Verify basic create works | App running | Open create modal, fill required fields, submit | Task appears in list with backend-generated ID internally |
| CT-002 | Create Task | P0 | Missing title | Validate required title | App running | Submit with empty title | UI/backend rejects with clear error |
| CT-003 | Create Task | P0 | Blank title | Reject blank title | App running | Submit title as empty string | Request rejected |
| CT-004 | Create Task | P0 | Whitespace title | Reject whitespace-only title | App running | Submit title as spaces/tabs | Request rejected |
| CT-005 | Create Task | P1 | Very long title | Check layout and validation | App running | Submit title with 500+ chars | Either accepted and displayed without breaking UI or rejected clearly |
| CT-006 | Create Task | P2 | Duplicate title | Confirm product behavior | Existing task title present | Create another task with same title | Allowed unless uniqueness is added; no ID conflict |
| CT-007 | Create Task | P0 | Negative effort | Validate effort positivity | App running | Submit effort `-1` | Request rejected |
| CT-008 | Create Task | P0 | Zero effort | Validate positive integer | App running | Submit effort `0` | Request rejected |
| CT-009 | Create Task | P0 | Decimal effort | Validate integer only | App running | Submit effort `1.5` | Request rejected |
| CT-010 | Create Task | P0 | String effort via API | Prevent invalid API input | Backend running | POST effort `"abc"` | 400 with meaningful error |
| CT-011 | Create Task | P1 | Huge effort | Check numeric handling | Backend running | POST effort `999999999999` | Accepted if safe integer policy allows, or rejected clearly |
| CT-012 | Create Task | P0 | Missing priority | Validate required priority | Backend running | POST without priority | 400 invalid priority |
| CT-013 | Create Task | P0 | Invalid priority | Enforce enum | Backend running | POST priority `Urgent` | 400 invalid priority |
| CT-014 | Create Task | P0 | Missing status | Validate required status | Backend running | POST without status | 400 invalid status |
| CT-015 | Create Task | P0 | Invalid status | Enforce enum | Backend running | POST status `Blocked` | 400 invalid status |
| CT-016 | Create Task | P1 | Empty category | Optional category allowed | App running | Create with blank category | Task created |
| CT-017 | Create Task | P1 | Empty description | Optional description allowed | App running | Create with blank description | Task created |
| CT-018 | Create Task | P1 | Special characters | Check encoding/display | App running | Create title/category with `!@#$%^&*()` | Saved and rendered safely |
| CT-019 | Create Task | P1 | Unicode text | Check non-ASCII display | App running | Create with Hindi/Japanese text | Saved and rendered correctly |
| CT-020 | Create Task | P1 | Emoji text | Check rendering | App running | Create with emoji in description | Saved or rejected clearly; UI not broken |
| CT-021 | Create Task | P0 | XSS payload | Ensure React escaping | App running | Create title `<script>alert(1)</script>` | Text shown harmlessly; script not executed |
| CT-022 | Create Task | P1 | SQL injection string | Ensure no unsafe behavior | App running | Create title `'; DROP TABLE tasks; --` | Treated as plain text |
| CT-023 | Create Task | P1 | Very long description | Check modal/card robustness | App running | Create description with 5000+ chars | UI remains usable |
| CT-024 | Create Task | P1 | Very long category | Check layout robustness | App running | Create category with 500+ chars | UI remains usable |
| CT-025 | Create Task | P1 | Double-click create | Detect duplicate submission | App running | Fill form, double-click Create quickly | Ideally one task created; duplicate risk should be noted |
| CT-026 | Create Task | P1 | Rapid API creates | Check ID generation | Backend running | Send 20 POST requests quickly | IDs unique and increasing |
| CT-027 | Create Task | P2 | Slow network create | Check loading behavior | Simulate slow network | Submit create | UI should not create duplicates; message should be clear |
| CT-028 | Create Task | P1 | Browser refresh | Check in-memory reset expectation | Backend running | Create task, refresh browser | Task remains if backend still running |
| CT-029 | Create Task | P1 | Backend restart | Verify assignment storage behavior | Task created | Restart backend | Data resets to seed data; documented behavior |
| ET-001 | Edit Task | P0 | Edit each field | Verify updates | Existing task | Edit title, description, priority, effort, category, status | Updated values shown |
| ET-002 | Edit Task | P1 | Edit one field only | Preserve unchanged fields | Existing task | Change only title | Only title changes; dependencies preserved |
| ET-003 | Edit Task | P1 | Edit after dependency exists | Ensure dependencies not overwritten | Task has dependencies | Edit details | Dependencies remain unchanged |
| ET-004 | Edit Task | P1 | Edit after execution plan | Ensure plan can refresh | Plan generated | Edit priority/effort | Old plan cleared or new plan generated correctly |
| ET-005 | Edit Task | P0 | Invalid effort edit | Validate update endpoint | Existing task | Edit effort to 0/-1/decimal | Rejected with error |
| ET-006 | Edit Task | P0 | Invalid priority edit | Validate update endpoint | Existing task | API PUT priority `Urgent` | 400 invalid priority |
| ET-007 | Edit Task | P0 | Invalid status edit | Validate update endpoint | Existing task | API PUT status `Blocked` | 400 invalid status |
| ET-008 | Edit Task | P1 | Cancel edit | Ensure no accidental update | Edit modal open | Change fields, click Cancel | No changes saved |
| ET-009 | Edit Task | P1 | Multiple edits quickly | Check last-write behavior | Existing task | Submit updates rapidly | Data remains valid; no corrupted fields |
| ET-010 | Edit Task | P0 | Edit deleted task by API | Validate 404 | Delete task | PUT deleted ID | 404 Task not found |
| ET-011 | Edit Task | P0 | Edit invalid ID | Validate 404 | Backend running | PUT `/tasks/T9999` | 404 Task not found |
| ET-012 | Edit Task | P1 | Backend restart while editing | Check stale modal behavior | Edit modal open | Restart backend, submit | Error shown or update fails safely |
| DM-001 | Dependencies | P0 | No dependency | Verify empty list save | Existing task | Save with no boxes checked | Dependencies become empty array |
| DM-002 | Dependencies | P0 | One dependency | Verify one edge | Two tasks | Set task B depends on A | B stores A ID |
| DM-003 | Dependencies | P1 | Many dependencies | Verify multiple edges | Many tasks | Select several dependencies | All selected IDs saved |
| DM-004 | Dependencies | P0 | Duplicate dependency via API | Prevent duplicates | Backend running | PUT dependencies `["T1","T1"]` | 400 duplicate dependency |
| DM-005 | Dependencies | P0 | Self dependency via API | Prevent self edge | Backend running | PUT T1 dependencies `["T1"]` | 400 self dependency |
| DM-006 | Dependencies | P0 | Non-existing dependency | Prevent missing edge | Backend running | PUT dependency `T9999` | 400 missing dependency |
| DM-007 | Dependencies | P1 | Dependency on deleted task | Data integrity after delete | Delete task | Try to save deleted ID by API | 400 missing dependency |
| DM-008 | Dependencies | P1 | Remove dependency | Verify edge removal | Task has dependency | Uncheck dependency and save | Dependency removed |
| DM-009 | Dependencies | P1 | Replace dependency list | Verify full replacement | Task has dependencies | Save different selection | Old dependencies replaced |
| DM-010 | Dependencies | P1 | Rapid save | Check race behavior | Dependency modal open | Click Save repeatedly | Final state valid; no duplicate IDs |
| DM-011 | Dependencies | P1 | Cancel dialog | Ensure no save | Modal open | Change checkboxes, click Cancel | Dependencies unchanged |
| DM-012 | Dependencies | P1 | Large dependency list | Check UI scroll/layout | 100 tasks | Open dependency modal | UI remains usable |
| DM-013 | Dependencies | P1 | Select all tasks | Max dependency list | 20+ tasks | Select all other tasks | Saved if no self dependency |
| DM-014 | Dependencies | P1 | Select none | Empty dependency list | Task has dependencies | Unselect all and save | Dependencies empty |
| DM-015 | Dependencies | P0 | Direct circular dependency | Allow temporary cycle | T1, T2 exist | T1 depends T2 and T2 depends T1 | Save allowed; plan later fails |
| DM-016 | Dependencies | P0 | Indirect circular dependency | Allow temporary cycle | T1 -> T2 -> T3 chain | Add T1 depends on T3 | Save allowed; plan later fails |
| DM-017 | Dependencies | P1 | Long chain | Check chain data | 50 tasks | Create T2 depends T1 ... T50 depends T49 | Saved correctly |
| DM-018 | Dependencies | P1 | Diamond graph | Check shared dependencies | A, B, C, D | B/C depend A, D depends B/C | Saved correctly |
| DM-019 | Dependencies | P1 | Tree graph | Check branching | Multiple tasks | Parent prerequisite for many children | Saved correctly |
| DM-020 | Dependencies | P1 | Multiple parents/children | Check complex graph | Many tasks | Save multi-parent and multi-child relationships | Saved correctly |
| DT-001 | Delete Task | P0 | Delete leaf node | Verify normal delete | Task no one depends on | Delete task | Task removed |
| DT-002 | Delete Task | P0 | Delete referenced task | Enforce guard | Another task depends on it | Delete normally | 409/force prompt |
| DT-003 | Delete Task | P0 | Force delete referenced task | Cleanup edges | Another task depends on it | Force delete | Task removed from all dependency lists |
| DT-004 | Delete Task | P1 | Cancel force delete | Preserve data | Delete referenced task | Click Cancel in confirm | Task remains |
| DT-005 | Delete Task | P1 | Delete root node | Check guard | Root has dependents | Delete | Rejected unless force |
| DT-006 | Delete Task | P1 | Delete middle node | Check guard | A -> B -> C | Delete B | Rejected unless force |
| DT-007 | Delete Task | P0 | Delete same task twice | Validate 404 | Task deleted | DELETE same ID again | 404 |
| DT-008 | Delete Task | P1 | Delete after plan | Plan stale handling | Plan generated | Delete task | Plan cleared or regenerated correctly |
| DT-009 | Delete Task | P1 | Delete while editing | Stale UI safety | Edit modal open | Delete same task elsewhere/API | Submit edit | 404 or safe error |
| DT-010 | Delete Task | P1 | Delete while dependency dialog open | Stale UI safety | Dependency modal open | Delete selected task/API | Save dependencies | Error or safe close |
| DT-011 | Delete Task | P1 | Delete all tasks | Empty project support | Multiple tasks | Delete/force delete all | Empty list and no-task plan work |
| DT-012 | Delete Task | P1 | Delete last task | Empty state | One task exists | Delete it | Empty list shown |
| EP-001 | Execution Plan | P0 | No tasks | Empty graph | No tasks | Generate plan | Empty plan, no crash |
| EP-002 | Execution Plan | P0 | One task | Single node | One task | Generate plan | Single task returned |
| EP-003 | Execution Plan | P1 | Two independent tasks | Priority order | Two tasks no dependencies | Generate plan | Higher priority first |
| EP-004 | Execution Plan | P0 | Linear chain | Dependency order | T1 -> T2 -> T3 | Generate plan | T1, T2, T3 |
| EP-005 | Execution Plan | P1 | Tree graph | Branching order | Tree dependencies | Generate plan | Parent before all children |
| EP-006 | Execution Plan | P1 | Diamond graph | Join dependency order | Diamond graph | Generate plan | D appears after B and C |
| EP-007 | Execution Plan | P1 | Disconnected graph | Handle components | Two separate chains | Generate plan | All tasks included, dependencies respected |
| EP-008 | Execution Plan | P0 | High priority wins | Business rule | Available High and Medium | Generate plan | High first |
| EP-009 | Execution Plan | P1 | Medium vs Low | Business rule | Available Medium and Low | Generate plan | Medium first |
| EP-010 | Execution Plan | P0 | Equal priority lower effort | Business rule | Same priority, efforts 2 and 5 | Generate plan | Effort 2 first |
| EP-011 | Execution Plan | P0 | Equal priority and effort tie by ID | Business rule | T2 and T4 same priority/effort | Generate plan | Smaller ID first |
| EP-012 | Execution Plan | P1 | 100 tasks | Scale | 100 valid tasks | Generate plan | Completes quickly, all included |
| EP-013 | Execution Plan | P1 | 500 tasks | Scale | 500 valid tasks | Generate plan | Completes within acceptable time |
| EP-014 | Execution Plan | P1 | Long chain | Recursion safety | 500 chain tasks | Generate plan | No stack overflow; correct order |
| EP-015 | Execution Plan | P1 | Star graph | Many children | One root, many dependents | Generate plan | Root first, children by priority rules |
| EP-016 | Execution Plan | P0 | Simple cycle | Cycle detection | T1 <-> T2 | Generate plan | Error returned, no plan |
| EP-017 | Execution Plan | P0 | Multiple cycles | Cycle detection | Two independent cycles | Generate plan | Error returned |
| EP-018 | Execution Plan | P0 | Self cycle | Cycle detection | API-created self edge impossible except corrupted data | Generate plan with corrupted data/test helper | Error returned |
| EP-019 | Execution Plan | P1 | Cycle after force delete | Cleanup correctness | Cycle exists involving task X | Force delete X, generate plan | Plan succeeds if cycle removed |
| EP-020 | Execution Plan | P1 | Execution twice | Idempotence | Valid graph | Generate twice | Same result; data unchanged |
| EP-021 | Execution Plan | P1 | Execution after edit | Dynamic ordering | Plan generated | Edit priority/effort, regenerate | New ordering reflects edit |
| EP-022 | Execution Plan | P1 | Execution after dependency update | Dynamic graph | Plan generated | Change dependencies, regenerate | New ordering reflects graph |
| PQ-001 | Priority Queue | P0 | Single element | Basic heap behavior | Unit level | Enqueue/dequeue one | Same element returned |
| PQ-002 | Priority Queue | P0 | Two elements | Comparator behavior | Unit level | Enqueue lower/higher priority | Higher priority dequeued first |
| PQ-003 | Priority Queue | P1 | Equal priority lower effort | Comparator behavior | Unit level | Enqueue same priority different effort | Lower effort first |
| PQ-004 | Priority Queue | P1 | Equal priority/effort ID tie | Comparator behavior | Unit level | Enqueue same priority/effort different IDs | Smaller ID first |
| PQ-005 | Priority Queue | P1 | Random order insert | Heap property | Unit level | Insert shuffled tasks | Dequeue sorted by comparator |
| PQ-006 | Priority Queue | P1 | 1000 inserts/removals | Performance/integrity | Unit level | Enqueue/dequeue 1000 tasks | No missing/duplicate elements |
| TS-001 | Topological Sort | P0 | All nodes visited | Integrity | Valid graph | Generate plan | Plan length equals task count |
| TS-002 | Topological Sort | P0 | No duplicate nodes | Integrity | Valid graph | Generate plan | Each ID appears once |
| TS-003 | Topological Sort | P0 | No missing nodes | Integrity | Valid graph | Generate plan | Every task present |
| TS-004 | Topological Sort | P0 | Indegree updates | Algorithm correctness | Multi-parent graph | Generate plan | Child appears only after all parents |
| TS-005 | Topological Sort | P1 | Graph correctness | Edge direction | A dependency of B | Generate plan | A appears before B |
| TS-006 | Topological Sort | P1 | PQ interaction | Tie among zero-indegree nodes | Several available tasks | Generate plan | Priority queue rules applied |
| API-001 | API | P1 | Wrong HTTP method | Route safety | Backend running | POST `/tasks/T1`, PATCH `/tasks/T1` | 404/405 style response, no data mutation |
| API-002 | API | P1 | Wrong endpoint | Route safety | Backend running | GET `/bad-route` | 404 |
| API-003 | API | P0 | Invalid JSON | Parser error handling | Backend running | POST malformed JSON | Clear error; server does not crash |
| API-004 | API | P0 | Missing body | Validation | Backend running | POST with no body | 400 meaningful error |
| API-005 | API | P0 | Empty body | Validation | Backend running | POST `{}` | 400 required field error |
| API-006 | API | P1 | Wrong content type | Robustness | Backend running | POST text/plain body | 400 or safe validation error |
| API-007 | API | P1 | Extra fields | Mass assignment check | Backend running | POST with `isAdmin`, custom `id`, dependencies | Unknown fields ignored; backend generates ID; dependencies empty |
| API-008 | API | P1 | Large payload | DoS safety | Backend running | POST huge description | Accepted safely or rejected with body limit |
| API-009 | API | P0 | GET invalid ID | 404 handling | Backend running | GET `/tasks/T9999` | 404 Task not found |
| API-010 | API | P0 | PUT invalid ID | 404 handling | Backend running | PUT `/tasks/T9999` | 404 Task not found |
| API-011 | API | P0 | DELETE invalid ID | 404 handling | Backend running | DELETE `/tasks/T9999` | 404 Task not found |
| API-012 | API | P0 | PUT dependencies invalid ID | 404 handling | Backend running | PUT `/tasks/T9999/dependencies` | 404 Task not found |
| API-013 | API | P1 | Null values | Robustness | Backend running | POST null fields | Rejected clearly |
| API-014 | API | P1 | Nested arrays/objects | Robustness | Backend running | POST object for title/array for effort | Rejected clearly or safely normalized |
| API-015 | API | P1 | Prototype pollution payload | Security | Backend running | POST `{"__proto__": {...}}` | No prototype pollution; app stable |
| DI-001 | Data Integrity | P0 | IDs never reused | ID rule | Create T4, delete T4 | Create next task | New ID is T5, not T4 |
| DI-002 | Data Integrity | P0 | IDs never renumbered | ID rule | Have T1,T2,T3 | Delete T2 | T1 and T3 IDs unchanged |
| DI-003 | Data Integrity | P0 | Dependencies existing | Integrity | Backend running | Try missing dependency | Rejected |
| DI-004 | Data Integrity | P0 | No duplicate dependencies | Integrity | Backend running | Save duplicate dependency IDs | Rejected |
| DI-005 | Data Integrity | P0 | No self dependency | Integrity | Backend running | Save self dependency | Rejected |
| DI-006 | Data Integrity | P0 | Force delete cleanup everywhere | Integrity | Task used by many tasks | Force delete it | Removed from every remaining dependency array |
| DI-007 | Data Integrity | P0 | Normal delete rejects referenced task | Integrity | Task has dependents | DELETE without force | 409 |
| DI-008 | Data Integrity | P1 | Execution plan does not mutate data | Idempotence | Valid graph | Generate plan, then GET tasks | Tasks unchanged |
| UI-001 | UI | P1 | Create modal opens/closes | Modal behavior | App running | Click Create, Cancel | Modal opens then closes |
| UI-002 | UI | P1 | View modal opens/closes | Modal behavior | Existing task | Click View, Close | Modal opens then closes |
| UI-003 | UI | P1 | Dependency modal opens/closes | Modal behavior | Existing task | Click Dependencies, Cancel | Modal opens then closes |
| UI-004 | UI | P2 | ESC key closes modal | Accessibility | Modal open | Press ESC | Ideally closes; currently likely not supported |
| UI-005 | UI | P2 | Outside click closes modal | UX | Modal open | Click overlay | Ideally closes; currently likely not supported |
| UI-006 | UI | P1 | Checkbox state persists before save | Dependency UX | Modal open | Check/uncheck boxes | State reflects clicks |
| UI-007 | UI | P1 | Search title | Filter behavior | Tasks exist | Search by title | Matching tasks shown |
| UI-008 | UI | P1 | Search category/status | Filter behavior | Tasks exist | Search category/status | Matching tasks shown |
| UI-009 | UI | P1 | Empty project | Empty state | Delete all tasks | View list and plan | No crash; useful empty messages |
| UI-010 | UI | P2 | Responsive layout | Mobile usability | Browser narrow | Use app | No overlapping text/buttons |
| UI-011 | UI | P2 | Long names | Layout robustness | Long title/category | View card/modal | Text wraps, no overflow |
| UI-012 | UI | P2 | Scroll behavior | Large lists | 100 tasks | Scroll page/modal | Usable scroll |
| UI-013 | UI | P1 | Error messages | User feedback | Trigger validation error | Observe UI | Clear message shown |
| UI-014 | UI | P2 | Success messages | User feedback | Create/edit/delete | Observe UI | Nice-to-have confirmation |
| UI-015 | UI | P1 | Buttons disabled while submitting | Duplicate prevention | Slow network | Submit form repeatedly | Ideally disabled; currently risk exists |
| SEC-001 | Security | P0 | XSS in title | Client rendering safety | App running | Create script title | Script not executed |
| SEC-002 | Security | P0 | HTML injection | Client rendering safety | App running | Create `<img onerror=alert(1)>` | Rendered harmlessly |
| SEC-003 | Security | P1 | JSON injection | API robustness | Backend running | Send nested/malicious JSON | No crash/no pollution |
| SEC-004 | Security | P1 | Massive payload | Availability | Backend running | Send very large payload | Server handles safely or rejects |
| SEC-005 | Security | P1 | Unexpected object fields | Mass assignment | Backend running | POST custom ID/dependencies | Ignored or normalized safely |
| PERF-001 | Performance | P1 | 100 tasks CRUD | Basic scale | Backend running | Create/manage 100 tasks | App remains responsive |
| PERF-002 | Performance | P1 | 500 tasks execution | Algorithm scale | Backend running | Generate plan for 500 tasks | Completes quickly |
| PERF-003 | Performance | P2 | 1000 tasks execution | Stress | Backend running | Generate plan for 1000 tasks | Completes or clear limits documented |
| PERF-004 | Performance | P1 | Repeated execution | Stability | Valid graph | Generate plan 100 times | Stable, no mutation |
| PERF-005 | Performance | P1 | Repeated dependency updates | Stability | Many tasks | Update dependencies repeatedly | Data remains valid |
| BR-001 | Business Rules | P0 | Backend generates IDs | ID ownership | Create via API with supplied ID | POST `id:"BAD"` | Backend ignores supplied ID |
| BR-002 | Business Rules | P0 | User never enters IDs | UI rule | Use frontend | Create/manage dependencies | No ID input shown |
| BR-003 | Business Rules | P0 | Dependencies separate from create/edit | Architecture rule | Use create/edit forms | Inspect fields | No dependency field shown |
| BR-004 | Business Rules | P0 | Cycle detection only on execution | Workflow rule | Create cycle through dependency modal/API | Save dependencies | Save succeeds; Generate Plan fails |
| BR-005 | Business Rules | P0 | Combined invalid create | Multi-rule validation | Backend running | Missing title + invalid effort + invalid status | Rejected; at least one clear error |
| BR-006 | Business Rules | P0 | Combined invalid dependency update | Multi-rule validation | Backend running | Duplicate + self + missing dependency | Rejected; data unchanged |

## Manual Regression Flow

Run this once before submission:

1. Start backend and frontend.
2. Create three tasks.
3. Edit one task's title, priority, effort, and status.
4. Add dependencies using titles in the dependency modal.
5. Generate an execution plan and verify dependency order.
6. Create a temporary cycle.
7. Generate plan and verify the cycle error.
8. Remove the cycle and verify plan works again.
9. Try deleting a referenced task and verify normal delete is rejected.
10. Force delete it and verify dependencies are cleaned up.
11. Search by title, category, priority, and status.
12. Refresh the browser and confirm data remains while backend is still running.
13. Restart backend and confirm seed data returns.
