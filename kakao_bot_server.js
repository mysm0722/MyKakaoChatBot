const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var app = express();

// SSL Settings
var https_options = {
    ca: fs.readFileSync('/etc/letsencrypt/live/bot.mycloud1.ga/chain.pem', 'utf8'),
    key: fs.readFileSync('/etc/letsencrypt/live/bot.mycloud1.ga/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/bot.mycloud1.ga/fullchain.pem', 'utf8')
};

// JSON Parser
app.use(bodyParser.json());

// Kakao API - Keyboard Router
app.get('/keyboard', (req, res) => {
    const menu = {
        type: 'buttons',
        buttons: ["NCP Portal", "NCP User Guide", "NCP Console"]
    };

	let keyboard = {
    	"type" : "text"
  	};

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(keyboard));
});

var helpText =
    "[ NCP Help ] \n\n" +
    "@guide(@g) : NCP User Guide \n" +
    "@portal(@p) : NCP Portal Site \n" +
    "@help(@h) : ChatBot Help  \n" +
    "";

var helpArrayText = {
    "message": {
      "text": helpText,
      "message_button": {
        "label": "Naver Cloud Platform.",
        "url": "https://www.ncloud.com"
      }
    },
    "keyboard": {
      "type": "text"
    }
}

var guideUrlText =
    "[ NCP User Guide ] \n\n" +
    "NCP User Guide : http://docs.ncloud.com/ko/\n" +
    "";

var guideUrlArrayText = {
    "message": {
      "text": guideUrlText,
      "message_button": {
        "label": "User Guide",
        "url": "http://docs.ncloud.com/ko/"
      }
    },
    "keyboard": {
      "type": "text"
    }
}

var portalUrlText =
    "[ NCP Portal Site ] \n\n" +
    "NCP Portal Site : http://www.ncloud.com\n" +
    "";

var portalUrlArrayText = {
    "message": {
      "text": guideUrlText,
      "message_button": {
        "label": "NCP Portal",
        "url": "http://www.ncloud.com"
      }
    },
    "keyboard": {
      "type": "text"
    }
}

// Kakao API - Keyboard Router
app.post('/message', (req, res) => {

    // Require API Connection
    const _obj = {
        user_key: req.body.user_key,
        type: req.body.type,
        content: req.body.content
    };

	let answer = {
    	"message":{
      		"text":"your message is arrieved server : "+ _obj.content // in case 'text'
    	}
  	}

    // Message Command
	if (_obj.content == '@help' || _obj.content == '@h' ) {
		answer = helpArrayText;
	} else if (_obj.content == '@portal' || _obj.content == '@p' ) {
		answer = portalUrlArrayText;
	} else if (_obj.content == '@guide' || _obj.content == '@g' ) {
        answer = guideUrlArrayText;
	} else {
		answer = helpArrayText;
	}
		
	// Reply Answer
    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(answer));
});

// HTTPS Server
https.createServer(https_options, app).listen(443, function(){
    console.log("@NCP Kakao Bot Server is Running");
});
