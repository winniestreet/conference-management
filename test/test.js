const chai = require('chai');
const assert = chai.assert;
const app = require('../app.js');
const formatEvents = app.formatEvents;
const formatTime = app.formatTime;
const setMorningSessions = app.setMorningSessions;

describe('formatTime', () => {
    it('should turn minutes into 12h time with AM PM', () => {
        assert.equal(formatTime(870), '02:30 PM')
    })
})

// NOTE: did not manage to get these tests working in time

// describe('formatEvents', () => {
//     it('should only contain numbers in the length', () => {
//         let events = formatEvents(["User Interface CSS in Rails Apps 30min"]);
//         console.log(events[0].length);
//         assert(events[0].length).to.be.a('integer');
//     })
// });

// describe('setMorningSessions', () => {
//     it('should not exceed 3 hours', () => {
//         const sumOfArray = (array) => {
//             let sum = 0;
//             array.map(obj => {
//                 sum = sum + obj.length;
//             })
//             return sum;
//         }
        
//         const sum = sumOfArray(array);
//         assert()
//     })
// })

// describe('Afternoon', () => {
//     it('should not start before 04:00 PM', () => {
//     })
//     it('should not start after 05:00 PM')
// })

// describe('Array', () => {
//     it('should not have overlaps between talks', () => {
//     })
//     it('should allocate every talk to a session')
//     it('should not allocate the same talk twice')
// })