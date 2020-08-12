## Members

* Jingzheng Song
* Menglin Shen

## Links

UI: https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_CrazyFit_UI

API: https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_CrazyFit

## Overview

CrazyFit a fitness web application that intends to help people who want to lose weight and keep a healthy lifestyle. This website provides healthy food recipes, food intake tracker, exercise calories tracker and an alarm to record exercise. Our goal is to help people stay on track and reach the goal. Example user email: song.jingz@husky.neu.edu, password: 111

### Iteration 1

In Iteration 1, we use express, mongoose and graphql to create a basic implementation of CrazyFit back-end services. We create types and relations to represent user's daily food records and exercises records.
Here are some examples of basic CRUD
- ![1](/screenshots/connect.png)
- ![2](/screenshots/beforeEdit.png)
- ![3](/screenshots/afterEdit.png)
- ![4](/screenshots/successAdd.png)


### Iteration 2
In Iteration 2, we add more fields in our food type, exercise type and more muations. In the UI part, we bind these queries and mutations with components and enable add, delete, edit like features. We also use third party library auth0 and store user information in mongodb. (Google login is not stored in db, we are resolving the issues). 

- ![1](/screenshots/moreFields.png)
- ![2](/screenshots/auth0Users.png)
- ![3](/screenshots/foodsWithTime.png)


### Iteration 3

In iteration 3, we replaced the previous temporary auth0 login and enabled out own login/logout flow. We can add users' information to database when clicking signup button. The registered users can then signin when they click login button. The login queries get the jwt token back and use the token to protect routes. Logged in users will get their own saved foods, exercises and displayed history. We then save the token and set it as cookie to persist users' login status. Furthermore, we finish all the pages in footer. All users can send messages to Menglin's email, and the messages will be stored in database as well.

- ![1](/screenshots/userMessage.png)
- ![2](/screenshots/myAccount.png)

## Contributions

Jingzheng Song:

1. Focused on backend API and realized the CRUD functionality on MongoDB and handles the request from the client.
2. Developed GraphQL queries and mutations for food, exercise, alarm and history pages.
3. Created the GET and POST methods on API to realize the functionality. 
4. Deployed the backend and frontend to Heroku.
5. Debugging.

Menglin Shen:

1. Focused on frontend UI and designed all the main pages.
2. Integrated an authentication login and signup form with Auth0 and Google credentials.
3. Developed the Auth0 authentication and started working on the connection of users database on MongoDB.
4. Deployed frontend to Heroku.
5. Debugging.



