# C# gRPC 최소 구성

## 1. 최소 구성(개념)

- 서버 코드
- 클라이언트 코드
- 규약(proto)
- gRPC 라이브러리(런타임/도구)

## 2. C#에서의 최소 조건

- .NET 런타임/SDK 필요 (C#은 .NET 위에서만 실행)
- .NET 6/7/8 중 하나 사용 가능
- `.proto`는 `proto3` 문법 사용

## 3. 필요한 라이브러리 범주

필수 범주:
- 서버 런타임
- 클라이언트 런타임
- protobuf 런타임
- 코드 생성 도구

## 4. 대표 라이브러리 3개

- `Grpc.AspNetCore` (서버)
- `Grpc.Net.Client` (클라이언트)
- `Google.Protobuf` (protobuf 런타임)

코드 생성 도구는 보통 `Grpc.Tools`를 사용합니다.

## 5. 설치 방법(예시 조합)

아래는 가장 보편적인 조합 기준입니다.

```bash
dotnet add hello_grpc/csharp/Server package Grpc.AspNetCore
dotnet add hello_grpc/csharp/Client package Grpc.Net.Client
dotnet add hello_grpc/csharp/Server package Google.Protobuf
dotnet add hello_grpc/csharp/Client package Google.Protobuf
dotnet add hello_grpc/csharp/Server package Grpc.Tools
dotnet add hello_grpc/csharp/Client package Grpc.Tools
```

## 6. 요약

- C# gRPC의 최소 조건은 “.NET + proto3 + gRPC 런타임/도구”입니다.
- 위 라이브러리는 대표적인 선택지이며, 유일한 선택은 아닙니다.

REF: [proto 작성법](./04_proto_작성법.md)
