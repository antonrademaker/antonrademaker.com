namespace AntonRademaker.Web.Models {
	
	using System;
	using System.Collections.Generic;
	public class Post {
		
		public int Id {get;set;}
		public DateTimeOffset CreatedOn {get;set;}
		public DateTimeOffset PublishedOn {get;set;}
		public PostState PostState {get;set;}
		public string Title {get;set;}
		public string Original {get;set;}
		public string Content {get;set;}
		public virtual List<Comment> Comments {get;set;}
	}
}