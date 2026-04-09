# gRPC Hello 예제 정리 및 테스트

## 목적

- gRPC의 기본 구조(서비스, 메시지, 서버, 클라이언트)를 이해한다.
- 최소한의 코드로 요청/응답 흐름을 확인한다.

## 1. 최소 구성(개념)

gRPC 통신을 성립시키는 핵심 요소는 아래 네 가지입니다.

- 서버 코드
- 클라이언트 코드
- 규약(proto)
- gRPC 라이브러리(언어별 런타임/도구)

즉, "서버/클라이언트/규약/라이브러리"가 최소 구성입니다.

## 2. C#에서 실제 동작시키기 위한 최소 조건

C#은 .NET 런타임 위에서만 동작합니다. 따라서 C# gRPC는 .NET 없이 실행할 수 없습니다.

- .NET 런타임/SDK: 6/7/8 중 하나
- `.proto` 규약: `proto3` 사용
- gRPC 라이브러리: 서버/클라이언트/프로토버프/코드생성 도구 필요

## 3. 코드 구성

- `hello_grpc/helloworld.proto`: 서비스와 메시지(요청/응답) 정의
- `hello_grpc/csharp/Server`: gRPC 서버 프로젝트
- `hello_grpc/csharp/Client`: gRPC 클라이언트 프로젝트

## 4. C#에서 사용 가능한 gRPC 라이브러리(대표 조합)

gRPC를 .NET에서 쓰려면 보통 아래 범주가 필요합니다.

필수 범주:
- 서버 런타임: gRPC 서버 호스팅용
- 클라이언트 런타임: gRPC 호출용
- protobuf 런타임: 메시지 직렬화/역직렬화
- 코드 생성 도구: `.proto`에서 C# 코드 생성(개발 시점)

이 예제에서 선택한 패키지(한 가지 조합):
- 서버: `Grpc.AspNetCore`
- 클라이언트: `Grpc.Net.Client`
- protobuf 런타임: `Google.Protobuf`
- 코드 생성: `Grpc.Tools`

이 조합은 "여러 가능한 조합 중 하나"이며, 유일한 선택은 아닙니다.

## 5. 왜 Grpc.AspNetCore를 썼나

이 예제는 ASP.NET Core 위에서 가장 보편적으로 쓰이는 gRPC 서버 스택을 보여주기 위한 최소 구성이었습니다.
Kestrel이 HTTP/2를 기본 지원하고, 공식 문서와 샘플에서도 이 조합이 일반적이기 때문입니다.

## 6. .proto 설명(규약)

`.proto`는 서버와 클라이언트가 공유해야 하는 "계약서"입니다.

- `service`: RPC 목록 정의
- `rpc`: 요청/응답 규칙 정의
- `message`: 요청/응답 메시지 구조 정의

## 7. 서버/클라이언트 구성 조건

- 서버와 클라이언트는 동일한 gRPC 계약(스키마)을 공유해야 합니다.
- 동일한 `.proto` 파일을 같은 위치에 둘 필요는 없습니다.
- 핵심은 "같은 스키마로 생성된 코드"를 양쪽이 사용한다는 점입니다.

가능한 공유 방식:
- 서버/클라이언트가 `.proto` 파일을 각자 보유
- `.proto`를 공용 리포지토리/서브모듈로 공유
- 생성된 C# 코드를 NuGet 패키지로 배포하여 공유

## 8. 최소 시나리오 구성 요소 및 방법

구성 요소:
- `proto` 정의
- 서버 구현(서비스 핸들러 + 서버 호스팅)
- 클라이언트 구현(채널 + 스텁 호출)

방법:
1. `helloworld.proto` 작성
2. `Grpc.Tools`가 빌드 시 C# 코드 생성
3. 서버에서 `GreeterService` 구현 후 포트 바인딩
4. 클라이언트에서 채널 생성 후 `SayHello` 호출

## 9. 공통 사전 준비

- `hello_grpc/helloworld.proto`를 사용합니다.
- 서버를 먼저 실행한 뒤, 클라이언트를 실행하세요.

## 10. C# 예제 테스트

### 1. 서버 실행

```bash
dotnet run --project hello_grpc/csharp/Server/Server.csproj
```

### 2. 클라이언트 실행 (다른 터미널)

```bash
dotnet run --project hello_grpc/csharp/Client/Client.csproj
```

### 3. 기대 결과

클라이언트 콘솔에 다음과 유사한 출력이 표시됩니다.

```
0~9 입력 (q 종료): 5
Hello, world
0~9 입력 (q 종료): 10
not in Range
0~9 입력 (q 종료): q
```

## 11. 문제 해결

- 포트 충돌이 발생하면 실행 중인 동일 포트의 프로세스를 종료하거나, 서버 포트를 변경하세요.
- Windows 방화벽 경고가 나오면 로컬 통신을 허용해야 클라이언트가 접속할 수 있습니다.

## 12. 추가 의문에 대한 답변

### 1. .NET 8.0이 아니면 불가능한가?

아닙니다. gRPC는 .NET 6/7/8에서 모두 가능합니다. 이 예제는 최신 LTS인 .NET 8.0으로 작성했습니다.
필요 조건은 아래와 같습니다.
- `Grpc.AspNetCore`와 `Grpc.Net.Client`가 지원하는 .NET 버전
- HTTP/2 지원(ASP.NET Core/Kestrel이 기본 제공)

다른 버전을 쓰려면 `*.csproj`의 `TargetFramework`만 변경하면 됩니다.

### 2. `dotnet run`을 왜 쓰는가? 다른 방법은?

`dotnet run`은 빌드와 실행을 한 번에 수행하는 가장 간단한 방법입니다.
다른 방법은 아래와 같습니다.

1. 빌드 후 실행
```bash
dotnet build hello_grpc/csharp/Server/Server.csproj
dotnet run --no-build --project hello_grpc/csharp/Server/Server.csproj
```

2. 직접 실행 파일 실행
```bash
dotnet build hello_grpc/csharp/Client/Client.csproj
dotnet .\hello_grpc\csharp\Client\bin\Debug\net8.0\Client.dll
```

3. 게시(배포) 후 실행
```bash
dotnet publish hello_grpc/csharp/Server/Server.csproj -c Release -o out/server
dotnet .\out\server\Server.dll
```
