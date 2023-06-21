### Hi Coders,
## This repo powers the ACodeDaily.com 
The repo contains 3 decoupled components i.e. Interaction has been limited via api calls (except for database)
 - Frontend: The website [later to be expanded to mobile apps]

 - Backend: The repo is responsible for 
     - user authentication. 
     - business logic.
     - It leverages the APIs provided by the infra to serve the front end requests.
     - queries the database for user queries. 

- Infra: The repo is responsible for
     - periodic refreshing of user handles to get updates on their latest achievements.
     - serving the backend with outgoing calls for accesssing various platforms for example: Codeforces, Codechef, Github, Leetcode, Atcoder 
         - the process might need scraping at times hence the abstract nature makes the workflow smooth. 
     - gathering user details from the discord server (ACodeDaily)
     - periodic analaysis and updation of the internal database.


## What this project aims to achieve?
  - To serve both the Competitive programmers as well as the open source specialists. 
  - The platform would host people from the industry to refer people for roles in their respective orgs. 
  - This would give a fair chance to both the CPers and developers.
  - To develop a platform where the CP and Dev questions can be asked without any hesitation and are resolved ASAP!
      - Would add the discord CP doubts section here for serving the rich content to non discord audience.
           


## specific features 
  - signup/login for both job searchers and people willing to refer them. 
  - add and authenticate handles from various platforms and discord server. 
  - check your progress graph and compare your progress with others aka leaderboard.
  - reachout to people for referrals on the platforms.
  - People can check your profile and give referrals only to deserving candidates as they please. 
  - show discord server (AcodeDaily) forum posts here (would serve as a **stackoverflow for DSA/Competitive programming**)
  - ask doubts on the websites these doubts would be converted to forum posts and would be posted on the discord server.
  - search through various doubts based on the tags to pick topics where you can help.
  
## tech stack to be followed
  - Front End 
      - React+ Vite + TS 
  - Back end 
      - Node + TS
  - Infra 
      - Node + TS + MongoDB 


## future scope 
  - test grpc 
  - utilise microfrontends, microservices


## Progress 
  - [x] updating the readme file. 
  - [x] consensus on the tech stack to be followed
  - [x] set boiler plate code 
  - [ ] figma design
  - [ ] HLD design 
  - [ ] LLD design
  - [ ] Frontend tasks
    - [ ] user profile 
    - [ ] login/signup page
    - [ ] heatmap (including dev + CP)
    - [ ] Discussion for the mobile application (Flutter based - to be lead by Prerak)
  - [ ] Backend tasks
    - [ ] to be populated
  - [ ] Infra tasks
    - [ ] user data fetching from all platforms 
      - [ ] Leetcode 
      - [ ] Codeforces 
      - [ ] Github 
      - [ ] Codechef 
      - [ ] Atcoder
    - [ ] userhandle authentication (Everyone wants to be Tourist)
      - [ ] Leetcode 
      - [ ] Codeforces 
      - [ ] Github 
      - [ ] Codechef 
      - [ ] Atcoder 
    - [ ] discord handle authentication and score fetching 
      - [ ] the discord server score would be a function of individuals help to peers (in both CP and opensource). 
