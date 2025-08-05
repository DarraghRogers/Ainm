using MailKit.Net.Smtp;
using MimeKit;

public class EmailSender : IEmailSender
{
    private readonly IConfiguration _config;
    public EmailSender(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("Your App Name", _config["Email:SmtpFrom"]));
        emailMessage.To.Add(new MailboxAddress("", toEmail));
        emailMessage.Subject = subject;
        emailMessage.Body = new TextPart("plain") { Text = message };

        using (var client = new SmtpClient())
        {
            await client.ConnectAsync(_config["Email:SmtpHost"], int.Parse(_config["Email:SmtpPort"]), MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_config["Email:SmtpUser"], _config["Email:SmtpPass"]);
            await client.SendAsync(emailMessage);
            await client.DisconnectAsync(true);
        }
    }
}