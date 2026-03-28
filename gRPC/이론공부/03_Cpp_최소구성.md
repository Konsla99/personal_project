# C++ gRPC 최소 구성

## 1. 최소 구성(개념)

- 서버 코드
- 클라이언트 코드
- 규약(proto)
- gRPC 라이브러리(런타임/도구)

## 2. C++에서의 최소 조건

- C++ 컴파일러(C++17 이상 권장)
- `.proto`는 `proto3` 문법 사용
- gRPC C++ 런타임과 protobuf 런타임 필요

참고:
- C++ 표준 라이브러리에 gRPC는 포함되어 있지 않습니다.
- 운영체제 기본 설치만으로 gRPC가 제공되지 않는 경우가 대부분입니다.

## 3. 필요한 라이브러리 범주

필수 범주:
- gRPC C++ 런타임
- protobuf 런타임
- 코드 생성 도구(protoc, gRPC 플러그인)

## 4. 대표 라이브러리 3개

- `gRPC (grpc/grpc)` : C++ 서버/클라이언트 런타임
- `Protocol Buffers (protobuf)` : 메시지 직렬화/역직렬화
- `protoc + gRPC C++ plugin` : `.proto`에서 C++ 코드 생성

## 5. 설치 방법(대표 예시)

설치 방법은 크게 아래 세 가지 경로가 일반적입니다.

### 5-1. vcpkg 사용(가장 간단)

1. vcpkg 설치
```bash
git clone https://github.com/microsoft/vcpkg.git
cd vcpkg
./bootstrap-vcpkg.bat
```

2. gRPC 설치
```bash
vcpkg install grpc
```

3. CMake 연동 예시
```bash
cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=path/to/vcpkg/scripts/buildsystems/vcpkg.cmake
cmake --build build
```

### 5-2. Conan 사용

1. Conan 설치
```bash
pip install conan
```

2. gRPC 의존성 추가(예시)
```bash
conan install . --build=missing
```

3. CMake 연동은 Conan 프로파일에 맞게 설정

### 5-3. 직접 소스 빌드(CMake)

1. gRPC 저장소 클론
```bash
git clone --recurse-submodules https://github.com/grpc/grpc.git
```

2. 빌드
```bash
cmake -S grpc -B grpc/build
cmake --build grpc/build
```

## 6. 요약

- C++ gRPC의 최소 조건은 “C++ 컴파일러 + proto3 + gRPC/protobuf 런타임 + 코드 생성 도구”입니다.
- 라이브러리는 공식 gRPC/Protobuf 조합이 가장 보편적입니다.

REF: [proto 작성법](./04_proto_작성법.md)
