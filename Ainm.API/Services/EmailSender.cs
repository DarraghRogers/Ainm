using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

public class EmailSender: IEmailSender
{
    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public EmailSender(IConfiguration config)
    {
        _apiKey = config["SendGrid:ApiKey"];
        _fromEmail = config["SendGrid:FromEmail"];
        _fromName = config["SendGrid:FromName"];
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
    {
        var options = new SendGridClientOptions
        {
            ApiKey = _apiKey
        };
        options.SetDataResidency("eu");
        var client = new SendGridClient(options);
        var from = new EmailAddress(_fromEmail, _fromName);
        var to = new EmailAddress(toEmail);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent: null, htmlContent: htmlContent);
        await client.SendEmailAsync(msg);
    }
}