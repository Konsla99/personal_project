using Grpc.Net.Client;
using Helloworld;

using var channel = GrpcChannel.ForAddress("http://localhost:5000");
var client = new Greeter.GreeterClient(channel);

while (true)
{
    Console.Write("0~9 입력 (q 종료): ");
    var input = Console.ReadLine() ?? string.Empty;
    if (string.Equals(input.Trim(), "q", StringComparison.OrdinalIgnoreCase))
    {
        break;
    }

    var reply = await client.SayHelloAsync(new HelloRequest { Name = input });
    Console.WriteLine(reply.Message);
}
