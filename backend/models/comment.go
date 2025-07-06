package models

import "gorm.io/gorm"

// Comment defines the model for a comment on a place
type Comment struct {
	gorm.Model
	Content  string `gorm:"type:text;not null" json:"content"`
	UserID   uint   `gorm:"not null" json:"user_id"`
	User     User   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	PlaceID  uint   `gorm:"not null" json:"place_id"`
	Place    Place  `gorm:"foreignKey:PlaceID" json:"-"`
}

