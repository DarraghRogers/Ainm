public class PartnerInvite
{
    public int Id { get; set; }
    public int InviterUserId { get; set; }
    public string InviteeEmail { get; set; }
    public string InviteCode { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Accepted { get; set; }
}