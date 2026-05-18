using Microsoft.EntityFrameworkCore;
using NinoPDV.Api.Data;
using System.Net;
using System.Net.Mail;

namespace NinoPDV.Api.Services;

public interface IEmailService
{
    Task SendVerificationCodeAsync(string toEmail, string code);
}

public class EmailService : IEmailService
{
    private readonly AppDbContext _context;
    private readonly ILogger<EmailService> _logger;

    public EmailService(AppDbContext context, ILogger<EmailService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SendVerificationCodeAsync(string toEmail, string code)
    {
        var emailSetting = await _context.EmailSettings.FirstOrDefaultAsync();

        bool isConfigured = emailSetting != null && 
                            !string.IsNullOrEmpty(emailSetting.Server) && 
                            !string.IsNullOrEmpty(emailSetting.Username) && 
                            !string.IsNullOrEmpty(emailSetting.Password);

        if (isConfigured)
        {
            try
            {
                _logger.LogInformation("Tentando enviar código de verificação para {Email} via SMTP ({Server})...", toEmail, emailSetting!.Server);
                
                using (var mail = new MailMessage())
                {
                    mail.From = new MailAddress(emailSetting.Username!, "NinoPDV Cloud");
                    mail.To.Add(toEmail);
                    mail.Subject = "NinoPDV - Código de Verificação de E-mail";
                    mail.IsBodyHtml = true;
                    mail.Body = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;'>
                            <div style='text-align: center; margin-bottom: 20px;'>
                                <h1 style='color: #6366f1; margin: 0; font-size: 28px;'>NinoPDV</h1>
                            </div>
                            <div style='color: #334155; font-size: 16px; line-height: 1.6;'>
                                <p>Olá,</p>
                                <p>Obrigado por se registrar no NinoPDV! Use o código de verificação abaixo para concluir a criação de sua conta:</p>
                                <div style='text-align: center; margin: 30px 0;'>
                                    <span style='display: inline-block; background-color: #f1f5f9; color: #4f46e5; font-size: 32px; font-weight: bold; padding: 12px 30px; letter-spacing: 4px; border-radius: 8px; border: 1px dashed #6366f1;'>{code}</span>
                                </div>
                                <p style='color: #64748b; font-size: 14px;'>Este código de verificação expira em 10 minutos. Se você não solicitou este e-mail, por favor ignore-o.</p>
                            </div>
                            <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;' />
                            <div style='text-align: center; color: #94a3b8; font-size: 12px;'>
                                © 2026 NinoPDV. Todos os direitos reservados.
                            </div>
                        </div>
                    ";

                    using (var smtp = new SmtpClient(emailSetting.Server, emailSetting.Port))
                    {
                        smtp.Credentials = new NetworkCredential(emailSetting.Username, emailSetting.Password);
                        smtp.EnableSsl = emailSetting.Encryption == "SSL" || emailSetting.Encryption == "TLS";
                        
                        await smtp.SendMailAsync(mail);
                    }
                }

                _logger.LogInformation("E-mail com código de verificação enviado com sucesso para {Email}.", toEmail);
                return;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao enviar e-mail via SMTP. Ativando fallback local...");
            }
        }
        else
        {
            _logger.LogWarning("Configurações de SMTP vazias ou ausentes. Ativando fallback local...");
        }

        // FALLBACK LOCAL (DEVELOPER EXPERIENCE)
        // 1. Escreve no console
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("\n=======================================================");
        Console.WriteLine($"[EMAIL FALLBACK] Código de validação para: {toEmail}");
        Console.WriteLine($"CÓDIGO GERADO: {code}");
        Console.WriteLine("=======================================================\n");
        Console.ResetColor();

        // 2. Grava no arquivo temporário local para inspeção instantânea
        try
        {
            var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "temp_email_code.txt");
            var content = $"E-mail: {toEmail}\nCódigo de Verificação: {code}\nGerado em: {DateTime.Now:dd/MM/yyyy HH:mm:ss}\n-----------------------------------\n";
            await File.WriteAllTextAsync(filePath, content);
            _logger.LogInformation("Código de verificação [{Code}] salvo localmente em '{FilePath}' para fins de teste.", code, filePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Não foi possível gravar o arquivo temporário de fallback.");
        }
    }
}
