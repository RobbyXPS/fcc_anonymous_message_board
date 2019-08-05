# Information Security and Quality Assurance Projects - Anonymous Message Board

### _User stories_

1. Only allow your site to be loading in an iFrame on your own pages.
2. Do not allow DNS prefetching.
3. Only allow your site to send the referrer for your own pages.
4. I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.(Recommend res.redirect to board page /b/{board}) Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
5. I can POST a reply to a thread on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.(Recommend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.
6. I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.
7. I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
8. I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')
9. I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')
10. I can report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id. (Text response will be 'success')
11. I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 'success')
12. Complete functional tests that wholly test routes and pass.

#### Companion app to test with
- https://pricey-hugger.glitch.me/

  <br>
  <br>
  <br>
  <br>

### _Technology and how it was used_

#### Security features (Helmet JS)
    WHAT: FRAMEGUARD
        - HOW: Prevents clickjacking via header setting.
            - WHY: Clickjacking is when attackers use hidden UI elements overlayed on your site to get people to click on them without them knowing it.
    WHAT: DNS PREFETCHING
        - HOW: Prevents the browsers from prefectching dns requests via header setting.. 
            - WHY: Usually browsers start prefectching before the user clicks on a link, this helps with performance. Some users want this disabled because it can make them appear as if they visited something they did not.
    WHAT: REFERRER POLICY
        - HOW: Prevents sites from knowing where the user came from when clicking a link via header setting.
            - WHY: You may not want an external website to know users are coming from your website. You can get this info internal to your site by setting 'same-origin'.

#### Back-End features (Node + Express)

    - CRUD endpoints to handle board/thread/reply data.

#### Front-End features (HTML + AJAX + BOOTSTRAP)

    - Front-End > Back-End communication via AJAX requests for dynamic data generation.
    - Responsive design via HTML and mobile first Bootstrap library. 

#### Database

    - MongoDB managed in the cloud via https://www.mongodb.com/cloud.
    - Mongoose ODM (Object Document Mapper) used to make DB interactions more graceful. 

#### Test

    - Basic API tests written with Chai testing framework.
    
    

#### Notes:
  
  .env file is not included in repo, need to add with below code.

  `DB=SECRETKEY_URI_DB`  
  `NODE_ENV=notest`
