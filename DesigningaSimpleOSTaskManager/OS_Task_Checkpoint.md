OS Task Manager — Checkpoint
=================================

Part 1 — Process Scheduling
---------------------------

Processes:
- P1: arrival 0, burst 5
- P2: arrival 1, burst 3
- P3: arrival 2, burst 1

1) FCFS

Gantt (time):
P1 |0----5| P2 |5---8| P3 |8-9|

Completion times: P1=5, P2=8, P3=9
Waiting times = completion - arrival - burst
- P1: 5 - 0 - 5 = 0
- P2: 8 - 1 - 3 = 4
- P3: 9 - 2 - 1 = 6
Average waiting time = (0 + 4 + 6) / 3 = 10 / 3 = 3.333

2) Round Robin (quantum = 2)

Simulate (ready queue evolves with arrivals):
- t0–2: P1 (rem 3)
- t2–4: P2 (rem 1)
- t4–5: P3 (rem 0) — completes at 5
- t5–7: P1 (rem 1)
- t7–8: P2 (rem 0) — completes at 8
- t8–9: P1 (rem 0) — completes at 9

Gantt: P1|0-2| P2|2-4| P3|4-5| P1|5-7| P2|7-8| P1|8-9|

Completion times: P1=9, P2=8, P3=5
Waiting times:
- P1: 9 - 0 - 5 = 4
- P2: 8 - 1 - 3 = 4
- P3: 5 - 2 - 1 = 2
Average waiting time = (4 + 4 + 2)/3 = 10/3 = 3.333

Responsiveness: Round Robin is more responsive because it gives each ready process short CPU bursts quickly (reduces response time for later-arriving or short jobs), even if average waiting time happens to match FCFS in this small example.

Part 2 — Process Synchronization
--------------------------------

Scenario: Two processes P1 and P2 each increment a shared `counter` 100 times.

What can go wrong without synchronization:
- Race conditions: two threads may read the same value simultaneously, increment independently, and write back the same result — increments lost.
- Final counter may be less than 200 due to lost updates.

Suggested mechanism: Mutex (mutual exclusion lock).

Pseudocode (conceptual):

shared counter = 0
mutex m

Process P1:
for i = 1 to 100:
    m.lock()
    counter = counter + 1
    m.unlock()

Process P2:
for i = 1 to 100:
    m.lock()
    counter = counter + 1
    m.unlock()

If using semaphores: use a binary semaphore initialized to 1 and `wait()`/`signal()` around the increment.

Part 3 — Memory Management (Paging)
----------------------------------

Process needs pages: references = [1, 2, 3, 2, 4, 1, 5]
Available frames = 3

1) FIFO replacement

Frames progression (showing faults 'F'):
- access 1: [1, -, -]  F (1)
- access 2: [1, 2, -]  F (2)
- access 3: [1, 2, 3]  F (3)
- access 2: [1, 2, 3]  hit
- access 4: replace FIFO (1) -> [4, 2, 3]  F (4)
- access 1: replace next FIFO (2) -> [4, 1, 3]  F (5)
- access 5: replace next FIFO (3) -> [4, 1, 5]  F (6)

Total FIFO page faults = 6

2) LRU replacement

Frames progression:
- access 1: [1, -, -] F (1)
- access 2: [1, 2, -] F (2)
- access 3: [1, 2, 3] F (3)
- access 2: hit (update recency)
- access 4: replace LRU (1) -> [4, 2, 3] F (4)
- access 1: replace LRU (3) -> [4, 2, 1] F (5)
- access 5: replace LRU (2) -> [4, 5, 1] F (6)

Total LRU page faults = 6

Comparison: Both algorithms produce 6 page faults for this reference string and 3 frames. Generally LRU performs better when recent references predict near-future use (it exploits temporal locality), but for this small example both behave equally.

Part 4 — Disk Scheduling
------------------------

Initial head position = 53
Requests: [98, 183, 37, 122, 14, 124, 65, 67]

1) FCFS (order given)

Movements (absolute distances):
- 53 -> 98 = 45
- 98 -> 183 = 85
- 183 -> 37 = 146
- 37 -> 122 = 85
- 122 -> 14 = 108
- 14 -> 124 = 110
- 124 -> 65 = 59
- 65 -> 67 = 2

Total head movement = 45+85+146+85+108+110+59+2 = 640 tracks

2) SSTF (Shortest Seek Time First)

Choose next request with smallest distance from current head at each step.
Sequence chosen and distances:
- 53 -> 65 = 12
- 65 -> 67 = 2
- 67 -> 37 = 30
- 37 -> 14 = 23
- 14 -> 98 = 84
- 98 -> 122 = 24
- 122 -> 124 = 2
- 124 -> 183 = 59

Total head movement = 12+2+30+23+84+24+2+59 = 236 tracks

Conclusion: SSTF is far more efficient here (236 vs 640) because it minimizes immediate seek distance at each decision point.

Final notes & next steps
------------------------
- I prepared this report as Markdown. If you'd like, I can export to a PDF file for you and place it in the workspace. Reply "Export PDF" to request the PDF, or tell me if you instead want a PowerPoint.
