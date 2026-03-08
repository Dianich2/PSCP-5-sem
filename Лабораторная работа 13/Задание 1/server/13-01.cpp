#define WIN32_LEAN_AND_MEAN
#include <Winsock2.h>
#include <WS2tcpip.h>
#include <windows.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <iostream>
#pragma comment(lib, "WS2_32.lib")

int main(int argc, char* argv[]){
    WSADATA wsD;
    SOCKET serverSocket;
    SOCKADDR_IN serverSocketParms;
    SOCKET clientSocket;
    SOCKADDR_IN clientSocketParms;
    int lenClientSocketParms = sizeof(clientSocketParms);
    memset(&clientSocketParms, 0, sizeof(clientSocketParms));

    if(WSAStartup(MAKEWORD(2, 0), &wsD) != 0){
        printf("Error: WSAStartup exit with error\n");
        ExitProcess(-1);
    }

    if((serverSocket = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET){
        printf("Error: socket exit with error\n");
        ExitProcess(-1);
    }

    serverSocketParms.sin_family = AF_INET;
    serverSocketParms.sin_port = htons(2000);
    serverSocketParms.sin_addr.s_addr = INADDR_ANY;

    if(bind(serverSocket, (LPSOCKADDR)&serverSocketParms, sizeof(serverSocketParms)) == SOCKET_ERROR){
        printf("Error: bind exit with error\n");
        ExitProcess(-1);
    }

    if(listen(serverSocket, SOMAXCONN) == SOCKET_ERROR){
        printf("Error: listen exit with error\n");
        ExitProcess(-1);
    }

    char inputBuf[50];
    int lenInputBuf = 0;
    char outputBuf[50];
    int lenOutputBuf = 0;

    while(TRUE){
        if((clientSocket = accept(serverSocket, (LPSOCKADDR)&clientSocketParms, &lenClientSocketParms)) == INVALID_SOCKET){
            printf("Error: accept exit with error\n");
            ExitProcess(-1);
        }

        memset(inputBuf, 0, sizeof(inputBuf));
        if((lenInputBuf = recv(clientSocket, inputBuf, sizeof(inputBuf), NULL)) == SOCKET_ERROR){
            printf("Error: recv exit with error\n");
            ExitProcess(-1);
        }

        printf("Message from client: %s\n", inputBuf);

        memset(outputBuf, 0, sizeof(outputBuf));
        strcpy(outputBuf, "ECHO: ");
        strcat(outputBuf, inputBuf);

        if((lenOutputBuf = send(clientSocket, outputBuf, strlen(outputBuf), NULL)) == SOCKET_ERROR){
            printf("Error: send exit with error\n");
            ExitProcess(-1);
        }

        if(closesocket(clientSocket) == SOCKET_ERROR){
            printf("Error: closeSocket exit with error\n");
            ExitProcess(-1);
        }
    }

    if(closesocket(serverSocket) == SOCKET_ERROR){
        printf("Error: closeSocket exit with error\n");
        ExitProcess(-1);
    }

    if (WSACleanup() == SOCKET_ERROR) {
        printf("Error: WSACleanup exit with error\n");
        ExitProcess(-1);
	}
}