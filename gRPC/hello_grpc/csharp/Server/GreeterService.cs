using Grpc.Core;
using Helloworld;

public class GreeterService : Greeter.GreeterBase
{
    public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
    {
        var name = request.Name?.Trim() ?? string.Empty;
        var isSingleDigit = name.Length == 1 && name[0] >= '0' && name[0] <= '9';
        var message = isSingleDigit ? "Hello, world" : "not in Range";
        return Task.FromResult(new HelloReply { Message = message });
    }
}
