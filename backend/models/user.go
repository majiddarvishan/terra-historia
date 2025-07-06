package models

import (
	"gorm.io/gorm"
	"golang.org/x/crypto/bcrypt"
)

// User defines the user model
type User struct {
	gorm.Model
	Username string    `gorm:"size:255;not null;unique" json:"username"`
	Email    string    `gorm:"size:255;not null;unique" json:"email"`
	Password string    `gorm:"size:255;not null;" json:"-"`
	Places   []Place   `json:"places,omitempty"`
	Comments []Comment `json:"comments,omitempty"`
}

// HashPassword hashes the user's password before saving
func (user *User) HashPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}
	user.Password = string(bytes)
	return nil
}

// CheckPassword checks if the provided password is correct
func (user *User) CheckPassword(providedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
}
