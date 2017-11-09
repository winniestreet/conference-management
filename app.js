
var fs = require('fs');

// UTILITIES

// function to convert 12hour time with AM/PM to minutes
const toMins = (time) => {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if(AMPM == "PM" && hours<12) hours = hours+12;
    if(AMPM == "AM" && hours==12) hours = hours-12;
    totalMinutes = (hours*60) + minutes;
    return totalMinutes;
}

// function to convert minutes to 12hour time w/ AM or PM
const formatTime = (mins) => {
    var minutes = mins % 60;
    var hours = (mins - minutes)/60;
    var AMPM = "AM";

    if (hours >= 12) {
      hours = hours - 12;
      AMPM = "PM";
    }
    if (hours == 0) {
      hours = 12;
    }
    formatMinutes = minutes < 10 ? "0" + minutes : minutes;
    formatHours = hours < 10 ? "0" + hours : hours;   
    var displayTime = formatHours + ":" + formatMinutes;

    displayTime += " " + AMPM;
    return displayTime;
}
// function to count the length of time talks have already taken up in minutes
const sumOfTalks = (array) => {
    let sum = 0;
    array.map(obj => {
        sum = sum + obj.length;
    })
    return sum;
}
  
// read txt file from project, split lines, and format events to contain a name and length in minutes
var data = fs.readFileSync('./speeches.txt', 'utf8');
var lines = data.split('\n');
const formatTalks = (lines) => {
    const talks = lines.map(line => {
        var containsTime = line.match(/\d+/g);
        let length;
        let name; 
        if (containsTime) {
            length = parseInt(line.substr(-5, 2));
            name = line.substring(0, line.length - 6);      
        } else {
            name = line.substring(0, line.length - 10); 
            length = 5;       
        }
        return {
            name,
            length
        }
    })
    return talks;
}
const talks = formatTalks(lines);

// optionally order events longest to shortest (this ordering is only useful in so far as it ensures the morning sessions are as full as possible)
const talksOrdered = talks.sort((a, b) => {
    return (a.length > b.length) ? 1 : ((b.length > a.length) ? -1 : 0);
}).reverse();

// assign events to two arrays of morning talks
const setMorningSessions = (talks) => {  
    const maxLength = 180;  
    const morningSessions = [[], []]
    const talksAssigned = [];
        talks.map(talk => {
        let alreadyPushed = false;
        morningSessions.map(session => {
            if (alreadyPushed === false && (sumOfTalks(session) + talk.length) <= maxLength){
                session.push(talk);
                talksAssigned.push(talk.name);
                alreadyPushed = true
            }
        });
    })
    const talksUnassigned = talks.filter(talk => {
        if (!talksAssigned.includes(talk.name)){
            return talk;
        }
    });
    return {
        morningSessions,
        talksUnassigned
    };
}
let morningResults = setMorningSessions(talksOrdered);

const talksUnassigned = morningResults.talksUnassigned;

const setAfternoonSessions = (talks) => {  
    var minLength = 180;
    var maxLength = 240;
    const afternoonSessions = [[], []]
        talks.map(talk => {
        let alreadyPushed = false;
        afternoonSessions.map(session => {
            if (alreadyPushed === false && (sumOfTalks(session) + talk.length) <= maxLength){
                session.push(talk);
                alreadyPushed = true
            }
        });
    })
    return afternoonSessions;
}
let afternoonResults = setAfternoonSessions(talksUnassigned);

// divide morning and afternoon sessions into two tracks
let track1 = {
    morningSet: morningResults.morningSessions[0],
    afternoonSet: afternoonResults[0],
};
let track2 = {
    morningSet: morningResults.morningSessions[1],
    afternoonSet: afternoonResults[1]
};

const track1Timetable = [];
const track2Timetable = [];
const morningStart = "09:00 AM";
const afternoonStart = "01:00 PM"
const morningStartMins = toMins(morningStart);
const afternoonStartMins = toMins(afternoonStart);

// function to format the events in each track with the correct start times, talk names and lunch breaks
const setTrack = (track, timetable) => {
    var currentMinutes = morningStartMins;    
    track.morningSet.map(session => {
        if (currentMinutes === morningStartMins){
            currentMinutes = (currentMinutes + session.length);
            session.endTime = currentMinutes;            
            newString = morningStart + ' ' + session.name + ' ' + session.length + "mins"
            timetable.push(newString)
        } else {
            startTime = formatTime(currentMinutes);
            newString = startTime + ' ' + session.name + ' ' + session.length + "mins"
            timetable.push(newString);
            currentMinutes = (currentMinutes + session.length);    
            session.endTime = currentMinutes;
            
        }
    });
    timetable.push("12:00 PM Lunch break")
    currentMinutes = afternoonStartMins;
    track.afternoonSet.map(session => {
        if (currentMinutes === afternoonStartMins){
            currentMinutes = (currentMinutes + session.length);
            newString = afternoonStart + ' ' + session.name + ' ' + session.length + "mins"
            timetable.push(newString)
        } else {
            startTime = formatTime(currentMinutes);
            newString = startTime + ' ' + session.name + ' ' + session.length + "mins"
            timetable.push(newString)
            currentMinutes = (currentMinutes + session.length);
            // adding session endTime to use in testing whether last afternoon talk ends on or after 4pm but before 5pm
            session.endTime = currentMinutes;            
        }
    })
    return track;
}

setTrack(track1, track1Timetable);
setTrack(track2, track2Timetable);
console.log("Track 1 ", track1Timetable);
console.log("Track 2", track2Timetable);

module.exports = {
    formatTalks,
    formatTime,
    setMorningSessions
}
