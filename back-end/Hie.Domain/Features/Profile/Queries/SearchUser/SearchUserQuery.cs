using AutoMapper;
using AutoMapper.QueryableExtensions;
using Hie.Domain.Features.Profile.Queries.SearchUser;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.Profile.Query {
  public class SearchUserQuery: IRequest<IReadOnlyCollection<SearchUserVm>> {
    public string SearchString { get; set; }

    public class SearchUserQueryHandler: IRequestHandler<SearchUserQuery, IReadOnlyCollection<SearchUserVm>> {
      private readonly IAppDbContext _context;
      private readonly IMapper _mapper;
      private readonly ICurrentUserService _currentUserService;

      public SearchUserQueryHandler(IAppDbContext context, ICurrentUserService currentUserService, IMapper mapper) {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
      }

      public async Task<IReadOnlyCollection<SearchUserVm>> Handle(SearchUserQuery request, CancellationToken cancellationToken) {
        var query = _context.Users
          .Include(x => x.Client)
          .Include(x => x.Benefactor)
          .AsNoTracking()
          .Where(x => x.Id != _currentUserService.UserId.Value);

        query = query.Where(x => EF.Functions.Like(x.Phone, "%" + request.SearchString + "%") 
        || EF.Functions.Like(x.Login, "%" + request.SearchString + "%")
        || EF.Functions.Like(x.Email, "%" + request.SearchString + "%"));

        var users = await query
          .ProjectTo<SearchUserVm>(_mapper.ConfigurationProvider)
          .ToListAsync();

        foreach(var user in users) {
          var roles = new List<string>();
          if (user.IsClient) {
            roles.Add("Ищет помощь");
          }
          if (user.IsBenefactor) {
            roles.Add("Филантроп");
          }

          user.Roles = string.Join(", ", roles);
        }

        return users;
      }
    }
  }
}