# AOP-Ts3
This resource allows you to change instantly update the AOP of your server into a teamspeak channel from FiveM!
## Install

- Drag the AOP-Ts3 resource into your server resource folder.
- Open the `confg.json` file in your perfered editor of choice
---
### Configuration
- The `command name` is what the name of the command should be
- Under `permissions` you can toggle this on or off. This just restricts the command to a certain discord role or roles.
- The `time settings` allows you to display the time the AOP was changed on the TeamSpeak channel. This can be turned off
- Under `ts3 settings` You **must** fill this section out or you will be met with errors.
    - The host is the IP of the server your TeamSpeak is hosted off of. If it is hosted on the same server as your FiveM server then in most cases it can be left as *localhost*
    - The queryport, serverport, and username should be left as is unless you changed it yourself.
    - Your querypassword was giving to you when you created the teamspeak. If you create a new query account is created you must update the username to reflect that.
    - The Nickname can be set to anything, but please keep it short as their is a character limit for usernames on TeamSepeak.
    - `channel_id` is the ID of the channel you want the AOP to be displayed and is recomened to be a spacer channel. You can change how the text reacts in the `server.js` file
- `discord logs` allows you to log when the aop is changed and doesn't require you to setup the discord part just that you create a webhook for the channel.
---
## Support
Currently I don't have anyway to contact me directly, but the best way to recive support is here on github, the fivem forums, or any FiveM discord that offers scripting support.
