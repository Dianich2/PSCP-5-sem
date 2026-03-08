#define WIN32_LEAN_AND_MEAN
#include <Winsock2.h>
#include <WS2tcpip.h>
#include <windows.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <iostream>
#pragma comment(lib, "WS2_32.lib")

int main(int argc, char* argv[]) {
	SetConsoleCP(1251);
	SetConsoleOutputCP(1251);
	WSADATA wsD;
	SOCKET clientSocket;
    SOCKADDR_IN clientSocketParms;
		if (WSAStartup(MAKEWORD(2, 0), &wsD) != 0) {
			printf("Error: WSAStartup exit with error\n");
            ExitProcess(-1);
		}

		if ((clientSocket = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET) {
			printf("Error: socket exit with error\n");
            ExitProcess(-1);
		}
			
		clientSocketParms.sin_family = AF_INET;
		clientSocketParms.sin_port = htons(2000);
		clientSocketParms.sin_addr.s_addr = inet_addr("192.168.56.1");

		if ((connect(clientSocket, (LPSOCKADDR)&clientSocketParms, sizeof(clientSocketParms))) == SOCKET_ERROR) {
			printf("Error: connect exit with error\n");
            ExitProcess(-1);
		}
			
		char inputBuf[50];
        int lenInputBuf = 0;
        char outputBuf[50];
        int lenOutputBuf = 0;

		sprintf(outputBuf, "Hello");
		if ((lenOutputBuf = send(clientSocket, outputBuf, strlen(outputBuf) + 1, NULL)) == SOCKET_ERROR) {
			printf("Error: send exit with error\n");
            ExitProcess(-1);
		}

		if ((lenInputBuf = recv(clientSocket, inputBuf, sizeof(inputBuf), NULL)) == SOCKET_ERROR) {
			printf("Error: recv exit with error\n");
            ExitProcess(-1);
		}
			
		printf("Message from Server: %s\n", inputBuf);
		

		if (closesocket(clientSocket) == SOCKET_ERROR) {
			printf("Error: closeSocket exit with error\n");
            ExitProcess(-1);
		}

		if (WSACleanup() == SOCKET_ERROR) {
			printf("Error: WSACleanup exit with error\n");
            ExitProcess(-1);
		}
}