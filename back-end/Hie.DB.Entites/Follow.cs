using Hie.DB.Common;
using System;

namespace Hie.DB.Entities {
  public class Follow: IEntity {
    public long Id { get; set; }

    public long FollowerId { get; set; }
    public User FollowerUser { get; set; }

    public long FollowedId { get; set; }
    public User FollowedUser { get; set; }
  }
}