using System.IO.Compression;
using Google.Protobuf;
using Grpc.Core;
using Grpc.Net.Client;
using Aoi;

const string MnistFileName = "train-images-idx3-ubyte.gz";
var dataPath = FindMnistFilePath(MnistFileName);

if (string.IsNullOrEmpty(dataPath))
{
    Console.WriteLine("MNIST 파일을 찾을 수 없습니다.");
    Console.WriteLine("예상 위치:");
    Console.WriteLine("  aoi_grpc\\csharp\\Client\\data\\mnist\\train-images-idx3-ubyte.gz");
    Console.WriteLine("USAGE.md를 참고해 데이터셋을 다운로드하세요.");
    return;
}

Console.WriteLine("MNIST 로딩 중...");
var (images, rows, cols) = LoadMnistImages(dataPath);
Console.WriteLine($"로드 완료: {images.Count}장 ({rows}x{cols})");

using var channel = GrpcChannel.ForAddress("http://localhost:5001");
var client = new AoiStreamer.AoiStreamerClient(channel);
using var call = client.StreamImages();

var responseTask = Task.Run(async () =>
{
    await foreach (var ack in call.ResponseStream.ReadAllAsync())
    {
        Console.WriteLine($"[ACK] idx={ack.Idx}, saved={ack.SavedAs}");
    }
});

var index = 0;
var baseName = Path.GetFileNameWithoutExtension(Path.GetFileNameWithoutExtension(MnistFileName));

Console.WriteLine("t/T 입력 시 현재 이미지 전송, q 입력 시 종료");

while (true)
{
    if (Console.KeyAvailable)
    {
        var key = Console.ReadKey(true);
        if (key.KeyChar == 'q' || key.KeyChar == 'Q')
        {
            break;
        }

        if (key.KeyChar == 't' || key.KeyChar == 'T')
        {
            var imageBytes = images[index];
            var request = new ImageRequest
            {
                FileName = baseName,
                Idx = index,
                Image = ByteString.CopyFrom(imageBytes),
                Rows = rows,
                Cols = cols
            };

            await call.RequestStream.WriteAsync(request);
            Console.WriteLine($"[SEND] idx={index}");
        }
    }

    index++;
    if (index >= images.Count)
    {
        index = 0;
    }

    await Task.Delay(10);
}

await call.RequestStream.CompleteAsync();
await responseTask;

static string? FindMnistFilePath(string fileName)
{
    var baseDir = AppContext.BaseDirectory;
    var direct = Path.Combine(baseDir, "data", "mnist", fileName);
    if (File.Exists(direct))
    {
        return direct;
    }

    var current = new DirectoryInfo(baseDir);
    for (var i = 0; i < 8 && current != null; i++)
    {
        var candidate = Path.Combine(
            current.FullName,
            "aoi_grpc",
            "csharp",
            "Client",
            "data",
            "mnist",
            fileName);
        if (File.Exists(candidate))
        {
            return candidate;
        }
        current = current.Parent;
    }

    return null;
}

static (List<byte[]> images, int rows, int cols) LoadMnistImages(string gzPath)
{
    using var file = File.OpenRead(gzPath);
    using var gzip = new GZipStream(file, CompressionMode.Decompress);
    using var reader = new BinaryReader(gzip);

    var magic = ReadInt32BigEndian(reader);
    if (magic != 2051)
    {
        throw new InvalidDataException($"MNIST 이미지 파일이 아닙니다. magic={magic}");
    }

    var count = ReadInt32BigEndian(reader);
    var rows = ReadInt32BigEndian(reader);
    var cols = ReadInt32BigEndian(reader);

    var imageSize = rows * cols;
    var images = new List<byte[]>(count);
    for (var i = 0; i < count; i++)
    {
        var bytes = reader.ReadBytes(imageSize);
        if (bytes.Length != imageSize)
        {
            throw new EndOfStreamException("MNIST 이미지 데이터가 부족합니다.");
        }
        images.Add(bytes);
    }

    return (images, rows, cols);
}

static int ReadInt32BigEndian(BinaryReader reader)
{
    var bytes = reader.ReadBytes(4);
    if (BitConverter.IsLittleEndian)
    {
        Array.Reverse(bytes);
    }
    return BitConverter.ToInt32(bytes, 0);
}
