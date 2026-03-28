using Grpc.Core;
using Aoi;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

public class AoiService : AoiStreamer.AoiStreamerBase
{
    private readonly string _outputDir;

    public AoiService()
    {
        _outputDir = Path.Combine(AppContext.BaseDirectory, "received");
        Directory.CreateDirectory(_outputDir);
    }

    public override async Task StreamImages(
        IAsyncStreamReader<ImageRequest> requestStream,
        IServerStreamWriter<ImageAck> responseStream,
        ServerCallContext context)
    {
        await foreach (var request in requestStream.ReadAllAsync(context.CancellationToken))
        {
            var savedAs = SaveImage(request);
            var ack = new ImageAck { Idx = request.Idx, SavedAs = savedAs };
            await responseStream.WriteAsync(ack);
        }
    }

    private string SaveImage(ImageRequest request)
    {
        var baseName = Path.GetFileNameWithoutExtension(request.FileName);
        var timeStamp = DateTime.Now.ToString("yyyy_MM_dd_HH_mm_ss");
        var fileName = $"{timeStamp}_{baseName}_{request.Idx}.png";
        var fullPath = Path.Combine(_outputDir, fileName);

        var width = request.Cols;
        var height = request.Rows;
        var bytes = request.Image.ToByteArray();

        using var image = Image.LoadPixelData<L8>(bytes, width, height);
        image.Save(fullPath);

        return fileName;
    }
}
