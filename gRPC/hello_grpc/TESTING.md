# gRPC Hello 예제 설명 및 테스트 방법

이 문서는 팀원들에게 gRPC 사용 방법을 설명하기 위한 최소 예제의 구성과 실행 방법을 정리합니다.

## 목적

- gRPC의 기본 구조(서비스, 메시지, 서버, 클라이언트)를 이해한다.
- 최소한의 코드로 요청/응답 흐름을 확인한다.

## 코드 구성

- `hello_grpc/helloworld.proto`: 서비스와 메시지(요청/응답) 정의
- `hello_grpc/csharp/Server`: gRPC 서버 프로젝트
- `hello_grpc/csharp/Client`: gRPC 클라이언트 프로젝트

## 의존성 (범용적 관점)

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

## 왜 Grpc.AspNetCore를 썼나

이 예제는 ASP.NET Core 위에서 가장 보편적으로 쓰이는 gRPC 서버 스택을 보여주기 위한 최소 구성이었습니다.
Kestrel이 HTTP/2를 기본 지원하고, 공식 문서와 샘플에서도 이 조합이 일반적이기 때문입니다.

## 다른 선택지는 없나

가능합니다. 상황에 따라 다른 조합이 있을 수 있습니다.

대안 예시(개념적으로):
- 다른 gRPC 서버/클라이언트 프레임워크 사용
- protobuf 런타임/코드 생성 방식을 바꾸는 선택

즉, 위 패키지는 “가능한 조합 중 하나”일 뿐이며, 유일한 선택이 아닙니다.

## 최소 시나리오 구성 요소 및 방법

구성 요소:
- `proto` 정의
- 서버 구현(서비스 핸들러 + 서버 호스팅)
- 클라이언트 구현(채널 + 스텁 호출)

방법:
1. `helloworld.proto` 작성
2. `Grpc.Tools`가 빌드 시 C# 코드 생성
3. 서버에서 `GreeterService` 구현 후 포트 바인딩
4. 클라이언트에서 채널 생성 후 `SayHello` 호출

## .proto 설명

`helloworld.proto`는 gRPC 인터페이스의 계약서 역할을 합니다.

- `service Greeter`: RPC 목록 정의
- `rpc SayHello (HelloRequest) returns (HelloReply)`: 요청/응답 RPC 한 개
- `message HelloRequest`: 요청 메시지(입력)
- `message HelloReply`: 응답 메시지(출력)

모든 코드 생성과 통신 규약은 이 파일을 기준으로 맞춰집니다.

## 공통 사전 준비

- `hello_grpc/helloworld.proto`를 사용합니다.
- 서버를 먼저 실행한 뒤, 클라이언트를 실행하세요.

## C# 예제 테스트

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

## 문제 해결

- 포트 충돌이 발생하면 실행 중인 동일 포트의 프로세스를 종료하거나, 서버 포트를 변경하세요.
- Windows 방화벽 경고가 나오면 로컬 통신을 허용해야 클라이언트가 접속할 수 있습니다.

## 추가 의문에 대한 답변

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
