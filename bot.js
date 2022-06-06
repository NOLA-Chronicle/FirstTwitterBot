console.log("Twitter bot Booting up.....");


var RNDCCC = 0;
var CCGRPSGameNum = 0;

var Twit = require('twit');
var T = new Twit(
	{
		//SECRETS GO Here
		consumer_key:         '',
		consumer_secret:      '',
		access_token:         '',
		access_token_secret:  ''
	}
)

//Set up user stream.
var userStream = T.stream('user');
//Listen if someone follows me, send them a lovely message.
userStream.on('follow', followed);
//Listen if someone mentions me.
userStream.on('tweet', mentioned);

function mentioned(data)
{
	var sender = data.user.screen_name;
	var receiver = data.in_reply_to_screen_name;
	if(receiver == "Chronicle_Codes")
	{
		console.log('@' + sender + ' mentioned you!');
		
		//Save the message
		var msg = data.text;
		
		//Get all the tags
		var tags = data.entities.hashtags;
		
		//check if any of the tags are specific keywords.
		//If so execute the code block.
		for (i = 0; i < tags.length; i++)
		{
		
			//Gets the text info from the tag objects.
			tags[i] = tags[i].text.toUpperCase();
			
			//check for only one tag.
			if(tags.length = 1)
			{
			
				//check if tag is random chronicle codes counter(RNDCCC).
				if(tags[i] == "RNDCCC")
				{
				
					//If so, increase counter and post about it.
					RNDCCC += 1;
					postTweet("Thank you @" + sender + " for increasing the Random Chronicle Codes Counter\(RNDCCC\) by 1! The counter is now: " + RNDCCC);
				
				//check if tag is Chronicle Codes Game Rock Paper Scissors(CCGRPS).
				} 
				else if(tags[i] == "CCGRPS")
				{
					var userWeapon = checkMsgForWeapon(msg);
					var pcWeapon = chooseWeapon();
					
					var outcome = battle(userWeapon.toLowerCase(), pcWeapon.toLowerCase());
					
					if(outcome == "win")
					{
						CCGRPSGameNum += 1;
						postTweet("Game No." + CCGRPSGameNum + "  @" + sender + " chose " + userWeapon + ". I chose " + pcWeapon + ". You Won!");
					} 
					else if(outcome == "lose")
					{
						CCGRPSGameNum += 1;
						postTweet("Game No." + CCGRPSGameNum + "  @" + sender + " chose " + userWeapon + ". I chose " + pcWeapon + ". You Lost. :'(");
					}
					else if(outcome == "tie")
					{
						CCGRPSGameNum += 1;
						postTweet("Game No." + CCGRPSGameNum + "  @" + sender + " chose " + userWeapon + ". I also chose " + pcWeapon + ". Tie.");
					}
				}
			}
		}
	}
}

function battle(uw, pw)
{
	if(uw == pw)
	{
		return "tie";
	} 
	else if(uw == "rock" && pw == "scissors")
	{
		return "win";
	}
	else if(uw == "rock" && pw == "paper")
	{
		return "lose";
	}
	else if(uw == "paper" && pw == "rock")
	{
		return "win"
	}
	else if(uw == "paper" && pw == "scissors")
	{
		return "lose";
	}
	else if(uw == "scissors" && pw == "paper")
	{
		return "win"
	}
	else if(uw == "scissors" && pw == "rock")
	{
		return "lose";
	}
}

function chooseWeapon()
{
	var rndNum = Math.floor(Math.random() * 2);
	if(rndNum == 0)
	{
		return "rock";
	}
	else if(rndNum == 1)
	{
		return "paper";
	}
	else 
	{
		return "scissors";
	}
}

function checkMsgForWeapon(str)
{
	//list of possible choices.
	var arsenal = ["rock", "paper", "scissors"];
	//Go through all possible choices.
	for(i = 0; i < arsenal.length; i++)
	{
		//Get length of the weapon being looked for. 
		var wordSize = arsenal[i].length;
		//go through the message looking for the weapon.
		for(j = 0; j < str.length - wordSize; j++)
		{
			//get possible weapon substring.
			var strSub = str.substring(j, j + wordSize);
			//check if it is the weapon.
			if(strSub == arsenal[i])
			{
				return strSub;
			}
		}
	}
}

function followed(data)
{
	console.log('Someone followed you!');
	var name = data.source.name;
	var screenName = data.source.screen_name;
	
	postTweet("Thank you @" + screenName + " for following a bot! #AIrules");
}

function postTweet(message)
{
	var tweet = {
		status: message + '  #ChronicleCodesBot'
	}
	
	T.post('statuses/update', tweet, tweeted);
	
	function tweeted(err, data, response)
	{
		if(err)
		{
			console.log("Something went wrong!");
			console.log("Here is the error:");
			console.log('');
			console.log(err);
		} else {
			console.log("Tweeted!");
		}
	}
}