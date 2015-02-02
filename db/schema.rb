# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150119191309) do

  create_table "cards", force: true do |t|
    t.string   "name"
    t.integer  "cmc"
    t.text     "flavor"
    t.string   "image_name"
    t.string   "mana_cost"
    t.integer  "multiverseid"
    t.string   "rarity"
    t.string   "card_subtype"
    t.text     "card_text"
    t.string   "card_type_desc"
    t.string   "card_type"
    t.string   "card_colors"
    t.integer  "expansion_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "supertypes"
    t.string   "toughness"
    t.string   "power"
  end

  add_index "cards", ["expansion_id"], name: "index_cards_on_expansion_id"

  create_table "decks", force: true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "decks", ["user_id"], name: "index_decks_on_user_id"

  create_table "expansions", force: true do |t|
    t.string   "name"
    t.date     "release_date"
    t.string   "code"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "booster"
  end

  create_table "player_cards", force: true do |t|
    t.integer  "count"
    t.integer  "deck_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "card_id"
  end

  add_index "player_cards", ["card_id"], name: "index_player_cards_on_card_id"
  add_index "player_cards", ["deck_id"], name: "index_player_cards_on_deck_id"

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
