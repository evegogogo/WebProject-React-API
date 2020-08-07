## Members

* Jingzheng Song
* Menglin Shen

## Links

UI: https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_CrazyFit_UI

API: https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_CrazyFit

## Overview

CrazyFit a fitness web application that intends to help people who want to lose weight and keep a healthy lifestyle. This website provides healthy food recipes, food intake tracker, exercise calories tracker and an alarm to record exercise. Our goal is to help people stay on track and reach the goal.

### Iteration 2
In Iteration 2, we add more fields in our food type, exercise type and more muations. In the UI part, we bind these queries and mutations with components and enable add, delete, edit like features. We also use third party library auth0 and store user information in mongodb. (Google login is not stored in db, we are resolving the issues). 

- ![1](/screenshots/moreFields.png)
- ![2](/screenshots/auth0Users.png)
- ![3](/screenshots/foodsWithTime.png)



### Iteration 1

In Iteration 1, we use express, mongoose and graphql to create a basic implementation of CrazyFit back-end services. We create types and relations to represent user's daily food records and exercises records.
Here are some examples of basic CRUD
- ![1](/screenshots/connect.png)
- ![2](/screenshots/beforeEdit.png)
- ![3](/screenshots/afterEdit.png)
- ![4](/screenshots/successAdd.png)

