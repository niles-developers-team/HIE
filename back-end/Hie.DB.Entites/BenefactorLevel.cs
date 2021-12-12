using Hie.DB.Common;
using System;
using System.Collections.Generic;

namespace Hie.DB.Entities {
  public class BenefactorLevel: IEntity {
    public long Id { get; set; }
    public string LevelName { get; set;}
    public int Order { get; set;}
    public decimal MinAmount { get; set; }

    public ICollection<Benefactor> Benefactors { get; set; }
  }
}