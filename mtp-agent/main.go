package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/ddosakura/gklang"
	"golang.org/x/net/websocket"
)

func main() {
	l := log.New(os.Stdout, "[xxxx]: ", log.LstdFlags)
	gklang.LoadLogger(l, gklang.LvDebug)

	port := os.Getenv("DSSDC_PORT")
	if port == "" {
		port = ":8880"
	}

	http.Handle("/ws", websocket.Handler(wsHandler))

	initSys()

	fmt.Printf("Listen %s\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}

func wsHandler(ws *websocket.Conn) {
	for {
		var msg string
		if err := websocket.Message.Receive(ws, &msg); err != nil {
			fmt.Println("receive failed:", err)
			break
		}
		var a Action
		json.Unmarshal([]byte(msg), &a)
		// gklang.Log(gklang.LDebug, a)
		callSys(a)
	}
}
