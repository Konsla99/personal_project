# AOI gRPC 예제 사용법

이 예제는 MNIST 이미지를 클라이언트에서 서버로 전송하는 gRPC 스트리밍 예제입니다.

## 1. MNIST 데이터 다운로드

MNIST 이미지 파일을 클라이언트 폴더에 저장합니다.

```powershell
Invoke-WebRequest -Uri "https://ossci-datasets.s3.amazonaws.com/mnist/train-images-idx3-ubyte.gz" `
  -OutFile "aoi_grpc\\csharp\\Client\\data\\mnist\\train-images-idx3-ubyte.gz"
```

## 2. 서버 실행

```bash
dotnet run --project aoi_grpc/csharp/Server/Server.csproj
```

## 3. 클라이언트 실행

```bash
dotnet run --project aoi_grpc/csharp/Client/Client.csproj
```

## 4. 트리거 전송 방법

- `t` 또는 `T`를 누르면 현재 인덱스 이미지가 서버로 전송됩니다.
- `q` 또는 `Q`를 누르면 종료됩니다.

## 5. 저장 위치

서버가 받은 이미지는 아래 경로에 저장됩니다.

```
aoi_grpc/csharp/Server/bin/Debug/net8.0/received
```

REF: [구조 및 코드 설명](./STRUCTURE.md)
