# gRPC Hello 예제 정리 (구조형 설명)

이 문서는 팀원에게 gRPC의 최소 구성과 C#에서의 필수 조건을 구조적으로 설명합니다.

## 1. 최소 구성(개념)

gRPC 통신을 성립시키는 핵심 요소는 아래 네 가지입니다.

- 서버 코드
- 클라이언트 코드
- 규약(proto)
- gRPC 라이브러리(언어별 런타임/도구)

즉, “서버/클라이언트/규약/라이브러리”가 최소 구성입니다.

## 2. C#에서 실제 동작시키기 위한 최소 조건

C#은 .NET 런타임 위에서만 동작합니다. 따라서 C# gRPC는 .NET 없이 실행할 수 없습니다.

- .NET 런타임/SDK: 6/7/8 중 하나
- `.proto` 규약: `proto3` 사용
- gRPC 라이브러리: 서버/클라이언트/프로토버프/코드생성 도구 필요

## 3. C#에서 사용 가능한 gRPC 라이브러리(대표 조합)

현업에서 가장 보편적인 조합(이 예제도 해당):

- 서버: `Grpc.AspNetCore`
- 클라이언트: `Grpc.Net.Client`
- protobuf 런타임: `Google.Protobuf`
- 코드 생성: `Grpc.Tools`

이 조합은 “여러 가능한 조합 중 하나”이며, 유일한 선택은 아닙니다.

## 4. .proto 설명(규약)

`.proto`는 서버와 클라이언트가 공유해야 하는 “계약서”입니다.

- `service`: RPC 목록 정의
- `rpc`: 요청/응답 규칙 정의
- `message`: 요청/응답 메시지 구조 정의

## 5. 서버/클라이언트 구성 조건

- 서버와 클라이언트는 동일한 gRPC 계약(스키마)을 공유해야 합니다.
- 동일한 `.proto` 파일을 같은 위치에 둘 필요는 없습니다.
- 핵심은 “같은 스키마로 생성된 코드”를 양쪽이 사용한다는 점입니다.

가능한 공유 방식:
- 서버/클라이언트가 `.proto` 파일을 각자 보유
- `.proto`를 공용 리포지토리/서브모듈로 공유
- 생성된 C# 코드를 NuGet 패키지로 배포하여 공유

## 6. C# 예제 실행

서버 실행:

```bash
dotnet run --project hello_grpc/csharp/Server/Server.csproj
```

클라이언트 실행:

```bash
dotnet run --project hello_grpc/csharp/Client/Client.csproj
```

예상 출력:

```
0~9 입력 (q 종료): 5
Hello, world
0~9 입력 (q 종료): 10
not in Range
0~9 입력 (q 종료): q
```
