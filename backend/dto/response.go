package dto

// AuthResponse defines the response body for authentication requests
type AuthResponse struct {
	Token    string      `json:"token"`
	User     interface{} `json:"user"`
}

// UserResponse defines the user data sent in responses
type UserResponse struct {
	ID        uint   `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
}
