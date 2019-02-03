package main

import (
	"github.com/ddosakura/gklang"
	"github.com/go-vgo/robotgo"
)

var (
	x, y int

	reset  = true
	pX, pY int
)

func initSys() {
	x, y = robotgo.GetMousePos()
	gklang.Log(gklang.LInfo, "init", x, y)
}

func callSys(a Action) {
	gklang.Log(gklang.LDebug, a)
	switch a.Type {
	case "move":
		if reset {
			reset = false
			pX, pY = a.X, a.Y
			return
		}
		X := x + (a.X-pX)*a.Speed/10
		if X < 0 {
			X = 0
		}
		Y := y + (a.Y-pY)*a.Speed/10
		if Y < 0 {
			Y = 0
		}
		// println("move", X, Y)
		robotgo.MoveMouseSmooth(X, Y, 4.0/float64(a.Speed), 6.0/float64(a.Speed))
	case "reset":
		reset = true
		x, y = robotgo.GetMousePos()
	case "left", "right":
		robotgo.MouseClick(a.Type)
	case "left2", "right2":
		robotgo.MouseClick(a.Type, true)
	}
}
