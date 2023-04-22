var Game = require('./Game');

function GameStore() {
  this.games = {};
  this.roomInfo = {};

  // Periodically check for inactive games, and delete them
  setInterval(function(games) {
    for (key in games) {
      if (Date.now() - games[key].modifiedOn > (12 * 60 * 60 * 1000)) {
        console.log("Deleting game " + key + ". No activity for atleast 12 hours.");
        delete games[key];
      }
    }
  }, (1 * 60 * 60 * 1000), this.games);
};

GameStore.prototype.createNewRoom = function(id, roomName, playerName){
  for (var key in this.roomInfo){
    if(this.roomInfo[key]['name'] == roomName)  {
      roomName = roomName + "(2)";
    }
  }
  this.roomInfo[id] = {'name': roomName, participant: [playerName], viewer: []};
}
GameStore.prototype.getRoomInfo = function(){
  return this.roomInfo;
}
GameStore.prototype.getAvilableRoomInfo = function(){
  output = {}
  for (var key in this.roomInfo){
    if(this.roomInfo[key]['participant'].length == 1){
      output[key] = this.roomInfo[key];
    }
  }
  return output;
}
GameStore.prototype.checkUniqueParticipantName = function(id, playerName){
  if (!(id in this.roomInfo)){
    return false;
  }
  if (this.roomInfo[id]['participant'].includes(playerName) || this.roomInfo[id]['viewer'].includes(playerName)){
    // already have this name
    let r = Math.random().toString(36).substring(9);
    return playerName+ `(${r})`;
  }else{
    return playerName;
  }
}
GameStore.prototype.joinRoom = function(id, playerName){
  if (this.roomInfo[id]['participant'].length < 2){
    this.roomInfo[id]['participant'].push(playerName);
    return "player";
  }else{
    this.roomInfo[id]['viewer'].push(playerName);
    return "viewer";
  }
}
GameStore.prototype.getRoomName = function(id){
  return this.roomInfo[id]['name'];
}
GameStore.prototype.getRoomParticipantNo = function(id){
  return this.roomInfo[id]['participant'].length;
}
GameStore.prototype.removePlayer = function(id, playerName){
  console.log(`remove \n\n\n   ${playerName}`);
  if (!(id in this.roomInfo)){
    return false;
  }
  if (this.roomInfo[id]['participant'].includes(playerName)){
    // Check reli hv this ppl
    console.log(this.roomInfo);
    this.roomInfo[id]['participant'].splice(this.roomInfo[id]['participant'].indexOf(playerName), 1);
    console.log(this.roomInfo);
  }else if (this.roomInfo[id]['viewer'].includes(playerName)){
    this.roomInfo[id]['viewer'].splice(this.roomInfo[id]['viewer'].indexOf(playerName), 1);
  }
  // Check if room empty
  if (!this.roomInfo[id]['participant'].length){
    delete this.roomInfo[id];
  }
}

GameStore.prototype.add = function(gameParams) {
  var key       = '';
  var keyLength = 7;
  var chars     = 'abcdefghijklmnopqrstuvwxyz0123456789';

  // Generate a key until we get a unique one
  do {
    for (var i=0; i<keyLength; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    };
  } while (this.games.hasOwnProperty(key))

  // Create a new game and save using key
  this.games[key] = new Game(gameParams);

  return key;
};

GameStore.prototype.remove = function(key) {
  if (this.games.hasOwnProperty(key)) {
    delete this.games[key];
    return true;
  } else {
    return false;
  }
};

GameStore.prototype.find = function(key) {
  return (this.games.hasOwnProperty(key)) ? this.games[key] : false ;
};

module.exports = GameStore;
