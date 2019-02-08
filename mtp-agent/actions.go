package main

// Action is receivce from client
type Action struct {
	Type  string `json:"type"`
	Data  string `json:"data"`
	X     int    `json:"x"`
	Y     int    `json:"y"`
	Speed int    `json:"speed"`
	Code  int    `json:"code"`
}
