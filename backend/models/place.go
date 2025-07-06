package models

import "gorm.io/gorm"

// PlaceType defines the type of place
type PlaceType string

const (
	Nature     PlaceType = "nature"
	Historical PlaceType = "historical"
)

// Place defines the model for a tourist place
type Place struct {
	gorm.Model
	Title       string    `gorm:"size:255;not null" json:"title"`
	Description string    `gorm:"type:text;not null" json:"description"`
	Type        PlaceType `gorm:"type:varchar(50)" json:"type"`
	Location    string    `gorm:"size:255" json:"location"`
	ImageURL    string    `gorm:"size:255" json:"image_url"`
	UserID      uint      `gorm:"not null" json:"user_id"`
	User        User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Comments    []Comment `json:"comments,omitempty"`
}
