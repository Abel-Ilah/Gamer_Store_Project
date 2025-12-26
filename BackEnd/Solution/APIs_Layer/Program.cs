using System.Text.Json.Serialization;
using DataSource.Data;
using DataSource.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Services.classes;
using Services.Interfaces;
using Services.services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<AuthRepository>();
builder.Services.AddScoped<CartItemRepository>();
builder.Services.AddScoped<CategoriesDiscountsRepository>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<CompareRepository>();
builder.Services.AddScoped<DiscountRepository>();
builder.Services.AddScoped<EmailVerificationRepository>();
builder.Services.AddScoped<OrderItemRepository>();
builder.Services.AddScoped<OrderRepository>();
builder.Services.AddScoped<ProductImageRepository>();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<ProductsDiscountsRepository>();
builder.Services.AddScoped<UserPermissionsRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<ReviewRepository>();
builder.Services.AddScoped<ResetPasswordRepository>();
builder.Services.AddScoped<WishlistRepository>();


builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CartItemService>();
builder.Services.AddScoped<CategoriesDiscountsService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<CompareService>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<EmailVerificationService>();
builder.Services.AddScoped<EmailVerificationNotifier>();
builder.Services.AddScoped<OrderItemService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<ProductImageService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<UserPermissionsService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<ResetPasswordService>();
builder.Services.AddScoped<ResetPasswordNotifier>();
builder.Services.AddScoped<WishlistService>();
builder.Services.AddKeyedScoped<IEmailListener, ResetPasswordTokenSender>("reset-password");
builder.Services.AddKeyedScoped<IEmailListener, EmailVerificationSender>("verify-email");
builder.Services.AddKeyedScoped<IEmailNotifier, ResetPasswordNotifier>("reset-password-notifier");
builder.Services.AddKeyedScoped<IEmailNotifier, EmailVerificationNotifier>("verify-email-notifier");

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));



// Add CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


//builder.Services.AddControllers()
//    .AddJsonOptions(options =>
//    {
//        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
//    });

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowAll");

app.Run();
