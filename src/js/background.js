function bginit()
{
	log("Event", "BGInit");
	
	extVersion = getVersion();
	
	resetSettings();
	maintainLoop();
	
	//Refresh the cache
	//killCachedCalendars();
	//generate2NYearsOfData(7);
	
	googleTrack("Extension", "Initialized", extVersion);
	
}

//Run maintenance script every minute
function maintainLoop()
{
	maintain();
	var t = setTimeout("maintainLoop()", 60000);
}

//Maintain data
function maintain()
{
	log("Event", "maintain()");

	updateBadgeFromStored();
	updatePopupFromStored();
	updateIconFromStored();

	setToolTip(new Date().toLocaleDateString());

}

//Fill the cache
function generate2NYearsOfData(years)
{
	var thisYear = new Date().getFullYear();;
	
	for(var i = (thisYear - years); i< (thisYear + years); i++) {
		
		for(var j = 1; j < 13; j++)
		{
			log("Generating",i+"_"+j);
			new Calendar(i,j).getCal();
		}
	}
	
}

//Kill the cache
function killCachedCalendars()
{
	var storage = window.localStorage;
	
	log("Storage length",storage.length);
	
	for(var prop in storage){ 
		
		if(prop.substring(0,4) == "cal_")
		{
			log("Storage delete",prop);
			removeItem(prop);
		}
	}
	
	log("Storage length",storage.length);
	
}

function resetSettings()
{
	log("Event", "resetSettings()");

	var badgeColor = getItem("badgeColor");

	if(badgeColor == null) {
		var color = "#18CD32";
		setItem("badgeColor", color);
		log("setting up default badge color");
	}

	var popup = getItem("popup");
	if(popup == null) {
		var popup = "12";
		setItem("popup", popup);
		log("setting up default popup");
	}

	var iconColor = getItem("iconColor");
	if(iconColor == null) {
		var popup = "red";
		setItem("iconColor", popup);
		log("setting default icon color");
	}

}

function updateIconFromStored()
{
	var iconColor = getItem("iconColor");
	setIcon(iconColor);
}



function updateBadgeFromStored()
{
	var countto = getItem("countto");

	if(countto != null)
	{
		try {
			var badgeDate = new Date((countto*1)+86400000); //Stupid casting

			var diff = Math.abs(badgeDate.getDaysFromToday());

			if(badgeDate.getFullYear() > 1980 && badgeDate.getFullYear() < 2050)
			{
				setBadge(diff);
			}
		}
		catch(err)
		{

		}

	}
}

function updatePopupFromStored()
{
	var popup = getItem("popup");
	setPopup(popup);
}

//Listen for external stuff
//chrome.extension.sendRequest({action: "trackEvent", event_type:category, event_action:action, event_details:details});
chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse) {
			if (request.action == "trackEvent") {

				sendResponse({response: "ok"});
				log("Google Analytics", request.event_type + ": "+request.event_details);
				_gaq.push(['_trackEvent', request.event_type, request.event_action, request.event_details]);

			}
			else if (request.action == "killcache") {

				sendResponse({response: "ok"});

				killCachedCalendars();
				generate2NYearsOfData(2);
				
				log("Options event", "Killing cache");

			}			
			else if (request.action == "refresh") {

				sendResponse({response: "ok"});

				log("Options event", "Refreshing settings");

				maintain();

			}
			else
				sendResponse({}); // snub them.
		});


