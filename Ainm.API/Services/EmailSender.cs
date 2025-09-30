using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System;

public class EmailSender : IEmailSender
{
    private readonly IConfiguration _config;

    public EmailSender(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
    {
        Console.WriteLine("Preparing to send email...");
        Console.WriteLine($"To: {toEmail}");
        Console.WriteLine($"Subject: {subject}");
        Console.WriteLine($"HTML Content: {htmlContent}");

        // --- SMTP CONFIGURATION ---
        var smtpHost = "smtp.eu.mailgun.org";
        var smtpPort = int.Parse("587");
        var smtpUser = "admin@ainmtree.com";
        var smtpPass = "zKUX7_RFBG-MUuS";
        var fromEmail = "info@ainmtree.com";
        var fromName = "Ainm";

        var message = new MailMessage();
        try
        {
            message = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                Body = htmlContent,
                IsBodyHtml = true
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
        }

        message.To.Add(toEmail);

        using (var client = new SmtpClient(smtpHost, smtpPort))
        {
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential(smtpUser, smtpPass);

            Console.WriteLine("Sending email via SMTP...");
            await client.SendMailAsync(message);
            Console.WriteLine("SMTP email sent.");
        }

        // --- MAILGUN/RESTSHARP CODE (commented out) ---
        /*
        var options = new RestClientOptions("https://api.eu.mailgun.net")
        {
            Authenticator = new HttpBasicAuthenticator("api", Environment.GetEnvironmentVariable("MAILGUN_API_KEY"))
        };

        var client = new RestClient(options);
        var request = new RestRequest("/v3/sandbox2e2ee64598ff4dceb04edb9ccbc95c95.mailgun.org/messages", Method.Post);
        request.AlwaysMultipartFormData = true;
        request.AddParameter("from", "Mailgun Sandbox <postmaster@sandbox2e2ee64598ff4dceb04edb9ccbc95c95.mailgun.org>");
        request.AddParameter("to", toEmail);
        request.AddParameter("subject", subject);
        request.AddParameter("html", htmlContent);

        Console.WriteLine("Sending request to Mailgun...");
        var response = await client.ExecuteAsync(request);

        Console.WriteLine($"Mailgun Response Status: {response.StatusCode}");
        Console.WriteLine($"Mailgun Response Content: {response.Content}");
        */
    }
}