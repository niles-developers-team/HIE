using System.ComponentModel.DataAnnotations;

namespace Hie.Domain.Features.Profile.Command.CreateUserCommand {
  public class CreateUserCommand {
    [Required]
    public string Login { get; set; }
    [Required]
    public string Password { get; set; }
    public string TimeZone { get; set; } = "Russian Standard Time";
    public string Email { get; set; }
    [Required]
    public string Phone { get; set; }
  }
}