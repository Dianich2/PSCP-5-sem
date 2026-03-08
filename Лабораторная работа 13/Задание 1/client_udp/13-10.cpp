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
	SOCKET  cC;
	SOCKADDR_IN to;
	SOCKADDR_IN from;
	try {
		if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
			printf("Error: WSAStartup exit with error\n");
            ExitProcess(-1);
		}

		if ((cC = socket(AF_INET, SOCK_DGRAM, NULL)) == INVALID_SOCKET) {
			printf("Error: socket exit with error\n");
            ExitProcess(-1);
		}

		char bto[50];
		int lobuf = 0;
		to.sin_family = AF_INET;
		to.sin_port = htons(2000);
		to.sin_addr.s_addr = inet_addr("192.168.56.1");

		sprintf(bto, "Hello");
		if ((lobuf = sendto(cC, bto, strlen(bto) + 1, NULL,
			(sockaddr*)&to, sizeof(to))) == SOCKET_ERROR) {
			printf("Error: sendto exit with error\n");
            ExitProcess(-1);
		}

		char bfrom[50];
		int lc = sizeof(from);
		memset(&from, 0, lc);
		int  lb = 0;
		if ((lb = recvfrom(cC, bfrom, sizeof(bfrom), NULL,
			(sockaddr*)&from, &lc)) == SOCKET_ERROR) {
			printf("Error: recvfrom exit with error\n");
            ExitProcess(-1);
		}
			
        printf("Message from ServerU: %s\n", bfrom);

		if (closesocket(cC) == SOCKET_ERROR) {
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