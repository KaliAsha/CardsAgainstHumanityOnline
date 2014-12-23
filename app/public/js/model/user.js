function User(username,displayname,pp,banner,id){
	this.id = id | username.hashCode();
	this.username = username;
	this.displayname = displayname;
	this.pp = pp | PP_BASE;
	this.banner = banner | BANNER_BASE;
}