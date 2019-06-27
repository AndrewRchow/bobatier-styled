# BobaTier

## Dev Instructions
Open folder in VS Code, open terminal
```shell
npm install 
```
then to build
```shell
npm start 
```

Pages are in the "pages" folder  
* Tier List = Landing/index.js
  - Grades are given by averaging all combined scores
  - Tiers are determined by total average score 1-5 and seperated linearly
  - Scores are shown below with number of users who reviewed
* Recent Reviews = Reviews/index.js
  - Shows 50 most recent reviews
  - Comments can be added if user is signed in 
* My Reviews = Home/index.js
  - User can add/edit/delete their own reviews
  - Shop name input will autosuggest any previously submitted names from all users, currently no initial list.
  - *Had trouble styling the toastr*
* Account = Account/index.js
  - Only email reset atm
