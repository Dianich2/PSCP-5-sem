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
	WSADATA wsaData;
	SOCKET  sS;
	SOCKADDR_IN sockParms;
	SOCKADDR_IN from;
	try {
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
			printf("Error: WSAStartup exit with error\n");
            ExitProcess(-1);
		}

		if ((sS = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET) {
			printf("Error: socket exit with error\n");
            ExitProcess(-1);
		}

		sockParms.sin_family = AF_INET;
		sockParms.sin_port = htons(2000);
		sockParms.sin_addr.s_addr = INADDR_ANY;

		if (bind(sS, (LPSOCKADDR)&sockParms, sizeof(sockParms)) == SOCKET_ERROR) {
			printf("Error: bind exit with error\n");
            ExitProcess(-1);
		}

		int i = 1;

		while (true) {

			int lc = sizeof(from);
			memset(&from, 0, lc);
			char ibuf[50];
			int  lb = 0;

			if ((lb = recvfrom(sS, ibuf, sizeof(ibuf), NULL,
				(sockaddr*)&from, &lc)) == SOCKET_ERROR) {
				printf("Error: recvfrom exit with error\n");
                ExitProcess(-1);
			}
			ibuf[lb] = '\0';
			Sleep(1000);
			printf("Message from Client : %s\n", ibuf);

			int lobuf = 0;
            char outputBuf[50];
            memset(outputBuf, 0, sizeof(outputBuf));
            strcpy(outputBuf, "ECHO: ");
            strcat(outputBuf, ibuf);

			if ((lobuf = sendto(sS, outputBuf, strlen(outputBuf), NULL,
				(sockaddr*)&from, sizeof(from))) == SOCKET_ERROR) {
				printf("Error: sendto exit with error\n");
                ExitProcess(-1);
			}

		}


		if (closesocket(sS) == SOCKET_ERROR) {
			printf("Error: closesocket exit with error\n");
            ExitProcess(-1);
		}

		if (WSACleanup() == SOCKET_ERROR) {
			printf("Error: WSACleanup exit with error\n");
            ExitProcess(-1);
		}
	}
	catch (std::string errMsg) {
		printf("\n%s\n", errMsg.c_str());
	}
}