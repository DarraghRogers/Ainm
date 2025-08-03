public class Invite
{
    public int Id { get; set; }
    public int InviterId { get; set; }
    public string Token { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool Accepted { get; set; }
}