# AOI gRPC 예제 구조 및 코드 설명

## 1. 폴더 구조

```
aoi_grpc
├─ aoi.proto
├─ USAGE.md
├─ STRUCTURE.md
├─ TODO.md
└─ csharp
   ├─ Server
   │  ├─ Server.csproj
   │  ├─ Program.cs
   │  └─ AoiService.cs
   └─ Client
      ├─ Client.csproj
      ├─ Program.cs
      └─ data
         └─ mnist
            └─ train-images-idx3-ubyte.gz
```

## 2. 핵심 파일 설명

- `aoi.proto`: 이미지 전송용 스트리밍 RPC 정의
- `AoiService.cs`: 서버 수신 처리 및 이미지 저장
- `Program.cs`(Server): gRPC 서버 실행
- `Program.cs`(Client): MNIST 로딩 및 키보드 트리거 전송

## 3. gRPC 통신 구조

- `StreamImages`는 클라이언트/서버 양방향 스트리밍입니다.
- 클라이언트는 `t/T` 입력 시 현재 인덱스의 이미지를 전송합니다.
- 서버는 수신 즉시 파일로 저장하고, 저장된 이름을 `ACK`로 응답합니다.

## 4. 코드 흐름 요약

클라이언트:
1. MNIST 파일 로딩
2. 인덱스 0부터 끝까지 무한 순환
3. `t/T` 입력 시 해당 인덱스 이미지 전송

서버:
1. 스트림으로 이미지 수신
2. `yyyy_MM_dd_HH_mm_ss_파일명_idx.png` 형식으로 저장
3. 저장 결과를 ACK로 반환

REF: [사용법](./USAGE.md)
