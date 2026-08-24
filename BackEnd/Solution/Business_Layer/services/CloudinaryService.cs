using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using Services.classes;
using Services.Interfaces;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IOptions<CloudinarySettings> settings)
    {
        var account = new Account(
            settings.Value.CloudName,
            settings.Value.ApiKey,
            settings.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(Stream stream,string fileName)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, stream),
            Folder = "gaming-store/images"
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception(result.Error.Message);

        return result.SecureUrl.ToString();
    }

    public async Task DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId)
        {
            ResourceType = ResourceType.Image
        };

        var result = await _cloudinary.DestroyAsync(deleteParams);

        if (result.Error != null)
            throw new Exception(result.Error.Message);
    }

    public string GetImagePublicId(string imageUrl)
    {
        var uri = new Uri(imageUrl);

        var path = uri.AbsolutePath;

        // /p9ceh1x9/image/upload/v1786805505/gaming-store/images/file.png
        var uploadIndex = path.IndexOf("/upload/");

        if (uploadIndex == -1)
            throw new ArgumentException("Invalid Cloudinary URL");

        var publicId = path[(uploadIndex + "/upload/".Length)..];

        // Remove version
        if (publicId.StartsWith("v"))
        {
            var slashIndex = publicId.IndexOf('/');

            if (slashIndex != -1)
                publicId = publicId[(slashIndex + 1)..];
        }

        // Remove extension
        publicId = Path.ChangeExtension(publicId, null);

        return publicId;
    }


}