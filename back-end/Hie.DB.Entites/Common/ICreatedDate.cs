using System;

namespace Hie.DB.Common {
  internal interface ICreatedDate {
    DateTime CreateDateUtc { get; set; }
  }
}