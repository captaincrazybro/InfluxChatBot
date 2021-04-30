var blacklists = require('./blacklists.json');
const guildId = "813586633252405258";
const fs = require('fs');

module.exports = async (bot) => {

    // finds the current date
    let currentDate = new Date();

    // variable to check if changed
    let changed = false;

    // loops through blacklists
    for(bl of blacklists){

        if(currentDate >= bl.date) {
            changed = true;
            let blacklists = blacklists.filter(val => val.id != bl.id);
        }

    }

    if(changed) {
        fs.writeFile('./blacklists.json', JSON.stringify(blacklists), err => {
            if(err) console.log(err);
        })
    }
    
}
