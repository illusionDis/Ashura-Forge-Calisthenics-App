# Çalışma ortamı (Render'ın dinleyeceği portu 8080 ayarlıyoruz)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Build ortamı
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Sadece csproj dosyasını kopyalayıp paketleri indiriyoruz (Önbellek optimizasyonu)
COPY ["Backend/AshuraForge.API.csproj", "Backend/"]
RUN dotnet restore "Backend/AshuraForge.API.csproj"

# Tüm kodları kopyalayıp projeyi derliyoruz
COPY . .
WORKDIR "/src/Backend"
RUN dotnet build "AshuraForge.API.csproj" -c Release -o /app/build

# Publish alıyoruz
FROM build AS publish
RUN dotnet publish "AshuraForge.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final aşaması: Sadece publish edilmiş dosyaları alıp çalıştırıyoruz
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AshuraForge.API.dll"]