# Config documentation
<pre>
{
    <b>notification:</b> [
        {
           <b>type:</b> <i>&lt;String&gt;</i>,
           <b>token:</b> <i>&lt;String&gt;</i>,
           <b>chat_id:</b> <i>&lt;String&gt;</i>,
           <b>users:</b> <i>&lt;String[]&gt;</i>   
           <b>proxy:</b> <i>&lt;String&gt;</i>,
           <b>url:</b> <i>&lt;String&gt;</i>,
        }
    ]
}
</pre>


**notify**: set notification options in array of objects; 

**type**: required field stating the intended notification service, e.g. 'telegram'

**telegram-specific options**:

**token**: set telegram bot token;

**chat_id**: set telegram chat id;

**proxy**: set proxy for telegram api;

**users**: list of users for mention in message

**url**: if you want to send the request to some middleware service that will in turn send it to telegram, enter its url with bot token
