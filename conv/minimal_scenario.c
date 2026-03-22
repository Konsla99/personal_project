// minimal_scenario.c
// 지침.md 기반 최소 시나리오

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// C용 BOOL 타입
typedef int BOOL;
#define TRUE 1
#define FALSE 0

// 지침에 따른 명령 코드
#define CMD_READ  1
#define CMD_WRITE 3

// --- 전송 계층 스텁 (실제 시리얼 I/O로 교체) ---
static BOOL send_to_device(const unsigned char *buffer, int cnt) {
    // NOTE: buffer는 바이너리 프레임이며 char*로 처리됨.
    (void)cnt;
    // 실제 코드에서는 시리얼 포트로 전송.
    // 최소 시나리오에서는 길이가 1 이상이면 성공으로 가정.
    return (buffer != NULL && cnt > 0) ? TRUE : FALSE;
}

static int read_from_device(unsigned char *buffer, int max_cnt) {
    // NOTE: buffer는 바이너리 프레임이며 char*로 처리됨.
    // 최소 모의 응답. 실제 시리얼 읽기로 교체.
    // 예: ACK=0x01이 들어간 짧은 응답 프레임을 가정
    if (max_cnt < 4) return 0;
    buffer[0] = 0x00; // Address
    buffer[1] = 0x02; // Device ID (응답 예시)
    buffer[2] = 0x01; // ACK
    buffer[3] = 0x05; // MsgLength(예시)
    return 4;
}

// --- 보조 함수 ---
static BOOL is_read_pid(const char *pid) {
    if (pid == NULL) return FALSE;
    // 최소 규칙: "R"/"READ_"면 ReadRequest, "W"/"WRITE_"면 WriteRequest.
    if (strncmp(pid, "READ_", 5) == 0) return TRUE;
    if (strncmp(pid, "WRITE_", 6) == 0) return FALSE;
    if (pid[0] == 'R') return TRUE;
    if (pid[0] == 'W') return FALSE;
    // 숫자만 들어온 경우 기본은 Read로 간주 (최소 시나리오).
    return TRUE;
}

static BOOL build_command_buffer(int addr, int cmd, unsigned short pid,
                                 const unsigned char *data, int data_len,
                                 unsigned char *out, int out_sz, int *out_len) {
    if (out == NULL || out_sz <= 0) return FALSE;
    if (data_len < 0) return FALSE;

    // MsgLength = cmd(1) + pid(2) + reserved(2) + data_len
    int msg_len = 5 + data_len;
    int total_len = 4 + msg_len + 2; // Address~MsgLength(4) + Msg + CRC(2)
    if (out_sz < total_len) return FALSE;

    out[0] = (unsigned char)(addr & 0xFF); // Address
    out[1] = 0x00;                         // Device ID (요청 예시는 0x00)
    out[2] = 0x00;                         // ACK: cmd 1,3은 고정 0x00
    out[3] = (unsigned char)(msg_len & 0xFF); // MsgLength
    out[4] = (unsigned char)(cmd & 0xFF);     // Cmd
    out[5] = (unsigned char)((pid >> 8) & 0xFF); // PID MSB
    out[6] = (unsigned char)(pid & 0xFF);        // PID LSB
    out[7] = 0x00; // Reserved MSB
    out[8] = 0x00; // Reserved LSB

    if (data_len > 0 && data != NULL) {
        memcpy(out + 9, data, (size_t)data_len);
    }

    // CRC는 사양에 맞는 계산이 필요하나 최소 시나리오에서는 0x0000
    out[9 + data_len] = 0x00;     // CRC MSB
    out[10 + data_len] = 0x00;    // CRC LSB

    if (out_len != NULL) *out_len = total_len;
    return TRUE;
}

static BOOL parse_bool_response(const unsigned char *buffer, int cnt) {
    if (buffer == NULL || cnt <= 0) return FALSE;
    // 최소 파싱 규칙: ACK(오프셋 2)가 0x01이면 TRUE.
    if (cnt > 2 && buffer[2] == 0x01) return TRUE;
    return FALSE;
}

// --- 요구 API ---
BOOL sendCommand(int addr, const char *pcCmd) {
    unsigned char tx_buf[128];
    int tx_len = 0;
    int cmd = is_read_pid(pcCmd) ? CMD_READ : CMD_WRITE;

    // pcCmd는 PID 문자열. 예: "0x00DD" 또는 "221"
    if (pcCmd == NULL || pcCmd[0] == '\0') {
        return FALSE;
    }
    char *endptr = NULL;
    unsigned long pid_val = strtoul(pcCmd, &endptr, 0);
    if (endptr == pcCmd) {
        return FALSE;
    }
    if (pid_val > 0xFFFF) return FALSE;

    if (!build_command_buffer(addr, cmd, (unsigned short)pid_val,
                              NULL, 0, tx_buf, (int)sizeof(tx_buf), &tx_len)) {
        return FALSE;
    }

    return send_to_device(tx_buf, tx_len);
}

BOOL RecvCommand(void) { // 예정
    unsigned char rx_buf[64];
    int cnt = read_from_device(rx_buf, (int)sizeof(rx_buf));
    return parse_bool_response(rx_buf, cnt);
}

// --- 최소 사용 예 ---
#ifdef BUILD_DEMO
int main(void) {
    BOOL ok_tx = sendCommand(1, "0x00DD");
    BOOL ok_rx = RecvCommand();

    printf("sendCommand: %s\n", ok_tx ? "TRUE" : "FALSE");
    printf("RecvCommand: %s\n", ok_rx ? "TRUE" : "FALSE");
    return 0;
}
#endif
