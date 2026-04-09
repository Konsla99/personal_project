# C# gRPC 최소 구성

## 1. 최소 구성(개념)

- 서버 코드
- 클라이언트 코드
- 규약(proto)
- gRPC 라이브러리(런타임/도구)

설명(아주 짧게):
- 서버 코드는 “서버가 제공하는 기능”을 구현합니다.
- 클라이언트 코드는 “서버 기능을 호출”하는 부분을 구현합니다.
- gRPC 라이브러리는 통신을 실제로 가능하게 하는 엔진입니다.

## 2. C#에서의 최소 조건

- .NET 런타임/SDK 필요 (C#은 .NET 위에서만 실행)
- .NET 6 이상
- `.proto`는 `proto3` 문법 사용

왜 6 이상인가?
- gRPC for .NET의 공식 구현(Grpc.AspNetCore/Grpc.Net.Client)이 .NET 6+ 기준으로 유지/지원됩니다.

추가 조건(실행을 위한 필수):
- gRPC/Protobuf 관련 라이브러리 패키지 필요

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

### 각 패키지가 하는 일(간단 설명)

- `Grpc.AspNetCore` : 서버가 gRPC 요청을 받을 수 있게 해주는 엔진
- `Grpc.Net.Client` : 클라이언트가 gRPC 요청을 보낼 수 있게 해주는 엔진
- `Google.Protobuf` : 메시지를 바이너리로 포장/해제(직렬화/역직렬화)
- `Grpc.Tools` : `.proto`를 C# 코드로 자동 생성(빌드 시)

## 4-1. 패키지는 어디에 넣나 (위치)

서버 프로젝트(`Server.csproj`)에 넣는 것:
- `Grpc.AspNetCore`
- `Google.Protobuf`
- `Grpc.Tools` (빌드 시)

클라이언트 프로젝트(`Client.csproj`)에 넣는 것:
- `Grpc.Net.Client`
- `Google.Protobuf`
- `Grpc.Tools` (빌드 시)

서버가 Python인 경우(옵션 제외):
- `grpcio` : gRPC 서버 런타임
- `grpcio-tools` : .proto → Python 코드 생성
- `protobuf` : 메시지 직렬화/역직렬화 런타임

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

런타임 추가 방법(일반화):
- Visual Studio: 프로젝트 우클릭 → Manage NuGet Packages → 패키지 검색 후 설치
- 명령어: `dotnet add <프로젝트.csproj> package <패키지명>`

## 6. C#에서 .proto를 코드로 변환하는 방법

C#은 `Grpc.Tools`가 빌드 시 자동으로 `.proto`를 C# 코드로 생성합니다.
따로 명령을 실행하지 않아도 됩니다.

일반화된 설정 절차(Visual Studio 기준):
1. 프로젝트에 `.proto` 파일을 추가한다.
2. 해당 `.proto` 파일의 **Build Action**을 `Protobuf`로 설정한다.
3. **gRPC 서비스 유형**을 `Server` 또는 `Client`로 지정한다.
4. 프로젝트가 `Grpc.Tools`를 참조하도록 추가한다.
5. 빌드하면 자동으로 C# 코드가 생성된다.

예시(`.csproj` 내 설정):

```xml
<Protobuf Include="..\..\aoi.proto" GrpcServices="Server" />
```

클라이언트도 동일하게 설정해야 합니다:

```xml
<Protobuf Include="..\..\aoi.proto" GrpcServices="Client" />
```

## 7. 요약

- C# gRPC의 최소 조건은 “.NET 6 이상 + proto3 + gRPC 런타임/도구”입니다.
- 위 라이브러리는 대표적인 선택지이며, 유일한 선택은 아닙니다.

REF: [proto 작성법](./04_proto_작성법.md)
