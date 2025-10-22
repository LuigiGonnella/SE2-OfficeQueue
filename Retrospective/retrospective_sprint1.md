TEMPLATE FOR RETROSPECTIVE (Team 15)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 

      3 committed vs 1 done

- Total points committed vs. done 

      6 committed points vs 1 point done

- Nr of hours planned vs. spent (as a team)



**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing

    92 tests

- Code review completed

    0 completed

- Code present on VCS
  

- End-to-End tests performed

    0 tests

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

|      Story      | # Tasks | Points | Hours est. | Hours actual |
| :-------------: | :-----: | :----: | :--------: | :----------: |
| _Uncategorized_ |    6    |   -    | 23 h 45 m  |  33 h 15 m   |
|  _Get Ticket_   |    5    |   -    |    10 h    |   5 h 45 m   |
| _Next Customer_ |    6    |   -    | 15 h 30 m  |     14 h     |
| _Call Customer_ |    4    |   -    | 11 h 30 m  |   6 h 30 m   |

> story `Uncategorized` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean | StDev |
| ---------- | :--: | :---: |
| Estimation | 174  |  153  |
| Actual     | 170  |  232  |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = -2\% $$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| = 29\% $$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated

      4h 30m

  - Total hours spent

      3h
  - Nr of automated unit test 
  cases

      92 tests 
  - Coverage

      95.03%

```
-----------------|---------|----------|---------|---------|-------------------
File             |  Stmts  | Branch   | Funcs   |  Lines  | Uncovered Lines   
-----------------|---------|----------|---------|---------|-------------------
All files        |   95.03 |    85.18 |   96.15 |   95.71 |                   
 src             |     100 |      100 |     100 |     100 |                   
  utils.ts       |     100 |      100 |     100 |     100 |                   
 ...repositories |   94.65 |     82.6 |      96 |   95.38 |                   
  ...pository.ts |     100 |      100 |     100 |     100 |                   
  ...pository.ts |     100 |      100 |     100 |     100 |                   
  ...pository.ts |     100 |      100 |     100 |     100 |                   
  ...pository.ts |     100 |      100 |     100 |     100 |                   
  ...pository.ts |   84.09 |    66.66 |   85.71 |   86.04 | 71,106-125        
-----------------|---------|----------|---------|---------|-------------------
```

Test Suites: 5 passed, 5 total
Tests:       92 passed, 92 total

- E2E testing: (we consider Integration instead)
  - Total hours estimated

      1d 2h 30m
  - Total hours spent

      0
  - Nr of test cases

      0
- Code review 
  - Total hours estimated 

      0
  - Total hours spent

      0
  


## ASSESSMENT

- What did go wrong in the sprint?

- What caused your errors in estimation (if any)?

- What lessons did you learn (both positive and negative) in this sprint?

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two

- One thing you are proud of as a Team!!