# Vortrex's Roleplay Resource

### Description
This is Vortrex's Roleplay Resource
---
## Setup
* Download the server from the [downloads page](https://gtaconnected.com/downloads) of the GTA Connected website.
* Download this resource via git clone or directly from GitHub with the green zip download button.
* Add this resource as-is into a resource folder of your choice inside the resources directory of your server. I named my resource folder "gtac_roleplay"
* Add the resource to the server config. You should also disable a lot of the cvars in the config too. I only have traffic, civilians, planes, and bigmap enabled.
* Add the [v-roleplay-intro](https://github.com/VortrexFTW/v-roleplay-intro) resource to your server to make the screen fade in (needs to be a separate resource)
* Download the required modules and add them to your server config. See list of modules below.
* Import the database.sql to your MySQL server, and edit database.json in the resource's config folder with the info to connect to the database.
* (Optional) Edit the email SMTP connection info. Without this, the email features will be disabled.
* Start the server and connect. Register your account, make a character, and disconnect.
* Edit your account in the database (get your account ID from the acct_main table and then edit the four entries in acct_svr for your account, changing acct_svr_staff_flags to negative 1 (-1) ... **you must not be connected to the server when doing this**
* You now have full admin. Enjoy the resource!
---
## Modules
* [MySQL](https://github.com/VortrexFTW/mod_mysql)
* [Hashing](https://github.com/VortrexFTW/mod_hashing)
* [SMTP](https://github.com/VortrexFTW/mod_smtp) (Optional)
---
### Git Branches
*The nightly branch is not recommended for public server. Some features may or may not work as intended, or the script may be broken entirely. `master` will always be the stable branch, although slower to get new features.*  
* master/main - The current release. *This branch is never committed to directly, only merged*
* nightly - The next upcoming release. All feature/fix/change branches are merged into this one.
* feature/fix/change - This is where the stuff currently being working on goes into.  
---
### Scripting Style
* Always use camelCase, even for event names.
* Use a util function where possible. Keep raw logic in command/event/network handlers to a minimum.
* Keep opening curly brackets in-line. Don't linebreak before an opening curly brackets.
* Use sentence case instead of adjacent uppercase letters in class/member names. (i.e. Id instead of ID)
* Use generic, non-specific class member names wherever possible. (i.e. databaseId instead of accountId)
* All communications from server to client are handled in server-side `client.js` script file via utils
* All communications from client to server are handled in client-side `server.js` script file via utils
* All server events are handled in `event.js` script file, sometimes with utils.
---
### Database Style
* Always use lowercase.
* Shorten prefix names to four characters or less (i.e. acct=account, veh=vehicle)
* Add an underscore between each word
* Append _main to any tables that store primary data (i.e. acct_main, ban_main, etc)
* Prefix field names with the table name, except for _main tables (i.e. acct_id, job_loc_id)
* Tables use primary index on their ID column.
* Tables use both secondary indexes & cascading foreign key links to any ID that points to another table
---
### Notes
* The resource is designed to load the script files first, then initialize after that's done.
* The IDEAS.md file is not a to-do list. It's just a random file to throw ideas into when they come to mind.
* Bitwise values are used for several different aspects related to permissions. The value of -1 is **always** used as "*all flags*" for that set.
* The script does not fade in the game camera. You'll need the [v-roleplay-intro](https://github.com/VortrexFTW/v-roleplay-intro) for that. 
* The script does not contain any content except item types. You need to spawn all businesses, houses, vehicles, jobs, job routes, etc.
