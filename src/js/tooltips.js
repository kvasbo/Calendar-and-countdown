/**
 *  Handle tooltip related stuff
 */


//Add tooltip to a field
function addToolTip(id, elementid)
{
	$(id).tooltip({ 
		effect: 'slide',
		offset:	[0, 0],
		predelay: 500,
		opacity: 1,
		layout: getToolTip(elementid)
	}).dynamic({ bottom: { direction: 'down', bounce: true } }); 
}


function getToolTip(id)
{
	//Recreate date object from time stamp
	var stampTmp = id.split('_');
	var stamp = parseInt(stampTmp[2]);

	var date = new Date(stamp);

	var gmtOffset = date.getTimezoneOffset() * 60000;

	//Get the base variables in order
	var ndate = new Date(date.getTime() - gmtOffset);
	var moonphase = getLunarPhase(ndate);
	var day = ndate.getDay();
	var month = ndate.getMonth();
	var mDay = ndate.getDate();

	var dayDiffCountShow = false;

	//Should we count up/down to date in popup?
	if(oldId != false){

		var countDate = new Date(oldId*1); 	//Stupid casting again

		var dayDiffCountDate = days_between(ndate, countDate); 	//Finding diff between oldid and now
		dayDiffCountShow = true; //Show it later on
	}

	if(dayDiffCountDate == 0) //Then we do not want to show it
	{
		dayDiffCountShow = false;
	}

	//Get correct suffix
	lDay = (mDay%10);
	switch(lDay)
	{
	case 1:
		if(mDay > 20 || mDay < 10) sFix = chrome.i18n.getMessage("numberSt");
		else sFix = chrome.i18n.getMessage("numberTh");
		break;
	case 2:
		if(mDay > 20 || mDay < 10) sFix = chrome.i18n.getMessage("numberNd");
		else sFix = chrome.i18n.getMessage("numberTh");
		break;
	case 3:
		if(mDay > 20 || mDay < 10) sFix = chrome.i18n.getMessage("numberRd");
		else sFix = chrome.i18n.getMessage("numberTh");
		break;
	default:
		sFix = chrome.i18n.getMessage("numberTh");
	}

	var monthName = chrome.i18n.getMessage("mon"+(month+1)); 

	var dateString = chrome.i18n.getMessage("fullDate", [ucFirst(chrome.i18n.getMessage("lday"+day)), monthName, mDay, sFix]);

	var out =  "<div>";
	out += "<span class='dayinfo'>"+dateString+"</span>";

	//Day of the year
	out += "<span class='dayinyear'>"+chrome.i18n.getMessage("dayCapital")+" "+(ndate.getDayOfYear()+1)+" / "+(ndate.getDaysLeftInYear()-1)+" "+chrome.i18n.getMessage("left")+".</span>";

	var fromToday = ndate.getDaysFromToday()+1;

	//Days from today
	out += "<span class='countdown'>";

	var suffix  = "";
	if(Math.abs(fromToday) != 1) suffix = chrome.i18n.getMessage("several_suffix"); //"s" if one

	if(fromToday < 0)
	{
		out += Math.abs(fromToday)+" "+chrome.i18n.getMessage("day", "test")+suffix+" "+chrome.i18n.getMessage("ago")+".";
	}
	else if(fromToday > 0)
	{
		out += fromToday+" "+chrome.i18n.getMessage("day")+suffix+" "+chrome.i18n.getMessage("leftuntil")+".";
	}

	out += "</span>";

	//"Days from countdown date"
	if( isNaN(dayDiffCountDate) == false && dayDiffCountDate != 0 && dayDiffCountDate < 5000) {

		var suffix  = "";

		if(Math.abs(dayDiffCountDate) != 1) suffix = chrome.i18n.getMessage("several_suffix"); //"s" if > one

		out += "<span class='countdown'>"+dayDiffCountDate+" "+chrome.i18n.getMessage("day")+suffix+" "+chrome.i18n.getMessage("frommarkeddate")+"</span>";

	}

	//Add moon image
	out += "<img class='moonicon' src='pics/phases/"+getLunarImage(moonphase)+"'>";
	out += "</div>";

	return out;
}