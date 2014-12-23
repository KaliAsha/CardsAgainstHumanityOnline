function Message(content, author){
	this.id = (new Date()+author.id+content).hashCode();
	this.content = content;
	this.author = author;
}

Message.prototype.getId = function(){
	return this.id;
}