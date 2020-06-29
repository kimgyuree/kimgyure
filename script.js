var modeFlag = true,
		alarmSetFlag = false,
    alarmData = {
      hrs: 0,
      mins: 0,
      alarmSet: false,
			pm: false
    };

// Functions
// display clock data
function display(hrs, mins) {
	console.log(alarmData);
	console.log('hrs = ' + hrs + ' / mins = ' + mins);
	if(alarmData.alarmSet && hrs === alarmData.hrs && mins === alarmData.mins) {
		alarmActive();
	}
	if (!modeFlag) {
		hrs = ampm(hrs);
	}
	hrs = zeroPrefixer(hrs);
	mins = zeroPrefixer(mins);
	$('.hrs').text(hrs);
	$('.mins').text(mins);
}

// Alarm trigger
function alarmActive() {
	$('.nums').addClass('alarm-flash');
	$('.alarm-display').text('alarm!');
	myAudio.play();
}

// am pm mode function
function ampm(hour) {
	if (hour > 12) {
		alarmData.pm = true;
		$('.ampm-display').text('pm');
		return hour - 12;
	} else {
		alarmData.pm = false;
		$('.ampm-display').text('am');
		return hour;
	}
}

// Function to prefix a zero if less than ten
function zeroPrefixer(num) {
  return (num < 10 ? '0' : '') + num;
}

// get javascript time data
function setClock() {
	if(!alarmSetFlag){
		var hrs = new Date().getHours(),
				mins = new Date().getMinutes();
		display(hrs, mins);
	}
}

// record current time
function currentTime() {
  alarmData.hrs = Number($('.hrs').text());
  alarmData.mins = Number($('.mins').text());
	if (alarmData.pm && !modeFlag) {
		alarmData.hrs = alarmData.hrs + 12;
	}
}

// update values after clicking on controls
function alarmControl(val, sym) {
  sym === '+' ? alarmData[val]++ : alarmData[val]--;
  alarmLimiter(val);
}

// dont allow above or below 24hrs or 60 secs
function alarmLimiter(val) {
  if (val === 'mins' && alarmData.mins > 59) {
    alarmData.mins -= 60;
  } else if (val === 'mins' && alarmData.mins < 0) {
    alarmData.mins += 60;
  } else if (val === 'hrs' && alarmData.hrs > 23) {
    alarmData.hrs -= 24;
  } else if (val === 'hrs' && alarmData.hrs < 0) {
    alarmData.hrs += 24;
  }
  display(alarmData.hrs, alarmData.mins);
}

function setAlarm(toSet, text) {
	var $a = $('.alarm-display')
	alarmData.alarmSet = toSet;
	$('.alarm').text(text);
	toSet ? $a.text('alarm set for ' + alarmData.hrs + ':' + zeroPrefixer(alarmData.mins)) : $a.text('no alarm set');
}

// Set interval timer that checks every second.
setInterval(setClock, 1000);

// Click events
$('.mode').click(function() {
	modeFlag ? $('.mode-display').text('am/pm clock') : $('.mode-display').text('24hr clock');
	$('.ampm-display').toggleClass('handle');
	modeFlag = !modeFlag;
});

$('.alarm').click(function() {
	if (alarmData.alarmSet) {
		$('.nums').removeClass('alarm-flash');
		setAlarm(false, 'set alarm');
	} else {
		$('ul').toggleClass('handle');
		$('.nums').toggleClass('flash');
		alarmSetFlag ? setAlarm(true, 'cancel alarm') : currentTime();
		alarmSetFlag = !alarmSetFlag;
	}
});

$('.control-hrs li').each(function() {
  $(this).click(function(){
    alarmControl('hrs', $(this).text());
  });
});

$('.control-mins li').each(function() {
  $(this).click(function(){
    alarmControl('mins', $(this).text());
  });
});