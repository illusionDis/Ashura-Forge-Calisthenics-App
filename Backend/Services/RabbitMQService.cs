using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace AshuraForge.API.Services;

// ─────────────────────────────────────────────────────────────────────────────
// RabbitMQ Mesaj Yayınlama Servisi
// ─────────────────────────────────────────────────────────────────────────────
public interface IRabbitMQService
{
    void PublishWorkoutLogged(int userId, string workoutName, string category, int durationMinutes);
}

public class RabbitMQService : IRabbitMQService, IDisposable
{
    private readonly IConnection? _connection;
    private readonly IModel?     _channel;
    private readonly string      _queueName;
    private readonly ILogger<RabbitMQService> _logger;

    public RabbitMQService(IConfiguration config, ILogger<RabbitMQService> logger)
    {
        _logger    = logger;
        _queueName = config["RabbitMQ:QueueName"] ?? "workout.logged";

        try
        {
            var host = config["RabbitMQ:Host"] ?? "localhost";
            var port = int.Parse(config["RabbitMQ:Port"] ?? "5672");
            _logger.LogInformation("RabbitMQ bağlantısı deneniyor → {Host}:{Port}", host, port);

            var factory = new ConnectionFactory
            {
                HostName = host,
                Port     = port,
                UserName = config["RabbitMQ:Username"] ?? "guest",
                Password = config["RabbitMQ:Password"] ?? "guest",
                RequestedConnectionTimeout = TimeSpan.FromSeconds(10),
                SocketReadTimeout          = TimeSpan.FromSeconds(10),
                SocketWriteTimeout         = TimeSpan.FromSeconds(10)
            };

            _connection = factory.CreateConnection();
            _channel    = _connection.CreateModel();

            _channel.QueueDeclare(
                queue:      _queueName,
                durable:    true,
                exclusive:  false,
                autoDelete: false,
                arguments:  null);

            _logger.LogInformation("RabbitMQ bağlantısı kuruldu. Kuyruk: {Queue}", _queueName);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("RabbitMQ bağlantısı kurulamadı: {Message}. Mesaj yayını devre dışı.", ex.Message);
        }
    }

    public void PublishWorkoutLogged(int userId, string workoutName, string category, int durationMinutes)
    {
        if (_channel == null || !_channel.IsOpen)
        {
            _logger.LogWarning("RabbitMQ kanalı kapalı, mesaj gönderilemedi.");
            return;
        }

        var message = new
        {
            UserId          = userId,
            WorkoutName     = workoutName,
            Category        = category,
            DurationMinutes = durationMinutes,
            LoggedAt        = DateTime.UtcNow
        };

        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

        var properties = _channel.CreateBasicProperties();
        properties.Persistent = true;

        _channel.BasicPublish(
            exchange:   "",
            routingKey: _queueName,
            basicProperties: properties,
            body:       body);

        _logger.LogInformation(
            "RabbitMQ mesajı yayınlandı → Kuyruk: {Queue} | Kullanıcı: {UserId} | Antrenman: {Name}",
            _queueName, userId, workoutName);
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}
