namespace AntonRademaker.Web {
using Microsoft.AspNet.Builder;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Logging;
using Microsoft.Data.Entity;
using Microsoft.AspNet.Hosting;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.AspNet.Identity;
using Microsoft.Data.Entity.SqlServer;
using System;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Collections.Generic;
using Microsoft.AspNet.Routing;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.Runtime;
	public class Startup {
	
   		public void ConfigureServices(IServiceCollection services)
                {
                        services.AddMvc();
                        
                        //Sql client not available on mono
                        var usingMono = Type.GetType("Mono.Runtime") != null;
 
    // Add EF services to the services container
 //   if (usingMono)
 //   {
 //       services.AddEntityFramework(Configuration)
 //               .AddInMemoryStore()
 //               .AddDbContext<MoviesAppContext>();
 //   } else {
 //       services.AddEntityFramework(Configuration)
 //               .AddSqlServer()
 //               .AddDbContext<MoviesAppContext>(options =>
 //               {
 //                   options.UseSqlServer(Configuration.Get("Data:DefaultConnection:ConnectionString"));
 //               });
 //   }
                }

                public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
                {
                        loggerFactory.AddConsole();
            
                        app.UseErrorPage();

                        app.UseMvcWithDefaultRoute();

                        app.UseWelcomePage();
                        
                }
                
                       public Startup(IApplicationEnvironment env)
        {
                         /* 
            * Below code demonstrates usage of multiple configuration sources. For instance a setting say 'setting1' is found in both the registered sources, 
            * then the later source will win. By this way a Local config can be overridden by a different setting while deployed remotely.
            */
            var builder = new ConfigurationBuilder(env.ApplicationBasePath)
                .AddJsonFile("LocalConfig.json")
                .AddEnvironmentVariables(); //All environment variables in the process's context flow in as configuration values.

                }
            
                    
         
	}
    
}