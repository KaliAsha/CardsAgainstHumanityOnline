var socket = io.connect(server_url);
var window_focus;
var newmessages = 0;
var basetitle = $(document).attr('title');
var lastmess = '';

socket.on('connect', function(){
  socket.emit('join_room', {id:room,user:user.username});
});

socket.on('message_received', function (message){
  autoscroll(function(auto){
    genMess(message.user, message.text, message.id);
    if(window_focus || $('#forcescroll').is(':checked')){
      if(auto){
        //console.log('confirm autoscroll');
        $(document).scrollTop($(document).height());
      }
    }else{
      newmessages++;
      $(document).attr('title', (newmessages!=0?'('+newmessages+') ':'')+basetitle);
    }
  });
});

socket.on('message_transmitted', function (data){
  autoscroll(function(auto){
    genMess(data.user, data.text, data.id, true);
    $('#messagezone').val('');
    $('#messagezone').attr("disabled", false);
    $('#messagezone').focus();
    if(window_focus || $('#forcescroll').is(':checked')){
      if(auto) {
        //console.log('confirm autoscroll');
        $(document).scrollTop($(document).height());
      }
    }
  });
});

$('#sendbutton').click(function(){
  var text = $('#messagezone').val();
  if(text!=''){
    $('#messagezone').attr("disabled", true);
    lastmess = text;
    var id = (new Date()+user.username+text).hashCode();
    socket.emit('message_sent', {'user':user ,'text':text, 'id':id});
  }
});

function genMess(user, text, id, me){
  var date = new Date();
  if($('#chatzone > .card:last-child').attr('data-userid')==user.id){
    $('#chatzone > .card:last-child footer').remove();
    var r = '<blockquote'+(me?' class="blockquote-reverse"':'')+' data-id="'+id+'">';
    r += '<p>'+text+'</p>';
    r += '<footer>'+addZero(date.getHours())+':'+addZero(date.getMinutes())+'</footer>';
    r += '</blockquote>';
    $('#chatzone > .card:last-child > .card_text').append(r);
  }else{
    var r = '<div class="card'+(me?' me':'')+'" data-userid="'+user.id+'">';
    r += '<div class="card_header" '+(typeof(user.banner)!=='undefined'?'style="background-image:url(\''+user.banner+'\')"':'')+'>';
    r += '<a href="http://twitter.com/'+user.username+'" target="_blank"><div class="crop'+(me?'_me':'')+'">';
    r += '<img src="'+user.avatar+'" class="pp" onload="resizeR2ratio(this)"/></div></a>';
    r += '<p'+(me?' class="me"':'')+'>'+user.displayName+'<br/><span>@'+user.username+'</span></p>';
    r += '</div>';
    r += '<div class="card_text">';
    r += '<blockquote'+(me?' class="blockquote-reverse"':'')+' data-id="'+id+'">';
    r += '<p>'+text+'</p>';
    r += '<footer>'+addZero(date.getHours())+':'+addZero(date.getMinutes())+'</footer>';
    r += '</blockquote>';
    r += '</div>';
    r += '</div>';
    $('#chatzone').append(r);
    //$('.card[data-userid='+user.id+'] .pp').attr("src",user.avatar);
  }
}

function autoscroll(callback){
  //console.log(callback);
  //console.log($(window).scrollTop() + $(window).height(), );
  if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
    //console.log('autoscroll');
    callback(true);
  }else{
    //console.log('no autoscroll');
    callback(false);
  }
}

function addZero(i){
  return i<10 ? "0"+i : i;
}

$('#messagezone').on('keyup', function(event) {
  if(event.keyCode == 13) {
    $('#sendbutton').click();
  }
  if(event.keyCode == 38) {
    if($('#messagezone').val()==''){
      $('#messagezone').val(lastmess);
    }
  }
});

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

$(window).focus(function() {
  newmessages=0;
  $(document).attr('title', basetitle);
  window_focus = true;
}).blur(function() {
  window_focus = false;
});

function resizeR2ratio(img){
  var aspectRatio = $(img).width()/$(img).height();
  if(aspectRatio > 1) {
    $(img).addClass('avatar');
  } else {
    $(img).addClass('avatar_portrait');      
  }
}