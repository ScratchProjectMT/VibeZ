# VibeZ

Current Application Flow:
1. Client goes to our home page (localhost:8080)
2. Client is served index.html -> Need to change to Authorize Vibez/Sign In to Slack page
3. Client is redirected to Authorize Vibes page
4. Client is redirected to /slack/oauth
5. Verify access token
6. Client is redirected to the main page ('/')


Useful things to know:
-App name on slack: VibeZTest
-Redirect setting on VibeZTest set to '/slack/oath' !!!!!
-Need to be a collaborator to edit the app

Resources:
-https://api.slack.com/docs/conversations-api
-https://api.slack.com/docs/oauth

Collaborators:
-Adam Stover
-Jason Lee
-Kevin Nam
-Bryan Villafuerte