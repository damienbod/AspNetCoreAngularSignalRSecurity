using ApiServer.Repositories;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;

namespace ApiServer.Policies
{
    public class CorrectUserHandler : AuthorizationHandler<CorrectUserRequirement>
    {
        private readonly IDataEventRecordRepository _dataEventRecordRepository;

        public CorrectUserHandler(IDataEventRecordRepository dataEventRecordRepository)
        {
            _dataEventRecordRepository = dataEventRecordRepository;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CorrectUserRequirement requirement)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            if (requirement == null)
                throw new ArgumentNullException(nameof(requirement));

            var authFilterCtx = (Microsoft.AspNetCore.Mvc.Filters.AuthorizationFilterContext)context.Resource;
            var httpContext = authFilterCtx.HttpContext;
            var pathData = httpContext.Request.Path.Value.Split("/");
            long id = long.Parse(pathData[pathData.Length -1]);

            var username = _dataEventRecordRepository.GetUsername(id);
            if (username == httpContext.User.Identity.Name)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
