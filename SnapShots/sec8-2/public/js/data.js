class Data{
  constructor(){ this.socket = io.connect();}

  on(event, fun){ this.socket.on(event, args => fun(args));}

  emit(event, data){ this.socket.emit(event, data);}

  webTest(spa){}
}