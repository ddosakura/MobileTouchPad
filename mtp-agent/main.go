//go:generate statik -src=./assets -f
//go:generate go fmt statik/statik.go

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "./statik"
	"github.com/ddosakura/gklang"
	"github.com/rakyll/statik/fs"
	"golang.org/x/net/websocket"
)

func main() {
	l := log.New(os.Stdout, "[xxxx]: ", log.LstdFlags)
	dev := os.Getenv("MTPA_DEV")
	if dev == "true" {
		gklang.LoadLogger(l, gklang.LvDebug)
	} else {
		gklang.LoadLogger(l, gklang.LvInfo)
	}

	statikFS, e := fs.New()
	if e != nil {
		gklang.Er(e)
	}

	port := os.Getenv("MTPA_PORT")
	if port == "" {
		port = ":8880"
	}

	http.Handle("/ws", websocket.Handler(wsHandler))
	http.Handle("/", http.FileServer(statikFS))

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
