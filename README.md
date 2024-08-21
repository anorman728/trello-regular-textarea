This is a quick & dirty and *highly imperfect* solution to Trello trying to force their unusable rich text/markdown frankeneditor down our throats.  It only applies to comments, not descriptions.  (I made this for myself, and I'm more concerned about the comments, but of course anybody can make a change to this to make it better.)

It adds a textarea above the comment box.  This is *just* a textarea, so it won't change your formatting on the fly, but unfortunately it also won't let you @ people with tab-completion.  You can write markdown-compatible text here, and when you press Ctrl+Enter, it will copy it over to the frankeneditor where you can add any @ completions, or just hit Ctrl+Enter again to post the comment.

This is new and slapped together quickly, so I can't promise it will work 100%, and I also can't promise that Trello won't change something that will break it.

You'll need to install an extension like Tampermonkey to get this to work.  I tried to add this to Greasyfork, but they wouldn't allow it because it uses an "unapproved external script".
