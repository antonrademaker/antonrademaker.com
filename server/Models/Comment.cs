namespace AntonRademaker.Web.Models {
	
	using System;
	public class Comment {
		public int Id {get;set;}
		
		public int PostId {get;set;}
		public virtual Post Post {get;set;}
		public DateTimeOffset PublishedOn {get;set;}
		public string Original {get;set;}
		public string Content {get;set;}
		public string Name {get;set;}
		public string Email {get;set;}
	}
}