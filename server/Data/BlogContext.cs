namespace AntonRademaker.Web.Data {
	
	using System;
	using Microsoft.AspNet.Identity.EntityFramework;
	using Microsoft.Data.Entity;
	using Microsoft.Data.Entity.Metadata;
	using AntonRademaker.Web.Models;
	public class BlogContext : IdentityDbContext<ApplicationUser> {
		
	}
}