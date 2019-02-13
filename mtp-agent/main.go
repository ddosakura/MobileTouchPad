//go:generate statik -src=./assets -f
//go:generate go fmt statik/statik.go

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"

	_ "./statik"
	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/qr"
	"github.com/ddosakura/gklang"
	"github.com/rakyll/statik/fs"
	"golang.org/x/net/websocket"
)

const (
	qrCodeSize = 25
)

func main() {
	l := log.New(os.Stdout, "[MTPA]: ", log.LstdFlags)
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

	addrs, err := net.InterfaceAddrs()
	if err != nil {
		gklang.Er(err)
	}
	gklang.Log(gklang.LDebug, addrs)
	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				url := "http://" + ipnet.IP.String() + port
				// Create the barcode
				qrCode, e := qr.Encode(url, qr.M, qr.Auto)
				if e != nil {
					gklang.Er(e)
				}
				// Scale the barcode to 200x200 pixels
				qrCode, e = barcode.Scale(qrCode, qrCodeSize, qrCodeSize)
				if e != nil {
					gklang.Er(e)
				}

				for x := 0; x < qrCodeSize; x++ {
					for y := 0; y < qrCodeSize; y++ {
						r, g, b, _ := qrCode.At(x, y).RGBA()
						if r == 0 && g == 0 && b == 0 {
							fmt.Print("\033[40;40m  \033[0m")
						} else {
							fmt.Print("\033[47;30m  \033[0m")
						}
					}
					fmt.Println()
				}

				// // create the output file
				// file, _ := os.Create("qrcode.png")
				// defer file.Close()
				// // encode the barcode as png
				// e := png.Encode(file, qrCode)
				// if e != nil {
				// 	gklang.Er(e)
				// }

				break
			}

		}
	}

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
