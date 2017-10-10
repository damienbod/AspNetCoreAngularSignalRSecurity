using ApiServer.Repositories;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Security.Claims;
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

            //  _dataEventRecordRepository.Get(httpContext.Request.Query.TryGetValue())
            if ("mist" == requirement.Username)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
