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

// 获取目标坐标
func getXY(a Action) (int, int) {
	X := x + (a.X-pX)*a.Speed
	if X < 0 {
		X = 0
	}
	Y := y + (a.Y-pY)*a.Speed
	if Y < 0 {
		Y = 0
	}
	return X, Y
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
		X, Y := getXY(a)
		// println("move", X, Y)
		robotgo.MoveMouseSmooth(X, Y, 0.4/float64(a.Speed), 0.6/float64(a.Speed))
	case "reset":
		reset = true
		x, y = robotgo.GetMousePos()
	case "left", "center", "right":
		robotgo.MouseClick(a.Type)
	// case "left2", "right2":
	// 	robotgo.MouseClick(a.Type, true)
	case "scroll-up":
		// robotgo.ScrollMouse(int(math.Floor(math.Pow(float64(a.Speed), 1.5))), "up")
		robotgo.ScrollMouse(a.Speed*a.Speed, "up")
	case "scroll-down":
		//  robotgo.ScrollMouse(int(math.Floor(math.Pow(float64(a.Speed), 1.5))), "down")
		robotgo.ScrollMouse(a.Speed*a.Speed, "down")
	case "mouse-down":
		robotgo.MouseToggle("down")
	case "drag":
		if reset {
			reset = false
			pX, pY = a.X, a.Y
			return
		}
		X, Y := getXY(a)
		// println("move", X, Y)
		robotgo.MoveMouseSmooth(X, Y, 0.4/float64(a.Speed), 0.6/float64(a.Speed))
		// robotgo.DragMouse(a.X, a.Y)
	case "mouse-up":
		robotgo.MouseToggle("up")
	}

}
